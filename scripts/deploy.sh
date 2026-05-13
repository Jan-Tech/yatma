#!/bin/bash
# Full deploy script — run from /var/www/yatma on the VPS
set -e
cd /var/www/yatma

echo ">>> Pulling latest code..."
git pull origin main

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

echo ">>> Building app..."
npm run build

echo ">>> Restarting PM2..."
pm2 restart yatma 2>/dev/null || pm2 start ecosystem.config.js

pm2 save
echo ">>> Done! App running on port 3002."
pm2 list
