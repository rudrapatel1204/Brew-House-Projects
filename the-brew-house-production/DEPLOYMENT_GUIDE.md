# 🚀 VPS Deployment Guide — THE BREW HOUSE

This guide outlines how to deploy **THE BREW HOUSE** website on any Linux VPS (Ubuntu/Debian, CentOS/AlmaLinux, Arch) using Nginx, Caddy, or Apache.

---

## 📦 1. Fast Download Options to Your VPS

### Option A: Direct Secure Copy (SCP from your local machine to your VPS)
Run this command from your local Windows terminal (PowerShell or Git Bash):
```bash
scp "C:\Users\rudra patel\OneDrive\Desktop\new proejct\the-brew-house-production.zip" user@YOUR_VPS_IP:/var/www/
```

### Option B: Local HTTP Server Transfer
1. On your Windows machine, open PowerShell in the project directory:
   ```powershell
   python -m http.server 8080
   ```
2. On your VPS terminal, download it directly:
   ```bash
   wget http://YOUR_PC_PUBLIC_IP:8080/the-brew-house-production.zip
   # or
   curl -O http://YOUR_PC_PUBLIC_IP:8080/the-brew-house-production.zip
   ```

3. Unzip on your VPS:
   ```bash
   unzip the-brew-house-production.zip -d /var/www/the-brew-house
   ```

---

## 🌐 2. Nginx Production Configuration

1. Create a server block on your VPS at `/etc/nginx/sites-available/the-brew-house`:
```nginx
server {
    listen 80;
    listen [::]:80;
    server_name yourdomain.com www.yourdomain.com; # Replace with your domain

    root /var/www/the-brew-house;
    index index.html;

    # Gzip compression for high performance
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript image/svg+xml;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets (CSS, JS, Fonts, Images)
    location ~* \.(css|js|jpg|jpeg|png|gif|ico|svg|woff2|woff)$ {
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

2. Enable the site and test Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/the-brew-house /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

3. Enable free SSL (HTTPS) with Certbot:
```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

## ⚡ 3. Caddy Alternative (Instant HTTPS)

If you use Caddy, simply add this to your `/etc/caddy/Caddyfile`:
```caddy
yourdomain.com {
    root * /var/www/the-brew-house
    file_server
    encode gzip
}
```
Then run:
```bash
sudo systemctl reload caddy
```

---

## 🛠️ 4. Client Configuration Prior to Production
Open `/var/www/the-brew-house/js/main.js` and update the top configuration block:
```javascript
const CONFIG = {
  // Replace with the business WhatsApp number (with country code, e.g. "919876543210")
  WHATSAPP_PHONE: "919876543210",
  
  CAFE_PHONE_DISPLAY: "+91 (0265) 234-8900",
  CAFE_EMAIL: "concierge@yourcafedomain.com",
  LOCATION_ADDRESS: "14, Heritage Avenue, Alkapuri, Vadodara, Gujarat 390007"
};
```
