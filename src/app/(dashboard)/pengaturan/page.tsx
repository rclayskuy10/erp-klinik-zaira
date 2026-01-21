'use client';

import React, { useState, useEffect } from 'react';
import { Building2, Clock, MapPin, Phone, Mail, Globe, Save, Upload, Bell, Shield, Database, Palette } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Button, Input, Badge } from '@/components/ui';

type TabType = 'profil' | 'jadwal' | 'notifikasi' | 'backup' | 'tampilan';

export default function PengaturanPage() {
  const [activeTab, setActiveTab] = useState<TabType>('profil');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Profil Klinik State
  const [profilKlinik, setProfilKlinik] = useState({
    nama: 'Klinik Zaira',
    alamat: 'Jl. Kesehatan No. 123, Kelurahan Sehat, Kecamatan Bugar',
    kota: 'Jakarta Selatan',
    kodePos: '12345',
    telepon: '(021) 123-4567',
    email: 'info@klinikzaira.com',
    website: 'www.klinikzaira.com',
    npwp: '01.234.567.8-012.000',
    nomorIzin: 'SIP-JKT-2024-001234',
    tagline: 'Melayani dengan Sepenuh Hati',
  });

  // Jadwal State
  const [jadwalOperasional, setJadwalOperasional] = useState([
    { hari: 'Senin', buka: true, jamBuka: '08:00', jamTutup: '21:00' },
    { hari: 'Selasa', buka: true, jamBuka: '08:00', jamTutup: '21:00' },
    { hari: 'Rabu', buka: true, jamBuka: '08:00', jamTutup: '21:00' },
    { hari: 'Kamis', buka: true, jamBuka: '08:00', jamTutup: '21:00' },
    { hari: 'Jumat', buka: true, jamBuka: '08:00', jamTutup: '17:00' },
    { hari: 'Sabtu', buka: true, jamBuka: '08:00', jamTutup: '15:00' },
    { hari: 'Minggu', buka: false, jamBuka: '08:00', jamTutup: '12:00' },
  ]);

  // Notifikasi State
  const [notifikasiSettings, setNotifikasiSettings] = useState({
    emailKunjungan: true,
    emailPembayaran: true,
    emailStok: true,
    smsKunjungan: false,
    smsPembayaran: false,
    whatsappReminder: true,
    alertStokMinimum: true,
    alertKadaluarsa: true,
    alertPiutang: false,
  });

  // Tampilan State
  const [tampilanSettings, setTampilanSettings] = useState({
    tema: 'light',
    warnaPrimer: '#0d9488',
    formatTanggal: 'DD/MM/YYYY',
    formatWaktu: '24',
    bahasaUtama: 'id',
    itemsPerPage: 10,
  });

  // Load settings from localStorage on mount
  useEffect(() => {
    console.log('Loading settings from localStorage...');
    
    try {
      const savedProfilKlinik = localStorage.getItem('profilKlinik');
      if (savedProfilKlinik) {
        console.log('Found saved profil klinik:', savedProfilKlinik);
        setProfilKlinik(JSON.parse(savedProfilKlinik));
      }

      const savedJadwalOperasional = localStorage.getItem('jadwalOperasional');
      if (savedJadwalOperasional) {
        console.log('Found saved jadwal operasional:', savedJadwalOperasional);
        setJadwalOperasional(JSON.parse(savedJadwalOperasional));
      }

      const savedNotifikasiSettings = localStorage.getItem('notifikasiSettings');
      if (savedNotifikasiSettings) {
        console.log('Found saved notifikasi settings:', savedNotifikasiSettings);
        setNotifikasiSettings(JSON.parse(savedNotifikasiSettings));
      }

      const savedTampilanSettings = localStorage.getItem('tampilanSettings');
      if (savedTampilanSettings) {
        console.log('Found saved tampilan settings:', savedTampilanSettings);
        setTampilanSettings(JSON.parse(savedTampilanSettings));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const handleSave = () => {
    console.log('Saving settings...');
    console.log('Profil Klinik:', profilKlinik);
    console.log('Jadwal Operasional:', jadwalOperasional);
    console.log('Notifikasi Settings:', notifikasiSettings);
    console.log('Tampilan Settings:', tampilanSettings);
    
    setIsSaving(true);
    try {
      // Save all settings to localStorage
      localStorage.setItem('profilKlinik', JSON.stringify(profilKlinik));
      localStorage.setItem('jadwalOperasional', JSON.stringify(jadwalOperasional));
      localStorage.setItem('notifikasiSettings', JSON.stringify(notifikasiSettings));
      localStorage.setItem('tampilanSettings', JSON.stringify(tampilanSettings));
      
      console.log('Settings saved successfully to localStorage');
      
      setTimeout(() => {
        setIsSaving(false);
        alert('Pengaturan berhasil disimpan!');
      }, 500);
    } catch (error) {
      console.error('Error saving settings:', error);
      setIsSaving(false);
      alert('Gagal menyimpan pengaturan!');
    }
  };

  const tabs = [
    { id: 'profil' as TabType, label: 'Profil Klinik', icon: Building2 },
    { id: 'jadwal' as TabType, label: 'Jadwal Operasional', icon: Clock },
    { id: 'notifikasi' as TabType, label: 'Notifikasi', icon: Bell },
    { id: 'backup' as TabType, label: 'Backup & Data', icon: Database },
    { id: 'tampilan' as TabType, label: 'Tampilan', icon: Palette },
  ];

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Memuat pengaturan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" suppressHydrationWarning>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Pengaturan</h1>
          <p className="text-gray-500">Konfigurasi sistem dan profil klinik</p>
        </div>
        <Button type="button" onClick={handleSave} disabled={isSaving} className="gap-2" suppressHydrationWarning>
          <Save className="w-4 h-4" />
          {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'bg-teal-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            suppressHydrationWarning
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'profil' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Logo & Info */}
          <Card className="lg:col-span-1">
            <CardContent className="py-6">
              <div className="text-center">
                <div className="w-32 h-32 bg-teal-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Building2 className="w-16 h-16 text-teal-600" />
                </div>
                <Button variant="outline" size="sm" className="gap-2">
                  <Upload className="w-4 h-4" />
                  Upload Logo
                </Button>
                <p className="text-xs text-gray-400 mt-2">PNG atau JPG, maks 2MB</p>
              </div>
              <div className="mt-6 pt-6 border-t">
                <div className="text-center">
                  <p className="text-sm text-gray-500">Status Lisensi</p>
                  <Badge variant="success" className="mt-1">Aktif</Badge>
                  <p className="text-xs text-gray-400 mt-2">Berlaku sampai: 31 Des 2025</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Form */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Informasi Klinik</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama Klinik *</label>
                  <Input
                    value={profilKlinik.nama}
                    onChange={(e) => setProfilKlinik({ ...profilKlinik, nama: e.target.value })}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tagline</label>
                  <Input
                    value={profilKlinik.tagline}
                    onChange={(e) => setProfilKlinik({ ...profilKlinik, tagline: e.target.value })}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Alamat *</label>
                  <textarea
                    value={profilKlinik.alamat}
                    onChange={(e) => setProfilKlinik({ ...profilKlinik, alamat: e.target.value })}
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kota</label>
                  <Input
                    value={profilKlinik.kota}
                    onChange={(e) => setProfilKlinik({ ...profilKlinik, kota: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kode Pos</label>
                  <Input
                    value={profilKlinik.kodePos}
                    onChange={(e) => setProfilKlinik({ ...profilKlinik, kodePos: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telepon</label>
                  <Input
                    value={profilKlinik.telepon}
                    onChange={(e) => setProfilKlinik({ ...profilKlinik, telepon: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <Input
                    type="email"
                    value={profilKlinik.email}
                    onChange={(e) => setProfilKlinik({ ...profilKlinik, email: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                  <Input
                    value={profilKlinik.website}
                    onChange={(e) => setProfilKlinik({ ...profilKlinik, website: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">NPWP</label>
                  <Input
                    value={profilKlinik.npwp}
                    onChange={(e) => setProfilKlinik({ ...profilKlinik, npwp: e.target.value })}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nomor Izin Praktik</label>
                  <Input
                    value={profilKlinik.nomorIzin}
                    onChange={(e) => setProfilKlinik({ ...profilKlinik, nomorIzin: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'jadwal' && (
        <Card>
          <CardHeader>
            <CardTitle>Jadwal Operasional</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {jadwalOperasional.map((jadwal, idx) => (
                <div key={jadwal.hari} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-24">
                    <span className="font-medium">{jadwal.hari}</span>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={jadwal.buka}
                      onChange={(e) => {
                        const newJadwal = [...jadwalOperasional];
                        newJadwal[idx].buka = e.target.checked;
                        setJadwalOperasional(newJadwal);
                      }}
                      className="w-5 h-5 rounded text-teal-600 focus:ring-teal-500"
                    />
                    <span className={jadwal.buka ? 'text-green-600 font-medium' : 'text-red-500'}>
                      {jadwal.buka ? 'Buka' : 'Tutup'}
                    </span>
                  </label>
                  {jadwal.buka && (
                    <>
                      <div className="flex items-center gap-2">
                        <input
                          type="time"
                          value={jadwal.jamBuka}
                          onChange={(e) => {
                            const newJadwal = [...jadwalOperasional];
                            newJadwal[idx].jamBuka = e.target.value;
                            setJadwalOperasional(newJadwal);
                          }}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                        <span className="text-gray-500">-</span>
                        <input
                          type="time"
                          value={jadwal.jamTutup}
                          onChange={(e) => {
                            const newJadwal = [...jadwalOperasional];
                            newJadwal[idx].jamTutup = e.target.value;
                            setJadwalOperasional(newJadwal);
                          }}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'notifikasi' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Notifikasi Email</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { key: 'emailKunjungan', label: 'Notifikasi Kunjungan Baru', desc: 'Kirim email saat ada kunjungan baru' },
                  { key: 'emailPembayaran', label: 'Notifikasi Pembayaran', desc: 'Kirim email saat pembayaran berhasil' },
                  { key: 'emailStok', label: 'Alert Stok Rendah', desc: 'Kirim email saat stok di bawah minimum' },
                ].map(item => (
                  <label key={item.key} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                    <input
                      type="checkbox"
                      checked={notifikasiSettings[item.key as keyof typeof notifikasiSettings]}
                      onChange={(e) => setNotifikasiSettings({ ...notifikasiSettings, [item.key]: e.target.checked })}
                      className="w-5 h-5 mt-0.5 rounded text-teal-600 focus:ring-teal-500"
                    />
                    <div>
                      <p className="font-medium">{item.label}</p>
                      <p className="text-sm text-gray-500">{item.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notifikasi WhatsApp</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { key: 'whatsappReminder', label: 'Reminder Kunjungan', desc: 'Kirim reminder ke pasien H-1' },
                  { key: 'smsKunjungan', label: 'Konfirmasi Registrasi', desc: 'Kirim konfirmasi saat berhasil registrasi' },
                  { key: 'smsPembayaran', label: 'Struk Digital', desc: 'Kirim struk pembayaran via WhatsApp' },
                ].map(item => (
                  <label key={item.key} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                    <input
                      type="checkbox"
                      checked={notifikasiSettings[item.key as keyof typeof notifikasiSettings]}
                      onChange={(e) => setNotifikasiSettings({ ...notifikasiSettings, [item.key]: e.target.checked })}
                      className="w-5 h-5 mt-0.5 rounded text-teal-600 focus:ring-teal-500"
                    />
                    <div>
                      <p className="font-medium">{item.label}</p>
                      <p className="text-sm text-gray-500">{item.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Alert Sistem</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { key: 'alertStokMinimum', label: 'Stok Minimum', desc: 'Alert saat stok mencapai batas minimum' },
                  { key: 'alertKadaluarsa', label: 'Obat Kadaluarsa', desc: 'Alert obat akan kadaluarsa dalam 90 hari' },
                  { key: 'alertPiutang', label: 'Piutang Jatuh Tempo', desc: 'Alert piutang yang jatuh tempo' },
                ].map(item => (
                  <label key={item.key} className="flex items-start gap-3 p-4 border rounded-lg cursor-pointer hover:border-teal-500">
                    <input
                      type="checkbox"
                      checked={notifikasiSettings[item.key as keyof typeof notifikasiSettings]}
                      onChange={(e) => setNotifikasiSettings({ ...notifikasiSettings, [item.key]: e.target.checked })}
                      className="w-5 h-5 mt-0.5 rounded text-teal-600 focus:ring-teal-500"
                    />
                    <div>
                      <p className="font-medium">{item.label}</p>
                      <p className="text-sm text-gray-500">{item.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'backup' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Backup Data</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Shield className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-green-800">Backup Otomatis Aktif</p>
                      <p className="text-sm text-green-600">Backup terakhir: Hari ini, 03:00 WIB</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Jadwal Backup Otomatis</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500">
                    <option value="daily">Setiap Hari (03:00 WIB)</option>
                    <option value="weekly">Setiap Minggu</option>
                    <option value="monthly">Setiap Bulan</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Retensi Backup</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500">
                    <option value="7">7 Hari Terakhir</option>
                    <option value="30">30 Hari Terakhir</option>
                    <option value="90">90 Hari Terakhir</option>
                  </select>
                </div>

                <Button 
                  variant="outline" 
                  className="w-full gap-2"
                  onClick={() => {
                    const confirmBackup = confirm('Apakah Anda yakin ingin melakukan backup sekarang?');
                    if (confirmBackup) {
                      alert('Backup sedang diproses. Anda akan mendapat notifikasi saat selesai.');
                      // In real app, this would call API to create backup
                    }
                  }}
                >
                  <Database className="w-4 h-4" />
                  Backup Sekarang
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Riwayat Backup</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { tanggal: '2024-01-25 03:00', ukuran: '245 MB', status: 'success' },
                  { tanggal: '2024-01-24 03:00', ukuran: '243 MB', status: 'success' },
                  { tanggal: '2024-01-23 03:00', ukuran: '241 MB', status: 'success' },
                  { tanggal: '2024-01-22 03:00', ukuran: '239 MB', status: 'success' },
                  { tanggal: '2024-01-21 03:00', ukuran: '237 MB', status: 'success' },
                ].map((backup, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{backup.tanggal}</p>
                      <p className="text-xs text-gray-500">{backup.ukuran}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="success">Berhasil</Badge>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          alert(`Mengunduh backup: ${backup.tanggal}`);
                          // In real app, this would download the backup file
                        }}
                      >
                        Unduh
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'tampilan' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Preferensi Tampilan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tema</label>
                  <div className="grid grid-cols-3 gap-3">
                    {['light', 'dark', 'system'].map(tema => (
                      <button
                        key={tema}
                        onClick={() => setTampilanSettings({ ...tampilanSettings, tema })}
                        className={`p-3 border-2 rounded-lg text-center transition-colors ${
                          tampilanSettings.tema === tema
                            ? 'border-teal-500 bg-teal-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <span className="font-medium capitalize">{tema}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Warna Primer</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={tampilanSettings.warnaPrimer}
                      onChange={(e) => setTampilanSettings({ ...tampilanSettings, warnaPrimer: e.target.value })}
                      className="w-12 h-12 rounded-lg cursor-pointer"
                    />
                    <Input
                      value={tampilanSettings.warnaPrimer}
                      onChange={(e) => setTampilanSettings({ ...tampilanSettings, warnaPrimer: e.target.value })}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Item per Halaman</label>
                  <select
                    value={tampilanSettings.itemsPerPage}
                    onChange={(e) => setTampilanSettings({ ...tampilanSettings, itemsPerPage: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Format Regional</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Format Tanggal</label>
                  <select
                    value={tampilanSettings.formatTanggal}
                    onChange={(e) => setTampilanSettings({ ...tampilanSettings, formatTanggal: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="DD/MM/YYYY">DD/MM/YYYY (25/01/2024)</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY (01/25/2024)</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD (2024-01-25)</option>
                    <option value="DD MMM YYYY">DD MMM YYYY (25 Jan 2024)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Format Waktu</label>
                  <select
                    value={tampilanSettings.formatWaktu}
                    onChange={(e) => setTampilanSettings({ ...tampilanSettings, formatWaktu: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="24">24 Jam (14:30)</option>
                    <option value="12">12 Jam (2:30 PM)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bahasa</label>
                  <select
                    value={tampilanSettings.bahasaUtama}
                    onChange={(e) => setTampilanSettings({ ...tampilanSettings, bahasaUtama: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="id">Bahasa Indonesia</option>
                    <option value="en">English</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
