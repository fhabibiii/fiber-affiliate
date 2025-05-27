
export const indonesianTexts = {
  login: {
    title: "Masuk ke Fibernode Affiliate",
    username: "Nama Pengguna",
    password: "Kata Sandi", 
    submit: "Masuk",
    loading: "Sedang masuk...",
    errors: {
      required: "Field ini wajib diisi",
      invalid: "Username atau password salah",
      networkError: "Terjadi kesalahan koneksi"
    }
  },
  navigation: {
    welcome: "Selamat datang",
    logout: "Keluar",
    dashboard: "Dashboard",
    addCustomer: "Tambah Pelanggan",
    manageAffiliator: "Manajemen Affiliator", 
    managePayment: "Manajemen Pembayaran",
    searchAffiliator: "Cari Affiliator...",
    customerList: "Daftar Pelanggan",
    paymentHistory: "Riwayat Pembayaran",
    noResults: "Tidak ada hasil ditemukan"
  },
  common: {
    loading: "Memuat...",
    save: "Simpan",
    cancel: "Batal",
    delete: "Hapus",
    edit: "Edit",
    search: "Cari",
    clear: "Bersihkan"
  }
} as const;
