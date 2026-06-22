# Deploy to VDS

This document uses placeholders. Do not commit real production IP addresses, domains, passwords, tokens or private paths.

## 1. DNS

Create an A record:

```text
APP_DOMAIN  A  SERVER_PUBLIC_IP
```

Optional dev subdomain:

```text
DEV_APP_DOMAIN  A  SERVER_PUBLIC_IP
```

Example placeholders:

```text
support.example.com      A  203.0.113.10
dev.support.example.com  A  203.0.113.10
```

## 2. Server packages

```bash
apt update && apt upgrade -y
apt install -y git curl ca-certificates ufw
```

Install Docker if it is not installed:

```bash
curl -fsSL https://get.docker.com | sh
```

## 3. Firewall

```bash
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
ufw status numbered
```

Do not open PostgreSQL publicly.

## 4. Clone project

```bash
mkdir -p /opt/kord
cd /opt/kord
git clone https://github.com/chrlie-droid/kord-support.git
cd kord-support
cp .env.example .env
```

Edit `.env` before production:

```bash
nano .env
```

Change at least:

```text
SECRET_KEY=strong-random-secret
POSTGRES_PASSWORD=strong-db-password
```

## 5. Start application

```bash
docker compose up -d --build
docker compose exec app alembic upgrade head
docker compose exec app sh -lc 'cd /app && PYTHONPATH=/app python /app/scripts/seed_admin.py'
```

Check backend locally:

```bash
curl http://127.0.0.1:8085/api/health
```

Check frontend locally:

```bash
curl http://127.0.0.1:3000
```

## 6. Domain and HTTPS with Caddy

Install Caddy:

```bash
apt install -y debian-keyring debian-archive-keyring apt-transport-https curl
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' > /etc/apt/sources.list.d/caddy-stable.list
apt update
apt install -y caddy
```

Create config. Replace `APP_DOMAIN` and `CLEAR_DOMAIN` with real domains only on the server, not in committed documentation:

```bash
cat > /etc/caddy/Caddyfile <<'EOF'
APP_DOMAIN {
    handle /api/* {
        reverse_proxy 127.0.0.1:8085
    }

    reverse_proxy 127.0.0.1:3000
}

CLEAR_DOMAIN {
    reverse_proxy 127.0.0.1:8001
}
EOF

caddy validate --config /etc/caddy/Caddyfile
systemctl reload caddy
systemctl status caddy --no-pager
```

Open:

```text
https://APP_DOMAIN
https://APP_DOMAIN/crm
https://APP_DOMAIN/api/health
```

## 7. Update deployment

```bash
cd /opt/kord/kord-support
git pull
docker compose up -d --build
docker compose exec app alembic upgrade head
```
