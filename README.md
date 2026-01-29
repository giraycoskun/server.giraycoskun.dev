# Server Home Page

## Build

```bash
pnpm install
pnpm run build
```

```bash
pnpm build:local
pnpm build:external
```

```bash
pnpm dev
```

## Nginx Conf

```bash
sudo cp nginx.conf /etc/nginx/sites-available/default
```

```bash
sudo nginx -t
sudo nginx -s reload
sudo systemctl reload nginx
sudo systemctl status nginx
```

```bash
sudo ln -s /etc/nginx/sites-available/default /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

## Webhook Server

/etc/systemd/system/server-webhook.service
```
[Unit]
Description=GitHub Server-Webhook Listener
After=network.target

[Service]
Type=simple
User=giraycoskun
WorkingDirectory=/home/giraycoskun/Code/server.giraycoskun.dev/
ExecStart=/home/giraycoskun/.nvm/versions/node/v24.11.1/bin/pnpm start
Restart=always
# Redirect logs to a file
StandardOutput=append:/var/log/server-webhook.log
StandardError=inherit

Environment="PATH=/home/giraycoskun/.nvm/versions/node/v24.11.1/bin:/usr/local/bin:/usr/bin:/bin"
EnvironmentFile=/etc/webhook-server.env

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl start server-webhook
sudo systemctl restart server-webhook
sudo systemctl enable server-webhook
sudo systemctl status server-webhook
journalctl -u server-webhook.service -r
journalctl -xeu server-webhook.service
journalctl -u server-webhook.service -n 15 -f
```

The project is developed via React, Vite, and TypeScript. I have chosen React because well, I like and have some experience with it. I have never used Vite previously, but it has been quite fast to test and build the project and did not face any issues so far. I have also never used Typescript but I have been writing Python with types, thus wanted to give it a try for javascript as well.

Project is built and served via Nginx on my home server. I also wanted a Continuous Build setup, but Jenkins was too heavy for this, thus have a small Express.js app that listens to GitHub webhooks and triggers a build bash script which is run as a systemd service.


### Initialize project

```bash
pnpm create vite@latest my-app --template react
```

```bash
pnpm install
```

This sets up a basic React + Vite project with TypeScript support. The development server can be started with:

```bash
pnpm dev
```

### Project Structure

The project follows a standard React application structure:

- `/src` - Main application code
- `/src/components` - Reusable React components
- `/src/pages` - Page components
- `/public` - Static assets
- `vite.config.ts` - Vite configuration

## Step 2: How to Build via GitHub Webhooks

I have considered Jenkins for Continuous Deployment but it was too heavy and as the Nginx was on the host machine directly, and Jenkins either needed to be directly on host machine as well or else the container creates some overhead due to SSH connection.

I have decided on a simpler solution: A simple Express.js app (`./src/server/webhook-server.ts`) that is triggered by a GitHub Webhook, run as a systemd service.

## Double Build

![server-screenshot](https://images.giraycoskun.dev/ss-server-local.png)

![server-external](https://images.giraycoskun.dev/ss-server-external.png)


### Systemd Service

Create a systemd service file at `/etc/systemd/system/webhook-server.service`:

```ini
[Unit]
Description=GitHub Webhook Server
After=network.target

[Service]
Type=simple
User=your-user
WorkingDirectory=/path/to/project
ExecStart=/usr/bin/node /path/to/webhook-server.js
Restart=always

[Install]
WantedBy=multi-user.target
```

Enable and start the service:

```bash
sudo systemctl enable webhook-server
sudo systemctl start webhook-server
```

### Webhook Handler

The Express.js application listens for GitHub webhook events and triggers the build script:

```javascript
const express = require('express');
const { exec } = require('child_process');

app.post('/webhook', (req, res) => {
  // Verify webhook signature
  // Execute build script
  exec('./build.sh', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error}`);
      return;
    }
    console.log(`Build output: ${stdout}`);
  });
  
  res.status(200).send('Webhook received');
});
```

## Step 3: How to Deploy in Nginx on Home Server

Here are the essential steps to deploy the built React application on Nginx:

### Build the Project

```bash
pnpm build
```

This creates an optimized production build in the `dist` directory.

### Nginx Configuration

Create an Nginx server block configuration file at `/etc/nginx/sites-available/server.giraycoskun.dev`:

```nginx
server {
    listen 80;
    server_name server.giraycoskun.dev;
    
    root /path/to/project/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/server.giraycoskun.dev /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```