'use client';

import React, { useState } from 'react';
import { Search, Plus, Building2, Phone, Mail, MapPin, Edit, Trash2, Eye } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Button, Input, Badge, DataTable, Modal } from '@/components/ui';

interface Supplier {
  id: string;
  kode: string;
  nama: string;
  alamat: string;
  kota: string;
  telepon: string;
  email: string;
  kontakPerson: string;
  npwp?: string;
  rekening?: string;
  bank?: string;
  status: 'aktif' | 'nonaktif';
  catatan?: string;
}

// Dummy suppliers data
const suppliersData: Supplier[] = [
  {
    id: 'SUP001',
    kode: 'KF-001',
    nama: 'PT. Kimia Farma Tbk',
    alamat: 'Jl. Veteran No. 9',
    kota: 'Jakarta Pusat',
    telepon: '021-3847100',
    email: 'order@kimiafarma.co.id',
    kontakPerson: 'Budi Santoso',
    npwp: '01.234.567.8-012.000',
    rekening: '1234567890',
    bank: 'Bank Mandiri',
    status: 'aktif',
  },
  {
    id: 'SUP002',
    kode: 'EN-001',
    nama: 'PT. Enseval Putera Megatrading',
    alamat: 'Jl. Pulo Lentut No. 10',
    kota: 'Jakarta Timur',
    telepon: '021-4682610',
    email: 'sales@enseval.com',
    kontakPerson: 'Dewi Anggraeni',
    npwp: '02.345.678.9-013.000',
    rekening: '0987654321',
    bank: 'Bank BCA',
    status: 'aktif',
  },
  {
    id: 'SUP003',
    kode: 'AP-001',
    nama: 'PT. Anugrah Pharmindo Lestari',
    alamat: 'Jl. Agung Karya IV Blok B No. 5',
    kota: 'Jakarta Utara',
    telepon: '021-6518888',
    email: 'order@apl.co.id',
    kontakPerson: 'Ahmad Rizky',
    npwp: '03.456.789.0-014.000',
    rekening: '1122334455',
    bank: 'Bank BNI',
    status: 'aktif',
  },
  {
    id: 'SUP004',
    kode: 'KB-001',
    nama: 'PT. Kalbe Farma Tbk',
    alamat: 'Jl. Let. Jend. Suprapto Kav. 4',
    kota: 'Jakarta Pusat',
    telepon: '021-4287888',
    email: 'distributor@kalbe.co.id',
    kontakPerson: 'Sri Wahyuni',
    npwp: '04.567.890.1-015.000',
    rekening: '5566778899',
    bank: 'Bank Mandiri',
    status: 'aktif',
  },
  {
    id: 'SUP005',
    kode: 'MS-001',
    nama: 'PT. Mensa Binasukses',
    alamat: 'Jl. Raya Bekasi KM 25',
    kota: 'Bekasi',
    telepon: '021-8841234',
    email: 'info@mensa.co.id',
    kontakPerson: 'Hendra Wijaya',
    status: 'nonaktif',
    catatan: 'Kontrak berakhir',
  },
];

export default function SupplierPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'aktif' | 'nonaktif'>('all');
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState<Partial<Supplier>>({
    nama: '',
    alamat: '',
    kota: '',
    telepon: '',
    email: '',
    kontakPerson: '',
    npwp: '',
    rekening: '',
    bank: '',
    status: 'aktif',
    catatan: '',
  });

  const filteredSuppliers = suppliersData.filter(supplier => {
    const matchSearch = 
      supplier.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.kode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.kontakPerson.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === 'all' || supplier.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleSubmit = () => {
    alert(isEditing ? 'Supplier berhasil diperbarui!' : 'Supplier baru berhasil ditambahkan!');
    setShowFormModal(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      nama: '',
      alamat: '',
      kota: '',
      telepon: '',
      email: '',
      kontakPerson: '',
      npwp: '',
      rekening: '',
      bank: '',
      status: 'aktif',
      catatan: '',
    });
    setIsEditing(false);
  };

  const handleEdit = (supplier: Supplier) => {
    setFormData(supplier);
    setIsEditing(true);
    setShowFormModal(true);
  };

  const columns = [
    {
      header: 'Kode',
      key: 'kode',
      render: (item: Supplier) => (
        <span className="font-mono text-teal-600 font-medium">{item.kode}</span>
      ),
    },
    {
      header: 'Nama Supplier',
      key: 'nama',
      render: (item: Supplier) => (
        <div>
          <p className="font-medium">{item.nama}</p>
          <p className="text-xs text-gray-500">{item.kota}</p>
        </div>
      ),
    },
    {
      header: 'Kontak',
      key: 'telepon',
      render: (item: Supplier) => (
        <div>
          <p className="text-sm">{item.telepon}</p>
          <p className="text-xs text-gray-500">{item.kontakPerson}</p>
        </div>
      ),
    },
    {
      header: 'Email',
      key: 'email',
      render: (item: Supplier) => (
        <span className="text-sm text-gray-600">{item.email}</span>
      ),
    },
    {
      header: 'Status',
      key: 'status',
      render: (item: Supplier) => (
        <Badge variant={item.status === 'aktif' ? 'success' : 'danger'}>
          {item.status === 'aktif' ? 'Aktif' : 'Non-Aktif'}
        </Badge>
      ),
    },
    {
      header: 'Aksi',
      key: 'id',
      render: (item: Supplier) => (
        <div className="flex gap-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => {
              setSelectedSupplier(item);
              setShowDetailModal(true);
            }}
            suppressHydrationWarning
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => handleEdit(item)}
            suppressHydrationWarning
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => alert(`Menghapus supplier ${item.nama}`)}
            suppressHydrationWarning
          >
            <Trash2 className="w-4 h-4 text-red-500" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6" suppressHydrationWarning>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Kelola Supplier</h1>
          <p className="text-gray-500">Daftar supplier obat dan alat medis</p>
        </div>
        <Button type="button" onClick={() => setShowFormModal(true)} className="gap-2" suppressHydrationWarning>
          <Plus className="w-5 h-5" />
          Tambah Supplier
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
              <Building2 className="w-6 h-6 text-teal-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{suppliersData.length}</p>
              <p className="text-sm text-gray-500">Total Supplier</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 border-l-4 border-l-green-500">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {suppliersData.filter(s => s.status === 'aktif').length}
            </p>
            <p className="text-sm text-gray-500">Aktif</p>
          </div>
        </Card>
        <Card className="p-4 border-l-4 border-l-gray-400">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-600">
              {suppliersData.filter(s => s.status === 'nonaktif').length}
            </p>
            <p className="text-sm text-gray-500">Non-Aktif</p>
          </div>
        </Card>
      </div>

      {/* Filter & Search */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Cari supplier, kode, atau kontak person..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="all">Semua Status</option>
              <option value="aktif">Aktif</option>
              <option value="nonaktif">Non-Aktif</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Supplier</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={filteredSuppliers}
            emptyMessage="Tidak ada supplier ditemukan"
          />
        </CardContent>
      </Card>

      {/* Form Modal */}
      <Modal
        isOpen={showFormModal}
        onClose={() => {
          setShowFormModal(false);
          resetForm();
        }}
        title={isEditing ? 'Edit Supplier' : 'Tambah Supplier Baru'}
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama Supplier *</label>
              <Input
                value={formData.nama || ''}
                onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                placeholder="Masukkan nama supplier"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Alamat *</label>
              <Input
                value={formData.alamat || ''}
                onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                placeholder="Alamat lengkap"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kota *</label>
              <Input
                value={formData.kota || ''}
                onChange={(e) => setFormData({ ...formData, kota: e.target.value })}
                placeholder="Kota"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Telepon *</label>
              <Input
                value={formData.telepon || ''}
                onChange={(e) => setFormData({ ...formData, telepon: e.target.value })}
                placeholder="No. telepon"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <Input
                type="email"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kontak Person *</label>
              <Input
                value={formData.kontakPerson || ''}
                onChange={(e) => setFormData({ ...formData, kontakPerson: e.target.value })}
                placeholder="Nama kontak person"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">NPWP</label>
              <Input
                value={formData.npwp || ''}
                onChange={(e) => setFormData({ ...formData, npwp: e.target.value })}
                placeholder="NPWP (opsional)"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="aktif">Aktif</option>
                <option value="nonaktif">Non-Aktif</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bank</label>
              <Input
                value={formData.bank || ''}
                onChange={(e) => setFormData({ ...formData, bank: e.target.value })}
                placeholder="Nama bank"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">No. Rekening</label>
              <Input
                value={formData.rekening || ''}
                onChange={(e) => setFormData({ ...formData, rekening: e.target.value })}
                placeholder="No. rekening"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Catatan</label>
              <textarea
                value={formData.catatan || ''}
                onChange={(e) => setFormData({ ...formData, catatan: e.target.value })}
                placeholder="Catatan tambahan (opsional)"
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                setShowFormModal(false);
                resetForm();
              }}
            >
              Batal
            </Button>
            <Button
              className="flex-1"
              onClick={handleSubmit}
              disabled={!formData.nama || !formData.alamat || !formData.telepon || !formData.kontakPerson}
            >
              {isEditing ? 'Simpan Perubahan' : 'Tambah Supplier'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Detail Modal */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedSupplier(null);
        }}
        title="Detail Supplier"
        size="md"
      >
        {selectedSupplier && (
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b">
              <div>
                <p className="font-mono text-teal-600">{selectedSupplier.kode}</p>
                <h3 className="text-xl font-bold">{selectedSupplier.nama}</h3>
              </div>
              <Badge variant={selectedSupplier.status === 'aktif' ? 'success' : 'danger'}>
                {selectedSupplier.status === 'aktif' ? 'Aktif' : 'Non-Aktif'}
              </Badge>
            </div>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="font-medium">{selectedSupplier.alamat}</p>
                  <p className="text-sm text-gray-500">{selectedSupplier.kota}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium">{selectedSupplier.telepon}</p>
                  <p className="text-sm text-gray-500">Kontak: {selectedSupplier.kontakPerson}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <p>{selectedSupplier.email}</p>
              </div>
            </div>

            {/* Additional Info */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              {selectedSupplier.npwp && (
                <div className="flex justify-between">
                  <span className="text-gray-500">NPWP</span>
                  <span className="font-mono">{selectedSupplier.npwp}</span>
                </div>
              )}
              {selectedSupplier.bank && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Bank</span>
                  <span>{selectedSupplier.bank}</span>
                </div>
              )}
              {selectedSupplier.rekening && (
                <div className="flex justify-between">
                  <span className="text-gray-500">No. Rekening</span>
                  <span className="font-mono">{selectedSupplier.rekening}</span>
                </div>
              )}
            </div>

            {/* Notes */}
            {selectedSupplier.catatan && (
              <div className="bg-yellow-50 p-3 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Catatan:</strong> {selectedSupplier.catatan}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setShowDetailModal(false);
                  handleEdit(selectedSupplier);
                }}
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowDetailModal(false)}
              >
                Tutup
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
