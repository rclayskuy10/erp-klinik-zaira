'use client';

import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Button, Badge, Modal, Input, Textarea } from '@/components/ui';
import { DataTable } from '@/components/ui/Table';
import { kategoriTarifList, layananList } from '@/data/dummy-data';
import { formatCurrency } from '@/lib/utils';
import { KategoriTarif } from '@/types';

export default function TarifPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedTarif, setSelectedTarif] = useState<KategoriTarif | null>(null);
  const [tarifData, setTarifData] = useState<KategoriTarif[]>(kategoriTarifList);
  const [formData, setFormData] = useState<Partial<KategoriTarif>>({});

  const filteredTarif = tarifData.filter(
    (t) => t.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
           t.kode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (tarif: KategoriTarif) => {
    setSelectedTarif(tarif);
    setFormData({
      kode: tarif.kode,
      nama: tarif.nama,
      deskripsi: tarif.deskripsi,
    });
    setShowModal(true);
  };

  const handleDelete = (tarif: KategoriTarif) => {
    if (confirm(`Apakah Anda yakin ingin menghapus kategori tarif ${tarif.nama}?`)) {
      setTarifData(prevData => prevData.filter(t => t.id !== tarif.id));
      alert(`Kategori tarif ${tarif.nama} berhasil dihapus!`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedTarif) {
      // Update data tarif
      setTarifData(prevData => 
        prevData.map(t => 
          t.id === selectedTarif.id 
            ? { ...t, ...formData } 
            : t
        )
      );
      alert(`Data kategori tarif ${formData.nama || selectedTarif.nama} berhasil diperbarui!`);
    } else {
      // Tambah tarif baru (muncul di bagian atas)
      const newTarif: KategoriTarif = {
        id: `TAR${String(tarifData.length + 1).padStart(3, '0')}`,
        ...formData as Omit<KategoriTarif, 'id'>,
      };
      setTarifData(prevData => [newTarif, ...prevData]);
      alert(`Kategori tarif baru ${formData.nama} berhasil ditambahkan!`);
    }
    
    setShowModal(false);
    setSelectedTarif(null);
    setFormData({});
  };

  const getLayananCount = (kode: string) => {
    const kategoriMap: Record<string, string> = {
      'KON': 'konsultasi',
      'TIN': 'tindakan',
      'LAB': 'laboratorium',
      'RAD': 'radiologi',
    };
    return layananList.filter(l => l.kategori === kategoriMap[kode]).length;
  };

  const getTotalTarif = (kode: string) => {
    const kategoriMap: Record<string, string> = {
      'KON': 'konsultasi',
      'TIN': 'tindakan',
      'LAB': 'laboratorium',
      'RAD': 'radiologi',
    };
    const layanan = layananList.filter(l => l.kategori === kategoriMap[kode]);
    if (layanan.length === 0) return '-';
    const min = Math.min(...layanan.map(l => l.tarif));
    const max = Math.max(...layanan.map(l => l.tarif));
    return `${formatCurrency(min)} - ${formatCurrency(max)}`;
  };

  const columns = [
    {
      key: 'kode',
      header: 'Kode',
      render: (item: KategoriTarif) => (
        <span className="font-mono font-medium text-teal-600">{item.kode}</span>
      ),
    },
    {
      key: 'nama',
      header: 'Nama Kategori',
      render: (item: KategoriTarif) => (
        <div>
          <p className="font-medium text-gray-800">{item.nama}</p>
          <p className="text-xs text-gray-500">{item.deskripsi}</p>
        </div>
      ),
    },
    {
      key: 'layanan',
      header: 'Jumlah Layanan',
      render: (item: KategoriTarif) => (
        <Badge variant="info">{getLayananCount(item.kode)} Layanan</Badge>
      ),
    },
    {
      key: 'tarif',
      header: 'Rentang Tarif',
      render: (item: KategoriTarif) => (
        <span className="text-gray-700">{getTotalTarif(item.kode)}</span>
      ),
    },
    {
      key: 'actions',
      header: 'Aksi',
      render: (item: KategoriTarif) => (
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
          <h1 className="text-2xl font-bold text-gray-800">Kategori Tarif</h1>
          <p className="text-gray-500">Kelola kategori tarif layanan klinik</p>
        </div>
        <Button type="button" onClick={() => { 
          setSelectedTarif(null); 
          setFormData({});
          setShowModal(true); 
        }} suppressHydrationWarning>
          <Plus className="w-4 h-4" />
          Tambah Kategori
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="py-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Cari kategori tarif..."
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
          <CardTitle>Daftar Kategori Tarif ({filteredTarif.length})</CardTitle>
        </CardHeader>
        <DataTable columns={columns} data={filteredTarif} />
      </Card>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedTarif(null);
          setFormData({});
        }}
        title={selectedTarif ? 'Edit Kategori Tarif' : 'Tambah Kategori Tarif'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input 
            label="Kode" 
            placeholder="Contoh: KON" 
            value={formData.kode || ''} 
            onChange={(e) => setFormData({ ...formData, kode: e.target.value })}
          />
          <Input 
            label="Nama Kategori" 
            placeholder="Contoh: Konsultasi" 
            value={formData.nama || ''} 
            onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
          />
          <Textarea 
            label="Deskripsi" 
            placeholder="Deskripsi kategori tarif" 
            rows={3} 
            value={formData.deskripsi || ''} 
            onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
          />
          
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" type="button" onClick={() => {
              setShowModal(false);
              setSelectedTarif(null);
              setFormData({});
            }}>
              Batal
            </Button>
            <Button type="submit">
              {selectedTarif ? 'Simpan Perubahan' : 'Tambah Kategori'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
