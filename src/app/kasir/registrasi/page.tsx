'use client';

import React, { useState } from 'react';
import { Search, Plus, UserPlus } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Button, Badge, Modal, Input, Select } from '@/components/ui';
import { pasienList, dokterList, poliList, getPasienById, getDokterById, getPoliById } from '@/data/dummy-data';
import { formatDate, calculateAge, generateId } from '@/lib/utils';
import { Pasien } from '@/types';

export default function RegistrasiPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPasien, setSelectedPasien] = useState<Pasien | null>(null);
  const [showNewPatientModal, setShowNewPatientModal] = useState(false);
  const [step, setStep] = useState<'search' | 'form' | 'confirm'>('search');
  
  const [formData, setFormData] = useState({
    poliId: '',
    dokterId: '',
    jenisPembayaran: 'umum',
    keluhanUtama: '',
  });

  const filteredPasien = pasienList.filter(
    (p) =>
      p.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.noRM.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.nik.includes(searchTerm)
  );

  const availableDokter = dokterList.filter(d => d.poliId === formData.poliId);

  const handleSelectPasien = (pasien: Pasien) => {
    setSelectedPasien(pasien);
    setStep('form');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('confirm');
  };

  const handleConfirm = () => {
    alert('Registrasi berhasil! Nomor antrian: 5');
    setStep('search');
    setSelectedPasien(null);
    setFormData({
      poliId: '',
      dokterId: '',
      jenisPembayaran: 'umum',
      keluhanUtama: '',
    });
  };

  return (
    <div className="space-y-6" suppressHydrationWarning>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Registrasi Kunjungan</h1>
          <p className="text-gray-500">Daftarkan kunjungan pasien baru</p>
        </div>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center justify-center gap-4">
        {['Pilih Pasien', 'Isi Form', 'Konfirmasi'].map((label, index) => {
          const stepNum = index + 1;
          const isActive = (step === 'search' && stepNum === 1) ||
                          (step === 'form' && stepNum === 2) ||
                          (step === 'confirm' && stepNum === 3);
          const isPast = (step === 'form' && stepNum === 1) ||
                        (step === 'confirm' && stepNum <= 2);
          return (
            <React.Fragment key={label}>
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  isActive ? 'bg-teal-600 text-white' :
                  isPast ? 'bg-teal-100 text-teal-600' :
                  'bg-gray-200 text-gray-500'
                }`}>
                  {stepNum}
                </div>
                <span className={`text-sm font-medium ${isActive ? 'text-teal-600' : 'text-gray-500'}`}>
                  {label}
                </span>
              </div>
              {index < 2 && (
                <div className={`w-16 h-0.5 ${isPast ? 'bg-teal-200' : 'bg-gray-200'}`} />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Step 1: Search Patient */}
      {step === 'search' && (
        <Card>
          <CardHeader>
            <CardTitle>Cari Pasien</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari berdasarkan nama, No RM, atau NIK..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <Button variant="outline" onClick={() => setShowNewPatientModal(true)}>
                <UserPlus className="w-4 h-4" />
                Pasien Baru
              </Button>
            </div>

            {searchTerm && (
              <div className="border rounded-lg divide-y max-h-96 overflow-y-auto">
                {filteredPasien.length > 0 ? (
                  filteredPasien.map((pasien) => (
                    <div
                      key={pasien.id}
                      onClick={() => handleSelectPasien(pasien)}
                      className="p-4 hover:bg-gray-50 cursor-pointer flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 font-semibold">
                          {pasien.nama.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{pasien.nama}</p>
                          <p className="text-sm text-gray-500">{pasien.noRM} • NIK: {pasien.nik}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">{calculateAge(pasien.tanggalLahir)} tahun</p>
                        <Badge variant={pasien.jenisKelamin === 'L' ? 'info' : 'purple'}>
                          {pasien.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan'}
                        </Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    <p>Pasien tidak ditemukan</p>
                    <Button variant="outline" className="mt-4" onClick={() => setShowNewPatientModal(true)}>
                      <UserPlus className="w-4 h-4" />
                      Daftarkan Pasien Baru
                    </Button>
                  </div>
                )}
              </div>
            )}

            {!searchTerm && (
              <div className="text-center py-12 text-gray-500">
                <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Masukkan nama, No RM, atau NIK untuk mencari pasien</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Step 2: Registration Form */}
      {step === 'form' && selectedPasien && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Patient Info */}
          <Card>
            <CardHeader>
              <CardTitle>Informasi Pasien</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 text-2xl font-bold">
                  {selectedPasien.nama.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{selectedPasien.nama}</p>
                  <p className="text-teal-600">{selectedPasien.noRM}</p>
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">NIK</span>
                  <span className="font-medium">{selectedPasien.nik}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Tanggal Lahir</span>
                  <span className="font-medium">{formatDate(selectedPasien.tanggalLahir)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Umur</span>
                  <span className="font-medium">{calculateAge(selectedPasien.tanggalLahir)} tahun</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Jenis Kelamin</span>
                  <span className="font-medium">{selectedPasien.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">No. BPJS</span>
                  <span className="font-medium">{selectedPasien.noBPJS || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Telepon</span>
                  <span className="font-medium">{selectedPasien.telepon}</span>
                </div>
              </div>

              {(selectedPasien.riwayatAlergi?.length || selectedPasien.riwayatPenyakitKronis?.length) && (
                <div className="pt-4 border-t space-y-2">
                  {selectedPasien.riwayatAlergi?.length ? (
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Alergi:</p>
                      <div className="flex flex-wrap gap-1">
                        {selectedPasien.riwayatAlergi.map((a, i) => (
                          <Badge key={i} variant="danger">{a}</Badge>
                        ))}
                      </div>
                    </div>
                  ) : null}
                  {selectedPasien.riwayatPenyakitKronis?.length ? (
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Penyakit Kronis:</p>
                      <div className="flex flex-wrap gap-1">
                        {selectedPasien.riwayatPenyakitKronis.map((p, i) => (
                          <Badge key={i} variant="warning">{p}</Badge>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              )}

              <Button type="button" variant="outline" className="w-full" onClick={() => { setStep('search'); setSelectedPasien(null); }} suppressHydrationWarning>
                Ganti Pasien
              </Button>
            </CardContent>
          </Card>

          {/* Registration Form */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Form Registrasi</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select
                    label="Poli Tujuan"
                    options={[
                      { value: '', label: 'Pilih Poli' },
                      ...poliList.map(p => ({ value: p.id, label: p.nama }))
                    ]}
                    value={formData.poliId}
                    onChange={(e) => setFormData({ ...formData, poliId: e.target.value, dokterId: '' })}
                  />
                  <Select
                    label="Dokter"
                    options={[
                      { value: '', label: 'Pilih Dokter' },
                      ...availableDokter.map(d => ({ value: d.id, label: d.nama }))
                    ]}
                    value={formData.dokterId}
                    onChange={(e) => setFormData({ ...formData, dokterId: e.target.value })}
                    disabled={!formData.poliId}
                  />
                </div>

                <Select
                  label="Jenis Pembayaran"
                  options={[
                    { value: 'umum', label: 'Umum / Pribadi' },
                    { value: 'bpjs', label: 'BPJS Kesehatan' },
                    { value: 'asuransi', label: 'Asuransi Lainnya' },
                  ]}
                  value={formData.jenisPembayaran}
                  onChange={(e) => setFormData({ ...formData, jenisPembayaran: e.target.value })}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Keluhan Utama
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    rows={4}
                    placeholder="Tuliskan keluhan utama pasien..."
                    value={formData.keluhanUtama}
                    onChange={(e) => setFormData({ ...formData, keluhanUtama: e.target.value })}
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button variant="outline" type="button" onClick={() => { setStep('search'); setSelectedPasien(null); }}>
                    Batal
                  </Button>
                  <Button type="submit" disabled={!formData.poliId || !formData.dokterId}>
                    Lanjutkan
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Step 3: Confirmation */}
      {step === 'confirm' && selectedPasien && (
        <Card>
          <CardHeader>
            <CardTitle>Konfirmasi Registrasi</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-800">Data Pasien</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Nama</span>
                    <span className="font-medium">{selectedPasien.nama}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">No. RM</span>
                    <span className="font-medium">{selectedPasien.noRM}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">NIK</span>
                    <span className="font-medium">{selectedPasien.nik}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-800">Data Kunjungan</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Poli</span>
                    <span className="font-medium">{getPoliById(formData.poliId)?.nama}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Dokter</span>
                    <span className="font-medium">{getDokterById(formData.dokterId)?.nama}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Jenis Pembayaran</span>
                    <Badge variant={formData.jenisPembayaran === 'bpjs' ? 'success' : 'info'}>
                      {formData.jenisPembayaran.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {formData.keluhanUtama && (
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Keluhan Utama</h3>
                <p className="text-gray-700 p-3 bg-gray-50 rounded">{formData.keluhanUtama}</p>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={() => setStep('form')}>
                Kembali
              </Button>
              <Button onClick={handleConfirm}>
                Konfirmasi Registrasi
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* New Patient Modal */}
      <Modal
        isOpen={showNewPatientModal}
        onClose={() => setShowNewPatientModal(false)}
        title="Daftarkan Pasien Baru"
        size="lg"
      >
        <form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="NIK" placeholder="Masukkan NIK (16 digit)" />
            <Input label="Nama Lengkap" placeholder="Masukkan nama lengkap" />
            <Input label="Tanggal Lahir" type="date" />
            <Select
              label="Jenis Kelamin"
              options={[
                { value: 'L', label: 'Laki-laki' },
                { value: 'P', label: 'Perempuan' },
              ]}
            />
            <Input label="No. Telepon" placeholder="08xxxxxxxxxx" />
            <Input label="No. BPJS (Opsional)" placeholder="Masukkan No BPJS" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Alamat</label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              rows={3}
              placeholder="Masukkan alamat lengkap"
            />
          </div>
          
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" type="button" onClick={() => setShowNewPatientModal(false)}>
              Batal
            </Button>
            <Button type="submit">
              Daftarkan & Pilih
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
