# Deploy to VDS

Target server example:

```text
188.225.38.81
support.koard.ru
```

## 1. DNS

Create an A record:

```text
support.koard.ru  A  188.225.38.81
```

Optional dev subdomain:

```text
dev.support.koard.ru  A  188.225.38.81
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
docker compose exec app python -m scripts.seed_admin
```

Check:

```bash
curl http://127.0.0.1:8085/api/health
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

Create config:

```bash
cat > /etc/caddy/Caddyfile <<'EOF'
support.koard.ru {
    reverse_proxy 127.0.0.1:8085
}
EOF

systemctl reload caddy
systemctl status caddy --no-pager
```

Open:

```text
https://support.koard.ru
https://support.koard.ru/crm
https://support.koard.ru/docs
```

## 7. Update deployment

```bash
cd /opt/kord/kord-support
git pull
docker compose up -d --build
docker compose exec app alembic upgrade head
```
