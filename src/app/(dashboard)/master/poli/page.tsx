'use client';

import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Building2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Button, Badge, Modal, Input, Textarea } from '@/components/ui';
import { DataTable } from '@/components/ui/Table';
import { poliList, dokterList } from '@/data/dummy-data';
import { Poli } from '@/types';

export default function PoliPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedPoli, setSelectedPoli] = useState<Poli | null>(null);
  const [poliData, setPoliData] = useState<Poli[]>(poliList);
  const [formData, setFormData] = useState<Partial<Poli>>({});

  const filteredPoli = poliData.filter(
    (p) => p.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
           p.kode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getDokterCount = (poliId: string) => {
    return dokterList.filter(d => d.poliId === poliId).length;
  };

  const handleEdit = (poli: Poli) => {
    setSelectedPoli(poli);
    setFormData({
      kode: poli.kode,
      nama: poli.nama,
      deskripsi: poli.deskripsi,
    });
    setShowModal(true);
  };

  const handleDelete = (poli: Poli) => {
    if (confirm(`Apakah Anda yakin ingin menghapus data poli ${poli.nama}?`)) {
      setPoliData(prevData => prevData.filter(p => p.id !== poli.id));
      alert(`Data poli ${poli.nama} berhasil dihapus!`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedPoli) {
      // Update data poli
      setPoliData(prevData => 
        prevData.map(p => 
          p.id === selectedPoli.id 
            ? { ...p, ...formData } 
            : p
        )
      );
      alert(`Data poli ${formData.nama || selectedPoli.nama} berhasil diperbarui!`);
    } else {
      // Tambah poli baru (muncul di bagian atas)
      const newPoli: Poli = {
        id: `POL${String(poliData.length + 1).padStart(3, '0')}`,
        isActive: true,
        ...formData as Omit<Poli, 'id' | 'isActive'>,
      };
      setPoliData(prevData => [newPoli, ...prevData]);
      alert(`Poli baru ${formData.nama} berhasil ditambahkan!`);
    }
    
    setShowModal(false);
    setSelectedPoli(null);
    setFormData({});
  };

  const columns = [
    {
      key: 'kode',
      header: 'Kode',
      render: (item: Poli) => (
        <span className="font-mono font-medium text-teal-600">{item.kode}</span>
      ),
    },
    {
      key: 'nama',
      header: 'Nama Poli',
      render: (item: Poli) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-teal-600" />
          </div>
          <div>
            <p className="font-medium text-gray-800">{item.nama}</p>
            <p className="text-xs text-gray-500">{item.deskripsi}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'dokter',
      header: 'Jumlah Dokter',
      render: (item: Poli) => (
        <Badge variant="info">{getDokterCount(item.id)} Dokter</Badge>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (item: Poli) => (
        <Badge variant={item.isActive ? 'success' : 'default'}>
          {item.isActive ? 'Aktif' : 'Tidak Aktif'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Aksi',
      render: (item: Poli) => (
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
          <h1 className="text-2xl font-bold text-gray-800">Data Poli</h1>
          <p className="text-gray-500">Kelola data poli klinik</p>
        </div>
        <Button type="button" onClick={() => { 
          setSelectedPoli(null); 
          setFormData({});
          setShowModal(true); 
        }} suppressHydrationWarning>
          <Plus className="w-4 h-4" />
          Tambah Poli
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="py-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Cari poli..."
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
          <CardTitle>Daftar Poli ({filteredPoli.length})</CardTitle>
        </CardHeader>
        <DataTable columns={columns} data={filteredPoli} />
      </Card>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedPoli(null);
          setFormData({});
        }}
        title={selectedPoli ? 'Edit Poli' : 'Tambah Poli Baru'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input 
            label="Kode Poli" 
            placeholder="Contoh: UMM" 
            value={formData.kode || ''} 
            onChange={(e) => setFormData({ ...formData, kode: e.target.value })}
          />
          <Input 
            label="Nama Poli" 
            placeholder="Contoh: Poli Umum" 
            value={formData.nama || ''} 
            onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
          />
          <Textarea 
            label="Deskripsi" 
            placeholder="Deskripsi poli" 
            rows={3} 
            value={formData.deskripsi || ''} 
            onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
          />
          
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" type="button" onClick={() => {
              setShowModal(false);
              setSelectedPoli(null);
              setFormData({});
            }}>
              Batal
            </Button>
            <Button type="submit">
              {selectedPoli ? 'Simpan Perubahan' : 'Tambah Poli'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
