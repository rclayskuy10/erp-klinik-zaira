'use client';

import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, AlertTriangle, Package } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Button, Badge, Modal, Input, Select } from '@/components/ui';
import { DataTable } from '@/components/ui/Table';
import { obatList, alatMedisList } from '@/data/dummy-data';
import { formatCurrency } from '@/lib/utils';
import { Obat, AlatMedis } from '@/types';

export default function ObatPage() {
  const [activeTab, setActiveTab] = useState<'obat' | 'alat'>('obat');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterKategori, setFilterKategori] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedObat, setSelectedObat] = useState<Obat | null>(null);
  const [obatData, setObatData] = useState<Obat[]>(obatList);
  const [formData, setFormData] = useState<Partial<Obat>>({});

  const filteredObat = obatData.filter((o) => {
    const matchSearch = o.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       o.kode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchKategori = !filterKategori || o.kategori === filterKategori;
    return matchSearch && matchKategori;
  });

  const filteredAlat = alatMedisList.filter((a) =>
    a.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.kode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const obatHampirHabis = obatData.filter(o => o.stok <= o.minimumStok);

  const handleEdit = (obat: Obat) => {
    setSelectedObat(obat);
    setFormData({
      kode: obat.kode,
      nama: obat.nama,
      kategori: obat.kategori,
      satuan: obat.satuan,
      hargaBeli: obat.hargaBeli,
      hargaJual: obat.hargaJual,
      stok: obat.stok,
      minimumStok: obat.minimumStok,
    });
    setShowModal(true);
  };

  const handleDelete = (obat: Obat) => {
    if (confirm(`Apakah Anda yakin ingin menghapus obat ${obat.nama}?`)) {
      setObatData(prevData => prevData.filter(o => o.id !== obat.id));
      alert(`Obat ${obat.nama} berhasil dihapus!`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedObat) {
      // Update data obat
      setObatData(prevData => 
        prevData.map(o => 
          o.id === selectedObat.id 
            ? { ...o, ...formData } 
            : o
        )
      );
      alert(`Data obat ${formData.nama || selectedObat.nama} berhasil diperbarui!`);
    } else {
      // Tambah obat baru (muncul di bagian atas)
      const newObat: Obat = {
        id: `OBT${String(obatData.length + 1).padStart(3, '0')}`,
        isActive: true,
        ...formData as Omit<Obat, 'id' | 'isActive'>,
      };
      setObatData(prevData => [newObat, ...prevData]);
      alert(`Obat baru ${formData.nama} berhasil ditambahkan!`);
    }
    
    setShowModal(false);
    setSelectedObat(null);
    setFormData({});
  };

  const obatColumns = [
    {
      key: 'kode',
      header: 'Kode',
      render: (item: Obat) => (
        <span className="font-mono text-sm text-teal-600">{item.kode}</span>
      ),
    },
    {
      key: 'nama',
      header: 'Nama Obat',
      render: (item: Obat) => (
        <div>
          <p className="font-medium text-gray-800">{item.nama}</p>
          <p className="text-xs text-gray-500 capitalize">{item.kategori}</p>
        </div>
      ),
    },
    {
      key: 'stok',
      header: 'Stok',
      render: (item: Obat) => (
        <div className="flex items-center gap-2">
          <span className={`font-medium ${item.stok <= item.minimumStok ? 'text-red-600' : 'text-gray-800'}`}>
            {item.stok} {item.satuan}
          </span>
          {item.stok <= item.minimumStok && (
            <AlertTriangle className="w-4 h-4 text-red-500" />
          )}
        </div>
      ),
    },
    {
      key: 'minimumStok',
      header: 'Min. Stok',
      render: (item: Obat) => `${item.minimumStok} ${item.satuan}`,
    },
    {
      key: 'hargaBeli',
      header: 'Harga Beli',
      render: (item: Obat) => formatCurrency(item.hargaBeli),
    },
    {
      key: 'hargaJual',
      header: 'Harga Jual',
      render: (item: Obat) => (
        <span className="font-semibold text-gray-800">{formatCurrency(item.hargaJual)}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (item: Obat) => (
        <Badge variant={item.isActive ? 'success' : 'default'}>
          {item.isActive ? 'Aktif' : 'Tidak Aktif'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Aksi',
      render: (item: Obat) => (
        <div className="flex gap-2">
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

  const alatColumns = [
    {
      key: 'kode',
      header: 'Kode',
      render: (item: AlatMedis) => (
        <span className="font-mono text-sm text-teal-600">{item.kode}</span>
      ),
    },
    {
      key: 'nama',
      header: 'Nama Alat',
      render: (item: AlatMedis) => (
        <div>
          <p className="font-medium text-gray-800">{item.nama}</p>
          <p className="text-xs text-gray-500">{item.kategori}</p>
        </div>
      ),
    },
    {
      key: 'stok',
      header: 'Stok',
      render: (item: AlatMedis) => (
        <div className="flex items-center gap-2">
          <span className={`font-medium ${item.stok <= item.minimumStok ? 'text-red-600' : 'text-gray-800'}`}>
            {item.stok} {item.satuan}
          </span>
          {item.stok <= item.minimumStok && (
            <AlertTriangle className="w-4 h-4 text-red-500" />
          )}
        </div>
      ),
    },
    {
      key: 'harga',
      header: 'Harga',
      render: (item: AlatMedis) => (
        <span className="font-semibold text-gray-800">{formatCurrency(item.harga)}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (item: AlatMedis) => (
        <Badge variant={item.isActive ? 'success' : 'default'}>
          {item.isActive ? 'Aktif' : 'Tidak Aktif'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Aksi',
      render: (item: AlatMedis) => (
        <div className="flex gap-2">
          <button type="button" className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded" suppressHydrationWarning>
            <Edit className="w-4 h-4" />
          </button>
          <button type="button" className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded" suppressHydrationWarning>
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
          <h1 className="text-2xl font-bold text-gray-800">Obat & Alat Medis</h1>
          <p className="text-gray-500">Kelola data obat dan alat medis</p>
        </div>
        <Button type="button" onClick={() => { 
          setSelectedObat(null); 
          setFormData({});
          setShowModal(true); 
        }} suppressHydrationWarning>
          <Plus className="w-4 h-4" />
          {activeTab === 'obat' ? 'Tambah Obat' : 'Tambah Alat Medis'}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-sm text-gray-500">Total Obat</p>
          <p className="text-2xl font-bold text-gray-800">{obatData.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-500">Total Alat Medis</p>
          <p className="text-2xl font-bold text-gray-800">{alatMedisList.length}</p>
        </Card>
        <Card className="p-4 border-l-4 border-l-yellow-500">
          <p className="text-sm text-gray-500">Stok Menipis</p>
          <p className="text-2xl font-bold text-yellow-600">{obatHampirHabis.length}</p>
        </Card>
        <Card className="p-4 border-l-4 border-l-red-500">
          <p className="text-sm text-gray-500">Hampir Kadaluarsa</p>
          <p className="text-2xl font-bold text-red-600">3</p>
        </Card>
      </div>

      {/* Alert for low stock */}
      {obatHampirHabis.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-yellow-800">Perhatian: Stok Menipis</p>
            <p className="text-sm text-yellow-700">
              {obatHampirHabis.length} obat memiliki stok di bawah minimum. Segera lakukan pengadaan.
            </p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          type="button"
          onClick={() => setActiveTab('obat')}
          className={`px-4 py-2 font-medium transition-colors border-b-2 -mb-px ${
            activeTab === 'obat'
              ? 'text-teal-600 border-teal-600'
              : 'text-gray-500 border-transparent hover:text-gray-700'
          }`}
          suppressHydrationWarning
        >
          Obat ({obatData.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('alat')}
          className={`px-4 py-2 font-medium transition-colors border-b-2 -mb-px ${
            activeTab === 'alat'
              ? 'text-teal-600 border-teal-600'
              : 'text-gray-500 border-transparent hover:text-gray-700'
          }`}
          suppressHydrationWarning
        >
          Alat Medis ({alatMedisList.length})
        </button>
      </div>

      {/* Search & Filter */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder={`Cari ${activeTab === 'obat' ? 'obat' : 'alat medis'}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            {activeTab === 'obat' && (
              <select
                value={filterKategori}
                onChange={(e) => setFilterKategori(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="">Semua Kategori</option>
                <option value="tablet">Tablet</option>
                <option value="kapsul">Kapsul</option>
                <option value="sirup">Sirup</option>
                <option value="salep">Salep</option>
                <option value="injeksi">Injeksi</option>
                <option value="infus">Infus</option>
              </select>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            {activeTab === 'obat' ? `Daftar Obat (${filteredObat.length})` : `Daftar Alat Medis (${filteredAlat.length})`}
          </CardTitle>
        </CardHeader>
        {activeTab === 'obat' ? (
          <DataTable columns={obatColumns} data={filteredObat} />
        ) : (
          <DataTable columns={alatColumns} data={filteredAlat} />
        )}
      </Card>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedObat(null);
          setFormData({});
        }}
        title={selectedObat ? 'Edit Obat' : 'Tambah Obat Baru'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              label="Kode Obat" 
              placeholder="OBT-001" 
              value={formData.kode || ''} 
              onChange={(e) => setFormData({ ...formData, kode: e.target.value })}
            />
            <Select
              label="Kategori"
              options={[
                { value: 'tablet', label: 'Tablet' },
                { value: 'kapsul', label: 'Kapsul' },
                { value: 'sirup', label: 'Sirup' },
                { value: 'salep', label: 'Salep' },
                { value: 'injeksi', label: 'Injeksi' },
                { value: 'infus', label: 'Infus' },
                { value: 'alat_medis', label: 'Alat Medis' },
              ]}
              value={formData.kategori || ''}
              onChange={(e) => setFormData({ ...formData, kategori: e.target.value as any })}
            />
          </div>
          <Input 
            label="Nama Obat" 
            placeholder="Nama obat" 
            value={formData.nama || ''} 
            onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input 
              label="Satuan" 
              placeholder="Tablet/Botol/dll" 
              value={formData.satuan || ''} 
              onChange={(e) => setFormData({ ...formData, satuan: e.target.value })}
            />
            <Input 
              label="Harga Beli" 
              type="number" 
              placeholder="10000" 
              value={formData.hargaBeli?.toString() || ''} 
              onChange={(e) => setFormData({ ...formData, hargaBeli: parseInt(e.target.value) || 0 })}
            />
            <Input 
              label="Harga Jual" 
              type="number" 
              placeholder="15000" 
              value={formData.hargaJual?.toString() || ''} 
              onChange={(e) => setFormData({ ...formData, hargaJual: parseInt(e.target.value) || 0 })}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              label="Stok Awal" 
              type="number" 
              placeholder="100" 
              value={formData.stok?.toString() || ''} 
              onChange={(e) => setFormData({ ...formData, stok: parseInt(e.target.value) || 0 })}
            />
            <Input 
              label="Minimum Stok" 
              type="number" 
              placeholder="20" 
              value={formData.minimumStok?.toString() || ''} 
              onChange={(e) => setFormData({ ...formData, minimumStok: parseInt(e.target.value) || 0 })}
            />
          </div>
          
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" type="button" onClick={() => {
              setShowModal(false);
              setSelectedObat(null);
              setFormData({});
            }}>
              Batal
            </Button>
            <Button type="submit">
              {selectedObat ? 'Simpan Perubahan' : 'Tambah Obat'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
