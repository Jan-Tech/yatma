#!/bin/bash
# Run as root on a fresh Ubuntu 22.04 Vultr VPS
set -e

echo "=== Installing Node.js 20 ==="
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

echo "=== Installing PostgreSQL ==="
apt-get install -y postgresql postgresql-contrib

echo "=== Installing Nginx ==="
apt-get install -y nginx

echo "=== Installing PM2 ==="
npm install -g pm2

echo "=== Setting up PostgreSQL ==="
sudo -u postgres psql -c "CREATE USER yatma WITH PASSWORD 'CHANGE_THIS_PASSWORD';"
sudo -u postgres psql -c "CREATE DATABASE yatma OWNER yatma;"

echo "=== Creating app directory ==="
mkdir -p /var/www/yatma

echo "=== Done. Next steps: ==="
echo "1. cd /var/www/yatma"
echo "2. git clone https://github.com/Jan-Tech/yatma.git ."
echo "3. cp .env.production.example .env.production.local"
echo "4. nano .env.production.local   # fill in DATABASE_URL, NEXTAUTH_SECRET, NEXTAUTH_URL"
echo "5. npm install"
echo "6. npx prisma generate"
echo "7. npx prisma db push"
echo "8. npm run db:seed"
echo "9. npm run build"
echo "10. pm2 start ecosystem.config.js"
echo "11. pm2 save && pm2 startup"
echo "12. cp nginx.conf /etc/nginx/sites-available/yatma"
echo "13. ln -s /etc/nginx/sites-available/yatma /etc/nginx/sites-enabled/"
echo "14. nginx -t && systemctl reload nginx"
