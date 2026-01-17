'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search, Edit, Trash2, Eye, FileText } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Button, Badge, Modal, Input, Select, Textarea } from '@/components/ui';
import { DataTable } from '@/components/ui/Table';
import { pasienList, getPasienById } from '@/data/dummy-data';
import { formatDate, calculateAge, formatShortDate } from '@/lib/utils';
import { Pasien } from '@/types';

export default function PasienPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedPasien, setSelectedPasien] = useState<Pasien | null>(null);
  const [pasienData, setPasienData] = useState<Pasien[]>(pasienList);
  const [formData, setFormData] = useState<Partial<Pasien>>({});
  
  // State terpisah untuk riwayat (string format untuk editing)
  const [riwayatAlergiText, setRiwayatAlergiText] = useState('');
  const [riwayatPenyakitKronisText, setRiwayatPenyakitKronisText] = useState('');

  const filteredPasien = pasienData.filter(
    (p) =>
      p.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.noRM.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.nik.includes(searchTerm)
  );

  const handleView = (pasien: Pasien) => {
    setSelectedPasien(pasien);
    setShowDetailModal(true);
  };

  const handleEdit = (pasien: Pasien) => {
    setSelectedPasien(pasien);
    setFormData({
      nik: pasien.nik,
      nama: pasien.nama,
      tanggalLahir: pasien.tanggalLahir,
      jenisKelamin: pasien.jenisKelamin,
      telepon: pasien.telepon,
      email: pasien.email,
      noBPJS: pasien.noBPJS,
      golonganDarah: pasien.golonganDarah,
      alamat: pasien.alamat,
    });
    setRiwayatAlergiText(pasien.riwayatAlergi?.join(', ') || '');
    setRiwayatPenyakitKronisText(pasien.riwayatPenyakitKronis?.join(', ') || '');
    setShowModal(true);
  };

  const handleDelete = (pasien: Pasien) => {
    if (confirm(`Apakah Anda yakin ingin menghapus data pasien ${pasien.nama}?`)) {
      setPasienData(prevData => prevData.filter(p => p.id !== pasien.id));
      alert(`Data pasien ${pasien.nama} berhasil dihapus!`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Convert riwayat text ke array
    const riwayatAlergi = riwayatAlergiText
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);
    
    const riwayatPenyakitKronis = riwayatPenyakitKronisText
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);
    
    const updatedFormData = {
      ...formData,
      riwayatAlergi,
      riwayatPenyakitKronis,
    };
    
    if (selectedPasien) {
      // Update data pasien
      setPasienData(prevData => 
        prevData.map(p => 
          p.id === selectedPasien.id 
            ? { ...p, ...updatedFormData } 
            : p
        )
      );
      alert(`Data pasien ${formData.nama || selectedPasien.nama} berhasil diperbarui!`);
    } else {
      // Tambah pasien baru (muncul di bagian atas)
      const newPasien: Pasien = {
        id: `PSN${String(pasienData.length + 1).padStart(3, '0')}`,
        noRM: `RM${String(pasienData.length + 1).padStart(6, '0')}`,
        ...updatedFormData as Omit<Pasien, 'id' | 'noRM'>,
      };
      setPasienData(prevData => [newPasien, ...prevData]);
      alert(`Pasien baru ${formData.nama} berhasil ditambahkan!`);
    }
    
    setShowModal(false);
    setSelectedPasien(null);
    setFormData({});
    setRiwayatAlergiText('');
    setRiwayatPenyakitKronisText('');
  };

  const columns = [
    {
      key: 'noRM',
      header: 'No. RM',
      render: (item: Pasien) => (
        <span className="font-medium text-teal-600">{item.noRM}</span>
      ),
    },
    {
      key: 'nama',
      header: 'Nama Pasien',
      render: (item: Pasien) => (
        <div>
          <p className="font-medium text-gray-800">{item.nama}</p>
          <p className="text-xs text-gray-500">NIK: {item.nik}</p>
        </div>
      ),
    },
    {
      key: 'jenisKelamin',
      header: 'L/P',
      render: (item: Pasien) => (
        <Badge variant={item.jenisKelamin === 'L' ? 'info' : 'purple'}>
          {item.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan'}
        </Badge>
      ),
    },
    {
      key: 'umur',
      header: 'Umur',
      render: (item: Pasien) => `${calculateAge(item.tanggalLahir)} tahun`,
    },
    {
      key: 'telepon',
      header: 'Telepon',
    },
    {
      key: 'noBPJS',
      header: 'BPJS',
      render: (item: Pasien) => (
        item.noBPJS ? (
          <Badge variant="success">Aktif</Badge>
        ) : (
          <Badge variant="default">-</Badge>
        )
      ),
    },
    {
      key: 'actions',
      header: 'Aksi',
      render: (item: Pasien) => (
        <div className="flex gap-2" suppressHydrationWarning>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleView(item);
            }}
            className="p-1.5 text-gray-500 hover:text-teal-600 hover:bg-teal-50 rounded"
            suppressHydrationWarning
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(item);
            }}
            className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded"
            suppressHydrationWarning
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(item);
            }}
            className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded"
            suppressHydrationWarning
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6" suppressHydrationWarning>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Data Pasien</h1>
          <p className="text-gray-500">Kelola data pasien klinik</p>
        </div>
        <Button onClick={() => { 
          setSelectedPasien(null); 
          setFormData({});
          setRiwayatAlergiText('');
          setRiwayatPenyakitKronisText('');
          setShowModal(true); 
        }} suppressHydrationWarning>
          <Plus className="w-4 h-4" />
          Tambah Pasien
        </Button>
      </div>

      {/* Search & Filter */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Cari berdasarkan nama, No RM, atau NIK..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                suppressHydrationWarning
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Pasien ({filteredPasien.length})</CardTitle>
        </CardHeader>
        <DataTable
          columns={columns}
          data={filteredPasien}
          onRowClick={handleView}
        />
      </Card>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={selectedPasien ? 'Edit Pasien' : 'Tambah Pasien Baru'}
        size="lg"
      >
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              label="NIK" 
              placeholder="Masukkan NIK (16 digit)" 
              value={formData.nik || ''} 
              onChange={(e) => setFormData({...formData, nik: e.target.value})}
            />
            <Input 
              label="Nama Lengkap" 
              placeholder="Masukkan nama lengkap" 
              value={formData.nama || ''} 
              onChange={(e) => setFormData({...formData, nama: e.target.value})}
            />
            <Input 
              label="Tanggal Lahir" 
              type="date" 
              value={formData.tanggalLahir ? new Date(formData.tanggalLahir).toISOString().split('T')[0] : ''} 
              onChange={(e) => setFormData({...formData, tanggalLahir: new Date(e.target.value)})}
            />
            <Select
              label="Jenis Kelamin"
              options={[
                { value: 'L', label: 'Laki-laki' },
                { value: 'P', label: 'Perempuan' },
              ]}
              value={formData.jenisKelamin || ''}
              onChange={(e) => setFormData({...formData, jenisKelamin: e.target.value as 'L' | 'P'})}
            />
            <Input 
              label="No. Telepon" 
              placeholder="08xxxxxxxxxx" 
              value={formData.telepon || ''} 
              onChange={(e) => setFormData({...formData, telepon: e.target.value})}
            />
            <Input 
              label="Email" 
              type="email" 
              placeholder="email@example.com" 
              value={formData.email || ''} 
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
            <Input 
              label="No. BPJS (Opsional)" 
              placeholder="Masukkan No BPJS" 
              value={formData.noBPJS || ''} 
              onChange={(e) => setFormData({...formData, noBPJS: e.target.value})}
            />
            <Select
              label="Golongan Darah"
              options={[
                { value: '', label: 'Pilih Golongan Darah' },
                { value: 'A', label: 'A' },
                { value: 'B', label: 'B' },
                { value: 'AB', label: 'AB' },
                { value: 'O', label: 'O' },
              ]}
              value={formData.golonganDarah || ''}
              onChange={(e) => setFormData({...formData, golonganDarah: e.target.value as 'A' | 'B' | 'AB' | 'O'})}
            />
          </div>
          <Textarea 
            label="Alamat" 
            placeholder="Masukkan alamat lengkap" 
            rows={3} 
            value={formData.alamat || ''} 
            onChange={(e) => setFormData({...formData, alamat: e.target.value})}
          />
          <Textarea 
            label="Riwayat Alergi" 
            placeholder="Contoh: Penisilin, Seafood" 
            rows={2} 
            value={riwayatAlergiText} 
            onChange={(e) => setRiwayatAlergiText(e.target.value)}
          />
          <Textarea 
            label="Riwayat Penyakit Kronis" 
            placeholder="Contoh: Hipertensi, Diabetes" 
            rows={2} 
            value={riwayatPenyakitKronisText} 
            onChange={(e) => setRiwayatPenyakitKronisText(e.target.value)}
          />
          
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" type="button" onClick={() => setShowModal(false)}>
              Batal
            </Button>
            <Button type="submit">
              {selectedPasien ? 'Simpan Perubahan' : 'Tambah Pasien'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Detail Modal */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title="Detail Pasien"
        size="lg"
      >
        {selectedPasien && (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4 pb-4 border-b">
              <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 text-2xl font-bold">
                {selectedPasien.nama.charAt(0)}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800">{selectedPasien.nama}</h3>
                <p className="text-teal-600 font-medium">{selectedPasien.noRM}</p>
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">NIK</p>
                <p className="font-medium">{selectedPasien.nik}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">No. BPJS</p>
                <p className="font-medium">{selectedPasien.noBPJS || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Tanggal Lahir</p>
                <p className="font-medium">{formatDate(selectedPasien.tanggalLahir)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Umur</p>
                <p className="font-medium">{calculateAge(selectedPasien.tanggalLahir)} tahun</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Jenis Kelamin</p>
                <p className="font-medium">{selectedPasien.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Golongan Darah</p>
                <p className="font-medium">{selectedPasien.golonganDarah || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Telepon</p>
                <p className="font-medium">{selectedPasien.telepon}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{selectedPasien.email || '-'}</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500">Alamat</p>
              <p className="font-medium">{selectedPasien.alamat}</p>
            </div>

            {/* Riwayat */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 mb-2">Riwayat Alergi</p>
                <div className="flex flex-wrap gap-1">
                  {selectedPasien.riwayatAlergi?.length ? (
                    selectedPasien.riwayatAlergi.map((alergi, i) => (
                      <Badge key={i} variant="danger">{alergi}</Badge>
                    ))
                  ) : (
                    <span className="text-gray-400">Tidak ada</span>
                  )}
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-2">Penyakit Kronis</p>
                <div className="flex flex-wrap gap-1">
                  {selectedPasien.riwayatPenyakitKronis?.length ? (
                    selectedPasien.riwayatPenyakitKronis.map((penyakit, i) => (
                      <Badge key={i} variant="warning">{penyakit}</Badge>
                    ))
                  ) : (
                    <span className="text-gray-400">Tidak ada</span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={() => setShowDetailModal(false)}>
                Tutup
              </Button>
              <Button onClick={() => router.push(`/emr/rekam-medis?pasienId=${selectedPasien.id}`)}>
                <FileText className="w-4 h-4" />
                Lihat Rekam Medis
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
