#!/bin/bash
# ============================================================================
# Docker Disk Space Usage Analyzer & Cleanup Tool
# ============================================================================
# This script evaluates Docker disk space usage and provides interactive
# options to remove unused containers, images, volumes, networks, and
# build cache.
# ============================================================================

set -euo pipefail

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# Separator line
LINE="━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# ── Helpers ──────────────────────────────────────────────────────────────────

print_header() {
    echo ""
    echo -e "${CYAN}${LINE}${NC}"
    echo -e "${BOLD}${CYAN}  $1${NC}"
    echo -e "${CYAN}${LINE}${NC}"
    echo ""
}

print_section() {
    echo ""
    echo -e "  ${BLUE}▸ $1${NC}"
    echo -e "  ${BLUE}──────────────────────────────────────────${NC}"
}

print_info() {
    echo -e "    ${NC}$1${NC}"
}

print_success() {
    echo -e "    ${GREEN}✔ $1${NC}"
}

print_warning() {
    echo -e "    ${YELLOW}⚠ $1${NC}"
}

print_error() {
    echo -e "    ${RED}✖ $1${NC}"
}

confirm() {
    local prompt="$1"
    local answer
    echo ""
    read -rp "    $(echo -e "${YELLOW}${prompt} [y/N]: ${NC}")" answer
    [[ "$answer" =~ ^[Yy]$ ]]
}

# ── Pre-flight check ────────────────────────────────────────────────────────

if ! command -v docker &>/dev/null; then
    print_error "Docker is not installed or not in PATH."
    exit 1
fi

if ! docker info &>/dev/null 2>&1; then
    print_error "Docker daemon is not running or you don't have permission to access it."
    exit 1
fi

# ── Disk Usage Overview ─────────────────────────────────────────────────────

print_header "🐳  Docker Disk Space Usage Report"

echo -e "  ${BOLD}Overall Docker disk usage (docker system df):${NC}"
echo ""
docker system df
echo ""

# ── Detailed Breakdown ──────────────────────────────────────────────────────

print_header "📊  Detailed Breakdown"

# --- Containers ---
print_section "Containers"

total_containers=$(docker ps -a --format '{{.ID}}' | wc -l | tr -d ' ')
running_containers=$(docker ps --format '{{.ID}}' | wc -l | tr -d ' ')
stopped_containers=$((total_containers - running_containers))

print_info "Total containers:   ${BOLD}${total_containers}${NC}"
print_info "Running:            ${GREEN}${running_containers}${NC}"
print_info "Stopped:            ${YELLOW}${stopped_containers}${NC}"

if [ "$total_containers" -gt 0 ]; then
    echo ""
    docker ps -a --format "table {{.ID}}\t{{.Names}}\t{{.Status}}\t{{.Size}}" 2>/dev/null || \
        docker ps -a --format "table {{.ID}}\t{{.Names}}\t{{.Status}}"
fi

# --- Images ---
print_section "Images"

total_images=$(docker images -a --format '{{.ID}}' | wc -l | tr -d ' ')
dangling_images=$(docker images -f "dangling=true" --format '{{.ID}}' | wc -l | tr -d ' ')

print_info "Total images:       ${BOLD}${total_images}${NC}"
print_info "Dangling (<none>):  ${YELLOW}${dangling_images}${NC}"

if [ "$total_images" -gt 0 ]; then
    echo ""
    docker images -a --format "table {{.Repository}}\t{{.Tag}}\t{{.ID}}\t{{.Size}}\t{{.CreatedSince}}"
fi

# --- Volumes ---
print_section "Volumes"

total_volumes=$(docker volume ls -q | wc -l | tr -d ' ')
dangling_volumes=$(docker volume ls -f "dangling=true" -q | wc -l | tr -d ' ')

print_info "Total volumes:      ${BOLD}${total_volumes}${NC}"
print_info "Unused (dangling):  ${YELLOW}${dangling_volumes}${NC}"

if [ "$total_volumes" -gt 0 ]; then
    echo ""
    docker volume ls
fi

# --- Networks ---
print_section "Networks"

# Default networks that should not be removed
custom_networks=$(docker network ls --format '{{.Name}}' | grep -vcE '^(bridge|host|none)$' || true)

print_info "Custom networks:    ${BOLD}${custom_networks}${NC}"

if [ "$custom_networks" -gt 0 ]; then
    echo ""
    docker network ls --format "table {{.ID}}\t{{.Name}}\t{{.Driver}}\t{{.Scope}}" | grep -vE '\b(bridge|host|none)\b'
fi

# --- Build Cache ---
print_section "Build Cache"
docker system df --format '{{.Type}}\t{{.TotalCount}}\t{{.Size}}\t{{.Reclaimable}}' 2>/dev/null | grep -i "build" || print_info "No build cache info available."

# ── Cleanup Options ─────────────────────────────────────────────────────────

print_header "🧹  Cleanup Options"

# 1) Stopped containers
if [ "$stopped_containers" -gt 0 ]; then
    print_warning "Found ${stopped_containers} stopped container(s)."
    if confirm "Remove all stopped containers?"; then
        docker container prune -f
        print_success "Stopped containers removed."
    fi
else
    print_success "No stopped containers to remove."
fi

# 2) Dangling images
if [ "$dangling_images" -gt 0 ]; then
    print_warning "Found ${dangling_images} dangling image(s) (<none>)."
    if confirm "Remove all dangling images?"; then
        docker image prune -f
        print_success "Dangling images removed."
    fi
else
    print_success "No dangling images to remove."
fi

# 3) All unused images (not just dangling)
unused_images=$(docker images --format '{{.ID}}' | wc -l | tr -d ' ')
if [ "$unused_images" -gt 0 ]; then
    print_warning "There are ${unused_images} total image(s). Some may be unused by any container."
    if confirm "Remove ALL unused images (not referenced by any container)?"; then
        docker image prune -a -f
        print_success "Unused images removed."
    fi
fi

# 4) Dangling volumes
if [ "$dangling_volumes" -gt 0 ]; then
    print_warning "Found ${dangling_volumes} dangling volume(s)."
    print_warning "⚠  Volumes may contain important data! Review before removing."
    echo ""
    docker volume ls -f "dangling=true"
    echo ""
    if confirm "Remove all dangling volumes? (DATA WILL BE LOST)"; then
        docker volume prune -f
        print_success "Dangling volumes removed."
    fi
else
    print_success "No dangling volumes to remove."
fi

# 5) Unused networks
if [ "$custom_networks" -gt 0 ]; then
    print_warning "Found ${custom_networks} custom network(s). Some may be unused."
    if confirm "Remove all unused networks?"; then
        docker network prune -f
        print_success "Unused networks removed."
    fi
else
    print_success "No custom networks to clean up."
fi

# 6) Build cache
print_warning "Docker build cache can accumulate over time."
if confirm "Remove all build cache?"; then
    docker builder prune -f
    print_success "Build cache removed."
fi

# 7) Nuclear option
echo ""
echo -e "  ${RED}${BOLD}⚠  NUCLEAR OPTION${NC}"
echo -e "  ${RED}──────────────────────────────────────────${NC}"
print_warning "This will remove ALL unused data: stopped containers, unused"
print_warning "images, unused networks, unused volumes, and build cache."
if confirm "Run 'docker system prune -a --volumes'? (CAUTION: this is irreversible)"; then
    docker system prune -a --volumes -f
    print_success "Full system prune completed."
fi

# ── Final Report ─────────────────────────────────────────────────────────────

print_header "📈  Post-Cleanup Disk Usage"
docker system df
echo ""
print_success "Done! Docker cleanup complete."
echo ""
