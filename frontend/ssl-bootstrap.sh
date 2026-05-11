#!/bin/sh
# Genera cert self-signed si no existe Let's Encrypt cert.
# Permite que nginx arranque la primera vez antes de emitir cert real.
set -e

DOMAIN="${DOMAIN:-rlaricor.com}"
LIVE_DIR="/etc/letsencrypt/live/${DOMAIN}"
FULLCHAIN="${LIVE_DIR}/fullchain.pem"
PRIVKEY="${LIVE_DIR}/privkey.pem"

if [ -f "${FULLCHAIN}" ] && [ -f "${PRIVKEY}" ]; then
  echo "[ssl-bootstrap] Cert existente para ${DOMAIN}, no se genera dummy."
  exit 0
fi

echo "[ssl-bootstrap] Generando cert self-signed temporal para ${DOMAIN}..."
mkdir -p "${LIVE_DIR}"
openssl req -x509 -newkey rsa:2048 -days 1 -nodes \
  -keyout "${PRIVKEY}" \
  -out "${FULLCHAIN}" \
  -subj "/CN=${DOMAIN}" >/dev/null 2>&1
echo "[ssl-bootstrap] Listo. Emite cert real con ./init-letsencrypt.sh"
