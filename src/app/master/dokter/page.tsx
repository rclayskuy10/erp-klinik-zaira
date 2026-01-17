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
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedDokter, setSelectedDokter] = useState<Dokter | null>(null);
  const [selectedTenaga, setSelectedTenaga] = useState<TenagaMedis | null>(null);
  const [dokterData, setDokterData] = useState<Dokter[]>(dokterList);
  const [tenagaData, setTenagaData] = useState<TenagaMedis[]>(tenagaMedisList);
  const [formData, setFormData] = useState<Partial<Dokter>>({});

  const filteredDokter = dokterData.filter(
    (d) =>
      d.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.spesialisasi.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTenaga = tenagaData.filter(
    (t) =>
      t.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.jabatan.toLowerCase().includes(searchTerm.toLowerCase())
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
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedDokter) {
      // Update data dokter
      setDokterData(prevData => 
        prevData.map(d => 
          d.id === selectedDokter.id 
            ? { ...d, ...formData } 
            : d
        )
      );
      alert(`Data dokter ${formData.nama || selectedDokter.nama} berhasil diperbarui!`);
    } else {
      // Tambah dokter baru (muncul di bagian atas)
      const newDokter: Dokter = {
        id: `DOK${String(dokterData.length + 1).padStart(3, '0')}`,
        jadwalPraktek: [],
        isActive: true,
        ...formData as Omit<Dokter, 'id' | 'jadwalPraktek' | 'isActive'>,
      };
      setDokterData(prevData => [newDokter, ...prevData]);
      alert(`Dokter baru ${formData.nama} berhasil ditambahkan!`);
    }
    
    setShowModal(false);
    setSelectedDokter(null);
    setFormData({});
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
              setSelectedDokter(item);
              setShowDetailModal(true);
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
          <button type="button" className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded" suppressHydrationWarning>
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
          setSelectedDokter(null); 
          setFormData({});
          setShowModal(true); 
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
              placeholder={`Cari ${activeTab === 'dokter' ? 'dokter' : 'tenaga medis'}...`}
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
          <DataTable columns={dokterColumns} data={filteredDokter} />
        ) : (
          <DataTable columns={tenagaColumns} data={filteredTenaga} />
        )}
      </Card>

      {/* Detail Modal for Dokter */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title="Detail Dokter"
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
    </div>
  );
}
