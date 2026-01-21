'use client';

import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Eye, Calendar, Phone } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Button, Badge, Modal, Input, Select, Textarea } from '@/components/ui';
import { DataTable } from '@/components/ui/Table';
import { dokterList, tenagaMedisList, poliList, getPoliById } from '@/data/dummy-data';
import { formatCurrency } from '@/lib/utils';
import { Dokter, TenagaMedis } from '@/types';

export default function DokterPage() {
  const [activeTab, setActiveTab] = useState<'dokter' | 'tenaga'>('dokter');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showTenagaModal, setShowTenagaModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedDokter, setSelectedDokter] = useState<Dokter | null>(null);
  const [selectedTenaga, setSelectedTenaga] = useState<TenagaMedis | null>(null);
  const [dokterData, setDokterData] = useState<Dokter[]>(dokterList);
  const [tenagaData, setTenagaData] = useState<TenagaMedis[]>(tenagaMedisList);
  const [formData, setFormData] = useState<Partial<Dokter>>({});
  const [tenagaFormData, setTenagaFormData] = useState<Partial<TenagaMedis>>({});
  const [jadwalPraktek, setJadwalPraktek] = useState<{hari: string; jamMulai: string; jamSelesai: string}[]>([]);

  const filteredDokter = dokterData.filter(
    (d) =>
      d.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.spesialisasi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.nip.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.sip.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.telepon.includes(searchTerm) ||
      (d.email && d.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (getPoliById(d.poliId)?.nama.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredTenaga = tenagaData.filter(
    (t) =>
      t.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.jabatan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.nip.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.telepon.includes(searchTerm) ||
      (t.email && t.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleDeleteDokter = (dokter: Dokter) => {
    if (confirm(`Apakah Anda yakin ingin menghapus data dokter ${dokter.nama}?`)) {
      setDokterData(prevData => prevData.filter(d => d.id !== dokter.id));
      alert(`Data dokter ${dokter.nama} berhasil dihapus!`);
    }
  };

  const handleDeleteTenaga = (tenaga: TenagaMedis) => {
    if (confirm(`Apakah Anda yakin ingin menghapus data ${tenaga.nama}?`)) {
      setTenagaData(prevData => prevData.filter(t => t.id !== tenaga.id));
      alert(`Data ${tenaga.nama} berhasil dihapus!`);
    }
  };

  const handleEditDokter = (dokter: Dokter) => {
    setSelectedDokter(dokter);
    setFormData({
      nama: dokter.nama,
      nip: dokter.nip,
      sip: dokter.sip,
      spesialisasi: dokter.spesialisasi,
      poliId: dokter.poliId,
      tarifKonsultasi: dokter.tarifKonsultasi,
      telepon: dokter.telepon,
      email: dokter.email,
    });
    setJadwalPraktek(dokter.jadwalPraktek || []);
    setShowModal(true);
  };

  const handleEditTenaga = (tenaga: TenagaMedis) => {
    setSelectedTenaga(tenaga);
    setTenagaFormData({
      nama: tenaga.nama,
      nip: tenaga.nip,
      jabatan: tenaga.jabatan,
      telepon: tenaga.telepon,
      email: tenaga.email,
    });
    setShowTenagaModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedDokter) {
      // Update data dokter
      setDokterData(prevData => 
        prevData.map(d => 
          d.id === selectedDokter.id 
            ? { ...d, ...formData, jadwalPraktek } 
            : d
        )
      );
      alert(`Data dokter ${formData.nama || selectedDokter.nama} berhasil diperbarui!`);
    } else {
      // Tambah dokter baru (muncul di bagian atas)
      const newDokter: Dokter = {
        id: `DOK${String(dokterData.length + 1).padStart(3, '0')}`,
        jadwalPraktek: jadwalPraktek,
        isActive: true,
        ...formData as Omit<Dokter, 'id' | 'jadwalPraktek' | 'isActive'>,
      };
      setDokterData(prevData => [newDokter, ...prevData]);
      alert(`Dokter baru ${formData.nama} berhasil ditambahkan!`);
    }
    
    setShowModal(false);
    setSelectedDokter(null);
    setFormData({});
    setJadwalPraktek([]);
  };

  const handleSubmitTenaga = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedTenaga) {
      // Update data tenaga medis
      setTenagaData(prevData => 
        prevData.map(t => 
          t.id === selectedTenaga.id 
            ? { ...t, ...tenagaFormData } 
            : t
        )
      );
      alert(`Data ${tenagaFormData.nama || selectedTenaga.nama} berhasil diperbarui!`);
    } else {
      // Tambah tenaga medis baru
      const newTenaga: TenagaMedis = {
        id: `TM${String(tenagaData.length + 1).padStart(3, '0')}`,
        isActive: true,
        ...tenagaFormData as Omit<TenagaMedis, 'id' | 'isActive'>,
      };
      setTenagaData(prevData => [newTenaga, ...prevData]);
      alert(`Tenaga medis baru ${tenagaFormData.nama} berhasil ditambahkan!`);
    }
    
    setShowTenagaModal(false);
    setSelectedTenaga(null);
    setTenagaFormData({});
  };

  const dokterColumns = [
    {
      key: 'nama',
      header: 'Nama Dokter',
      render: (item: Dokter) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 font-semibold">
            {item.nama.charAt(0)}
          </div>
          <div>
            <p className="font-medium text-gray-800">{item.nama}</p>
            <p className="text-xs text-gray-500">{item.spesialisasi}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'sip',
      header: 'SIP',
      render: (item: Dokter) => (
        <span className="text-sm text-gray-600">{item.sip}</span>
      ),
    },
    {
      key: 'poli',
      header: 'Poli',
      render: (item: Dokter) => {
        const poli = getPoliById(item.poliId);
        return <Badge variant="info">{poli?.nama}</Badge>;
      },
    },
    {
      key: 'tarif',
      header: 'Tarif Konsultasi',
      render: (item: Dokter) => (
        <span className="font-medium text-gray-800">{formatCurrency(item.tarifKonsultasi)}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (item: Dokter) => (
        <Badge variant={item.isActive ? 'success' : 'default'}>
          {item.isActive ? 'Aktif' : 'Tidak Aktif'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Aksi',
      render: (item: Dokter) => (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleEditDokter(item);
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
              handleDeleteDokter(item);
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

  const tenagaColumns = [
    {
      key: 'nama',
      header: 'Nama',
      render: (item: TenagaMedis) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
            {item.nama.charAt(0)}
          </div>
          <div>
            <p className="font-medium text-gray-800">{item.nama}</p>
            <p className="text-xs text-gray-500">NIP: {item.nip}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'jabatan',
      header: 'Jabatan',
      render: (item: TenagaMedis) => (
        <Badge variant="purple">
          {item.jabatan.charAt(0).toUpperCase() + item.jabatan.slice(1)}
        </Badge>
      ),
    },
    {
      key: 'telepon',
      header: 'Telepon',
    },
    {
      key: 'email',
      header: 'Email',
    },
    {
      key: 'status',
      header: 'Status',
      render: (item: TenagaMedis) => (
        <Badge variant={item.isActive ? 'success' : 'default'}>
          {item.isActive ? 'Aktif' : 'Tidak Aktif'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Aksi',
      render: (item: TenagaMedis) => (
        <div className="flex gap-2">
          <button 
            type="button" 
            onClick={(e) => {
              e.stopPropagation();
              handleEditTenaga(item);
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
              handleDeleteTenaga(item);
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
          <h1 className="text-2xl font-bold text-gray-800">Dokter & Tenaga Medis</h1>
          <p className="text-gray-500">Kelola data dokter dan tenaga medis klinik</p>
        </div>
        <Button type="button" onClick={() => { 
          if (activeTab === 'dokter') {
            setSelectedDokter(null); 
            setFormData({});
            setJadwalPraktek([]);
            setShowModal(true);
          } else {
            setSelectedTenaga(null);
            setTenagaFormData({});
            setShowTenagaModal(true);
          }
        }} suppressHydrationWarning>
          <Plus className="w-4 h-4" />
          {activeTab === 'dokter' ? 'Tambah Dokter' : 'Tambah Tenaga Medis'}
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          type="button"
          onClick={() => setActiveTab('dokter')}
          className={`px-4 py-2 font-medium transition-colors border-b-2 -mb-px ${
            activeTab === 'dokter'
              ? 'text-teal-600 border-teal-600'
              : 'text-gray-500 border-transparent hover:text-gray-700'
          }`}
          suppressHydrationWarning
        >
          Dokter ({dokterList.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('tenaga')}
          className={`px-4 py-2 font-medium transition-colors border-b-2 -mb-px ${
            activeTab === 'tenaga'
              ? 'text-teal-600 border-teal-600'
              : 'text-gray-500 border-transparent hover:text-gray-700'
          }`}
          suppressHydrationWarning
        >
          Tenaga Medis ({tenagaMedisList.length})
        </button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="py-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder={activeTab === 'dokter' 
                ? 'Cari berdasarkan nama, NIP, SIP, spesialisasi, poli, telepon, atau email...'
                : 'Cari berdasarkan nama, NIP, jabatan, telepon, atau email...'
              }
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            {activeTab === 'dokter' ? `Daftar Dokter (${filteredDokter.length})` : `Daftar Tenaga Medis (${filteredTenaga.length})`}
          </CardTitle>
        </CardHeader>
        {activeTab === 'dokter' ? (
          <DataTable 
            columns={dokterColumns} 
            data={filteredDokter} 
            onRowClick={(dokter) => {
              setSelectedDokter(dokter);
              setShowDetailModal(true);
            }}
          />
        ) : (
          <DataTable 
            columns={tenagaColumns} 
            data={filteredTenaga}
            onRowClick={(tenaga) => {
              setSelectedTenaga(tenaga);
              setShowDetailModal(true);
            }}
          />
        )}
      </Card>

      {/* Detail Modal for Dokter & Tenaga Medis */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedDokter(null);
          setSelectedTenaga(null);
        }}
        title={selectedDokter ? "Detail Dokter" : "Detail Tenaga Medis"}
        size="lg"
      >
        {selectedDokter && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 pb-4 border-b">
              <div className="w-20 h-20 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 text-3xl font-bold">
                {selectedDokter.nama.charAt(0)}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800">{selectedDokter.nama}</h3>
                <p className="text-teal-600">{selectedDokter.spesialisasi}</p>
                <Badge variant={selectedDokter.isActive ? 'success' : 'default'} className="mt-1">
                  {selectedDokter.isActive ? 'Aktif' : 'Tidak Aktif'}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">NIP</p>
                <p className="font-medium">{selectedDokter.nip}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">SIP</p>
                <p className="font-medium">{selectedDokter.sip}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Poli</p>
                <p className="font-medium">{getPoliById(selectedDokter.poliId)?.nama}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Tarif Konsultasi</p>
                <p className="font-medium text-teal-600">{formatCurrency(selectedDokter.tarifKonsultasi)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Telepon</p>
                <p className="font-medium">{selectedDokter.telepon}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{selectedDokter.email}</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-2">Jadwal Praktik</p>
              <div className="space-y-2">
                {selectedDokter.jadwalPraktek.map((jadwal, i) => (
                  <div key={i} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="font-medium w-20">{jadwal.hari}</span>
                    <span className="text-gray-600">{jadwal.jamMulai} - {jadwal.jamSelesai}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={() => setShowDetailModal(false)}>
                Tutup
              </Button>
              <Button type="button" onClick={() => { 
                setShowDetailModal(false); 
                handleEditDokter(selectedDokter);
              }} suppressHydrationWarning>
                <Edit className="w-4 h-4" />
                Edit Dokter
              </Button>
            </div>
          </div>
        )}
        
        {selectedTenaga && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 pb-4 border-b">
              <div className="w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 text-3xl font-bold">
                {selectedTenaga.nama.charAt(0)}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800">{selectedTenaga.nama}</h3>
                <p className="text-purple-600">{selectedTenaga.jabatan.charAt(0).toUpperCase() + selectedTenaga.jabatan.slice(1)}</p>
                <Badge variant={selectedTenaga.isActive ? 'success' : 'default'} className="mt-1">
                  {selectedTenaga.isActive ? 'Aktif' : 'Tidak Aktif'}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">NIP</p>
                <p className="font-medium">{selectedTenaga.nip}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Jabatan</p>
                <Badge variant="purple">
                  {selectedTenaga.jabatan.charAt(0).toUpperCase() + selectedTenaga.jabatan.slice(1)}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-gray-500">Telepon</p>
                <p className="font-medium flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  {selectedTenaga.telepon}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{selectedTenaga.email || '-'}</p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={() => {
                setShowDetailModal(false);
                setSelectedTenaga(null);
              }}>
                Tutup
              </Button>
              <Button onClick={() => {
                setShowDetailModal(false);
                handleEditTenaga(selectedTenaga);
              }} suppressHydrationWarning>
                <Edit className="w-4 h-4" />
                Edit Tenaga Medis
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={selectedDokter ? 'Edit Dokter' : 'Tambah Dokter Baru'}
        size="lg"
      >
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              label="Nama Lengkap" 
              placeholder="Dr. ..." 
              value={formData.nama || ''} 
              onChange={(e) => setFormData({...formData, nama: e.target.value})}
            />
            <Input 
              label="NIP" 
              placeholder="Masukkan NIP" 
              value={formData.nip || ''} 
              onChange={(e) => setFormData({...formData, nip: e.target.value})}
            />
            <Input 
              label="SIP" 
              placeholder="Masukkan SIP" 
              value={formData.sip || ''} 
              onChange={(e) => setFormData({...formData, sip: e.target.value})}
            />
            <Input 
              label="Spesialisasi" 
              placeholder="Contoh: Spesialis Anak" 
              value={formData.spesialisasi || ''} 
              onChange={(e) => setFormData({...formData, spesialisasi: e.target.value})}
            />
            <Select
              label="Poli"
              options={poliList.map(p => ({ value: p.id, label: p.nama }))}
              value={formData.poliId || ''}
              onChange={(e) => setFormData({...formData, poliId: e.target.value})}
            />
            <Input 
              label="Tarif Konsultasi" 
              type="number" 
              placeholder="150000" 
              value={formData.tarifKonsultasi?.toString() || ''} 
              onChange={(e) => setFormData({...formData, tarifKonsultasi: Number(e.target.value)})}
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
          </div>
          
          {/* Jadwal Praktik */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">Jadwal Praktik</label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setJadwalPraktek([...jadwalPraktek, { hari: '', jamMulai: '', jamSelesai: '' }])}
              >
                <Plus className="w-4 h-4 mr-1" />
                Tambah Jadwal
              </Button>
            </div>
            
            {jadwalPraktek.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4 border-2 border-dashed rounded-lg">
                Belum ada jadwal praktik. Klik "Tambah Jadwal" untuk menambahkan.
              </p>
            )}
            
            {jadwalPraktek.map((jadwal, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-3 p-3 border rounded-lg bg-gray-50">
                <Select
                  label="Hari"
                  options={[
                    { value: '', label: 'Pilih Hari' },
                    { value: 'Senin', label: 'Senin' },
                    { value: 'Selasa', label: 'Selasa' },
                    { value: 'Rabu', label: 'Rabu' },
                    { value: 'Kamis', label: 'Kamis' },
                    { value: 'Jumat', label: 'Jumat' },
                    { value: 'Sabtu', label: 'Sabtu' },
                    { value: 'Minggu', label: 'Minggu' },
                  ]}
                  value={jadwal.hari}
                  onChange={(e) => {
                    const newJadwal = [...jadwalPraktek];
                    newJadwal[index].hari = e.target.value;
                    setJadwalPraktek(newJadwal);
                  }}
                />
                <Input
                  label="Jam Mulai"
                  type="time"
                  value={jadwal.jamMulai}
                  onChange={(e) => {
                    const newJadwal = [...jadwalPraktek];
                    newJadwal[index].jamMulai = e.target.value;
                    setJadwalPraktek(newJadwal);
                  }}
                />
                <Input
                  label="Jam Selesai"
                  type="time"
                  value={jadwal.jamSelesai}
                  onChange={(e) => {
                    const newJadwal = [...jadwalPraktek];
                    newJadwal[index].jamSelesai = e.target.value;
                    setJadwalPraktek(newJadwal);
                  }}
                />
                <div className="flex items-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      const newJadwal = jadwalPraktek.filter((_, i) => i !== index);
                      setJadwalPraktek(newJadwal);
                    }}
                    className="w-full text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" type="button" onClick={() => setShowModal(false)}>
              Batal
            </Button>
            <Button type="submit">
              {selectedDokter ? 'Simpan Perubahan' : 'Tambah Dokter'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal Tenaga Medis */}
      <Modal
        isOpen={showTenagaModal}
        onClose={() => setShowTenagaModal(false)}
        title={selectedTenaga ? 'Edit Tenaga Medis' : 'Tambah Tenaga Medis Baru'}
        size="lg"
      >
        <form className="space-y-4" onSubmit={handleSubmitTenaga}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              label="Nama Lengkap" 
              placeholder="Masukkan nama lengkap" 
              value={tenagaFormData.nama || ''} 
              onChange={(e) => setTenagaFormData({...tenagaFormData, nama: e.target.value})}
              required
            />
            <Input 
              label="NIP" 
              placeholder="Masukkan NIP" 
              value={tenagaFormData.nip || ''} 
              onChange={(e) => setTenagaFormData({...tenagaFormData, nip: e.target.value})}
              required
            />
            <Select
              label="Jabatan"
              options={[
                { value: '', label: 'Pilih Jabatan' },
                { value: 'perawat', label: 'Perawat' },
                { value: 'bidan', label: 'Bidan' },
                { value: 'analis', label: 'Analis' },
                { value: 'apoteker', label: 'Apoteker' },
                { value: 'admin', label: 'Admin' },
                { value: 'radiografer', label: 'Radiografer' },
              ]}
              value={tenagaFormData.jabatan || ''}
              onChange={(e) => setTenagaFormData({...tenagaFormData, jabatan: e.target.value as 'perawat' | 'bidan' | 'analis' | 'apoteker' | 'admin' | 'radiografer'})}
              required
            />
            <Input 
              label="No. Telepon" 
              placeholder="08xxxxxxxxxx" 
              value={tenagaFormData.telepon || ''} 
              onChange={(e) => setTenagaFormData({...tenagaFormData, telepon: e.target.value})}
              required
            />
            <Input 
              label="Email" 
              type="email" 
              placeholder="email@example.com" 
              value={tenagaFormData.email || ''} 
              onChange={(e) => setTenagaFormData({...tenagaFormData, email: e.target.value})}
            />
          </div>
          
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" type="button" onClick={() => setShowTenagaModal(false)}>
              Batal
            </Button>
            <Button type="submit">
              {selectedTenaga ? 'Simpan Perubahan' : 'Tambah Tenaga Medis'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
