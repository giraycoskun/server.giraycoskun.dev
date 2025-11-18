# Server Home Page

```bash
sudo cp nginx.conf /etc/nginx/sites-available/default
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
sudo nginx -t && sudo systemctl reload nginx
```