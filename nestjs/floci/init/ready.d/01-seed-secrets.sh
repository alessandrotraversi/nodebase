#!/bin/sh
# Runs once Floci's Secrets Manager is ready to accept requests.
# Seeds local secrets so the app has something to read in development.
# See: https://floci.io/floci/configuration/initialization-hooks/
set -eu

SECRET_ID="app/database"
SECRET_VALUE='{"username":"app","password":"local-dev-password"}'

if aws secretsmanager describe-secret --secret-id "$SECRET_ID" >/dev/null 2>&1; then
  echo "[init] Secret '$SECRET_ID' already exists, skipping."
else
  aws secretsmanager create-secret \
    --name "$SECRET_ID" \
    --secret-string "$SECRET_VALUE" >/dev/null
  echo "[init] Seeded secret '$SECRET_ID'."
fi
