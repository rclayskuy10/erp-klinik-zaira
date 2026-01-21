'use client';

import React, { useState } from 'react';
import { Search, FileText, Package, Minus, Calendar, Eye } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Button, Input, Badge, DataTable, Modal } from '@/components/ui';
import { obatList, alatMedisList, getPasienById, getDokterById } from '@/data/dummy-data';
import { formatCurrency, formatDate } from '@/lib/utils';

interface StokKeluarItem {
  id: string;
  itemId: string;
  itemType: 'obat' | 'alat';
  nama: string;
  jumlah: number;
  harga: number;
  subtotal: number;
}

interface StokKeluar {
  id: string;
  noTransaksi: string;
  tanggal: string;
  tipe: 'resep' | 'pemakaian' | 'retur' | 'expired';
  referensi?: string;
  pasienId?: string;
  dokterId?: string;
  items: StokKeluarItem[];
  total: number;
  catatan?: string;
}

// Dummy data stok keluar
const dummyStokKeluar: StokKeluar[] = [
  {
    id: 'SK001',
    noTransaksi: 'OUT-2024-001',
    tanggal: '2024-01-20',
    tipe: 'resep',
    referensi: 'RSP-2024-001',
    pasienId: 'PAS001',
    dokterId: 'DOK001',
    items: [
      { id: '1', itemId: 'OBT001', itemType: 'obat', nama: 'Paracetamol 500mg', jumlah: 10, harga: 1500, subtotal: 15000 },
      { id: '2', itemId: 'OBT005', itemType: 'obat', nama: 'Vitamin C 500mg', jumlah: 30, harga: 1000, subtotal: 30000 },
    ],
    total: 45000,
  },
  {
    id: 'SK002',
    noTransaksi: 'OUT-2024-002',
    tanggal: '2024-01-21',
    tipe: 'pemakaian',
    items: [
      { id: '1', itemId: 'ALT002', itemType: 'alat', nama: 'Masker Medis', jumlah: 20, harga: 2500, subtotal: 50000 },
      { id: '2', itemId: 'ALT001', itemType: 'alat', nama: 'Syringe 3ml', jumlah: 10, harga: 1500, subtotal: 15000 },
    ],
    total: 65000,
    catatan: 'Pemakaian untuk ruang tindakan',
  },
  {
    id: 'SK003',
    noTransaksi: 'OUT-2024-003',
    tanggal: '2024-01-22',
    tipe: 'resep',
    referensi: 'RSP-2024-002',
    pasienId: 'PAS002',
    dokterId: 'DOK002',
    items: [
      { id: '1', itemId: 'OBT002', itemType: 'obat', nama: 'Amoxicillin 500mg', jumlah: 15, harga: 2500, subtotal: 37500 },
      { id: '2', itemId: 'OBT004', itemType: 'obat', nama: 'Omeprazole 20mg', jumlah: 14, harga: 2000, subtotal: 28000 },
    ],
    total: 65500,
  },
  {
    id: 'SK004',
    noTransaksi: 'OUT-2024-004',
    tanggal: '2024-01-23',
    tipe: 'expired',
    items: [
      { id: '1', itemId: 'OBT003', itemType: 'obat', nama: 'Cetirizine 10mg', jumlah: 50, harga: 800, subtotal: 40000 },
    ],
    total: 40000,
    catatan: 'Obat kadaluarsa batch CTZ-2023-005',
  },
];

export default function StokKeluarPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTipe, setFilterTipe] = useState('');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<StokKeluar | null>(null);

  const filteredRecords = dummyStokKeluar.filter(record => {
    const matchSearch = record.noTransaksi.toLowerCase().includes(searchQuery.toLowerCase());
    const matchTipe = filterTipe ? record.tipe === filterTipe : true;
    return matchSearch && matchTipe;
  });

  const getTipeBadge = (tipe: string) => {
    switch (tipe) {
      case 'resep':
        return <Badge variant="info">Resep</Badge>;
      case 'pemakaian':
        return <Badge variant="default">Pemakaian</Badge>;
      case 'retur':
        return <Badge variant="warning">Retur</Badge>;
      case 'expired':
        return <Badge variant="danger">Kadaluarsa</Badge>;
      default:
        return <Badge>{tipe}</Badge>;
    }
  };

  const columns = [
    {
      header: 'No. Transaksi',
      key: 'noTransaksi',
      render: (item: StokKeluar) => (
        <span className="font-mono text-teal-600 font-medium">{item.noTransaksi}</span>
      ),
    },
    {
      header: 'Tanggal',
      key: 'tanggal',
      render: (item: StokKeluar) => formatDate(item.tanggal),
    },
    {
      header: 'Tipe',
      key: 'tipe',
      render: (item: StokKeluar) => getTipeBadge(item.tipe),
    },
    {
      header: 'Pasien/Referensi',
      key: 'pasienId',
      render: (item: StokKeluar) => {
        if (item.pasienId) {
          const pasien = getPasienById(item.pasienId);
          return (
            <div>
              <p className="font-medium">{pasien?.nama}</p>
              <p className="text-xs text-gray-500">{item.referensi}</p>
            </div>
          );
        }
        return <span className="text-gray-500">{item.catatan || '-'}</span>;
      },
    },
    {
      header: 'Jumlah Item',
      key: 'items',
      render: (item: StokKeluar) => `${item.items.length} item`,
    },
    {
      header: 'Total Nilai',
      key: 'total',
      render: (item: StokKeluar) => (
        <span className="font-semibold">{formatCurrency(item.total)}</span>
      ),
    },
    {
      header: 'Aksi',
      key: 'id',
      render: (item: StokKeluar) => (
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
          <Eye className="w-4 h-4" />
        </Button>
      ),
    },
  ];

  // Calculate stats
  const totalResep = dummyStokKeluar.filter(s => s.tipe === 'resep').length;
  const totalPemakaian = dummyStokKeluar.filter(s => s.tipe === 'pemakaian').length;
  const totalExpired = dummyStokKeluar.filter(s => s.tipe === 'expired').length;
  const totalNilai = dummyStokKeluar.reduce((acc, s) => acc + s.total, 0);

  return (
    <div className="space-y-6" suppressHydrationWarning>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Stok Keluar</h1>
          <p className="text-gray-500">Riwayat pengeluaran stok obat dan alat medis</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalResep}</p>
              <p className="text-sm text-gray-500">Resep</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalPemakaian}</p>
              <p className="text-sm text-gray-500">Pemakaian</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <Minus className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalExpired}</p>
              <p className="text-sm text-gray-500">Kadaluarsa</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <p className="text-xl font-bold text-teal-600">{formatCurrency(totalNilai)}</p>
            <p className="text-sm text-gray-500">Total Nilai Keluar</p>
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
                placeholder="Cari no. transaksi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={filterTipe}
              onChange={(e) => setFilterTipe(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="">Semua Tipe</option>
              <option value="resep">Resep</option>
              <option value="pemakaian">Pemakaian</option>
              <option value="retur">Retur</option>
              <option value="expired">Kadaluarsa</option>
            </select>
            <input
              type="date"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Riwayat Stok Keluar</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={filteredRecords}
            emptyMessage="Tidak ada data stok keluar"
          />
        </CardContent>
      </Card>

      {/* Detail Modal */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedRecord(null);
        }}
        title="Detail Stok Keluar"
        size="lg"
      >
        {selectedRecord && (
          <div className="space-y-4">
            {/* Header Info */}
            <div className="grid grid-cols-2 gap-4 pb-4 border-b">
              <div>
                <p className="text-sm text-gray-500">No. Transaksi</p>
                <p className="font-mono font-bold text-teal-600">{selectedRecord.noTransaksi}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Tanggal</p>
                <p className="font-medium">{formatDate(selectedRecord.tanggal)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Tipe</p>
                {getTipeBadge(selectedRecord.tipe)}
              </div>
              {selectedRecord.referensi && (
                <div>
                  <p className="text-sm text-gray-500">No. Referensi</p>
                  <p className="font-mono">{selectedRecord.referensi}</p>
                </div>
              )}
            </div>

            {/* Patient Info (if resep) */}
            {selectedRecord.pasienId && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-blue-600">Pasien</p>
                    <p className="font-medium">{getPasienById(selectedRecord.pasienId)?.nama}</p>
                    <p className="text-xs text-gray-500">{getPasienById(selectedRecord.pasienId)?.noRM}</p>
                  </div>
                  {selectedRecord.dokterId && (
                    <div>
                      <p className="text-sm text-blue-600">Dokter</p>
                      <p className="font-medium">{getDokterById(selectedRecord.dokterId)?.nama}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Items */}
            <div>
              <h4 className="font-medium mb-3">Daftar Item</h4>
              <div className="bg-gray-50 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="text-left py-2 px-3">Item</th>
                      <th className="text-center py-2 px-3">Tipe</th>
                      <th className="text-center py-2 px-3">Jumlah</th>
                      <th className="text-right py-2 px-3">Harga</th>
                      <th className="text-right py-2 px-3">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {selectedRecord.items.map((item, idx) => (
                      <tr key={idx}>
                        <td className="py-2 px-3 font-medium">{item.nama}</td>
                        <td className="py-2 px-3 text-center">
                          <Badge variant={item.itemType === 'obat' ? 'info' : 'default'}>
                            {item.itemType === 'obat' ? 'Obat' : 'Alat'}
                          </Badge>
                        </td>
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

            {/* Notes */}
            {selectedRecord.catatan && (
              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="text-sm text-yellow-700 font-medium">Catatan:</p>
                <p className="text-gray-700">{selectedRecord.catatan}</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
