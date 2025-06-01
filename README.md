
# Fibernode Internet - Sistem Manajemen Afiliator

## Project Info

**URL**: https://lovable.dev/projects/d80c474c-2279-43c7-995d-91c89b52aa5d

## Deployment Guide - Windows 11 dengan Nginx

### Prerequisites
- Windows 11 Professional/Enterprise (untuk Windows Service)
- Domain name yang sudah terdaftar dan pointing ke server
- Internet connection untuk download dependencies
- Administrator access di Windows

### Step 1: Install Node.js dan Yarn

1. **Install Node.js**
   - Kunjungi https://nodejs.org/
   - Download versi LTS (Long Term Support) terbaru
   - Jalankan installer dengan setting default
   - Restart Command Prompt setelah instalasi selesai
   - Verify installation:
   ```cmd
   node --version
   npm --version
   ```

2. **Install Yarn Package Manager**
   ```cmd
   npm install -g yarn
   ```
   - Verify installation:
   ```cmd
   yarn --version
   ```

### Step 2: Install Git dan Clone Repository

1. **Install Git untuk Windows**
   - Download dari https://git-scm.com/download/win
   - Install dengan setting default
   - Verify installation:
   ```cmd
   git --version
   ```

2. **Clone Repository**
   ```cmd
   # Buat folder untuk project
   mkdir C:\websites
   cd C:\websites
   
   # Clone repository (ganti dengan URL repository Anda)
   git clone <YOUR_GIT_REPOSITORY_URL> fibernode-app
   cd fibernode-app
   ```

### Step 3: Install Dependencies dan Build Project

1. **Install Dependencies**
   ```cmd
   # Pastikan berada di folder project
   cd C:\websites\fibernode-app
   
   # Install semua dependencies
   yarn install
   ```
   - Proses ini akan download semua packages yang diperlukan
   - Tunggu hingga selesai (5-15 menit tergantung koneksi internet)

2. **Setup Environment Variables untuk Production**
   - Buat file `.env.production` di root project:
   ```cmd
   copy .env.example .env.production
   ```
   - Edit file `.env.production` dengan text editor:
   ```env
   VITE_API_BASE_URL=https://yourdomain.com/api/v1
   VITE_APP_ENV=production
   VITE_APP_TITLE=Fibernode Internet
   ```
   - Ganti `yourdomain.com` dengan domain sebenarnya

3. **Build Project untuk Production**
   ```cmd
   # Build aplikasi untuk production
   yarn build
   ```
   - Perintah ini akan membuat folder `dist` berisi file production-ready
   - Pastikan tidak ada error dalam proses build

### Step 4: Install dan Setup Nginx

#### A. Download dan Install Nginx

1. **Download Nginx untuk Windows**
   - Kunjungi https://nginx.org/en/download.html
   - Download versi "Stable version" untuk Windows
   - Extract file ZIP ke `C:\nginx`

2. **Verifikasi Instalasi**
   ```cmd
   cd C:\nginx
   nginx -v
   ```

#### B. Setup Nginx sebagai Windows Service

1. **Download NSSM (Non-Sucking Service Manager)**
   - Kunjungi https://nssm.cc/download
   - Download versi terbaru
   - Extract ke `C:\tools\nssm`

2. **Install Nginx sebagai Windows Service**
   ```cmd
   # Buka Command Prompt sebagai Administrator
   cd C:\tools\nssm\win64
   
   # Install service
   nssm install nginx "C:\nginx\nginx.exe"
   
   # Set working directory
   nssm set nginx AppDirectory "C:\nginx"
   
   # Set startup type to automatic
   nssm set nginx Start SERVICE_AUTO_START
   
   # Set description
   nssm set nginx Description "Nginx Web Server"
   ```

### Step 5: Setup SSL Certificate dengan Let's Encrypt (Certbot)

#### A. Install Certbot untuk Windows

1. **Install Chocolatey Package Manager**
   - Buka PowerShell sebagai Administrator
   - Jalankan perintah:
   ```powershell
   Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
   ```

2. **Install Certbot via Chocolatey**
   ```powershell
   choco install certbot
   ```

#### B. Konfigurasi Domain dan DNS

1. **Pastikan Domain Pointing ke Server**
   - Login ke domain registrar/DNS provider
   - Set A record untuk domain mengarah ke IP public server
   - Set CNAME record untuk www mengarah ke domain utama
   - Tunggu propagasi DNS (biasanya 15-60 menit)

2. **Verify DNS Propagation**
   ```cmd
   nslookup yourdomain.com
   ping yourdomain.com
   ```

#### C. Generate SSL Certificate

1. **Stop Nginx Service sementara**
   ```cmd
   # Buka Command Prompt sebagai Administrator
   net stop nginx
   ```

2. **Request SSL Certificate**
   ```cmd
   # Request certificate untuk domain dan www subdomain
   certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com
   ```
   - Ikuti prompt untuk memasukkan email dan agree terms
   - Certificate akan disimpan di: `C:\Certbot\live\yourdomain.com\`

3. **Verify Certificate Files**
   ```cmd
   dir "C:\Certbot\live\yourdomain.com"
   ```
   - Pastikan ada files: `privkey.pem`, `fullchain.pem`, `cert.pem`, `chain.pem`

### Step 6: Konfigurasi Nginx

#### A. Backup Konfigurasi Default

```cmd
cd C:\nginx\conf
copy nginx.conf nginx.conf.backup
```

#### B. Buat Konfigurasi Production

1. **Edit nginx.conf**
   - Buka `C:\nginx\conf\nginx.conf` dengan text editor
   - Ganti seluruh isi dengan konfigurasi berikut:

```nginx
worker_processes auto;
error_log logs/error.log;
pid logs/nginx.pid;

events {
    worker_connections 1024;
    use select;
}

http {
    include       mime.types;
    default_type  application/octet-stream;
    
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';
    
    access_log logs/access.log main;
    
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
    
    # Rate limiting
    limit_req_zone $binary_remote_addr zone=login:10m rate=10r/m;
    limit_req_zone $binary_remote_addr zone=api:10m rate=100r/m;
    
    # Redirect HTTP to HTTPS
    server {
        listen 80;
        server_name yourdomain.com www.yourdomain.com;
        return 301 https://$server_name$request_uri;
    }
    
    # HTTPS Server
    server {
        listen 443 ssl http2;
        server_name yourdomain.com www.yourdomain.com;
        
        # SSL Configuration
        ssl_certificate "C:/Certbot/live/yourdomain.com/fullchain.pem";
        ssl_certificate_key "C:/Certbot/live/yourdomain.com/privkey.pem";
        
        ssl_session_cache shared:SSL:1m;
        ssl_session_timeout 10m;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES128-SHA256:ECDHE-RSA-AES256-SHA384;
        ssl_prefer_server_ciphers on;
        
        # Document root
        root "C:/websites/fibernode-app/dist";
        index index.html;
        
        # Handle client-side routing
        location / {
            try_files $uri $uri/ /index.html;
        }
        
        # Static assets caching
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
        
        # API proxy (jika diperlukan)
        location /api/ {
            limit_req zone=api burst=20 nodelay;
            proxy_pass http://your-backend-server;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }
        
        # Security: Hide nginx version
        server_tokens off;
        
        # Security: Prevent access to sensitive files
        location ~ /\. {
            deny all;
        }
        
        location ~ ~$ {
            deny all;
        }
    }
}
```

2. **Ganti Domain Placeholder**
   - Ganti semua `yourdomain.com` dengan domain sebenarnya
   - Ganti `your-backend-server` dengan URL backend server jika ada

#### C. Test Konfigurasi Nginx

```cmd
cd C:\nginx
nginx -t
```
- Pastikan output menunjukkan "syntax is ok" dan "test is successful"

### Step 7: Setup Auto-Renewal SSL Certificate

#### A. Buat Script untuk Auto-Renewal

1. **Buat folder untuk scripts**
   ```cmd
   mkdir C:\scripts
   ```

2. **Buat batch script untuk renewal**
   - Buat file `C:\scripts\renew-ssl.bat`:
   ```batch
   @echo off
   echo Starting SSL certificate renewal...
   
   REM Stop nginx service
   net stop nginx
   
   REM Renew certificate
   certbot renew --quiet
   
   REM Start nginx service
   net start nginx
   
   echo SSL certificate renewal completed.
   ```

#### B. Setup Task Scheduler untuk Auto-Renewal

1. **Buka Task Scheduler**
   - Tekan `Win + R`, ketik `taskschd.msc`

2. **Create New Task**
   - Klik "Create Task" di sidebar kanan
   - **General Tab:**
     - Name: "SSL Certificate Auto Renewal"
     - Description: "Automatically renew Let's Encrypt SSL certificates"
     - Run whether user is logged on or not: ✓
     - Run with highest privileges: ✓

   - **Triggers Tab:**
     - Click "New"
     - Begin the task: "On a schedule"
     - Settings: "Monthly"
     - Day: 1 (first day of month)
     - Time: 02:00 AM
     - Repeat task every: 12 hours for duration of 1 day

   - **Actions Tab:**
     - Click "New"
     - Action: "Start a program"
     - Program/script: `C:\scripts\renew-ssl.bat`

   - **Settings Tab:**
     - Allow task to be run on demand: ✓
     - If the running task does not end when requested, force it to stop: ✓

### Step 8: Deploy dan Start Services

#### A. Copy Built Files

```cmd
# Pastikan folder dist sudah ada
cd C:\websites\fibernode-app
dir dist

# Files sudah di tempat yang benar dari proses build sebelumnya
```

#### B. Start Nginx Service

```cmd
# Start nginx service
net start nginx

# Verify service status
sc query nginx
```

#### C. Test Website

1. **Test HTTP Redirect**
   - Buka browser: `http://yourdomain.com`
   - Seharusnya redirect otomatis ke HTTPS

2. **Test HTTPS Access**
   - Buka browser: `https://yourdomain.com`
   - Verify SSL certificate valid (green lock icon)

3. **Test Application Functionality**
   - Test login functionality
   - Test all routes dan navigation
   - Check browser console untuk errors

### Step 9: Monitoring dan Maintenance

#### A. Setup Log Monitoring

1. **Nginx Access Logs**
   - Location: `C:\nginx\logs\access.log`
   - Monitor untuk traffic patterns

2. **Nginx Error Logs**
   - Location: `C:\nginx\logs\error.log`
   - Monitor untuk errors dan issues

#### B. Regular Maintenance Tasks

1. **Update Application**
   ```cmd
   cd C:\websites\fibernode-app
   
   # Pull latest changes
   git pull origin main
   
   # Install new dependencies
   yarn install
   
   # Build for production
   yarn build
   
   # Restart nginx to clear cache
   net stop nginx
   net start nginx
   ```

2. **Monitor SSL Certificate Expiry**
   ```cmd
   # Check certificate expiry date
   certbot certificates
   ```

3. **Backup Important Files**
   - Backup `C:\nginx\conf\nginx.conf`
   - Backup `C:\Certbot\live\yourdomain.com\`
   - Backup project files regular

### Step 10: Troubleshooting

#### A. Common Issues dan Solutions

1. **Nginx Service Won't Start**
   ```cmd
   # Check configuration
   cd C:\nginx
   nginx -t
   
   # Check error logs
   type logs\error.log
   ```

2. **SSL Certificate Issues**
   ```cmd
   # Test SSL certificate
   certbot certificates
   
   # Force renew if needed
   certbot renew --force-renewal
   ```

3. **Port Already in Use**
   ```cmd
   # Check what's using port 80/443
   netstat -ano | findstr :80
   netstat -ano | findstr :443
   ```

4. **DNS Issues**
   ```cmd
   # Flush DNS cache
   ipconfig /flushdns
   
   # Check DNS resolution
   nslookup yourdomain.com
   ```

#### B. Performance Monitoring

1. **Monitor Resource Usage**
   - Open Task Manager
   - Monitor nginx.exe CPU dan memory usage
   - Ensure system has adequate resources

2. **Check Website Performance**
   - Use tools seperti GTmetrix, PageSpeed Insights
   - Monitor loading times dan optimization opportunities

### Step 11: Security Hardening

#### A. Windows Firewall Configuration

1. **Open Required Ports**
   ```cmd
   # Allow HTTP (port 80)
   netsh advfirewall firewall add rule name="HTTP" dir=in action=allow protocol=TCP localport=80
   
   # Allow HTTPS (port 443)
   netsh advfirewall firewall add rule name="HTTPS" dir=in action=allow protocol=TCP localport=443
   ```

#### B. Regular Security Updates

1. **Keep Windows Updated**
   - Enable automatic Windows updates
   - Regular security patches

2. **Update Nginx Regular**
   - Download latest version dari nginx.org
   - Replace files dan restart service

3. **Monitor Security Logs**
   - Check nginx access logs untuk suspicious activity
   - Setup fail2ban equivalent untuk Windows jika diperlukan

## Technologies Used

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Nginx
- Let's Encrypt SSL
- Windows Services

## Support

Untuk bantuan deployment atau troubleshooting, silakan hubungi tim development atau refer ke dokumentasi official:

- Nginx Documentation: https://nginx.org/en/docs/
- Certbot Documentation: https://certbot.eff.org/docs/
- Let's Encrypt: https://letsencrypt.org/docs/

## Notes

- Pastikan domain sudah pointing ke server sebelum request SSL certificate
- Auto-renewal SSL akan berjalan setiap bulan, monitor logs untuk memastikan success
- Backup konfigurasi dan certificates secara regular
- Monitor server resources dan website performance secara berkala
