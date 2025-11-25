# Server Home Page

## Build

```bash
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

Environment="PATH=/home/giraycoskun/.nvm/versions/node/v24.11.1/bin:/usr/local/bin:/usr/bin:/bin"
EnvironmentFile=/etc/webhook-server.env

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl start server-webhook
sudo systemctl enable server-webhook
sudo systemctl status server-webhook
journalctl -u server-webhook.service -r
journalctl -xeu server-webhook.service
journalctl -u server-webhook.service -n 15 -f
```