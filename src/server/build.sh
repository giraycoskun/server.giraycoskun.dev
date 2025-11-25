#!/bin/bash

echo "--- Pulling latest changes ---"
git pull origin main

echo "--- Installing deps ---"
pnpm install

echo "--- Building project with local ---"
pnpm build:local

echo "--- Building project with external ---"
pnpm build:external

echo "--- Server is Updated ---"
