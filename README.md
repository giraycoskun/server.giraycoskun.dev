# Server Home Page

```bash
sudo cp nginx.conf /etc/nginx/sites-available/server.giraycoskun.dev
```

## Nginx Conf

```bash
sudo nginx -t
sudo nginx -s reload
sudo systemctl reload nginx
sudo systemctl status nginx
```

```bash
sudo ln -s /etc/nginx/sites-available/default /etc/nginx/sites-enabled/
```