#!/usr/bin/env bash
# =============================================================================
# Edurod - copy the MongoDB data of an OLD server into THIS (new) server
# =============================================================================
# Run this ON THE NEW SERVER, from a checkout of the repository whose stack is
# already running (at least the "mongodb" service) with a filled-in .env.
#
# Safety guarantees:
#   - The OLD server is only read from (ping, stats, document counts and
#     mongodump). No write command is ever sent to it.
#   - The script refuses to run if the source URI points at this server's own
#     MongoDB, or if both connections reach the same instance.
#   - If the target database already holds documents, the script stops
#     without changing anything, unless --force-overwrite is given.
#   - Before restoring, the target database is always backed up.
#   - Document counts are compared after the restore.
#
# Usage:
#   bash tools/db/migrate-server.sh [options]
#
# Options:
#   --source-uri URI    Connection string of the OLD server's MongoDB, e.g.
#                       mongodb://user:pass@old-host:27017/?authSource=admin
#                       (default: $SOURCE_URI; otherwise you are prompted and
#                       the input is not echoed)
#   --source-db NAME    Database to copy from (default: edurod)
#   --target-db NAME    Database to copy into (default: edurod)
#   --force-overwrite   Allow replacing a target database that already holds
#                       documents. It is backed up first, and you must type
#                       its name to confirm.
#   -h, --help          Show this help
#
# Environment overrides:
#   MONGO_CONTAINER     Local MongoDB container (default: edurodmongolocal)
#   BACKEND_CONTAINER   Local backend container (default: edurod-backend)
#   ENV_FILE            .env holding the local Mongo credentials
#                       (default: <repo>/.env)
#   MONGO_TOOLS         "local" or "docker". Defaults to local when mongodump,
#                       mongorestore and mongosh are installed; otherwise the
#                       tools run from the local MongoDB image with host
#                       networking (Linux hosts).
#
# Tips:
#   - Stop the backend on the OLD server first (docker compose stop backend)
#     so nothing is written during the copy. Stopping it deletes nothing.
#   - If the old MongoDB is not reachable from here, open an SSH tunnel:
#       ssh -N -L 27018:127.0.0.1:27017 user@old-server
#     and use mongodb://user:pass@127.0.0.1:27018/?authSource=admin
#   - For extra safety, connect with a user that only has the "read" role on
#     the source database.
#   - Dumps and the log go to tools/db/mongodb-backup/migration_<timestamp>/.
#     They contain all application data (including password hashes), so keep
#     them private and delete them when no longer needed.
# =============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
ENV_FILE="${ENV_FILE:-$REPO_ROOT/.env}"
BACKUP_ROOT="$SCRIPT_DIR/mongodb-backup"
MONGO_CONTAINER="${MONGO_CONTAINER:-edurodmongolocal}"
BACKEND_CONTAINER="${BACKEND_CONTAINER:-edurod-backend}"
MONGO_TOOLS="${MONGO_TOOLS:-}"

SOURCE_URI="${SOURCE_URI:-}"
SOURCE_DB="edurod"
TARGET_DB="edurod"
FORCE_OVERWRITE=false

BACKEND_WAS_STOPPED=false
RESTORE_STARTED=false
TGT_BACKUP=""
TMP_DIR=""

# ── Output helpers ───────────────────────────────────────────────────────────

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'
if [ ! -t 1 ]; then
    RED='' GREEN='' YELLOW='' BLUE='' CYAN='' BOLD='' NC=''
fi

step() { echo; echo -e "${BOLD}${CYAN}▸ $*${NC}"; }
info() { echo -e "  $*"; }
ok() { echo -e "  ${GREEN}✔ $*${NC}"; }
warn() { echo -e "  ${YELLOW}⚠ $*${NC}"; }

print_rollback() {
    [ -n "$TGT_BACKUP" ] || return 0
    echo
    echo "  To put the target database back the way it was before the restore:"
    echo "    docker exec -i $MONGO_CONTAINER sh -c 'mongorestore -u \"\$MONGO_INITDB_ROOT_USERNAME\" -p \"\$MONGO_INITDB_ROOT_PASSWORD\" --authenticationDatabase admin --nsInclude \"$TARGET_DB.*\" --drop --archive --gzip' < \"$TGT_BACKUP\""
    echo "  (If the target was empty before, drop the database instead. Collections"
    echo "  that did not exist before the restore are not removed by the command above.)"
}

die() {
    echo -e "  ${RED}✖ $*${NC}" >&2
    if [ "$RESTORE_STARTED" = true ]; then
        print_rollback >&2
    else
        echo "  No data was changed on either server." >&2
    fi
    if [ "$BACKEND_WAS_STOPPED" = true ]; then
        echo "  The local backend container was left stopped. Start it with: docker start $BACKEND_CONTAINER" >&2
    fi
    exit 1
}

# Requires the user to type exactly "yes".
confirm() {
    local answer
    read -r -p "  $1 Type 'yes' to continue: " answer || true
    [ "$answer" = "yes" ]
}

usage() {
    awk 'NR > 1 && /^#/ { sub(/^# ?/, ""); print; next } NR > 1 { exit }' "$0"
}

human_bytes() {
    awk -v b="$1" 'BEGIN { split("B KB MB GB TB", u); i = 1; while (b >= 1024 && i < 5) { b /= 1024; i++ } printf "%.1f %s", b, u[i] }'
}

# ── Arguments ────────────────────────────────────────────────────────────────

while [ $# -gt 0 ]; do
    case "$1" in
        --source-uri) [ $# -ge 2 ] || die "--source-uri needs a value"; SOURCE_URI="$2"; shift 2 ;;
        --source-uri=*) SOURCE_URI="${1#*=}"; shift ;;
        --source-db) [ $# -ge 2 ] || die "--source-db needs a value"; SOURCE_DB="$2"; shift 2 ;;
        --source-db=*) SOURCE_DB="${1#*=}"; shift ;;
        --target-db) [ $# -ge 2 ] || die "--target-db needs a value"; TARGET_DB="$2"; shift 2 ;;
        --target-db=*) TARGET_DB="${1#*=}"; shift ;;
        --force-overwrite) FORCE_OVERWRITE=true; shift ;;
        -h | --help) usage; exit 0 ;;
        *) die "Unknown option: $1 (see --help)" ;;
    esac
done

for db_name in "$SOURCE_DB" "$TARGET_DB"; do
    [[ "$db_name" =~ ^[A-Za-z0-9_-]+$ ]] || die "Invalid database name: '$db_name'"
    case "$db_name" in
        admin | local | config) die "Refusing to migrate the MongoDB system database '$db_name'" ;;
    esac
done

# ── Pre-flight checks ────────────────────────────────────────────────────────

echo -e "${BOLD}Edurod server migration${NC}"

step "Checking this server"

command -v docker >/dev/null 2>&1 || die "docker is not installed or not in PATH"
docker info >/dev/null 2>&1 || die "Docker daemon is not running, or you lack permission to use it"
[ -f "$ENV_FILE" ] || die ".env not found at $ENV_FILE. Create it first (see docs/setup-guide.md)."

# Reads KEY=value from the .env file without executing it.
get_env_value() {
    local key="$1" line value
    line="$(grep -E "^[[:space:]]*${key}[[:space:]]*=" "$ENV_FILE" | tail -n 1 || true)"
    [ -n "$line" ] || return 1
    value="${line#*=}"
    value="${value%$'\r'}"
    value="$(printf '%s' "$value" | sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//')"
    if [[ "$value" =~ ^\"(.*)\"$ ]] || [[ "$value" =~ ^\'(.*)\'$ ]]; then
        value="${BASH_REMATCH[1]}"
    fi
    printf '%s' "$value"
}

TGT_USER="$(get_env_value MONGO_INITDB_ROOT_USERNAME)" || die "MONGO_INITDB_ROOT_USERNAME is missing from $ENV_FILE"
TGT_PASS="$(get_env_value MONGO_INITDB_ROOT_PASSWORD)" || die "MONGO_INITDB_ROOT_PASSWORD is missing from $ENV_FILE"
[ -n "$TGT_USER" ] && [ -n "$TGT_PASS" ] || die "Mongo root credentials in $ENV_FILE are empty"

container_running() {
    [ "$(docker inspect -f '{{.State.Running}}' "$1" 2>/dev/null || true)" = "true" ]
}

container_running "$MONGO_CONTAINER" ||
    die "Container '$MONGO_CONTAINER' is not running. Start the stack first: docker compose up -d"

port_line="$(docker port "$MONGO_CONTAINER" 27017/tcp 2>/dev/null | head -n 1 || true)"
[ -n "$port_line" ] || die "Port 27017 of '$MONGO_CONTAINER' is not published to the host"
TGT_PORT="${port_line##*:}"
bind_host="${port_line%:*}"
case "$bind_host" in
    0.0.0.0 | "[::]" | "::" | "") TGT_HOST="127.0.0.1" ;;
    *) TGT_HOST="${bind_host#[}"; TGT_HOST="${TGT_HOST%]}" ;;
esac
ok "Local MongoDB container '$MONGO_CONTAINER' is running ($TGT_HOST:$TGT_PORT)"

if [ -z "$MONGO_TOOLS" ]; then
    if command -v mongodump >/dev/null 2>&1 && command -v mongorestore >/dev/null 2>&1 &&
        command -v mongosh >/dev/null 2>&1; then
        MONGO_TOOLS="local"
    else
        MONGO_TOOLS="docker"
    fi
fi
case "$MONGO_TOOLS" in
    local)
        for tool in mongodump mongorestore mongosh; do
            command -v "$tool" >/dev/null 2>&1 || die "$tool not found (MONGO_TOOLS=local)"
        done
        ok "Using locally installed MongoDB tools"
        ;;
    docker)
        TOOLS_IMAGE="$(docker inspect -f '{{.Config.Image}}' "$MONGO_CONTAINER")"
        docker run --rm --entrypoint mongodump "$TOOLS_IMAGE" --version >/dev/null 2>&1 ||
            die "Could not run mongodump from image '$TOOLS_IMAGE'. Install the MongoDB Database Tools and mongosh instead."
        ok "Using MongoDB tools from image '$TOOLS_IMAGE'"
        ;;
    *) die "MONGO_TOOLS must be 'local' or 'docker'" ;;
esac

# ── Source connection ────────────────────────────────────────────────────────

if [ -z "$SOURCE_URI" ]; then
    echo
    read -r -s -p "  MongoDB URI of the OLD server (input hidden): " SOURCE_URI || true
    echo
fi
[[ "$SOURCE_URI" =~ ^mongodb(\+srv)?:// ]] || die "The source URI must start with mongodb:// or mongodb+srv://"
REDACTED_URI="$(printf '%s' "$SOURCE_URI" | sed -E 's#(://)[^@/]*@#\1***@#')"

# Refuses a source URI that points to this server's own MongoDB port.
check_source_not_local() {
    [[ "$SOURCE_URI" == mongodb+srv://* ]] && return 0
    local hostpart entry host port local_names
    local -a entries
    hostpart="${SOURCE_URI#*://}"
    hostpart="${hostpart%%/*}"
    hostpart="${hostpart%%\?*}"
    hostpart="${hostpart##*@}"
    local_names=" localhost 127.0.0.1 ::1 0.0.0.0 $TGT_HOST $(hostname 2>/dev/null || true) $(hostname -f 2>/dev/null || true) $(hostname -I 2>/dev/null || true) "
    IFS=',' read -r -a entries <<<"$hostpart"
    for entry in "${entries[@]}"; do
        if [[ "$entry" == \[*\]* ]]; then
            host="${entry%%]*}"; host="${host#[}"
            port="${entry##*]}"; port="${port#:}"
        elif [[ "$entry" == *:* ]]; then
            host="${entry%:*}"; port="${entry##*:}"
        else
            host="$entry"; port=""
        fi
        port="${port:-27017}"
        if [ "$port" = "$TGT_PORT" ] && [[ "$local_names" == *" $host "* ]]; then
            die "The source URI points to this server's own MongoDB ($host:$port). Use the OLD server's address, or an SSH tunnel on a different port."
        fi
    done
}
check_source_not_local

# ── Working directory and logging ────────────────────────────────────────────

TIMESTAMP="$(date +%Y%m%d_%H%M%S)"
RUN_DIR="$BACKUP_ROOT/migration_$TIMESTAMP"
mkdir -p "$RUN_DIR"
chmod 700 "$RUN_DIR"
TMP_DIR="$(mktemp -d)"
chmod 700 "$TMP_DIR"
trap 'rm -rf "$TMP_DIR"' EXIT

LOG_FILE="$RUN_DIR/migration.log"
exec > >(tee -a "$LOG_FILE") 2>&1

# Credentials go into files readable only by this user, so they don't show up
# in the process list or the log.
yaml_quote() { printf "'%s'" "${1//\'/\'\'}"; }
SRC_CFG="$TMP_DIR/source.yaml"
TGT_CFG="$TMP_DIR/target.yaml"
(
    umask 077
    printf 'uri: %s\n' "$(yaml_quote "$SOURCE_URI")" >"$SRC_CFG"
    printf 'password: %s\n' "$(yaml_quote "$TGT_PASS")" >"$TGT_CFG"
)

export MIG_SRC_URI="$SOURCE_URI" MIG_TGT_USER="$TGT_USER" MIG_TGT_PASS="$TGT_PASS"
export MIG_TGT_HOST="$TGT_HOST" MIG_TGT_PORT="$TGT_PORT" MIG_SIDE="" MIG_DB=""

# Runs a MongoDB tool, locally or from the Docker image.
mongo_tool() {
    local tool="$1"
    shift
    if [ "$MONGO_TOOLS" = "local" ]; then
        "$tool" "$@"
    else
        docker run --rm --network host \
            --user "$(id -u):$(id -g)" -e HOME=/tmp \
            -e MIG_SRC_URI -e MIG_TGT_USER -e MIG_TGT_PASS -e MIG_TGT_HOST -e MIG_TGT_PORT \
            -e MIG_SIDE -e MIG_DB \
            -v "$RUN_DIR:$RUN_DIR" -v "$TMP_DIR:$TMP_DIR" \
            --entrypoint "$tool" "$TOOLS_IMAGE" "$@"
    fi
}

# Target connection flags; the password comes from the --config file.
TGT_FLAGS=(--host="$TGT_HOST" --port="$TGT_PORT" --username="$TGT_USER"
    --authenticationDatabase=admin --config="$TGT_CFG")

# Read-only inspection: version, instance identity, data size, and document
# counts per collection. It only runs ping, buildInfo, serverStatus, dbStats,
# listCollections and countDocuments.
INSPECT_JS='
const side = process.env.MIG_SIDE;
const uri = side === "source"
    ? process.env.MIG_SRC_URI
    : "mongodb://" + encodeURIComponent(process.env.MIG_TGT_USER) + ":" +
      encodeURIComponent(process.env.MIG_TGT_PASS) + "@" + process.env.MIG_TGT_HOST + ":" +
      process.env.MIG_TGT_PORT + "/?authSource=admin&directConnection=true";
const conn = new Mongo(uri);
const adminDb = conn.getDB("admin");
const appDb = conn.getDB(process.env.MIG_DB);
if (!adminDb.runCommand({ ping: 1 }).ok) throw new Error("ping failed");
print("VERSION\t" + adminDb.runCommand({ buildInfo: 1 }).version);
let identity = "unknown";
try {
    const s = adminDb.runCommand({ serverStatus: 1, repl: 0, metrics: 0, locks: 0, wiredTiger: 0 });
    if (s.ok) identity = s.host + "|" + s.pid;
} catch (e) {}
print("IDENTITY\t" + identity);
print("DATASIZE\t" + Math.round(appDb.stats().dataSize || 0));
appDb.getCollectionInfos({ type: "collection" })
    .map((c) => c.name)
    .filter((n) => !n.startsWith("system."))
    .sort()
    .forEach((n) => print("COUNT\t" + n + "\t" + appDb.getCollection(n).countDocuments({})));
'

inspect_db() { # <source|target> <db> <outfile>
    MIG_SIDE="$1"
    MIG_DB="$2"
    mongo_tool mongosh --nodb --quiet --eval "$INSPECT_JS" | tr -d '\r' >"$3"
}

field() { awk -F'\t' -v k="$2" '$1 == k { print $2; exit }' "$1"; }
counts_of() { awk -F'\t' '$1 == "COUNT" { print $2 "\t" $3 }' "$1"; }
total_docs() { awk -F'\t' '{ s += $2 } END { print s + 0 }' "$1"; }

print_counts_table() { # <source counts> <target counts>
    awk -F'\t' '
        FILENAME == ARGV[1] { s[$1] = $2; n[$1]; next }
        { t[$1] = $2; n[$1] }
        END { for (k in n) printf "%s\t%s\t%s\n", k, (k in s) ? s[k] : "-", (k in t) ? t[k] : "-" }
    ' "$1" "$2" | sort | awk -F'\t' '
        BEGIN { printf "    %-30s %12s %12s\n", "collection", "source", "target" }
        { printf "    %-30s %12s %12s\n", $1, $2, $3 }
    '
}

# ── Inspect both databases ───────────────────────────────────────────────────

step "Inspecting the target database (this server)"
TGT_INFO="$TMP_DIR/target_info.txt"
inspect_db target "$TARGET_DB" "$TGT_INFO" ||
    die "Could not connect to the local MongoDB at $TGT_HOST:$TGT_PORT with the credentials from $ENV_FILE"
TGT_COUNTS="$TMP_DIR/target_counts.txt"
counts_of "$TGT_INFO" >"$TGT_COUNTS"
TGT_VERSION="$(field "$TGT_INFO" VERSION)"
TGT_ID="$(field "$TGT_INFO" IDENTITY)"
TGT_TOTAL="$(total_docs "$TGT_COUNTS")"
ok "Connected: MongoDB $TGT_VERSION, database '$TARGET_DB' has $TGT_TOTAL document(s)"

step "Inspecting the source database (old server, read-only)"
info "URI: $REDACTED_URI"
SRC_INFO="$TMP_DIR/source_info.txt"
inspect_db source "$SOURCE_DB" "$SRC_INFO" ||
    die "Could not connect to the old server. Check the URI, the credentials, and that port is reachable from here."
SRC_COUNTS="$TMP_DIR/source_counts.txt"
counts_of "$SRC_INFO" >"$SRC_COUNTS"
SRC_VERSION="$(field "$SRC_INFO" VERSION)"
SRC_ID="$(field "$SRC_INFO" IDENTITY)"
SRC_SIZE="$(field "$SRC_INFO" DATASIZE)"
SRC_TOTAL="$(total_docs "$SRC_COUNTS")"
ok "Connected: MongoDB $SRC_VERSION, database '$SOURCE_DB' has $SRC_TOTAL document(s) ($(human_bytes "${SRC_SIZE:-0}"))"

# ── Safety checks ────────────────────────────────────────────────────────────

step "Safety checks"

if [ "$SRC_ID" != "unknown" ] && [ "$SRC_ID" = "$TGT_ID" ]; then
    die "Source and target are the SAME MongoDB instance ($SRC_ID). Use the old server's address."
elif [ "$SRC_ID" = "unknown" ]; then
    warn "Could not read the source's server status (probably a read-only user)."
    warn "The same-instance check relied on the URI only."
else
    ok "Source and target are different MongoDB instances"
fi

[ "$SRC_TOTAL" -gt 0 ] ||
    die "The source database '$SOURCE_DB' has no documents. Wrong URI or database name?"
ok "Source database has data"

if ! grep -q $'^users\t' "$SRC_COUNTS"; then
    warn "The source database has no 'users' collection. It may not be an Edurod database."
    confirm "Copy it anyway?" || die "Aborted."
fi

echo
print_counts_table "$SRC_COUNTS" "$TGT_COUNTS"
echo

if [ "$TGT_TOTAL" -gt 0 ]; then
    warn "The target database '$TARGET_DB' on THIS server already has $TGT_TOTAL document(s)."
    if [ "$FORCE_OVERWRITE" != true ]; then
        info "This can be an account registered on the new server, or data from an earlier migration."
        info "If you are sure it can be replaced, re-run with --force-overwrite."
        info "The target is backed up first, and you will be asked to confirm."
        die "Refusing to overwrite existing data."
    fi

    more_in_target="$(awk -F'\t' '
        FILENAME == ARGV[1] { s[$1] = $2; next }
        $2 > 0 && (!($1 in s) || $2 + 0 > s[$1] + 0) { printf "%s ", $1 }
    ' "$SRC_COUNTS" "$TGT_COUNTS")"
    if [ -n "$more_in_target" ]; then
        warn "The TARGET has MORE documents than the source in: $more_in_target"
        warn "This usually means the source is not the newest copy of the data."
    fi

    only_in_target="$(awk -F'\t' '
        FILENAME == ARGV[1] { s[$1]; next }
        !($1 in s) { printf "%s ", $1 }
    ' "$SRC_COUNTS" "$TGT_COUNTS")"
    if [ -n "$only_in_target" ]; then
        info "Collections that exist only in the target are kept as they are: $only_in_target"
    fi

    answer=""
    read -r -p "  Type the target database name ('$TARGET_DB') to confirm its collections will be REPLACED: " answer || true
    [ "$answer" = "$TARGET_DB" ] || die "Aborted."
else
    ok "Target database has no documents; nothing will be overwritten"
fi

src_major="${SRC_VERSION%%.*}"
tgt_major="${TGT_VERSION%%.*}"
if [[ "$src_major" =~ ^[0-9]+$ ]] && [[ "$tgt_major" =~ ^[0-9]+$ ]] && [ "$tgt_major" -lt "$src_major" ]; then
    warn "The target MongoDB ($TGT_VERSION) is OLDER than the source ($SRC_VERSION)."
    confirm "Restoring into an older version may fail. Continue?" || die "Aborted."
fi

avail_kb="$(df -Pk "$RUN_DIR" 2>/dev/null | awk 'NR == 2 { print $4 }')"
need_kb=$(( ${SRC_SIZE:-0} * 2 / 1024 ))
if [[ "$avail_kb" =~ ^[0-9]+$ ]] && [ "$avail_kb" -lt "$need_kb" ]; then
    warn "Low disk space: $(human_bytes $((avail_kb * 1024))) free, about $(human_bytes $((need_kb * 1024))) recommended."
    confirm "Continue anyway?" || die "Aborted."
fi

# ── Final confirmation ───────────────────────────────────────────────────────

step "Plan"
info "1. Dump '$SOURCE_DB' from the old server ($REDACTED_URI). Read-only."
info "2. Stop the local backend container (if running) during the restore."
info "3. Back up '$TARGET_DB' on this server."
info "4. Restore the dump into '$TARGET_DB' on this server (replacing the collections it contains)."
info "5. Verify document counts, then start the backend again."
info "Files: $RUN_DIR"
echo
warn "Make sure nothing writes to the OLD server during the copy. Stop its backend"
warn "(docker compose stop backend). This deletes no data."
echo
confirm "Start the migration?" || die "Aborted."

# ── 1. Dump the source ───────────────────────────────────────────────────────

step "1/5 Dumping the source database"
SRC_ARCHIVE="$RUN_DIR/source_${SOURCE_DB}.archive.gz"
mongo_tool mongodump --config="$SRC_CFG" --db="$SOURCE_DB" --archive="$SRC_ARCHIVE" --gzip ||
    die "mongodump from the old server failed."
[ -s "$SRC_ARCHIVE" ] || die "The dump file is empty: $SRC_ARCHIVE"
ok "Dump saved: $SRC_ARCHIVE ($(human_bytes "$(wc -c <"$SRC_ARCHIVE")"))"

# If the old server was written to during the dump, the copy may be
# inconsistent.
SOURCE_CHANGED=false
SRC_AFTER_INFO="$TMP_DIR/source_after_info.txt"
inspect_db source "$SOURCE_DB" "$SRC_AFTER_INFO" || die "Could not re-inspect the source after the dump."
SRC_AFTER_COUNTS="$TMP_DIR/source_after_counts.txt"
counts_of "$SRC_AFTER_INFO" >"$SRC_AFTER_COUNTS"
if ! cmp -s "$SRC_COUNTS" "$SRC_AFTER_COUNTS"; then
    SOURCE_CHANGED=true
    warn "The source changed while it was being dumped (something is still writing to it):"
    diff "$SRC_COUNTS" "$SRC_AFTER_COUNTS" | sed 's/^/    /' || true
    confirm "Continue with a copy that may miss those changes? (Better: stop the old backend and re-run)" ||
        die "Aborted. The dump is kept in $RUN_DIR."
else
    ok "Source did not change during the dump"
fi

# ── 2. Stop the local backend ────────────────────────────────────────────────

step "2/5 Stopping the local backend"
if container_running "$BACKEND_CONTAINER"; then
    docker stop "$BACKEND_CONTAINER" >/dev/null
    BACKEND_WAS_STOPPED=true
    ok "Stopped '$BACKEND_CONTAINER'"
else
    info "'$BACKEND_CONTAINER' is not running; nothing to stop"
fi

# ── 3. Back up the target ────────────────────────────────────────────────────

step "3/5 Backing up the target database"
TGT_BACKUP_FILE="$RUN_DIR/target_${TARGET_DB}_before_restore.archive.gz"
mongo_tool mongodump "${TGT_FLAGS[@]}" --db="$TARGET_DB" --archive="$TGT_BACKUP_FILE" --gzip ||
    die "Backing up the target failed, so the restore was not attempted."
[ -f "$TGT_BACKUP_FILE" ] || die "Target backup file was not created."
TGT_BACKUP="$TGT_BACKUP_FILE"
ok "Target backup saved: $TGT_BACKUP"

# Make sure the target did not change after it was inspected and confirmed.
TGT_NOW_INFO="$TMP_DIR/target_now_info.txt"
inspect_db target "$TARGET_DB" "$TGT_NOW_INFO" || die "Could not re-inspect the target."
if ! cmp -s "$TGT_COUNTS" <(counts_of "$TGT_NOW_INFO"); then
    die "The target database changed since it was inspected. Re-run the script."
fi
ok "Target unchanged since inspection"

# ── 4. Restore ───────────────────────────────────────────────────────────────

step "4/5 Restoring into the target database"
RESTORE_STARTED=true
RESTORE_OUT="$TMP_DIR/restore.out"
set +e
mongo_tool mongorestore "${TGT_FLAGS[@]}" \
    --archive="$SRC_ARCHIVE" --gzip \
    --nsInclude="${SOURCE_DB}.*" --nsFrom="${SOURCE_DB}.*" --nsTo="${TARGET_DB}.*" \
    --drop --stopOnError 2>&1 | tee "$RESTORE_OUT"
restore_rc="${PIPESTATUS[0]}"
set -e
[ "$restore_rc" -eq 0 ] || die "mongorestore failed (exit code $restore_rc)."
failed_docs="$(grep -Eo '[0-9]+ document\(s\) failed to restore' "$RESTORE_OUT" | tail -n 1 | grep -Eo '^[0-9]+' || true)"
[ "${failed_docs:-0}" -eq 0 ] || die "$failed_docs document(s) failed to restore."
ok "Restore finished"

# ── 5. Verify ────────────────────────────────────────────────────────────────

step "5/5 Verifying"
TGT_AFTER_INFO="$TMP_DIR/target_after_info.txt"
inspect_db target "$TARGET_DB" "$TGT_AFTER_INFO" || die "Could not inspect the target after the restore."
TGT_AFTER_COUNTS="$TMP_DIR/target_after_counts.txt"
counts_of "$TGT_AFTER_INFO" >"$TGT_AFTER_COUNTS"

echo
print_counts_table "$SRC_AFTER_COUNTS" "$TGT_AFTER_COUNTS"
echo

mismatches="$(awk -F'\t' '
    FILENAME == ARGV[1] { s[$1] = $2; next }
    { t[$1] = $2 }
    END { for (k in s) if (!(k in t) || t[k] + 0 != s[k] + 0) printf "%s ", k }
' "$SRC_AFTER_COUNTS" "$TGT_AFTER_COUNTS")"

if [ -n "$mismatches" ]; then
    if [ "$SOURCE_CHANGED" = true ]; then
        warn "Counts differ in: $mismatches"
        warn "This is expected because the source was written to during the dump."
    else
        die "Document counts differ after the restore in: $mismatches"
    fi
else
    ok "Every collection has the same number of documents as the source"
fi

if [ "$BACKEND_WAS_STOPPED" = true ]; then
    docker start "$BACKEND_CONTAINER" >/dev/null
    BACKEND_WAS_STOPPED=false
    ok "Started '$BACKEND_CONTAINER' again"
fi

# ── Done ─────────────────────────────────────────────────────────────────────

step "Migration complete"
info "Source dump:    $SRC_ARCHIVE"
info "Target backup:  $TGT_BACKUP"
info "Log:            $LOG_FILE"
print_rollback
echo
info "Next steps:"
info "  - Log in on this server with an existing account and check Occurrences and Reports."
info "  - The old server was not modified. Keep it until you are satisfied."
info "    Anything written to it from now on is NOT copied here."
info "  - The files above contain all application data. Keep them private and"
info "    delete them when no longer needed."
