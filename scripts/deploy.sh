#!/usr/bin/env bash
# ──────────────────────────────────────────────────────────────────────────
# ContentForge — İlk Sunucu Kurulum & Deploy Scripti
# Ubuntu Server 24.04 LTS
# Kullanım: sudo bash scripts/deploy.sh
# ──────────────────────────────────────────────────────────────────────────
set -euo pipefail

DEPLOY_DIR="/opt/contentforge"
GITHUB_REPO="kutluhangil/ContentForge-AI"
COMPOSE_FILE="$DEPLOY_DIR/docker/docker-compose.yml"

log() { echo -e "\033[1;34m[deploy]\033[0m $*"; }
ok()  { echo -e "\033[1;32m[  ok  ]\033[0m $*"; }
err() { echo -e "\033[1;31m[error ]\033[0m $*"; exit 1; }

# ── 1. System prerequisites ────────────────────────────────────────────────
log "Sistem paketleri güncelleniyor..."
apt-get update -qq
apt-get install -y -qq \
  curl git ca-certificates gnupg lsb-release ufw fail2ban

# ── 2. Docker installation ─────────────────────────────────────────────────
if ! command -v docker &>/dev/null; then
  log "Docker yükleniyor..."
  curl -fsSL https://get.docker.com | sh
  systemctl enable --now docker
  ok "Docker yüklendi: $(docker --version)"
else
  ok "Docker zaten mevcut: $(docker --version)"
fi

# ── 3. Firewall ────────────────────────────────────────────────────────────
log "UFW güvenlik duvarı yapılandırılıyor..."
ufw --force reset
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 443/udp   # HTTP/3
ufw --force enable
ok "Güvenlik duvarı aktif"

# ── 4. Deploy directory ────────────────────────────────────────────────────
log "Deploy dizini hazırlanıyor: $DEPLOY_DIR"
mkdir -p "$DEPLOY_DIR"

if [ -d "$DEPLOY_DIR/.git" ]; then
  log "Repo güncelleniyor..."
  git -C "$DEPLOY_DIR" pull origin main
else
  log "Repo klonlanıyor..."
  git clone "https://github.com/$GITHUB_REPO.git" "$DEPLOY_DIR"
fi

# ── 5. Env file check ─────────────────────────────────────────────────────
if [ ! -f "$DEPLOY_DIR/.env.production" ]; then
  log "Örnek .env.production dosyası oluşturuluyor..."
  cp "$DEPLOY_DIR/.env.example" "$DEPLOY_DIR/.env.production"
  err ".env.production dosyası eksik! Lütfen düzenleyip tekrar çalıştırın:
  nano $DEPLOY_DIR/.env.production"
fi

ok ".env.production mevcut"

# ── 6. Pull & start services ──────────────────────────────────────────────
log "Docker imajları çekiliyor..."
docker compose -f "$COMPOSE_FILE" pull

log "Servisler başlatılıyor..."
docker compose -f "$COMPOSE_FILE" up -d --remove-orphans

# ── 7. Health check ────────────────────────────────────────────────────────
log "Sağlık kontrolü bekleniyor (30s)..."
sleep 30

APP_STATUS=$(docker compose -f "$COMPOSE_FILE" ps --status running app | grep -c "running" || echo "0")
if [ "$APP_STATUS" -eq 0 ]; then
  err "App container çalışmıyor! Logları kontrol edin:
  docker compose -f $COMPOSE_FILE logs app"
fi

HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api/health || echo "000")
if [ "$HTTP_STATUS" != "200" ]; then
  err "Health check başarısız (HTTP $HTTP_STATUS). Loglar:
  docker compose -f $COMPOSE_FILE logs --tail=50 app"
fi

ok "Health check geçti (HTTP $HTTP_STATUS)"

# ── 8. Summary ────────────────────────────────────────────────────────────
echo ""
echo "════════════════════════════════════════════════════════"
ok "ContentForge başarıyla deploy edildi!"
echo ""
echo "  Servisler:  docker compose -f $COMPOSE_FILE ps"
echo "  Loglar:     docker compose -f $COMPOSE_FILE logs -f"
echo "  Restart:    docker compose -f $COMPOSE_FILE restart"
echo "  Stop:       docker compose -f $COMPOSE_FILE down"
echo ""
echo "  NOT: Alan adınızı docker/Caddyfile dosyasında güncelleyin."
echo "════════════════════════════════════════════════════════"
