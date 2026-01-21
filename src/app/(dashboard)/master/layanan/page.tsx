'use client';

import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Button, Badge, Modal, Input, Select, Textarea } from '@/components/ui';
import { DataTable } from '@/components/ui/Table';
import { layananList, poliList, getPoliById } from '@/data/dummy-data';
import { formatCurrency } from '@/lib/utils';
import { Layanan } from '@/types';

export default function LayananPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterKategori, setFilterKategori] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedLayanan, setSelectedLayanan] = useState<Layanan | null>(null);
  const [layananData, setLayananData] = useState<Layanan[]>(layananList);
  const [formData, setFormData] = useState<Partial<Layanan>>({});

  const filteredLayanan = layananData.filter((l) => {
    const matchSearch = l.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       l.kode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchKategori = !filterKategori || l.kategori === filterKategori;
    return matchSearch && matchKategori;
  });

  const handleEdit = (layanan: Layanan) => {
    setSelectedLayanan(layanan);
    setFormData({
      kode: layanan.kode,
      nama: layanan.nama,
      kategori: layanan.kategori,
      poliId: layanan.poliId,
      tarif: layanan.tarif,
      deskripsi: layanan.deskripsi,
    });
    setShowModal(true);
  };

  const handleDelete = (layanan: Layanan) => {
    if (confirm(`Apakah Anda yakin ingin menghapus layanan ${layanan.nama}?`)) {
      setLayananData(prevData => prevData.filter(l => l.id !== layanan.id));
      alert(`Layanan ${layanan.nama} berhasil dihapus!`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedLayanan) {
      // Update data layanan
      setLayananData(prevData => 
        prevData.map(l => 
          l.id === selectedLayanan.id 
            ? { ...l, ...formData } 
            : l
        )
      );
      alert(`Data layanan ${formData.nama || selectedLayanan.nama} berhasil diperbarui!`);
    } else {
      // Tambah layanan baru (muncul di bagian atas)
      const newLayanan: Layanan = {
        id: `LAY${String(layananData.length + 1).padStart(3, '0')}`,
        isActive: true,
        ...formData as Omit<Layanan, 'id' | 'isActive'>,
      };
      setLayananData(prevData => [newLayanan, ...prevData]);
      alert(`Layanan baru ${formData.nama} berhasil ditambahkan!`);
    }
    
    setShowModal(false);
    setSelectedLayanan(null);
    setFormData({});
  };

  const getKategoriVariant = (kategori: string) => {
    switch (kategori) {
      case 'konsultasi': return 'info';
      case 'tindakan': return 'warning';
      case 'laboratorium': return 'purple';
      case 'radiologi': return 'success';
      default: return 'default';
    }
  };

  const columns = [
    {
      key: 'kode',
      header: 'Kode',
      render: (item: Layanan) => (
        <span className="font-mono text-sm text-teal-600">{item.kode}</span>
      ),
    },
    {
      key: 'nama',
      header: 'Nama Layanan',
      render: (item: Layanan) => (
        <p className="font-medium text-gray-800">{item.nama}</p>
      ),
    },
    {
      key: 'kategori',
      header: 'Kategori',
      render: (item: Layanan) => (
        <Badge variant={getKategoriVariant(item.kategori) as 'info' | 'warning' | 'purple' | 'success' | 'default'}>
          {item.kategori.charAt(0).toUpperCase() + item.kategori.slice(1)}
        </Badge>
      ),
    },
    {
      key: 'poli',
      header: 'Poli',
      render: (item: Layanan) => {
        const poli = item.poliId ? getPoliById(item.poliId) : null;
        return poli ? (
          <span className="text-gray-600">{poli.nama}</span>
        ) : (
          <span className="text-gray-400">Semua Poli</span>
        );
      },
    },
    {
      key: 'tarif',
      header: 'Tarif',
      render: (item: Layanan) => (
        <span className="font-semibold text-gray-800">{formatCurrency(item.tarif)}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (item: Layanan) => (
        <Badge variant={item.isActive ? 'success' : 'default'}>
          {item.isActive ? 'Aktif' : 'Tidak Aktif'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Aksi',
      render: (item: Layanan) => (
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

  return (
    <div className="space-y-6" suppressHydrationWarning>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Data Layanan</h1>
          <p className="text-gray-500">Kelola data layanan klinik (konsultasi, tindakan, lab)</p>
        </div>
        <Button type="button" onClick={() => { 
          setSelectedLayanan(null); 
          setFormData({});
          setShowModal(true); 
        }} suppressHydrationWarning>
          <Plus className="w-4 h-4" />
          Tambah Layanan
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {['konsultasi', 'tindakan', 'laboratorium', 'radiologi'].map((kategori) => (
          <Card key={kategori} className="p-4">
            <p className="text-sm text-gray-500 capitalize">{kategori}</p>
            <p className="text-2xl font-bold text-gray-800">
              {layananData.filter(l => l.kategori === kategori).length}
            </p>
          </Card>
        ))}
      </div>

      {/* Search & Filter */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Cari layanan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <select
              value={filterKategori}
              onChange={(e) => setFilterKategori(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="">Semua Kategori</option>
              <option value="konsultasi">Konsultasi</option>
              <option value="tindakan">Tindakan</option>
              <option value="laboratorium">Laboratorium</option>
              <option value="radiologi">Radiologi</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Layanan ({filteredLayanan.length})</CardTitle>
        </CardHeader>
        <DataTable columns={columns} data={filteredLayanan} />
      </Card>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedLayanan(null);
          setFormData({});
        }}
        title={selectedLayanan ? 'Edit Layanan' : 'Tambah Layanan Baru'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Kode Layanan" 
              placeholder="KON-001" 
              value={formData.kode || ''} 
              onChange={(e) => setFormData({ ...formData, kode: e.target.value })}
            />
            <Select
              label="Kategori"
              options={[
                { value: 'konsultasi', label: 'Konsultasi' },
                { value: 'tindakan', label: 'Tindakan' },
                { value: 'laboratorium', label: 'Laboratorium' },
                { value: 'radiologi', label: 'Radiologi' },
              ]}
              value={formData.kategori || ''}
              onChange={(e) => setFormData({ ...formData, kategori: e.target.value as any })}
            />
          </div>
          <Input 
            label="Nama Layanan" 
            placeholder="Nama layanan" 
            value={formData.nama || ''} 
            onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
          />
          <Select
            label="Poli (Opsional)"
            options={[
              { value: '', label: 'Semua Poli' },
              ...poliList.map(p => ({ value: p.id, label: p.nama }))
            ]}
            value={formData.poliId || ''}
            onChange={(e) => setFormData({ ...formData, poliId: e.target.value })}
          />
          <Input 
            label="Tarif" 
            type="number" 
            placeholder="150000" 
            value={formData.tarif?.toString() || ''} 
            onChange={(e) => setFormData({ ...formData, tarif: parseInt(e.target.value) || 0 })}
          />
          <Textarea 
            label="Deskripsi" 
            placeholder="Deskripsi layanan" 
            rows={2} 
            value={formData.deskripsi || ''} 
            onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
          />
          
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" type="button" onClick={() => {
              setShowModal(false);
              setSelectedLayanan(null);
              setFormData({});
            }}>
              Batal
            </Button>
            <Button type="submit">
              {selectedLayanan ? 'Simpan Perubahan' : 'Tambah Layanan'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
