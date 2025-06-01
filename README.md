
# Fibernode Internet - Sistem Manajemen Afiliator

## Project Info

**URL**: https://lovable.dev/projects/d80c474c-2279-43c7-995d-91c89b52aa5d

## Deployment Guide - Windows 11 dengan XAMPP

### Prerequisites
- Windows 11
- Internet connection untuk download dependencies

### Step 1: Install XAMPP

1. **Download XAMPP**
   - Kunjungi https://www.apachefriends.org/download.html
   - Download versi terbaru untuk Windows
   - Pilih yang include PHP 8.1 atau lebih tinggi

2. **Install XAMPP**
   - Jalankan installer sebagai Administrator
   - Install di `C:\xampp` (default location)
   - Pilih komponen: Apache, MySQL, PHP, phpMyAdmin
   - Selesaikan instalasi

3. **Jalankan XAMPP Control Panel**
   - Buka XAMPP Control Panel sebagai Administrator
   - Start Apache dan MySQL services

### Step 2: Install Node.js dan Yarn

1. **Install Node.js**
   - Download dari https://nodejs.org/
   - Pilih versi LTS (Long Term Support)
   - Install dengan setting default
   - Buka Command Prompt dan verify: `node --version`

2. **Install Yarn**
   ```cmd
   npm install -g yarn
   ```
   - Verify installation: `yarn --version`

### Step 3: Clone dan Setup Project

1. **Clone Repository**
   ```cmd
   # Buka Command Prompt atau PowerShell
   cd C:\xampp\htdocs
   git clone <YOUR_GIT_URL> fibernode-app
   cd fibernode-app
   ```

2. **Install Dependencies**
   ```cmd
   yarn install
   ```
   - Proses ini akan download semua dependencies yang diperlukan
   - Tunggu hingga selesai (bisa 5-10 menit tergantung koneksi internet)

### Step 4: Setup Environment Variables

1. **Buat file .env di root project**
   ```cmd
   copy .env.example .env
   ```

2. **Edit file .env**
   ```env
   VITE_API_BASE_URL=https://localhost/api/v1
   VITE_APP_ENV=production
   ```

### Step 5: Build Project untuk Production

1. **Build aplikasi**
   ```cmd
   yarn build
   ```
   - Perintah ini akan membuat folder `dist` berisi file production

2. **Copy hasil build ke XAMPP**
   ```cmd
   # Copy seluruh isi folder dist ke htdocs
   xcopy /E /I dist C:\xampp\htdocs\fibernode
   ```

### Step 6: Setup SSL dengan mkcert (SANGAT DETAIL)

#### A. Install mkcert

1. **Install Chocolatey (package manager untuk Windows)**
   - Buka PowerShell sebagai Administrator
   - Jalankan perintah:
   ```powershell
   Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
   ```

2. **Install mkcert via Chocolatey**
   ```powershell
   choco install mkcert
   ```

3. **Atau install manual:**
   - Download dari https://github.com/FiloSottile/mkcert/releases
   - Download file `mkcert-v1.4.4-windows-amd64.exe`
   - Rename ke `mkcert.exe`
   - Pindahkan ke `C:\Windows\System32\` atau tambahkan ke PATH

#### B. Setup Certificate Authority

1. **Install local CA**
   ```cmd
   mkcert -install
   ```
   - Ini akan install root certificate ke Windows certificate store
   - Klik "Yes" jika ada popup security warning

#### C. Generate SSL Certificate

1. **Buat folder untuk certificates**
   ```cmd
   mkdir C:\xampp\apache\conf\ssl.crt
   mkdir C:\xampp\apache\conf\ssl.key
   ```

2. **Generate certificate untuk localhost**
   ```cmd
   cd C:\xampp\apache\conf\ssl.crt
   mkcert localhost 127.0.0.1 ::1
   ```

3. **File yang dihasilkan:**
   - `localhost+2.pem` (certificate file)
   - `localhost+2-key.pem` (private key file)

4. **Rename dan pindahkan files:**
   ```cmd
   # Di folder C:\xampp\apache\conf\ssl.crt
   copy localhost+2.pem server.crt
   copy localhost+2-key.pem ..\ssl.key\server.key
   ```

#### D. Konfigurasi Apache untuk SSL

1. **Edit httpd.conf**
   - Buka `C:\xampp\apache\conf\httpd.conf`
   - Uncomment baris:
   ```apache
   Include conf/extra/httpd-ssl.conf
   LoadModule rewrite_module modules/mod_rewrite.so
   LoadModule ssl_module modules/mod_ssl.so
   ```

2. **Edit httpd-ssl.conf**
   - Buka `C:\xampp\apache\conf\extra\httpd-ssl.conf`
   - Cari bagian `<VirtualHost _default_:443>` dan edit:
   ```apache
   <VirtualHost _default_:443>
   DocumentRoot "C:/xampp/htdocs"
   ServerName localhost:443
   ServerAdmin admin@localhost
   
   SSLEngine on
   SSLCertificateFile "conf/ssl.crt/server.crt"
   SSLCertificateKeyFile "conf/ssl.key/server.key"
   
   <Location />
       SSLRequireSSL On
       SSLVerifyClient optional
       SSLVerifyDepth 1
       SSLOptions +StdEnvVars
   </Location>
   </VirtualHost>
   ```

3. **Tambahkan Virtual Host untuk project**
   - Edit file `C:\xampp\apache\conf\extra\httpd-vhosts.conf`
   - Tambahkan:
   ```apache
   <VirtualHost *:80>
       DocumentRoot "C:/xampp/htdocs/fibernode"
       ServerName localhost
       <Directory "C:/xampp/htdocs/fibernode">
           AllowOverride All
           Require all granted
       </Directory>
   </VirtualHost>

   <VirtualHost *:443>
       DocumentRoot "C:/xampp/htdocs/fibernode"
       ServerName localhost
       SSLEngine on
       SSLCertificateFile "conf/ssl.crt/server.crt"
       SSLCertificateKeyFile "conf/ssl.key/server.key"
       <Directory "C:/xampp/htdocs/fibernode">
           AllowOverride All
           Require all granted
       </Directory>
   </VirtualHost>
   ```

4. **Enable virtual hosts**
   - Edit `C:\xampp\apache\conf\httpd.conf`
   - Uncomment:
   ```apache
   Include conf/extra/httpd-vhosts.conf
   ```

### Step 7: Setup Auto-Start XAMPP saat Windows Boot

#### A. Menggunakan Windows Services

1. **Install Apache sebagai Windows Service**
   - Buka Command Prompt sebagai Administrator
   ```cmd
   cd C:\xampp\apache\bin
   httpd.exe -k install -n "Apache2.4"
   ```

2. **Install MySQL sebagai Windows Service**
   ```cmd
   cd C:\xampp\mysql\bin
   mysqld.exe --install MySQL --defaults-file="C:\xampp\mysql\bin\my.ini"
   ```

3. **Set services to start automatically**
   - Tekan `Win + R`, ketik `services.msc`
   - Cari "Apache2.4" service
   - Klik kanan → Properties → Startup type → Automatic
   - Ulangi untuk "MySQL" service

#### B. Alternative: Task Scheduler

1. **Buat Batch File**
   - Buat file `C:\xampp\start_xampp.bat`
   ```batch
   @echo off
   cd C:\xampp
   start "" "C:\xampp\xampp_start.exe"
   ```

2. **Setup Task Scheduler**
   - Tekan `Win + R`, ketik `taskschd.msc`
   - Create Basic Task
   - Name: "XAMPP Auto Start"
   - Trigger: "When the computer starts"
   - Action: "Start a program"
   - Program: `C:\xampp\start_xampp.bat`
   - Finish

### Step 8: Testing dan Verification

1. **Restart Apache dan MySQL**
   - Di XAMPP Control Panel, stop lalu start Apache dan MySQL

2. **Test HTTP Access**
   - Buka browser: `http://localhost/fibernode`

3. **Test HTTPS Access**
   - Buka browser: `https://localhost/fibernode`
   - Seharusnya tidak ada warning SSL

4. **Test Auto-Start**
   - Restart komputer
   - Check apakah XAMPP services running otomatis

### Step 9: Troubleshooting

#### Jika SSL tidak bekerja:
1. Check certificate files ada di lokasi yang benar
2. Restart Apache service
3. Clear browser cache dan cookies

#### Jika auto-start tidak bekerja:
1. Check Windows Services running sebagai Administrator
2. Check Task Scheduler permissions

#### Jika port conflict:
1. Check port 80 dan 443 tidak digunakan aplikasi lain
2. Edit `C:\xampp\apache\conf\httpd.conf` untuk ganti port

### Step 10: Update dan Maintenance

1. **Update aplikasi**
   ```cmd
   cd C:\xampp\htdocs\fibernode-app
   git pull origin main
   yarn install
   yarn build
   xcopy /E /I dist C:\xampp\htdocs\fibernode
   ```

2. **Backup database reguler**
   - Gunakan phpMyAdmin di `https://localhost/phpmyadmin`
   - Export database secara berkala

3. **Monitor logs**
   - Apache error log: `C:\xampp\apache\logs\error.log`
   - Access log: `C:\xampp\apache\logs\access.log`

## Technologies Used

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- XAMPP (Apache, MySQL, PHP)

## Support

Untuk bantuan deployment atau troubleshooting, silakan hubungi tim development.
