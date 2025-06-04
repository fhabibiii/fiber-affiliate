
# Fibernode Internet - Sistem Manajemen Afiliator

## Project Info

**Repository**: https://github.com/fhabibiii/fiber-affiliate-nexus  
**Framework**: React + Vite + TypeScript  
**Styling**: Tailwind CSS + shadcn/ui

## Panduan Deployment - Windows dengan XAMPP

### Prerequisites
- Windows 10/11
- Internet connection untuk download dependencies
- Administrator access di Windows

---

## Step 1: Install Git untuk Windows

### Download dan Install Git

1. **Buka browser dan kunjungi**: https://git-scm.com/download/win
2. **Download Git for Windows** (pilih versi 64-bit)
3. **Jalankan installer** yang sudah didownload
4. **Ikuti wizard instalasi**:
   - Welcome screen: Klik **Next**
   - Select Components: Biarkan default, klik **Next**
   - Select Start Menu Folder: Biarkan default, klik **Next**
   - Choosing the default editor: Pilih **Use Visual Studio Code** (atau editor favorit), klik **Next**
   - Adjusting your PATH environment: Pilih **Git from the command line and also from 3rd-party software**, klik **Next**
   - Choosing HTTPS transport backend: Pilih **Use the OpenSSL library**, klik **Next**
   - Configuring the line ending conversions: Pilih **Checkout Windows-style, commit Unix-style**, klik **Next**
   - Configuring the terminal emulator: Pilih **Use MinTTY**, klik **Next**
   - Choose the default behavior of git pull: Pilih **Default (fast-forward or merge)**, klik **Next**
   - Choose a credential helper: Pilih **Git Credential Manager**, klik **Next**
   - Configuring extra options: Biarkan default, klik **Next**
   - Configuring experimental options: Jangan centang apapun, klik **Install**

5. **Tunggu proses instalasi selesai**, lalu klik **Finish**

### Verifikasi Instalasi Git

1. **Buka Command Prompt** (tekan `Win + R`, ketik `cmd`, tekan Enter)
2. **Ketik perintah berikut**:
   ```cmd
   git --version
   ```
3. **Harusnya muncul output seperti**: `git version 2.x.x.windows.x`

---

## Step 2: Install Node.js dan Yarn

### Install Node.js

1. **Kunjungi**: https://nodejs.org/
2. **Download versi LTS** (Long Term Support) - pilih yang ada tulisan "Recommended For Most Users"
3. **Jalankan installer**:
   - Welcome screen: Klik **Next**
   - End-User License Agreement: Centang **I accept**, klik **Next**
   - Destination Folder: Biarkan default `C:\Program Files\nodejs\`, klik **Next**
   - Custom Setup: Biarkan semua ter-centang, klik **Next**
   - Tools for Native Modules: **JANGAN centang** "Automatically install the necessary tools", klik **Next**
   - Ready to Install: Klik **Install**
   - Tunggu proses instalasi selesai, klik **Finish**

4. **Restart Command Prompt** (tutup dan buka kembali)
5. **Verifikasi instalasi**:
   ```cmd
   node --version
   npm --version
   ```
   Harusnya muncul versi Node.js dan npm

### Install Yarn Package Manager

1. **Buka Command Prompt sebagai Administrator**:
   - Tekan `Win + X`
   - Pilih **"Command Prompt (Admin)"** atau **"Windows PowerShell (Admin)"**

2. **Install Yarn globally**:
   ```cmd
   npm install -g yarn
   ```

3. **Verifikasi instalasi Yarn**:
   ```cmd
   yarn --version
   ```
   Harusnya muncul versi Yarn

---

## Step 3: Clone Project dari GitHub

### Buat Folder untuk Project

1. **Buka File Explorer**
2. **Buat folder baru** di `C:\` dengan nama `websites`
   - Klik kanan di drive C:
   - Pilih **New > Folder**
   - Beri nama: `websites`

### Clone Repository

1. **Buka Command Prompt**
2. **Masuk ke folder websites**:
   ```cmd
   cd C:\websites
   ```

3. **Clone repository**:
   ```cmd
   git clone https://github.com/fhabibiii/fiber-affiliate-nexus.git
   ```

4. **Masuk ke folder project**:
   ```cmd
   cd fiber-affiliate-nexus
   ```

5. **Verifikasi isi folder**:
   ```cmd
   dir
   ```
   Harusnya muncul file-file seperti: `package.json`, `src`, `public`, dll.

---

## Step 4: Install Dependencies Project

### Install Dependencies

1. **Pastikan berada di folder project**:
   ```cmd
   cd C:\websites\fiber-affiliate-nexus
   ```

2. **Install semua dependencies**:
   ```cmd
   yarn install
   ```
   
   **Catatan**: 
   - Proses ini akan download semua packages yang diperlukan
   - Tunggu hingga selesai (5-15 menit tergantung koneksi internet)
   - Jika muncul warning, itu normal, yang penting tidak ada error merah

3. **Verifikasi instalasi berhasil**:
   ```cmd
   yarn --version
   ```
   Dan pastikan ada folder `node_modules` di dalam project:
   ```cmd
   dir
   ```

---

## Step 5: Kustomisasi Favicon (Opsional)

### Mengganti Favicon Default

1. **Siapkan file favicon**:
   - Format yang didukung: `.ico`, `.png`, `.jpg`, `.svg`
   - Ukuran yang disarankan: 32x32px atau 16x16px
   - Nama file: `favicon.ico` (untuk kompatibilitas terbaik)

2. **Ganti file favicon**:
   - Buka folder: `C:\websites\fiber-affiliate-nexus\public\`
   - **Backup** file `favicon.ico` yang lama (rename menjadi `favicon-old.ico`)
   - **Copy** file favicon baru ke folder tersebut
   - **Rename** file baru menjadi `favicon.ico`

3. **Verifikasi favicon baru**:
   - Setelah build dan deploy, favicon baru akan muncul di browser tab
   - Mungkin perlu clear cache browser untuk melihat perubahan

**Tips Favicon**:
- Gunakan desain yang simple dan mudah dikenali
- Test di berbagai ukuran untuk memastikan clarity
- Konsisten dengan branding aplikasi

---

## Step 6: Membuat File Environment (.env)

### Buat File .env

1. **Buka folder project**: `C:\websites\fiber-affiliate-nexus\`

2. **Buat file baru** bernama `.env` (tanpa ekstensi):
   - Klik kanan di folder project
   - Pilih **New > Text Document**
   - Rename file dari `New Text Document.txt` menjadi `.env`
   - **Penting**: Pastikan tidak ada ekstensi `.txt` di belakangnya

3. **Edit file .env** dengan text editor (Notepad, VS Code, dll):
   ```env
   # Environment Configuration
   VITE_API_BASE_URL=http://localhost/api/v1
   VITE_APP_ENV=production
   VITE_APP_TITLE=Fibernode Internet
   VITE_APP_VERSION=1.0.0
   ```

4. **Save file .env**

### Penjelasan Environment Variables

- **VITE_API_BASE_URL**: URL dasar untuk komunikasi dengan backend API. Ubah sesuai lokasi server API Anda.
- **VITE_APP_ENV**: Mode aplikasi (development/production). Gunakan "production" untuk deployment live.
- **VITE_APP_TITLE**: Judul aplikasi yang akan ditampilkan di browser tab dan header.
- **VITE_APP_VERSION**: Versi aplikasi untuk tracking dan debugging.

**Catatan Penting**: 
- Semua environment variable di Vite harus diawali dengan `VITE_`
- Sesuaikan `VITE_API_BASE_URL` dengan lokasi API backend Anda
- Jika tidak ada backend, biarkan seperti contoh di atas

---

## Step 7: Build Project untuk Production

### Build Project

1. **Buka Command Prompt**
2. **Masuk ke folder project**:
   ```cmd
   cd C:\websites\fiber-affiliate-nexus
   ```

3. **Jalankan perintah build**:
   ```cmd
   yarn build
   ```

4. **Tunggu proses build selesai**:
   - Proses ini akan membuat folder `dist` yang berisi file production-ready
   - Pastikan tidak ada error dalam proses build
   - Jika berhasil, akan muncul pesan seperti: "✓ built in Xs"

5. **Verifikasi folder dist**:
   ```cmd
   dir dist
   ```
   Harusnya ada file `index.html`, `.htaccess`, dan folder `assets`

---

## Step 8: Install dan Setup XAMPP

### Download dan Install XAMPP

1. **Kunjungi**: https://www.apachefriends.org/download.html
2. **Download XAMPP untuk Windows** (versi terbaru dengan PHP 8.x)
3. **Jalankan installer**:
   - Jika muncul warning User Account Control, klik **Yes**
   - Welcome screen: Klik **Next**
   - Select Components: 
     - Pastikan **Apache** ter-centang
     - **MySQL** ter-centang (jika butuh database)
     - **PHP** ter-centang
     - **phpMyAdmin** ter-centang (jika butuh database)
     - Yang lain bisa di-uncheck jika tidak perlu
     - Klik **Next**
   - Installation folder: Biarkan default `C:\xampp`, klik **Next**
   - Bitnami for XAMPP: **Uncheck** "Learn more about Bitnami", klik **Next**
   - Ready to Install: Klik **Next**
   - Tunggu proses instalasi selesai
   - Klik **Finish**

4. **Buka XAMPP Control Panel**:
   - Akan otomatis terbuka setelah instalasi
   - Atau bisa buka dari Start Menu: "XAMPP Control Panel"

### Aktivasi mod_rewrite Apache

**Penting**: Untuk mendukung routing React Router, mod_rewrite harus diaktifkan.

1. **Buka file konfigurasi Apache**:
   - File: `C:\xampp\apache\conf\httpd.conf`
   - Buka dengan text editor (Notepad, VS Code)

2. **Cari dan uncomment baris berikut**:
   ```apache
   # Cari baris ini (sekitar baris 150-160):
   #LoadModule rewrite_module modules/mod_rewrite.so
   
   # Hilangkan tanda # di depannya menjadi:
   LoadModule rewrite_module modules/mod_rewrite.so
   ```

3. **Cari dan ubah AllowOverride**:
   ```apache
   # Cari bagian <Directory> untuk htdocs (sekitar baris 220-230):
   <Directory "C:/xampp/htdocs">
       # Ubah dari:
       AllowOverride None
       # Menjadi:
       AllowOverride All
   </Directory>
   ```

4. **Save file** dan **restart Apache** di XAMPP Control Panel

### Start Apache di XAMPP

1. **Di XAMPP Control Panel**:
   - Klik tombol **Start** di samping **Apache**
   - Status Apache harusnya berubah menjadi hijau dengan tulisan "Running"
   - Jika m uncul Windows Firewall alert, klik **Allow access**

2. **Test Apache berjalan**:
   - Buka browser
   - Kunjungi: `http://localhost`
   - Harusnya muncul halaman welcome XAMPP

---

## Step 9: Deploy Project ke XAMPP

### Backup dan Clean Folder XAMPP

1. **Backup folder XAMPP htdocs** (opsional tapi direkomendasikan):
   ```cmd
   xcopy "C:\xampp\htdocs" "C:\xampp\htdocs_backup" /E /I /H
   ```
   
2. **Bersihkan folder htdocs**:
   ```cmd
   del /S /Q "C:\xampp\htdocs\*.*"
   ```

### Copy File Build ke XAMPP

1. **Copy semua isi folder dist**:
   ```cmd
   xcopy "C:\websites\fiber-affiliate-nexus\dist\*" "C:\xampp\htdocs\" /E /H
   ```
   
   **Atau dengan File Explorer**:
   - Buka folder: `C:\websites\fiber-affiliate-nexus\dist\`
   - **Select All** (Ctrl+A) semua file dan folder di dalam `dist`
   - **Copy** (Ctrl+C)
   - Buka folder: `C:\xampp\htdocs\`
   - **Paste** (Ctrl+V) semua file

2. **Verifikasi file sudah tercopy**:
   - Di folder `C:\xampp\htdocs\` harusnya ada:
     - `index.html`
     - `.htaccess` (penting untuk routing!)
     - Folder `assets` (berisi CSS, JS, dll)
     - File `favicon.ico`

3. **Verifikasi Apache Config untuk .htaccess**:
   - Restart Apache jika baru mengubah konfigurasi
   - Pastikan tidak ada error di Apache logs: `C:\xampp\apache\logs\error.log`

---

## Step 10: Auto-Start XAMPP Saat Windows Boot (Opsional)

### Setup Auto-Start Apache

1. **Buka Run dialog**: Tekan `Win + R`
2. **Buka Task Scheduler**: Ketik `taskschd.msc` dan tekan Enter
3. **Buat Task Baru**:
   - Di menu **Action**, pilih **Create Basic Task**
   - **Name**: "Start XAMPP Apache"
   - **Description**: "Auto-start Apache on Windows login"
   - Klik **Next**
   - **Trigger**: Choose "When I log on"
   - Klik **Next**
   - **Action**: Start a Program
   - **Program/script**: `C:\xampp\apache_start.bat`
   - Klik **Next** dan **Finish**

4. **Buat file batch `apache_start.bat`**:
   - Buka Notepad
   - Copy-paste code berikut:
     ```batch
     @echo off
     echo Starting Apache...
     "C:\xampp\apache\bin\httpd.exe"
     ```
   - Save di `C:\xampp\apache_start.bat`

5. **Test**: Restart Windows dan cek `http://localhost`

---

## Step 11: Menjalankan dan Mengakses Aplikasi

### Akses Aplikasi

1. **Pastikan Apache sudah running** di XAMPP Control Panel

2. **Buka browser** dan kunjungi salah satu URL berikut:
   ```
   http://localhost
   ```

3. **Pastikan Routing Berfungsi**:
   - Test akses langsung ke route: `http://localhost/login`
   - Test akses langsung ke route: `http://localhost/admin`
   - Test akses langsung ke route: `http://localhost/affiliator`
   - Semua URL di atas harusnya berhasil dimuat tanpa error 404

4. **Aplikasi harusnya terbuka** dan menampilkan halaman login/dashboard

### Test Fitur Aplikasi

1. **Test halaman utama**: Pastikan semua elemen tampil dengan benar
2. **Test navigation**: Klik menu-menu yang ada
3. **Test responsive**: Resize browser untuk test mobile view
4. **Check console**: Buka Developer Tools (F12) dan pastikan tidak ada error di console

---

## Step 12: Update dan Maintenance

### Update Project (Jika Ada Perubahan Code)

1. **Pull perubahan terbaru dari GitHub**:
   ```cmd
   cd C:\websites\fiber-affiliate-nexus
   git pull origin main
   ```

2. **Install dependencies baru** (jika ada):
   ```cmd
   yarn install
   ```

3. **Build ulang project**:
   ```cmd
   yarn build
   ```

4. **Copy ulang ke XAMPP**:
   - Backup existing files: `xcopy "C:\xampp\htdocs" "C:\xampp\htdocs_backup_DATE" /E /I /H`
   - Delete current files: `del /S /Q "C:\xampp\htdocs\*.*"`
   - Copy semua isi folder `dist` yang baru: `xcopy "C:\websites\fiber-affiliate-nexus\dist\*" "C:\xampp\htdocs\" /E /H`

### Backup Project

1. **Backup source code**:
   - Copy folder `C:\websites\fiber-affiliate-nexus\` ke lokasi backup

2. **Backup file production**:
   - Copy folder `C:\xampp\htdocs\` ke lokasi backup

---

## Troubleshooting

### Apache Tidak Bisa Start

**Problem**: Port 80 sudah digunakan aplikasi lain

**Solution**:
1. **Check aplikasi yang menggunakan port 80**:
   ```cmd
   netstat -ano | findstr :80
   ```
2. **Stop aplikasi tersebut** atau **ganti port Apache**:
   - Edit file: `C:\xampp\apache\conf\httpd.conf`
   - Cari: `Listen 80`
   - Ganti menjadi: `Listen 8080`
   - Restart Apache
   - Akses dengan: `http://localhost:8080`

### Build Error

**Problem**: Error saat `yarn build`

**Solution**:
1. **Hapus node_modules dan install ulang**:
   ```cmd
   rmdir /s node_modules
   yarn install
   ```
2. **Clear cache**:
   ```cmd
   yarn cache clean
   ```

### File .env Tidak Terbaca

**Problem**: Environment variables tidak working

**Solution**:
1. **Pastikan nama file benar**: `.env` (bukan `.env.txt`)
2. **Pastikan variable diawali VITE_**: `VITE_API_BASE_URL=...`
3. **Build ulang setelah edit .env**:
   ```cmd
   yarn build
   ```

### Halaman Blank/White Screen

**Problem**: Aplikasi tidak tampil, halaman kosong

**Solution**:
1. **Check Developer Console** (F12) untuk error
2. **Pastikan file index.html ada** di root folder XAMPP
3. **Check path file assets** apakah benar
4. **Coba akses langsung**: `http://localhost/index.html`

### Routing Error (404 Not Found)

**Problem**: URL langsung seperti `/admin` atau `/login` menampilkan error 404

**Solution**:
1. **Pastikan file .htaccess ada** di root folder `htdocs`
2. **Verifikasi mod_rewrite aktif**:
   - Cek `httpd.conf` sudah uncomment `LoadModule rewrite_module`
   - Cek `AllowOverride All` sudah diset untuk directory htdocs
3. **Restart Apache** di XAMPP Control Panel
4. **Cek error log Apache**: `C:\xampp\apache\logs\error.log`

### Error CORS saat API Call

**Problem**: API call gagal dengan error CORS (Cross-Origin Resource Sharing)

**Solution**:
1. **Pastikan API mendukung CORS**
2. **Tambahkan header CORS di .htaccess** jika API di server yang sama:
   ```apache
   # Tambahkan di .htaccess
   <IfModule mod_headers.c>
     Header set Access-Control-Allow-Origin "*"
     Header set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
     Header set Access-Control-Allow-Headers "Origin, X-Requested-With, Content-Type, Accept, Authorization"
   </IfModule>
   ```

---

## Technologies Used

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **UI Framework**: Tailwind CSS + shadcn/ui
- **Icons**: Lucide React
- **Web Server**: Apache (XAMPP)
- **Version Control**: Git

---

## Support

Untuk bantuan deployment atau troubleshooting, silakan:

1. **Check dokumentasi resmi**:
   - React: https://react.dev/
   - Vite: https://vitejs.dev/
   - XAMPP: https://www.apachefriends.org/

2. **Hubungi tim development** untuk support khusus project ini

---

## Notes Penting

- **Selalu backup** project sebelum update
- **Test aplikasi** setelah setiap deployment
- **Monitor log Apache** di `C:\xampp\apache\logs\` jika ada masalah
- **Keep XAMPP updated** untuk security
- **Jangan expose** file .env ke public jika ada data sensitif
