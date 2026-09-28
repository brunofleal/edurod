# Edurod setup guide

This guide covers:

1. [How the deployment is laid out](#1-architecture)
2. [Setting up a new server from scratch](#2-setting-up-a-server-from-scratch)
3. [First-run configuration inside the app](#3-first-run-configuration)
4. [Local development](#4-local-development)
5. [Day-to-day operations](#5-operations)
6. [Migrating data from one server to another](#6-migrating-to-a-new-server)
7. [Troubleshooting and known issues](#7-troubleshooting-and-known-issues)

All commands assume a Linux server with a POSIX shell, run from the repository root unless stated otherwise.

---

## 1. Architecture

`docker-compose.yml` defines three containers:

| Service    | Container          | Image / build        | Host ports             | Notes                                                        |
| ---------- | ------------------ | -------------------- | ---------------------- | ------------------------------------------------------------ |
| `mongodb`  | `edurodmongolocal` | `database/` (mongo:8) | `27017`                | Data lives in the named volume `mongodb_data`                |
| `backend`  | `edurod-backend`   | `backend/` (node:18) | `${BACKEND_PORT}` → 8000 | Express REST API under `/api/...`                           |
| `frontend` | `edurod-frontend`  | `frontend/` (node build → nginx) | `80`, `443`   | Static React build; certificates mounted from `./ssl`        |

How requests flow:

```
Browser ──(80/443)──▶ nginx (frontend container): serves the React app
Browser ──(VITE_BASE_URL, e.g. :8000)──▶ backend container ──▶ mongodb:27017 (database "edurod")
```

The browser calls the backend directly, at the URL in `VITE_BASE_URL`. nginx does not proxy the API. That URL is **compiled into the frontend at build time**, so changing it means rebuilding the frontend image.

---

## 2. Setting up a server from scratch

### 2.1 Prerequisites

- Docker Engine 24+ with the Compose plugin (`docker compose version` should work).
- Git.
- `openssl`, for generating secrets and, optionally, a self-signed certificate.
- Open ports: `80` and `443` (frontend) and `8000`, or whatever `BACKEND_PORT` you choose, for the API. **Keep `27017` closed to the internet** (see [2.7](#27-hardening-recommended)).

### 2.2 Get the code

```bash
git clone <repository-url> edurod
cd edurod
```

The Docker volume is named after the project folder (for example `edurod_mongodb_data`), so keep the folder name the same on every server to avoid confusion.

### 2.3 Create the `.env` file

```bash
cp .env.example .env
```

Edit `.env`:

| Variable                     | What to put there                                                                                                         |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `MONGO_INITDB_ROOT_USERNAME` | MongoDB root user name.                                                                                                    |
| `MONGO_INITDB_ROOT_PASSWORD` | Strong password. **Only applied the first time the container starts with an empty volume.** Changing it later has no effect. |
| `NODE_ENV`                   | `production`. Setting it to `development` adds stack traces to API error responses.                                        |
| `JWT_SECRET`                 | Long random string: `openssl rand -hex 32`. Login tokens never expire, so changing this secret is what logs everyone out. |
| `MONGODB_URI`                | `mongodb://<user>:<password>@mongodb:27017/edurod?authSource=admin`, using the same credentials as above. `mongodb` is the Compose service name. URL-encode special characters in the password (`@` → `%40`, `:` → `%3A`, `/` → `%2F`). |
| `BACKEND_PORT`               | Host port for the API, usually `8000`.                                                                                     |
| `FRONTEND_PORT`              | Not used by `docker-compose.yml`. The frontend always listens on 80/443.                                                   |
| `VITE_BASE_URL`              | The URL **browsers** use to reach the API, e.g. `http://edurod.example.com:8000`. Do not use `localhost` on a remote server: it would point to each user's own machine. |

Example:

```dotenv
MONGO_INITDB_ROOT_USERNAME=edurodadmin
MONGO_INITDB_ROOT_PASSWORD=S0me-Long-Random-Password
NODE_ENV=production
JWT_SECRET=3f6c...64-hex-chars...
MONGODB_URI=mongodb://edurodadmin:S0me-Long-Random-Password@mongodb:27017/edurod?authSource=admin
BACKEND_PORT=8000
FRONTEND_PORT=3000
VITE_BASE_URL=http://edurod.example.com:8000
```

> **HTTPS and mixed content.** If users open the site over `https://`, browsers block calls to an `http://` API. In that case, either serve the API over HTTPS too or proxy it through nginx (see [7. Serving the API through nginx](#serving-the-api-through-nginx-optional)).

### 2.4 SSL certificates

nginx expects `ssl/cert.pem` and `ssl/key.pem`. **Without them the frontend container won't start**, even if you only use HTTP.

**Option A: self-signed** (testing or internal use; browsers will show a warning):

```bash
mkdir -p ssl
openssl req -x509 -nodes -newkey rsa:2048 -days 365 \
  -keyout ssl/key.pem -out ssl/cert.pem \
  -subj "/CN=edurod.example.com"
```

**Option B: Let's Encrypt** (public domain pointing to the server):

```bash
docker compose stop frontend              # certbot needs port 80 free
sudo certbot certonly --standalone -d edurod.example.com
sudo cp /etc/letsencrypt/live/edurod.example.com/fullchain.pem ssl/cert.pem
sudo cp /etc/letsencrypt/live/edurod.example.com/privkey.pem  ssl/key.pem
```

Let's Encrypt certificates expire after 90 days. After each renewal, copy the files again and run `docker compose restart frontend`.

`ssl/` holds private keys and must never be committed.

### 2.5 Build and start

```bash
docker compose up -d --build
```

(`./start.sh` runs `docker compose up -d` without rebuilding.)

### 2.6 Verify

```bash
docker compose ps                         # all three services "running"
docker compose logs backend | tail -20    # expect "Connected to Database successfully"
curl http://localhost:8000/               # {"message":"Backend is running!"}
```

Then open `http://<server>` (or `https://`) in a browser. You should see the login page.

### 2.7 Hardening (recommended)

- **Don't expose MongoDB.** `docker-compose.yml` publishes `27017` on all interfaces, and Docker-published ports **bypass `ufw`/firewalld rules**. To make MongoDB reachable only from the server itself, change the mapping to:

  ```yaml
  ports:
      - "127.0.0.1:27017:27017"
  ```

- Use strong, unique values for `MONGO_INITDB_ROOT_PASSWORD` and `JWT_SECRET`.
- Keep `.env` and `ssl/` out of version control. Both are already gitignored.

---

## 3. First-run configuration

### 3.1 Create the first admin

Anyone can register at `/register`, but new accounts have **no roles**, and only an admin can assign roles in the app. The first admin therefore has to be promoted directly in the database:

1. Open `http://<server>/register` and create your account.
2. Open a MongoDB shell in the container. The command reads the credentials from the container's environment, so they don't end up in your shell history:

   ```bash
   docker exec -it edurodmongolocal sh -c \
     'mongosh -u "$MONGO_INITDB_ROOT_USERNAME" -p "$MONGO_INITDB_ROOT_PASSWORD" --authenticationDatabase admin edurod'
   ```

3. Grant the role:

   ```js
   db.users.updateOne({ email: "you@example.com" }, { $set: { roles: ["admin"] } })
   ```

4. Log out and log back in. The **Admin** menu should now appear.

From now on, manage other users from **Admin → Usuários**.

| Role     | Permissions                                                           |
| -------- | --------------------------------------------------------------------- |
| `admin`  | Everything: Admin page, all create/edit/delete operations              |
| `opener` | Create and edit occurrences                                            |
| `closer` | Close/resolve occurrences                                              |
| `viewer` | Read-only                                                              |

A user can have several roles.

### 3.2 Seed reference data (Admin page)

On a fresh database, configure these in the Admin page:

1. **System variables**: the admin panel offers to create them when none exist.
   - `pointsPerDriver` (default 100): monthly starting balance for each driver.
   - `maxPayAmoutPerDriver` (default 300): maximum monthly bonus.
2. **Occurrence categories** (for example Grave / Média / Leve). A category's points are **added** to the driver's balance, so penalty categories should use **negative** values (for example `-100`, `-50`, `-30`).
3. **Occurrence types**: each type belongs to a category.
4. **Occurrence sources**: where an occurrence came from (for example complaint, inspection).
5. **Drivers** (name, badge number `matricula`, admission date), **lines** and **vehicles**.

How the bonus is calculated (`backend/routes/driverReportRoute.js`): for a period of *N* months (the number of days ÷ 28, rounded),

```
points = max(0, pointsPerDriver × N + Σ category points of valid occurrences)
bonus  = min(maxPay × eligibleMonths, points / (pointsPerDriver × N) × maxPay × eligibleMonths)
```

`eligibleMonths` excludes the admission month for drivers hired during the period.

---

## 4. Local development

Requirements: **Node.js 20.19+ or 22.12+** (Vite 7 does not support Node 18) and Docker, used only for MongoDB.

1. **Database.** Create the root `.env` as in [2.3](#23-create-the-env-file), then start only MongoDB:

   ```bash
   docker compose up -d mongodb
   ```

2. **Backend.** `dotenv` reads `.env` from the current directory, so run these commands inside `backend/`:

   ```bash
   cd backend
   cp .env.example .env
   # edit backend/.env:
   #   PORT=8000
   #   DB_URL=mongodb://<user>:<password>@localhost:27017/edurod?authSource=admin
   #   JWT_SECRET=any-dev-secret
   #   NODE_ENV=development
   npm install
   npm run dev          # nodemon, http://localhost:8000
   ```

3. **Frontend**:

   ```bash
   cd frontend
   echo "VITE_BASE_URL=http://localhost:8000" > .env.local
   npm install
   npm run dev          # http://localhost:5173
   ```

   Other scripts: `npm run build`, `npm run lint`, `npm run preview`.

To load realistic data locally, restore a dump from production (see [6.3](#63-method-a-dump-and-restore-through-docker-recommended), or use `tools/db/copy-prod-to-dev.sh`).

---

## 5. Operations

| Task                         | Command                                                     |
| ---------------------------- | ----------------------------------------------------------- |
| Deploy a new version         | `git pull && docker compose up -d --build`                  |
| Rebuild only the frontend    | `docker compose up -d --build frontend`                     |
| Logs                         | `docker compose logs -f backend` (or `frontend`, `mongodb`) |
| Restart everything           | `docker compose restart`                                    |
| Stop (keeps data)            | `docker compose down`                                       |
| Free Docker disk space       | `bash tools/scripts/docker-cleanup.sh` (interactive)        |

> **Never run `docker compose down -v`** on a server with real data. The `-v` flag deletes the `mongodb_data` volume. Also be careful with the "dangling volumes" and "nuclear" options of `docker-cleanup.sh`.

### Scheduled backups

A compressed dump of the `edurod` database:

```bash
mkdir -p ~/edurod-backups
docker exec edurodmongolocal sh -c \
  'mongodump -u "$MONGO_INITDB_ROOT_USERNAME" -p "$MONGO_INITDB_ROOT_PASSWORD" --authenticationDatabase admin --db edurod --archive --gzip' \
  > ~/edurod-backups/edurod-$(date +%Y%m%d_%H%M%S).archive.gz
```

To run it every night at 03:00, add it to `crontab -e` with the full path to `docker`, and escape `%` as `\%` inside crontab. Copy backups off the server regularly.

---

## 6. Migrating to a new server

### 6.1 What has to move

| Item               | Where                                  | How                                    |
| ------------------ | -------------------------------------- | -------------------------------------- |
| Application code   | git repository                         | `git clone` on the new server          |
| Configuration      | `.env`                                 | Copy it (`scp`), then review           |
| Certificates       | `ssl/cert.pem`, `ssl/key.pem`          | Copy them, or issue new ones           |
| **Data**           | MongoDB database `edurod`              | `mongodump` → transfer → `mongorestore` |

The database holds everything else: users with their bcrypt-hashed passwords and roles, drivers, lines, vehicles, occurrences, categories, types, sources, system variables and the action log. After the migration, users log in with their existing passwords.

Use dump and restore rather than copying the Docker volume's files. It works across MongoDB versions and hosts, and it produces a portable backup as a side effect.

### 6.2 Prepare the new server

Follow [section 2](#2-setting-up-a-server-from-scratch) on the new server, but:

- **Copy `.env` from the old server** instead of starting from `.env.example`:
  - Keep the **same `JWT_SECRET`** if you want existing logins to keep working, or change it to force everyone to log in again. Both are safe.
  - **Update `VITE_BASE_URL`** if the hostname or IP changes.
  - The Mongo root credentials may stay the same or change. They only need to match between `MONGO_INITDB_ROOT_*` and `MONGODB_URI` on the new server.
- Copy `ssl/`, or create new certificates.
- Start the stack (`docker compose up -d --build`) and confirm it is healthy. **Skip [3.1](#31-create-the-first-admin)**: the admin account comes with the restored data.

### 6.3 Automated: `tools/db/migrate-server.sh` (recommended)

Run this on the **new** server once its stack is up (6.2). It connects to the old server's MongoDB and copies the `edurod` database into the local one:

```bash
# if the old MongoDB isn't reachable directly, tunnel it first:
#   ssh -N -L 27018:127.0.0.1:27017 user@old-server
bash tools/db/migrate-server.sh --source-uri "mongodb://<user>:<pass>@<old-host>:27017/?authSource=admin"
```

If `--source-uri` is omitted, the script asks for it without showing the input. The script:

- only reads from the old server and never writes to it;
- refuses if the URI points to this server's own MongoDB, or if both connections reach the same instance;
- stops without changing anything if the source is empty, or if the local database already has documents (override with `--force-overwrite`, which also asks you to type the database name);
- warns if the old server is written to during the dump;
- stops the local backend during the restore, backs up the local database first, compares document counts afterwards, and prints a rollback command.

Dumps and the log go to `tools/db/mongodb-backup/migration_<timestamp>/`. Run `--help` for all options. The manual steps below do the same thing by hand.

### 6.3.1 Method A: dump and restore through Docker (manual)

No MongoDB tools are needed on the host: `mongodump`, `mongorestore` and `mongosh` all ship inside the `mongo:8` container.

**On the old server:**

1. Stop writes so the dump is consistent. Stopping the backend is enough, and the site will show errors until the cutover:

   ```bash
   docker compose stop backend
   ```

2. Dump the database:

   ```bash
   docker exec edurodmongolocal sh -c \
     'mongodump -u "$MONGO_INITDB_ROOT_USERNAME" -p "$MONGO_INITDB_ROOT_PASSWORD" --authenticationDatabase admin --db edurod --archive --gzip' \
     > edurod-migration.archive.gz
   ls -lh edurod-migration.archive.gz      # sanity check: not empty
   ```

   Use `docker exec` **without** `-t` so the binary output isn't corrupted. Run this from a Linux shell. PowerShell 5.1 corrupts binary data piped with `>`.

3. Record document counts for later comparison:

   ```bash
   docker exec edurodmongolocal sh -c \
     'mongosh -u "$MONGO_INITDB_ROOT_USERNAME" -p "$MONGO_INITDB_ROOT_PASSWORD" --authenticationDatabase admin edurod --quiet --eval "db.getCollectionNames().sort().forEach(c => print(c, db[c].countDocuments()))"' \
     | tee counts-old.txt
   ```

4. Transfer the files:

   ```bash
   scp edurod-migration.archive.gz counts-old.txt .env user@new-server:~/edurod/
   scp -r ssl user@new-server:~/edurod/
   ```

**On the new server** (inside the `edurod` folder, with the stack running):

5. Restore. `--drop` replaces any collections that already exist in the new database:

   ```bash
   docker exec -i edurodmongolocal sh -c \
     'mongorestore -u "$MONGO_INITDB_ROOT_USERNAME" -p "$MONGO_INITDB_ROOT_PASSWORD" --authenticationDatabase admin --nsInclude "edurod.*" --drop --archive --gzip' \
     < edurod-migration.archive.gz
   ```

   The command should end with `N document(s) restored successfully. 0 document(s) failed to restore.`

6. Compare the counts:

   ```bash
   docker exec edurodmongolocal sh -c \
     'mongosh -u "$MONGO_INITDB_ROOT_USERNAME" -p "$MONGO_INITDB_ROOT_PASSWORD" --authenticationDatabase admin edurod --quiet --eval "db.getCollectionNames().sort().forEach(c => print(c, db[c].countDocuments()))"' \
     > counts-new.txt
   diff counts-old.txt counts-new.txt && echo "Counts match"
   ```

7. Restart the backend so it starts from a clean connection: `docker compose restart backend`.

### 6.4 Method B: direct copy with `tools/db/copy-prod-to-dev.sh`

This script copies one database straight into another over the network. It is handy when a single machine can reach both MongoDB instances, for example refreshing a development database from production.

Requirements on the machine that runs it:

- [MongoDB Database Tools](https://www.mongodb.com/try/download/database-tools) (`mongodump`, `mongorestore`) and `mongosh` installed.
- Network access to port `27017` on both servers. If MongoDB is bound to `127.0.0.1` as recommended, use an SSH tunnel: `ssh -L 27018:127.0.0.1:27017 user@old-server`, then connect to `localhost:27018`.

Steps:

1. Edit the two variables at the top of the script. Both URIs must include the `/edurod` database name, because the script restores from `<dump>/edurod`:

   ```bash
   PROD_URI="mongodb://<user>:<pass>@<old-host>:27017/edurod?authSource=admin"   # source
   DEV_URI="mongodb://<user>:<pass>@<new-host>:27017/edurod?authSource=admin"    # destination
   ```

   **Do not commit the script with credentials in it.**

2. Run it from `tools/db/`, so dumps land in the gitignored `tools/db/mongodb-backup/`:

   ```bash
   cd tools/db
   bash copy-prod-to-dev.sh     # type "yes" to confirm
   ```

   The script **drops the destination database** before restoring. Double-check which URI is which.

3. Verify the counts as in step 6 of Method A.

### 6.5 Cutover

1. Test the new server by logging in with an existing account, opening Occurrences and Reports, and checking that the numbers match the old server.
2. Point DNS (or users' bookmarks) to the new server. If the hostname in `VITE_BASE_URL` changed, make sure the frontend was rebuilt with the new value (`docker compose up -d --build frontend`).
3. Keep the old server stopped but intact (`docker compose down`, **without** `-v`) for a few days as a rollback option, together with `edurod-migration.archive.gz`.

**Rollback:** point DNS back and run `docker compose start backend` on the old server. Any data entered on the new server in the meantime would have to be migrated back the same way.

---

## 7. Troubleshooting and known issues

| Symptom                                                         | Cause / fix                                                                                                                                                                  |
| --------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Frontend container keeps restarting; logs mention `cannot load certificate` | `ssl/cert.pem` or `ssl/key.pem` is missing. See [2.4](#24-ssl-certificates).                                                                                    |
| Frontend image build fails in `npm run build` (e.g. `crypto.hash is not a function`) | `frontend/Dockerfile` uses `node:18-alpine`, but Vite 7 needs Node 20.19+. Change the build stage to `FROM node:22-alpine AS build`.                      |
| Backend logs `Database connection error: Authentication failed` | `MONGODB_URI` credentials don't match the root user. Remember that `MONGO_INITDB_ROOT_*` only applies to a **new, empty** volume, so an old volume keeps its original password. |
| Backend exits with `ECONNREFUSED` / server selection timeout    | MongoDB isn't up yet, or `MONGODB_URI` uses `localhost` instead of `mongodb` inside Compose. Check `docker compose logs mongodb`.                                              |
| Login page loads, but every request fails                       | Wrong `VITE_BASE_URL` (check the browser console, which logs `Using backend url: ...`), the backend port is blocked by the firewall, or HTTPS page → HTTP API (mixed content). Rebuild the frontend after fixing it. |
| Logged in but redirected to "no access permission"              | The user has no roles. An admin must assign them (see [3.1](#31-create-the-first-admin)).                                                                                     |
| `Too many requests from this IP`                                | Rate limit of 1000 requests per minute per IP (`backend/middlewares/rateLimiter.js`).                                                                                         |

Other notes:

- `backend/scripts/initOccurrenceCategories.js` does not work as-is: its `require` path has a typo, it reads `MONGO_URI` without loading `.env`, and it uses positive points. Create categories through the Admin page instead.
- `database/README.md` and `database/scripts/*` describe an older standalone MongoDB setup. Use the `.env` values described here instead.

### Serving the API through nginx (optional)

To serve everything over HTTPS from one origin, and so avoid mixed-content errors and the need to open port 8000, add this block inside the `server { ... }` block of `frontend/nginx.conf`:

```nginx
location /api/ {
    proxy_pass http://backend:8000;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

Then set `VITE_BASE_URL=https://edurod.example.com` (no port and no `/api`: the frontend already calls `/api/...` paths) and rebuild with `docker compose up -d --build frontend`. Behind a proxy, every client appears to come from the same IP, so the per-IP rate limit is shared by all users. Consider raising it, or enabling Express `trust proxy`.
