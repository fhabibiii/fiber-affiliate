
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

## Step 5: Mengganti Favicon

### Cara Mengganti Favicon.ico

1. **Siapkan file favicon baru**:
   - File harus berformat `.ico`, `.png`, atau `.jpg`
   - Ukuran yang direkomendasikan: 32x32 pixel atau 16x16 pixel
   - Nama file sebaiknya: `favicon.ico`

2. **Ganti file favicon**:
   - Buka folder `C:\websites\fiber-affiliate-nexus\public\`
   - **Backup favicon lama** (rename menjadi `favicon-old.ico`)
   - **Copy file favicon baru** ke folder `public`
   - **Rename file baru** menjadi `favicon.ico`

3. **Update referensi di index.html** (jika diperlukan):
   - Buka file `C:\websites\fiber-affiliate-nexus\index.html` dengan text editor
   - Cari baris yang berisi `<link rel="icon"`
   - Pastikan mengarah ke favicon yang benar:
   ```html
   <link rel="icon" type="image/x-icon" href="/favicon.ico" />
   ```

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
   VITE_API_BASE_URL=http://localhost/fiber-affiliate-nexus/api
   VITE_APP_ENV=production
   VITE_APP_TITLE=Fibernode Internet
   VITE_APP_VERSION=1.0.0
   
   # Optional: Jika ada konfigurasi lain
   # VITE_COMPANY_NAME=Fibernode Internet
   # VITE_CONTACT_EMAIL=info@fibernode.com
   ```

4. **Save file .env**

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
   Harusnya ada file `index.html` dan folder `assets`

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

### Start Apache di XAMPP

1. **Di XAMPP Control Panel**:
   - Klik tombol **Start** di samping **Apache**
   - Status Apache harusnya berubah menjadi hijau dengan tulisan "Running"
   - Jika muncul Windows Firewall alert, klik **Allow access**

2. **Test Apache berjalan**:
   - Buka browser
   - Kunjungi: `http://localhost`
   - Harusnya muncul halaman welcome XAMPP

---

## Step 9: Deploy Project ke XAMPP

### Copy File Build ke XAMPP

1. **Buat folder untuk project di XAMPP**:
   - Buka folder: `C:\xampp\htdocs\`
   - Buat folder baru bernama: `fiber-affiliate-nexus`
   - Full path: `C:\xampp\htdocs\fiber-affiliate-nexus\`

2. **Copy semua isi folder dist**:
   - Buka folder: `C:\websites\fiber-affiliate-nexus\dist\`
   - **Select All** (Ctrl+A) semua file dan folder di dalam `dist`
   - **Copy** (Ctrl+C)
   - Buka folder: `C:\xampp\htdocs\fiber-affiliate-nexus\`
   - **Paste** (Ctrl+V) semua file

3. **Verifikasi file sudah tercopy**:
   - Di folder `C:\xampp\htdocs\fiber-affiliate-nexus\` harusnya ada:
     - `index.html`
     - Folder `assets` (berisi CSS, JS, dll)
     - File `favicon.ico`

### Setup Virtual Host (Opsional)

Jika ingin menggunakan domain custom seperti `fibernode.local`:

1. **Edit file hosts Windows**:
   - Buka Notepad **sebagai Administrator**
   - Open file: `C:\Windows\System32\drivers\etc\hosts`
   - Tambahkan baris di akhir file:
   ```
   127.0.0.1    fibernode.local
   ```
   - Save file

2. **Edit file httpd-vhosts.conf**:
   - Buka file: `C:\xampp\apache\conf\extra\httpd-vhosts.conf`
   - Tambahkan di akhir file:
   ```apache
   <VirtualHost *:80>
       DocumentRoot "C:/xampp/htdocs/fiber-affiliate-nexus"
       ServerName fibernode.local
       ErrorLog "logs/fibernode-error.log"
       CustomLog "logs/fibernode-access.log" common
   </VirtualHost>
   ```
   - Save file

3. **Enable virtual host di Apache**:
   - Buka file: `C:\xampp\apache\conf\httpd.conf`
   - Cari baris: `#Include conf/extra/httpd-vhosts.conf`
   - Hapus tanda `#` di depannya menjadi: `Include conf/extra/httpd-vhosts.conf`
   - Save file

4. **Restart Apache**:
   - Di XAMPP Control Panel, klik **Stop** lalu **Start** untuk Apache

---

## Step 10: Menjalankan dan Mengakses Aplikasi

### Akses Aplikasi

1. **Pastikan Apache sudah running** di XAMPP Control Panel

2. **Buka browser** dan kunjungi salah satu URL berikut:

   **Opsi 1 - Direct folder access**:
   ```
   http://localhost/fiber-affiliate-nexus/
   ```

   **Opsi 2 - Jika sudah setup virtual host**:
   ```
   http://fibernode.local/
   ```

3. **Aplikasi harusnya terbuka** dan menampilkan halaman login/dashboard

### Test Fitur Aplikasi

1. **Test halaman utama**: Pastikan semua elemen tampil dengan benar
2. **Test navigation**: Klik menu-menu yang ada
3. **Test responsive**: Resize browser untuk test mobile view
4. **Check console**: Buka Developer Tools (F12) dan pastikan tidak ada error di console

---

## Step 11: Update dan Maintenance

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
   - Hapus isi folder `C:\xampp\htdocs\fiber-affiliate-nexus\`
   - Copy semua isi folder `dist` yang baru ke folder tersebut

### Backup Project

1. **Backup source code**:
   - Copy folder `C:\websites\fiber-affiliate-nexus\` ke lokasi backup

2. **Backup file production**:
   - Copy folder `C:\xampp\htdocs\fiber-affiliate-nexus\` ke lokasi backup

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
   - Akses dengan: `http://localhost:8080/fiber-affiliate-nexus/`

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
4. **Coba akses langsung**: `http://localhost/fiber-affiliate-nexus/index.html`

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
