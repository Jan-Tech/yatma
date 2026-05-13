#!/bin/bash
# Run this ONCE on the VPS after cloning the repo and creating .env.production.local
set -e
cd /var/www/yatma

echo ">>> Loading env vars..."
set -a
source /var/www/yatma/.env.production.local
set +a

echo ">>> Installing dependencies..."
npm install

echo ">>> Generating Prisma client..."
npx prisma generate

echo ">>> Pushing schema to database..."
npx prisma db push

echo ">>> Seeding admin account..."
npm run db:seed

echo ">>> Building app..."
npm run build

echo ">>> Starting with PM2..."
pm2 start ecosystem.config.js
pm2 save
pm2 startup | tail -1 | bash

echo ">>> Configuring Nginx..."
cp /var/www/yatma/nginx.conf /etc/nginx/sites-available/yatma
ln -sf /etc/nginx/sites-available/yatma /etc/nginx/sites-enabled/yatma
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx

echo ""
echo ">>> DONE! App is live."
pm2 list
