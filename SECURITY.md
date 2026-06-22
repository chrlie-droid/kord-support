# Security Policy

## Repository data policy

Never commit real production or customer data.

Forbidden in Git:

- real public IP addresses;
- real production domains;
- passwords;
- API tokens;
- private keys and certificates;
- OAuth secrets;
- Telegram bot tokens;
- Pyrus credentials;
- customer names and legal details;
- logs;
- database dumps;
- uploaded files;
- backups;
- local `.env` files.

Use placeholders in documentation:

```text
APP_DOMAIN
CLEAR_DOMAIN
SERVER_PUBLIC_IP
support.example.com
203.0.113.10
```

Use local environment variables for secrets.

## Seed admin

The admin seed script requires `SEED_ADMIN_PASSWORD`:

```bash
docker compose exec app sh -lc 'cd /app && PYTHONPATH=/app SEED_ADMIN_PASSWORD="change-this-local-password" python /app/scripts/seed_admin.py'
```

Do not commit the real value.

## Before committing

Search for common leak patterns:

```bash
grep -RInE "([0-9]{1,3}\.){3}[0-9]{1,3}|koard\.ru|password|token|secret|BEGIN .*PRIVATE KEY" . \
  --exclude-dir=.git \
  --exclude-dir=node_modules \
  --exclude-dir=.next
```

If a secret was committed, rotate it. Removing it from the latest file is not enough for high-risk secrets because it remains in Git history.
