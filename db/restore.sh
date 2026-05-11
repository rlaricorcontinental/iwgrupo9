#!/bin/bash
set -e

# Espera a que SQL Server este listo
echo "[restore] Esperando a SQL Server en mssql:1433..."
for i in {1..60}; do
  /opt/mssql-tools18/bin/sqlcmd -S mssql -U sa -P "$SA_PASSWORD" -C -Q "SELECT 1" &> /dev/null && break
  sleep 2
done

# Si la BD ya existe, no hace nada
EXISTS=$(/opt/mssql-tools18/bin/sqlcmd -S mssql -U sa -P "$SA_PASSWORD" -C -h -1 -W \
  -Q "SET NOCOUNT ON; SELECT COUNT(*) FROM sys.databases WHERE name='IsmaelCargoDB'" | tr -d '[:space:]')

if [ "$EXISTS" = "1" ]; then
  echo "[restore] IsmaelCargoDB ya existe. Nada que hacer."
  exit 0
fi

echo "[restore] Restaurando IsmaelCargoDB desde /backup/IsmaelCargoDB.bak..."

# Detecta los logical names dentro del .bak
FILELIST=$(/opt/mssql-tools18/bin/sqlcmd -S mssql -U sa -P "$SA_PASSWORD" -C -h -1 -W \
  -Q "SET NOCOUNT ON; RESTORE FILELISTONLY FROM DISK='/backup/IsmaelCargoDB.bak'")

DATA_LOGICAL=$(echo "$FILELIST" | awk '$3=="D"{print $1; exit}')
LOG_LOGICAL=$(echo "$FILELIST"  | awk '$3=="L"{print $1; exit}')

echo "[restore] DATA logical=$DATA_LOGICAL  LOG logical=$LOG_LOGICAL"

/opt/mssql-tools18/bin/sqlcmd -S mssql -U sa -P "$SA_PASSWORD" -C -Q "
RESTORE DATABASE [IsmaelCargoDB]
FROM DISK='/backup/IsmaelCargoDB.bak'
WITH MOVE '$DATA_LOGICAL' TO '/var/opt/mssql/data/IsmaelCargoDB.mdf',
     MOVE '$LOG_LOGICAL'  TO '/var/opt/mssql/data/IsmaelCargoDB_log.ldf',
     REPLACE, STATS=10;"

echo "[restore] Listo."
