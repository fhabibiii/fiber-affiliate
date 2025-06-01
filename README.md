
# Fibernode Internet - Sistem Manajemen Afiliator

Aplikasi web untuk mengelola sistem afiliator Fibernode Internet yang dibangun dengan React, TypeScript, Vite, dan Tailwind CSS.

## 🚀 Fitur Utama

- **Dashboard Admin**: Kelola afiliator, pelanggan, dan pembayaran
- **Dashboard Afiliator**: Pantau pelanggan dan riwayat pembayaran
- **Autentikasi Berbasis Cookie**: Sistem login yang aman
- **PWA Support**: Dapat diinstall sebagai aplikasi mobile
- **Responsive Design**: Kompatibel dengan desktop dan mobile
- **Real-time Data**: Sinkronisasi data real-time dengan backend

## 📋 Prasyarat Sistem

Sebelum memulai, pastikan sistem Anda memiliki:

- **Node.js** (versi 18 atau lebih baru) - [Download](https://nodejs.org/)
- **npm** (biasanya sudah termasuk dengan Node.js)
- **XAMPP** - [Download](https://www.apachefriends.org/)
- **mkcert** - [Download](https://github.com/FiloSottile/mkcert)
- **Git** - [Download](https://git-scm.com/)

## 🛠️ Instalasi dan Setup Development

### 1. Clone Repository

```bash
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Buat file `.env` di root directory:

```env
# Environment Configuration
VITE_APP_ENV=development
VITE_API_BASE_URL=https://315b-2404-c0-3740-00-a64c-1454.ngrok-free.app/api/v1

# Optional: Override default settings
# VITE_APP_NAME=Fibernode Internet
# VITE_REQUEST_TIMEOUT=10000
```

**Konfigurasi Environment:**
- `VITE_APP_ENV`: Set ke `development` untuk development, `production` untuk production
- `VITE_API_BASE_URL`: URL backend API (gunakan ngrok URL untuk development)

### 4. Jalankan Development Server

```bash
npm run dev
```

Aplikasi akan berjalan di `http://localhost:8080`

## 🌐 Setup HTTPS dengan mkcert (Recommended)

Untuk fitur PWA dan cookie yang optimal, gunakan HTTPS di development:

### 1. Install mkcert

**Windows (dengan Chocolatey):**
```bash
choco install mkcert
```

**macOS (dengan Homebrew):**
```bash
brew install mkcert
```

**Linux:**
```bash
# Download binary dari GitHub releases
curl -JLO "https://dl.filippo.io/mkcert/latest?for=linux/amd64"
chmod +x mkcert-v*-linux-amd64
sudo mv mkcert-v*-linux-amd64 /usr/local/bin/mkcert
```

### 2. Setup Certificate Authority

```bash
mkcert -install
```

### 3. Generate Certificate

Di directory project:

```bash
mkcert localhost 127.0.0.1 ::1
```

### 4. Update Vite Config untuk HTTPS

Buat file `vite.config.local.ts`:

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from "fs";

export default defineConfig({
  server: {
    host: "::",
    port: 8080,
    https: {
      key: fs.readFileSync('./localhost+2-key.pem'),
      cert: fs.readFileSync('./localhost+2.pem'),
    }
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

Jalankan dengan:
```bash
npx vite --config vite.config.local.ts
```

## 📦 Build untuk Production

### 1. Setup Environment Production

Update file `.env`:

```env
VITE_APP_ENV=production
VITE_API_BASE_URL=https://your-production-api.com/api/v1
```

### 2. Build Aplikasi

```bash
npm run build
```

Output akan tersimpan di folder `dist/`

### 3. Preview Build

```bash
npm run preview
```

## 🚀 Deployment dengan XAMPP

### 1. Setup XAMPP

1. **Install XAMPP** dari [https://www.apachefriends.org/](https://www.apachefriends.org/)
2. **Start Apache** dari XAMPP Control Panel
3. **Akses folder web** di `C:\xampp\htdocs\` (Windows) atau `/opt/lampp/htdocs/` (Linux)

### 2. Deploy Aplikasi

1. **Copy build files:**
   ```bash
   # Copy semua isi folder dist/ ke htdocs
   cp -r dist/* C:/xampp/htdocs/fibernode/
   ```

2. **Setup Virtual Host (Opsional):**
   
   Edit `C:\xampp\apache\conf\extra\httpd-vhosts.conf`:
   ```apache
   <VirtualHost *:80>
       DocumentRoot "C:/xampp/htdocs/fibernode"
       ServerName fibernode.local
       ErrorLog "logs/fibernode.local-error.log"
       CustomLog "logs/fibernode.local-access.log" common
   </VirtualHost>
   ```

   Edit `C:\Windows\System32\drivers\etc\hosts`:
   ```
   127.0.0.1 fibernode.local
   ```

3. **Restart Apache** dari XAMPP Control Panel

### 3. Setup HTTPS di XAMPP

1. **Generate SSL Certificate:**
   ```bash
   mkcert fibernode.local
   ```

2. **Copy certificates** ke `C:\xampp\apache\conf\ssl.crt\`

3. **Edit SSL config** di `C:\xampp\apache\conf\extra\httpd-ssl.conf`:
   ```apache
   <VirtualHost fibernode.local:443>
       DocumentRoot "C:/xampp/htdocs/fibernode"
       ServerName fibernode.local
       SSLEngine on
       SSLCertificateFile "conf/ssl.crt/fibernode.local.pem"
       SSLCertificateKeyFile "conf/ssl.crt/fibernode.local-key.pem"
   </VirtualHost>
   ```

4. **Enable SSL module** di `C:\xampp\apache\conf\httpd.conf`:
   ```apache
   # Uncomment this line:
   Include conf/extra/httpd-ssl.conf
   ```

5. **Restart Apache**

### 4. Konfigurasi SPA Routing

Buat file `.htaccess` di `C:\xampp\htdocs\fibernode\`:

```apache
Options -MultiViews
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^ index.html [QSA,L]

# Security headers
Header always set X-Content-Type-Options nosniff
Header always set X-Frame-Options DENY
Header always set X-XSS-Protection "1; mode=block"
Header always set Referrer-Policy "strict-origin-when-cross-origin"

# Cache static assets
<FilesMatch "\.(css|js|png|jpg|jpeg|gif|svg|woff2|woff|ttf|ico)$">
    ExpiresActive On
    ExpiresDefault "access plus 1 year"
</FilesMatch>
```

## 🔧 Troubleshooting

### Masalah Umum

**1. CORS Error:**
- Pastikan backend mengizinkan origin frontend
- Check cookie settings di browser

**2. Build Error:**
- Hapus `node_modules` dan jalankan `npm install` ulang
- Check versi Node.js (minimal v18)

**3. PWA tidak terinstall:**
- Pastikan menggunakan HTTPS
- Check service worker di DevTools

**4. API Connection Error:**
- Verify VITE_API_BASE_URL di `.env`
- Check ngrok tunnel masih aktif
- Pastikan backend berjalan

### Debug Mode

Enable debug logs:
```env
VITE_APP_ENV=development
```

Check console untuk detailed error messages.

## 🔐 Keamanan

Aplikasi ini mengimplementasikan beberapa fitur keamanan:

- **Cookie-based Authentication**: Session disimpan di server
- **Secure Storage**: Data sensitif dienkripsi di sessionStorage
- **CSP Headers**: Proteksi terhadap XSS attacks
- **Error Sanitization**: Error messages tidak expose detail sistem
- **Conditional Logging**: Console logs hanya di development

## 📱 PWA Features

- **Offline Support**: Service worker untuk caching
- **Install Prompt**: Dapat diinstall sebagai aplikasi
- **Responsive Design**: Optimal di semua device
- **Background Sync**: Sinkronisasi data background

## 🏗️ Teknologi yang Digunakan

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui
- **State Management**: React Query (@tanstack/react-query)
- **Routing**: React Router DOM
- **PWA**: Vite PWA Plugin
- **Build Tool**: Vite
- **Package Manager**: npm

## 📄 Lisensi

Private project untuk Fibernode Internet.

## 🤝 Kontribusi

Untuk kontribusi atau pertanyaan, hubungi tim development Fibernode Internet.

---

**Happy Coding! 🚀**
