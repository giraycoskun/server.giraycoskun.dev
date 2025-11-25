#!/bin/bash

echo "--- Pulling latest changes ---"
git pull https://${GITHUB_USER}:${GITHUB_TOKEN}@github.com:giraycoskun/server.giraycoskun.dev.git

echo "--- Installing deps ---"
pnpm install

echo "--- Building project with local ---"
pnpm build:local

echo "--- Building project with external ---"
pnpm build:external

echo "--- Server is Updated ---"
