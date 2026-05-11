#!/bin/bash
# Emite cert Let's Encrypt real usando DNS-01 challenge MANUAL.
# Requiere acceso a panel DNS de rlaricor.com para crear TXT record.
#
# Uso:
#   chmod +x init-letsencrypt.sh
#   ./init-letsencrypt.sh
set -e

DOMAIN="${DOMAIN:-rlaricor.com}"
EMAIL="${LE_EMAIL:-rlaricor@gmail.com}"
STAGING="${STAGING:-0}"   # STAGING=1 ./init-letsencrypt.sh   -> usa entorno de pruebas LE

if [ ! -x "$(command -v docker)" ]; then
  echo "Docker no encontrado."; exit 1
fi

mkdir -p ./certbot/conf ./certbot/www

STAGING_ARG=""
if [ "${STAGING}" = "1" ]; then
  STAGING_ARG="--staging"
  echo ">>> Modo STAGING (cert no válido en navegadores, solo prueba)"
fi

echo ">>> Solicitando cert para ${DOMAIN} (DNS-01 manual)"
echo ">>> Sigue las instrucciones: certbot pedirá que crees un TXT record."
echo ""

docker run -it --rm \
  -v "$(pwd)/certbot/conf:/etc/letsencrypt" \
  -v "$(pwd)/certbot/www:/var/www/certbot" \
  certbot/certbot:latest \
  certonly \
    --manual \
    --preferred-challenges dns \
    --email "${EMAIL}" \
    --agree-tos \
    --no-eff-email \
    ${STAGING_ARG} \
    -d "${DOMAIN}"

echo ""
echo ">>> Cert emitido. Recargando nginx..."
docker compose exec frontend nginx -s reload || docker compose restart frontend
echo ">>> Listo. https://${DOMAIN}:${HTTPS_PORT:-8080}"
