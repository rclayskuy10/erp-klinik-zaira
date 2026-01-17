// ==================== USER & ACCESS ====================
export type UserRole = 'admin' | 'dokter' | 'perawat' | 'kasir' | 'apoteker' | 'staff';

export interface User {
  id: string;
  nama: string;
  email: string;
  username: string;
  role: UserRole;
  status: 'aktif' | 'non-aktif';
  avatar?: string;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
}

// ==================== MASTER DATA ====================
export interface Pasien {
  id: string;
  noRM: string;
  nik: string;
  noBPJS?: string;
  nama: string;
  tanggalLahir: Date;
  jenisKelamin: 'L' | 'P';
  alamat: string;
  telepon: string;
  email?: string;
  golonganDarah?: 'A' | 'B' | 'AB' | 'O';
  riwayatAlergi?: string[];
  riwayatPenyakitKronis?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Dokter {
  id: string;
  nip: string;
  sip: string;
  nama: string;
  spesialisasi: string;
  poliId: string;
  telepon: string;
  email: string;
  jadwalPraktek: JadwalPraktek[];
  tarifKonsultasi: number;
  isActive: boolean;
  foto?: string;
}

export interface JadwalPraktek {
  hari: string;
  jamMulai: string;
  jamSelesai: string;
}

export interface TenagaMedis {
  id: string;
  nip: string;
  nama: string;
  jabatan: 'perawat' | 'bidan' | 'analis' | 'apoteker' | 'admin';
  telepon: string;
  email: string;
  isActive: boolean;
}

export interface Poli {
  id: string;
  kode: string;
  nama: string;
  deskripsi: string;
  isActive: boolean;
}

export interface Layanan {
  id: string;
  kode: string;
  nama: string;
  kategori: 'konsultasi' | 'tindakan' | 'laboratorium' | 'radiologi';
  poliId?: string;
  tarif: number;
  deskripsi?: string;
  isActive: boolean;
}

export interface Obat {
  id: string;
  kode: string;
  nama: string;
  kategori: KategoriObat;
  satuan: string;
  hargaBeli: number;
  hargaJual: number;
  stok: number;
  minimumStok: number;
  supplier?: string;
  isActive: boolean;
}

export type KategoriObat = 'tablet' | 'kapsul' | 'sirup' | 'salep' | 'injeksi' | 'infus' | 'alat_medis';

export interface BatchObat {
  id: string;
  obatId: string;
  noBatch: string;
  jumlah: number;
  sisaStok: number;
  tanggalMasuk: Date;
  tanggalKadaluarsa: Date;
  hargaBeli: number;
}

export interface AlatMedis {
  id: string;
  kode: string;
  nama: string;
  kategori: string;
  satuan: string;
  harga: number;
  stok: number;
  minimumStok: number;
  isActive: boolean;
}

export interface KategoriTarif {
  id: string;
  kode: string;
  nama: string;
  deskripsi: string;
}

// ==================== REKAM MEDIS (EMR) ====================
export interface Kunjungan {
  id: string;
  noKunjungan: string;
  pasienId: string;
  dokterId: string;
  poliId: string;
  tanggal: Date;
  jamMasuk: string;
  jamKeluar?: string;
  jenisKunjungan: 'baru' | 'lama';
  jenisPembayaran: 'umum' | 'bpjs' | 'asuransi';
  status: 'menunggu' | 'diperiksa' | 'selesai' | 'batal';
  keluhanUtama?: string;
  rekamMedisId?: string;
}

export interface RekamMedis {
  id: string;
  kunjunganId: string;
  pasienId: string;
  dokterId: string;
  tanggal: Date;
  soap: SOAP;
  diagnosis: Diagnosis[];
  resep: ResepObat[];
  tindakan: TindakanMedis[];
  lampiran?: Lampiran[];
  catatan?: string;
}

export interface SOAP {
  subjective: string;
  objective: {
    tekananDarah?: string;
    suhu?: number;
    nadi?: number;
    pernapasan?: number;
    beratBadan?: number;
    tinggiBadan?: number;
    pemeriksaanFisik?: string;
  };
  assessment: string;
  plan: string;
}

export interface Diagnosis {
  id: string;
  kodeICD10?: string;
  nama: string;
  tipe: 'utama' | 'sekunder';
}

export interface ResepObat {
  id: string;
  obatId: string;
  namaObat: string;
  jumlah: number;
  satuan: string;
  aturanPakai: string;
  catatan?: string;
  harga: number;
  subtotal: number;
}

export interface TindakanMedis {
  id: string;
  layananId: string;
  namaLayanan: string;
  jumlah: number;
  tarif: number;
  subtotal: number;
  catatan?: string;
}

export interface Lampiran {
  id: string;
  nama: string;
  tipe: 'lab' | 'radiologi' | 'foto' | 'dokumen';
  url: string;
  uploadedAt: Date;
}

// ==================== KASIR & BILLING ====================
export interface Registrasi {
  id: string;
  noRegistrasi: string;
  pasienId: string;
  poliId: string;
  dokterId: string;
  tanggal: Date;
  jamRegistrasi: string;
  nomorAntrian: number;
  jenisPembayaran: 'umum' | 'bpjs' | 'asuransi';
  status: 'menunggu' | 'dipanggil' | 'diperiksa' | 'selesai' | 'batal';
}

export interface Invoice {
  id: string;
  noInvoice: string;
  kunjunganId: string;
  pasienId: string;
  tanggal: Date;
  items: InvoiceItem[];
  subtotal: number;
  diskon: number;
  totalDiskon: number;
  pajak: number;
  totalPajak: number;
  grandTotal: number;
  metodePembayaran?: MetodePembayaran;
  status: 'draft' | 'pending' | 'lunas' | 'batal';
  paidAt?: Date;
  catatan?: string;
}

export interface InvoiceItem {
  id: string;
  tipe: 'konsultasi' | 'tindakan' | 'obat' | 'alat_medis' | 'administrasi';
  nama: string;
  jumlah: number;
  harga: number;
  diskon: number;
  subtotal: number;
}

export type MetodePembayaran = 'tunai' | 'transfer' | 'qris' | 'debit' | 'kredit';

export interface Pembayaran {
  id: string;
  invoiceId: string;
  tanggal: Date;
  jumlah: number;
  metodePembayaran: MetodePembayaran;
  referensi?: string;
  catatan?: string;
}

// ==================== FARMASI & INVENTORY ====================
export interface StokMasuk {
  id: string;
  noTransaksi: string;
  tanggal: Date;
  supplierId?: string;
  items: StokMasukItem[];
  totalNilai: number;
  catatan?: string;
  createdBy: string;
}

export interface StokMasukItem {
  id: string;
  obatId: string;
  noBatch: string;
  jumlah: number;
  hargaBeli: number;
  tanggalKadaluarsa: Date;
  subtotal: number;
}

export interface StokKeluar {
  id: string;
  noTransaksi: string;
  tanggal: Date;
  tipe: 'penjualan' | 'rusak' | 'kadaluarsa' | 'retur';
  referensiId?: string;
  items: StokKeluarItem[];
  catatan?: string;
  createdBy: string;
}

export interface StokKeluarItem {
  id: string;
  obatId: string;
  batchId: string;
  jumlah: number;
  harga: number;
  subtotal: number;
}

export interface Supplier {
  id: string;
  kode: string;
  nama: string;
  alamat: string;
  telepon: string;
  email?: string;
  kontakPerson?: string;
  isActive: boolean;
}

// ==================== LAPORAN ====================
export interface LaporanKunjungan {
  tanggal: Date;
  totalKunjungan: number;
  kunjunganBaru: number;
  kunjunganLama: number;
  perPoli: { poliId: string; nama: string; jumlah: number }[];
  perDokter: { dokterId: string; nama: string; jumlah: number }[];
}

export interface LaporanPendapatan {
  periode: string;
  totalPendapatan: number;
  pendapatanKonsultasi: number;
  pendapatanTindakan: number;
  pendapatanObat: number;
  pendapatanLainnya: number;
  perMetodePembayaran: { metode: MetodePembayaran; jumlah: number }[];
}

export interface LaporanObat {
  obatId: string;
  namaObat: string;
  jumlahTerjual: number;
  totalNilai: number;
}

export interface LaporanStok {
  obatId: string;
  namaObat: string;
  stokAwal: number;
  stokMasuk: number;
  stokKeluar: number;
  stokAkhir: number;
  nilai: number;
}

// ==================== DASHBOARD ====================
export interface DashboardStats {
  totalPasien: number;
  kunjunganHariIni: number;
  pendapatanHariIni: number;
  pendapatanBulanIni: number;
  obatHampirHabis: number;
  obatKadaluarsa: number;
  antrianMenunggu: number;
}
