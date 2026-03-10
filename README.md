# Server Home Page

> [!IMPORTANT]
> **Hosted website:** [server.giraycoskun.dev](https://server.giraycoskun.dev)

> [!TIP]
> **Features**
> - Responsive landing page for self-hosted services and personal projects
> - Live service reachability badges with `Running`, `Offline`, and `Waiting` states
> - Searchable **Port Mapper** view at `/ports`
> - Searchable **Bash Commands Reference** view at `/commands`
> - Separate local and external builds backed by different JSON datasets
> - Lightweight deployment pipeline using GitHub webhooks, Express, `systemd`, and Nginx
> - Nginx routing that serves `dist-local` or `dist-external` based on request origin

## Overview

`server.giraycoskun.dev` is a React + Vite + TypeScript dashboard for a home server. It exposes self-hosted services, personal projects, utility pages, and a small deployment webhook used to rebuild the site after GitHub pushes.

The frontend currently uses:

- `src/data/data-local.json` for the local-network version
- `src/data/data-external.json` for the public version

Current content snapshot:

- Local build: 18 services and 6 projects
- External build: 9 services and 6 projects
- Main routes: `/`, `/ports`, `/commands`

## Tech Stack

- React 19
- Vite 7
- TypeScript 5
- Tailwind CSS 4
- React Router 7
- Express 5 for the webhook listener
- Nginx for TLS termination, reverse proxying, and static file serving

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Landing page for services and projects |
| `/ports` | Searchable port-to-service and port-to-project mapping |
| `/commands` | Searchable Linux and bash command reference |
| `/webhook` | GitHub webhook endpoint proxied to the Express server |
| `/webhook/health` | Health endpoint for the webhook service |

## Development

### Requirements

- Node.js 24+ recommended
- `pnpm`

### Install

```bash
pnpm install
```

### Run locally

```bash
pnpm dev
```

### Available scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Start the Vite development server |
| `pnpm build` | Run TypeScript build and create the default production bundle |
| `pnpm build:local` | Build the local-network version into `dist-local` |
| `pnpm build:external` | Build the public version into `dist-external` |
| `pnpm preview` | Preview the built frontend |
| `pnpm lint` | Run ESLint |
| `pnpm start` | Start the Express webhook server from `src/server/webhook.tsx` |

## Environment Setup

The frontend chooses its data source using `VITE_ENV`.

`.env.local`

```bash
VITE_ENV=local
```

`.env.external`

```bash
VITE_ENV=external
```

The webhook server also needs runtime secrets and deployment credentials. Provide them through a `systemd` `EnvironmentFile` such as `/etc/webhook-server.env` instead of hardcoding values in commands:

- `WEBHOOK_SECRET`
- `GITHUB_TOKEN`
- `PORT` (optional, defaults to `9000`)

## Project Structure

| Path | Purpose |
| --- | --- |
| `src/App.tsx` | Main router and landing page |
| `src/pages/ports.tsx` | Port Mapper page |
| `src/pages/commands.tsx` | Bash Commands Reference page |
| `src/data/data.tsx` | Loads environment-specific JSON data |
| `src/data/data-local.json` | Local-network services and projects |
| `src/data/data-external.json` | Public-facing services and projects |
| `src/util/check.tsx` | Client-side URL reachability checks |
| `src/server/webhook.tsx` | Express webhook listener |
| `src/server/build.sh` | Deployment build script |
| `nginx.conf` | Nginx configuration for serving and proxying |

## Dual-Build Setup

This project intentionally generates two frontend outputs:

- `dist-local` for requests coming from the home network
- `dist-external` for public requests

At runtime:

1. Nginx classifies the request as local or external.
2. It maps the request to the correct build directory.
3. The frontend loads the matching JSON dataset through `src/data/data.tsx`.

This allows the public site to expose a reduced set of services while keeping the local dashboard more complete.

## Deployment Flow

The deployed setup is intentionally lightweight:

1. A push to GitHub triggers a webhook request to `/webhook`.
2. Nginx forwards that request to the Express app on port `9000`.
3. `src/server/webhook.tsx` verifies `X-Hub-Signature-256`.
4. The webhook server runs `src/server/build.sh`.
5. The build script fetches the latest changes, installs dependencies, and rebuilds both frontend variants.
6. Nginx continues serving `dist-local` or `dist-external` based on the incoming client.

Current build script flow:

```bash
git fetch ...
git pull ...
pnpm install
pnpm build:local
pnpm build:external
```

## Nginx

The repository includes an Nginx configuration that:

- redirects HTTP to HTTPS
- uses a Cloudflare origin certificate
- trusts `CF-Connecting-IP` for request origin detection
- proxies `/webhook` to the local Express listener
- switches the site root between `dist-local` and `dist-external`

Typical deployment steps:

```bash
sudo cp nginx.conf /etc/nginx/sites-available/default
sudo nginx -t
sudo systemctl reload nginx
```

## Webhook Service

Example `systemd` unit name:

`/etc/systemd/system/server-webhook.service`

Example service definition:

```ini
[Unit]
Description=GitHub Server Webhook Listener
After=network.target

[Service]
Type=simple
User=giraycoskun
WorkingDirectory=/home/giraycoskun/Code/server.giraycoskun.dev/
ExecStart=/home/giraycoskun/.nvm/versions/node/v24.11.1/bin/pnpm start
Restart=always
Environment="PATH=/home/giraycoskun/.nvm/versions/node/v24.11.1/bin:/usr/local/bin:/usr/bin:/bin"
EnvironmentFile=/etc/webhook-server.env
StandardOutput=append:/var/log/server-webhook.log
StandardError=inherit

[Install]
WantedBy=multi-user.target
```

Useful commands:

```bash
sudo systemctl daemon-reload
sudo systemctl enable server-webhook
sudo systemctl restart server-webhook
sudo systemctl status server-webhook
journalctl -u server-webhook.service -n 50 -f
```

## Screenshots

Local build:

![server-local](https://images.giraycoskun.dev/ss-server-local.png)

External build:

![server-external](https://images.giraycoskun.dev/ss-server-external.png)
