#!/bin/bash
set -e

cd /home/ubuntu/your-project-folder

echo "--- Pulling latest changes ---"
git pull origin main

echo "--- Installing deps ---"
pnpm install

echo "--- Building project ---"
pnpm build

echo "--- Restarting server ---"
# If you use something like pm2:
pm2 restart vite-server
