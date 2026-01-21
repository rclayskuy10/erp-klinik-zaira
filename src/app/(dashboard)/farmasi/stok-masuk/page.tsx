'use client';

import React, { useState } from 'react';
import { Plus, Search, Save, X, Package, Truck, Calendar } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Button, Input, Badge, DataTable, Modal } from '@/components/ui';
import { obatList, alatMedisList } from '@/data/dummy-data';
import { formatCurrency, formatDate, generateId } from '@/lib/utils';

interface StokMasukItem {
  id: string;
  itemId: string;
  itemType: 'obat' | 'alat';
  nama: string;
  jumlah: number;
  harga: number;
  subtotal: number;
  noBatch?: string;
  tanggalKadaluarsa?: string;
}

interface StokMasuk {
  id: string;
  noFaktur: string;
  tanggal: string;
  supplier: string;
  items: StokMasukItem[];
  total: number;
  status: 'draft' | 'selesai';
  catatan?: string;
}

// Dummy data stok masuk
const dummyStokMasuk: StokMasuk[] = [
  {
    id: 'SM001',
    noFaktur: 'FAK-2024-001',
    tanggal: '2024-01-15',
    supplier: 'PT. Kimia Farma',
    items: [
      { id: '1', itemId: 'OBT001', itemType: 'obat', nama: 'Paracetamol 500mg', jumlah: 100, harga: 800, subtotal: 80000, noBatch: 'PCM-2024-001', tanggalKadaluarsa: '2026-01-15' },
      { id: '2', itemId: 'OBT002', itemType: 'obat', nama: 'Amoxicillin 500mg', jumlah: 50, harga: 1500, subtotal: 75000, noBatch: 'AMX-2024-001', tanggalKadaluarsa: '2025-06-20' },
    ],
    total: 155000,
    status: 'selesai',
  },
  {
    id: 'SM002',
    noFaktur: 'FAK-2024-002',
    tanggal: '2024-01-18',
    supplier: 'PT. Enseval',
    items: [
      { id: '1', itemId: 'OBT005', itemType: 'obat', nama: 'Vitamin C 500mg', jumlah: 200, harga: 500, subtotal: 100000, noBatch: 'VTC-2024-001', tanggalKadaluarsa: '2025-12-31' },
    ],
    total: 100000,
    status: 'selesai',
  },
];

export default function StokMasukPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<StokMasuk | null>(null);
  const [stokMasukList, setStokMasukList] = useState<StokMasuk[]>(dummyStokMasuk);
  
  // Form state
  const [formData, setFormData] = useState({
    noFaktur: '',
    tanggal: new Date().toISOString().split('T')[0],
    supplier: '',
    catatan: '',
  });
  const [selectedItems, setSelectedItems] = useState<StokMasukItem[]>([]);
  const [showItemPicker, setShowItemPicker] = useState(false);
  const [itemSearch, setItemSearch] = useState('');

  const filteredRecords = stokMasukList.filter(record => 
    record.noFaktur.toLowerCase().includes(searchQuery.toLowerCase()) ||
    record.supplier.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const allItems = [
    ...obatList.map(o => ({ ...o, type: 'obat' as const })),
    ...alatMedisList.map(a => ({ ...a, type: 'alat' as const, hargaBeli: a.harga })),
  ];

  const filteredItems = allItems.filter(item =>
    item.nama.toLowerCase().includes(itemSearch.toLowerCase()) ||
    item.kode.toLowerCase().includes(itemSearch.toLowerCase())
  );

  const handleAddItem = (item: typeof allItems[0]) => {
    const newItem: StokMasukItem = {
      id: generateId('ITM'),
      itemId: item.id,
      itemType: item.type,
      nama: item.nama,
      jumlah: 1,
      harga: item.hargaBeli,
      subtotal: item.hargaBeli,
      noBatch: '',
      tanggalKadaluarsa: '',
    };
    setSelectedItems([...selectedItems, newItem]);
    setShowItemPicker(false);
    setItemSearch('');
  };

  const handleUpdateItem = (id: string, field: keyof StokMasukItem, value: any) => {
    setSelectedItems(items =>
      items.map(item => {
        if (item.id === id) {
          const updated = { ...item, [field]: value };
          if (field === 'jumlah' || field === 'harga') {
            updated.subtotal = updated.jumlah * updated.harga;
          }
          return updated;
        }
        return item;
      })
    );
  };

  const handleRemoveItem = (id: string) => {
    setSelectedItems(items => items.filter(item => item.id !== id));
  };

  const calculateTotal = () => {
    return selectedItems.reduce((acc, item) => acc + item.subtotal, 0);
  };

  const handleSubmit = () => {
    // Validasi
    if (!formData.noFaktur || !formData.supplier || selectedItems.length === 0) {
      alert('Mohon lengkapi semua field dan tambahkan minimal 1 item!');
      return;
    }

    // Buat data stok masuk baru
    const newStokMasuk: StokMasuk = {
      id: generateId('SM'),
      noFaktur: formData.noFaktur,
      tanggal: formData.tanggal,
      supplier: formData.supplier,
      items: selectedItems,
      total: calculateTotal(),
      status: 'selesai',
      catatan: formData.catatan,
    };

    // Tambahkan ke list
    setStokMasukList([newStokMasuk, ...stokMasukList]);
    
    // Update stok obat/alat (dalam implementasi real, ini akan ke API)
    selectedItems.forEach(item => {
      if (item.itemType === 'obat') {
        const obat = obatList.find(o => o.id === item.itemId);
        if (obat) {
          obat.stok += item.jumlah;
        }
      } else {
        const alat = alatMedisList.find(a => a.id === item.itemId);
        if (alat) {
          alat.stok += item.jumlah;
        }
      }
    });

    alert('Data stok masuk berhasil disimpan!');
    setShowFormModal(false);
    setFormData({
      noFaktur: '',
      tanggal: new Date().toISOString().split('T')[0],
      supplier: '',
      catatan: '',
    });
    setSelectedItems([]);
  };

  const columns = [
    {
      header: 'No. Faktur',
      key: 'noFaktur',
      render: (item: StokMasuk) => (
        <span className="font-mono text-teal-600 font-medium">{item.noFaktur}</span>
      ),
    },
    {
      header: 'Tanggal',
      key: 'tanggal',
      render: (item: StokMasuk) => formatDate(item.tanggal),
    },
    {
      header: 'Supplier',
      key: 'supplier',
      render: (item: StokMasuk) => item.supplier,
    },
    {
      header: 'Jumlah Item',
      key: 'items',
      render: (item: StokMasuk) => `${item.items.length} item`,
    },
    {
      header: 'Total',
      key: 'total',
      render: (item: StokMasuk) => (
        <span className="font-semibold">{formatCurrency(item.total)}</span>
      ),
    },
    {
      header: 'Status',
      key: 'status',
      render: (item: StokMasuk) => (
        <Badge variant={item.status === 'selesai' ? 'success' : 'warning'}>
          {item.status === 'selesai' ? 'Selesai' : 'Draft'}
        </Badge>
      ),
    },
    {
      header: 'Aksi',
      key: 'id',
      render: (item: StokMasuk) => (
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => {
            setSelectedRecord(item);
            setShowDetailModal(true);
          }}
          suppressHydrationWarning
        >
          Detail
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6" suppressHydrationWarning>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Stok Masuk</h1>
          <p className="text-gray-500">Kelola penerimaan stok dari supplier</p>
        </div>
        <Button type="button" onClick={() => setShowFormModal(true)} className="gap-2" suppressHydrationWarning>
          <Plus className="w-5 h-5" />
          Tambah Stok Masuk
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-teal-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stokMasukList.length}</p>
              <p className="text-sm text-gray-500">Total Transaksi</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Truck className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {stokMasukList.filter(s => s.status === 'selesai').length}
              </p>
              <p className="text-sm text-gray-500">Selesai</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stokMasukList.length}</p>
              <p className="text-sm text-gray-500">Bulan Ini</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <p className="text-xl font-bold text-teal-600">
              {formatCurrency(stokMasukList.reduce((acc, s) => acc + s.total, 0))}
            </p>
            <p className="text-sm text-gray-500">Total Nilai</p>
          </div>
        </Card>
      </div>

      {/* Search & Filter */}
      <Card>
        <CardContent className="py-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Cari no. faktur atau supplier..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Riwayat Stok Masuk</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={filteredRecords}
            emptyMessage="Tidak ada data stok masuk"
          />
        </CardContent>
      </Card>

      {/* Form Modal */}
      <Modal
        isOpen={showFormModal}
        onClose={() => {
          setShowFormModal(false);
          setSelectedItems([]);
        }}
        title="Tambah Stok Masuk"
        size="xl"
      >
        <div className="space-y-6">
          {/* Form Header */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">No. Faktur *</label>
              <Input
                value={formData.noFaktur}
                onChange={(e) => setFormData({ ...formData, noFaktur: e.target.value })}
                placeholder="Masukkan no. faktur"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal *</label>
              <Input
                type="date"
                value={formData.tanggal}
                onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Supplier *</label>
              <select
                value={formData.supplier}
                onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="">Pilih Supplier</option>
                <option value="PT. Kimia Farma">PT. Kimia Farma</option>
                <option value="PT. Enseval">PT. Enseval</option>
                <option value="PT. Anugrah">PT. Anugrah Pharma</option>
                <option value="PT. Kalbe Farma">PT. Kalbe Farma</option>
              </select>
            </div>
          </div>

          {/* Items */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-gray-700">Item Obat/Alat</label>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowItemPicker(true)}
                className="gap-1"
              >
                <Plus className="w-4 h-4" />
                Tambah Item
              </Button>
            </div>

            {/* Item Picker Dropdown */}
            {showItemPicker && (
              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <Input
                  placeholder="Cari obat atau alat medis..."
                  value={itemSearch}
                  onChange={(e) => setItemSearch(e.target.value)}
                  className="mb-3"
                />
                <div className="max-h-48 overflow-y-auto space-y-2">
                  {filteredItems.slice(0, 10).map(item => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleAddItem(item)}
                      className="w-full p-3 text-left bg-white border rounded-lg hover:bg-teal-50 transition-colors"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{item.nama}</p>
                          <p className="text-xs text-gray-500">{item.kode} • {item.type === 'obat' ? 'Obat' : 'Alat Medis'}</p>
                        </div>
                        <span className="text-teal-600">{formatCurrency(item.hargaBeli)}</span>
                      </div>
                    </button>
                  ))}
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setShowItemPicker(false);
                    setItemSearch('');
                  }}
                  className="mt-3"
                >
                  Tutup
                </Button>
              </div>
            )}

            {/* Selected Items Table */}
            {selectedItems.length > 0 ? (
              <div className="bg-gray-50 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="text-left py-2 px-3">Item</th>
                      <th className="text-center py-2 px-3 w-20">Qty</th>
                      <th className="text-right py-2 px-3 w-28">Harga</th>
                      <th className="text-left py-2 px-3 w-32">No. Batch</th>
                      <th className="text-left py-2 px-3 w-32">Exp Date</th>
                      <th className="text-right py-2 px-3 w-28">Subtotal</th>
                      <th className="w-10"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {selectedItems.map(item => (
                      <tr key={item.id}>
                        <td className="py-2 px-3">
                          <p className="font-medium">{item.nama}</p>
                          <Badge variant={item.itemType === 'obat' ? 'info' : 'default'} className="text-xs">
                            {item.itemType === 'obat' ? 'Obat' : 'Alat'}
                          </Badge>
                        </td>
                        <td className="py-2 px-3">
                          <Input
                            type="number"
                            value={item.jumlah}
                            onChange={(e) => handleUpdateItem(item.id, 'jumlah', parseInt(e.target.value) || 0)}
                            className="text-center"
                            min={1}
                          />
                        </td>
                        <td className="py-2 px-3">
                          <Input
                            type="number"
                            value={item.harga}
                            onChange={(e) => handleUpdateItem(item.id, 'harga', parseInt(e.target.value) || 0)}
                            className="text-right"
                          />
                        </td>
                        <td className="py-2 px-3">
                          {item.itemType === 'obat' && (
                            <Input
                              value={item.noBatch || ''}
                              onChange={(e) => handleUpdateItem(item.id, 'noBatch', e.target.value)}
                              placeholder="Batch"
                            />
                          )}
                        </td>
                        <td className="py-2 px-3">
                          {item.itemType === 'obat' && (
                            <Input
                              type="date"
                              value={item.tanggalKadaluarsa || ''}
                              onChange={(e) => handleUpdateItem(item.id, 'tanggalKadaluarsa', e.target.value)}
                            />
                          )}
                        </td>
                        <td className="py-2 px-3 text-right font-medium">
                          {formatCurrency(item.subtotal)}
                        </td>
                        <td className="py-2 px-3">
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(item.id)}
                            className="p-1 text-red-500 hover:bg-red-50 rounded"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-teal-50">
                    <tr>
                      <td colSpan={5} className="py-3 px-3 text-right font-bold">Total</td>
                      <td className="py-3 px-3 text-right font-bold text-teal-600">
                        {formatCurrency(calculateTotal())}
                      </td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg text-gray-500">
                Belum ada item ditambahkan
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Catatan</label>
            <textarea
              value={formData.catatan}
              onChange={(e) => setFormData({ ...formData, catatan: e.target.value })}
              placeholder="Catatan tambahan (opsional)"
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                setShowFormModal(false);
                setSelectedItems([]);
              }}
            >
              Batal
            </Button>
            <Button
              className="flex-1 gap-2"
              onClick={handleSubmit}
              disabled={!formData.noFaktur || !formData.supplier || selectedItems.length === 0}
            >
              <Save className="w-4 h-4" />
              Simpan
            </Button>
          </div>
        </div>
      </Modal>

      {/* Detail Modal */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedRecord(null);
        }}
        title="Detail Stok Masuk"
        size="lg"
      >
        {selectedRecord && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 pb-4 border-b">
              <div>
                <p className="text-sm text-gray-500">No. Faktur</p>
                <p className="font-mono font-bold text-teal-600">{selectedRecord.noFaktur}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Tanggal</p>
                <p className="font-medium">{formatDate(selectedRecord.tanggal)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Supplier</p>
                <p className="font-medium">{selectedRecord.supplier}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <Badge variant={selectedRecord.status === 'selesai' ? 'success' : 'warning'}>
                  {selectedRecord.status === 'selesai' ? 'Selesai' : 'Draft'}
                </Badge>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">Daftar Item</h4>
              <div className="bg-gray-50 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="text-left py-2 px-3">Item</th>
                      <th className="text-left py-2 px-3">Batch</th>
                      <th className="text-center py-2 px-3">Qty</th>
                      <th className="text-right py-2 px-3">Harga</th>
                      <th className="text-right py-2 px-3">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {selectedRecord.items.map((item, idx) => (
                      <tr key={idx}>
                        <td className="py-2 px-3">{item.nama}</td>
                        <td className="py-2 px-3 font-mono text-xs">{item.noBatch || '-'}</td>
                        <td className="py-2 px-3 text-center">{item.jumlah}</td>
                        <td className="py-2 px-3 text-right">{formatCurrency(item.harga)}</td>
                        <td className="py-2 px-3 text-right font-medium">{formatCurrency(item.subtotal)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-teal-50">
                    <tr>
                      <td colSpan={4} className="py-3 px-3 text-right font-bold">Total</td>
                      <td className="py-3 px-3 text-right font-bold text-teal-600">
                        {formatCurrency(selectedRecord.total)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
