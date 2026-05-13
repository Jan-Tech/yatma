#!/bin/bash
# Run this on the VPS to pull and redeploy
set -e
cd /var/www/yatma
git pull origin main
npm install --omit=dev
npx prisma generate
npx prisma db push
npm run build
pm2 restart yatma
echo "Deployed successfully."
