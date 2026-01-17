'use client';

import React, { useState } from 'react';
import { Package, TrendingUp, TrendingDown, Download, Filter, ArrowUpCircle, ArrowDownCircle, AlertTriangle, RotateCcw } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Button, Badge, DataTable } from '@/components/ui';
import { obatList, alatMedisList } from '@/data/dummy-data';
import { formatCurrency, formatDate } from '@/lib/utils';

interface StokMovement {
  id: string;
  tanggal: string;
  kodeItem: string;
  namaItem: string;
  tipe: 'obat' | 'alat';
  jenis: 'masuk' | 'keluar';
  kategori: 'pembelian' | 'resep' | 'pemakaian' | 'retur' | 'expired' | 'opname';
  jumlah: number;
  satuan: string;
  stokAwal: number;
  stokAkhir: number;
  keterangan?: string;
}

// Simulated stock movement data
const stokMovementData: StokMovement[] = [
  { id: 'SM001', tanggal: '2024-01-20', kodeItem: 'OBT001', namaItem: 'Paracetamol 500mg', tipe: 'obat', jenis: 'masuk', kategori: 'pembelian', jumlah: 500, satuan: 'tablet', stokAwal: 100, stokAkhir: 600, keterangan: 'PO-2024-001' },
  { id: 'SM002', tanggal: '2024-01-20', kodeItem: 'OBT001', namaItem: 'Paracetamol 500mg', tipe: 'obat', jenis: 'keluar', kategori: 'resep', jumlah: 20, satuan: 'tablet', stokAwal: 600, stokAkhir: 580, keterangan: 'Resep RSP-001' },
  { id: 'SM003', tanggal: '2024-01-21', kodeItem: 'OBT002', namaItem: 'Amoxicillin 500mg', tipe: 'obat', jenis: 'keluar', kategori: 'resep', jumlah: 30, satuan: 'kapsul', stokAwal: 200, stokAkhir: 170, keterangan: 'Resep RSP-002' },
  { id: 'SM004', tanggal: '2024-01-21', kodeItem: 'ALT002', namaItem: 'Masker Medis', tipe: 'alat', jenis: 'keluar', kategori: 'pemakaian', jumlah: 50, satuan: 'pcs', stokAwal: 500, stokAkhir: 450, keterangan: 'Pemakaian rutin' },
  { id: 'SM005', tanggal: '2024-01-22', kodeItem: 'OBT005', namaItem: 'Vitamin C 500mg', tipe: 'obat', jenis: 'masuk', kategori: 'pembelian', jumlah: 1000, satuan: 'tablet', stokAwal: 200, stokAkhir: 1200, keterangan: 'PO-2024-002' },
  { id: 'SM006', tanggal: '2024-01-22', kodeItem: 'OBT003', namaItem: 'Cetirizine 10mg', tipe: 'obat', jenis: 'keluar', kategori: 'expired', jumlah: 100, satuan: 'tablet', stokAwal: 300, stokAkhir: 200, keterangan: 'Batch CTZ-2023-001' },
  { id: 'SM007', tanggal: '2024-01-23', kodeItem: 'ALT001', namaItem: 'Syringe 3ml', tipe: 'alat', jenis: 'masuk', kategori: 'pembelian', jumlah: 200, satuan: 'pcs', stokAwal: 50, stokAkhir: 250, keterangan: 'PO-2024-003' },
  { id: 'SM008', tanggal: '2024-01-23', kodeItem: 'OBT007', namaItem: 'Amlodipine 5mg', tipe: 'obat', jenis: 'keluar', kategori: 'resep', jumlah: 15, satuan: 'tablet', stokAwal: 120, stokAkhir: 105, keterangan: 'Resep RSP-003' },
];

// Stock summary data
const stokSummary = [
  { id: 'SS001', kode: 'OBT001', nama: 'Paracetamol 500mg', tipe: 'obat', stokAwal: 100, masuk: 500, keluar: 150, stokAkhir: 450, satuan: 'tablet', nilaiStok: 360000 },
  { id: 'SS002', kode: 'OBT002', nama: 'Amoxicillin 500mg', tipe: 'obat', stokAwal: 200, masuk: 100, keluar: 130, stokAkhir: 170, satuan: 'kapsul', nilaiStok: 255000 },
  { id: 'SS003', kode: 'OBT003', nama: 'Cetirizine 10mg', tipe: 'obat', stokAwal: 300, masuk: 0, keluar: 150, stokAkhir: 150, satuan: 'tablet', nilaiStok: 120000 },
  { id: 'SS004', kode: 'OBT005', nama: 'Vitamin C 500mg', tipe: 'obat', stokAwal: 200, masuk: 1000, keluar: 400, stokAkhir: 800, satuan: 'tablet', nilaiStok: 400000 },
  { id: 'SS005', kode: 'ALT001', nama: 'Syringe 3ml', tipe: 'alat', stokAwal: 50, masuk: 200, keluar: 80, stokAkhir: 170, satuan: 'pcs', nilaiStok: 255000 },
  { id: 'SS006', kode: 'ALT002', nama: 'Masker Medis', tipe: 'alat', stokAwal: 500, masuk: 300, keluar: 350, stokAkhir: 450, satuan: 'pcs', nilaiStok: 1125000 },
];

export default function LaporanStokPage() {
  const [dateRange, setDateRange] = useState({
    start: '2024-01-01',
    end: '2024-01-31',
  });
  const [filterJenis, setFilterJenis] = useState<'all' | 'masuk' | 'keluar'>('all');
  const [filterTipe, setFilterTipe] = useState<'all' | 'obat' | 'alat'>('all');
  const [activeTab, setActiveTab] = useState<'movement' | 'summary'>('movement');

  // Filter movement data
  const filteredMovement = stokMovementData.filter(item => {
    const matchJenis = filterJenis === 'all' || item.jenis === filterJenis;
    const matchTipe = filterTipe === 'all' || item.tipe === filterTipe;
    return matchJenis && matchTipe;
  });

  // Calculate stats
  const totalMasuk = stokMovementData.filter(m => m.jenis === 'masuk').reduce((acc, m) => acc + m.jumlah, 0);
  const totalKeluar = stokMovementData.filter(m => m.jenis === 'keluar').reduce((acc, m) => acc + m.jumlah, 0);
  const totalNilaiStok = stokSummary.reduce((acc, s) => acc + s.nilaiStok, 0);
  const itemStokRendah = obatList.filter(o => o.stok <= o.minimumStok).length;

  const movementColumns = [
    {
      header: 'Tanggal',
      key: 'tanggal',
      render: (item: StokMovement) => formatDate(item.tanggal),
    },
    {
      header: 'Kode',
      key: 'kodeItem',
      render: (item: StokMovement) => (
        <span className="font-mono text-teal-600">{item.kodeItem}</span>
      ),
    },
    {
      header: 'Nama Item',
      key: 'namaItem',
      render: (item: StokMovement) => (
        <div>
          <p className="font-medium">{item.namaItem}</p>
          <Badge variant={item.tipe === 'obat' ? 'info' : 'default'} className="text-xs mt-1">
            {item.tipe === 'obat' ? 'Obat' : 'Alat Medis'}
          </Badge>
        </div>
      ),
    },
    {
      header: 'Jenis',
      key: 'jenis',
      render: (item: StokMovement) => (
        <div className={`flex items-center gap-1 font-medium ${item.jenis === 'masuk' ? 'text-green-600' : 'text-red-600'}`}>
          {item.jenis === 'masuk' ? (
            <ArrowUpCircle className="w-4 h-4" />
          ) : (
            <ArrowDownCircle className="w-4 h-4" />
          )}
          {item.jenis === 'masuk' ? 'Masuk' : 'Keluar'}
        </div>
      ),
    },
    {
      header: 'Kategori',
      key: 'kategori',
      render: (item: StokMovement) => {
        const variantMap: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple'> = {
          pembelian: 'success',
          resep: 'info',
          pemakaian: 'default',
          retur: 'warning',
          expired: 'danger',
          opname: 'default',
        };
        return <Badge variant={variantMap[item.kategori] || 'default'}>{item.kategori}</Badge>;
      },
    },
    {
      header: 'Jumlah',
      key: 'jumlah',
      render: (item: StokMovement) => (
        <span className={`font-semibold ${item.jenis === 'masuk' ? 'text-green-600' : 'text-red-600'}`}>
          {item.jenis === 'masuk' ? '+' : '-'}{item.jumlah} {item.satuan}
        </span>
      ),
    },
    {
      header: 'Stok',
      key: 'stokAkhir',
      render: (item: StokMovement) => (
        <span className="text-gray-600">{item.stokAwal} → {item.stokAkhir}</span>
      ),
    },
  ];

  const summaryColumns = [
    {
      header: 'Kode',
      key: 'kode',
      render: (item: any) => (
        <span className="font-mono text-teal-600">{item.kode}</span>
      ),
    },
    {
      header: 'Nama Item',
      key: 'nama',
      render: (item: any) => (
        <div>
          <p className="font-medium">{item.nama}</p>
          <Badge variant={item.tipe === 'obat' ? 'info' : 'default'} className="text-xs mt-1">
            {item.tipe === 'obat' ? 'Obat' : 'Alat Medis'}
          </Badge>
        </div>
      ),
    },
    {
      header: 'Stok Awal',
      key: 'stokAwal',
      render: (item: any) => `${item.stokAwal} ${item.satuan}`,
    },
    {
      header: 'Masuk',
      key: 'masuk',
      render: (item: any) => (
        <span className="text-green-600 font-medium">+{item.masuk}</span>
      ),
    },
    {
      header: 'Keluar',
      key: 'keluar',
      render: (item: any) => (
        <span className="text-red-600 font-medium">-{item.keluar}</span>
      ),
    },
    {
      header: 'Stok Akhir',
      key: 'stokAkhir',
      render: (item: any) => (
        <span className="font-semibold">{item.stokAkhir} {item.satuan}</span>
      ),
    },
    {
      header: 'Nilai Stok',
      key: 'nilaiStok',
      render: (item: any) => (
        <span className="font-medium text-teal-600">{formatCurrency(item.nilaiStok)}</span>
      ),
    },
  ];

  return (
    <div className="space-y-6" suppressHydrationWarning>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Laporan Stok</h1>
          <p className="text-gray-500">Analisis pergerakan dan nilai stok</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export Excel
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Date Filter */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Periode</label>
              <div className="flex gap-2 items-center">
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <span className="text-gray-500">s/d</span>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
            <select
              value={filterTipe}
              onChange={(e) => setFilterTipe(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="all">Semua Tipe</option>
              <option value="obat">Obat</option>
              <option value="alat">Alat Medis</option>
            </select>
            <select
              value={filterJenis}
              onChange={(e) => setFilterJenis(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="all">Semua Pergerakan</option>
              <option value="masuk">Masuk</option>
              <option value="keluar">Keluar</option>
            </select>
            <Button className="gap-2">
              <Filter className="w-4 h-4" />
              Terapkan
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-teal-500 to-teal-600 text-white">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold">{formatCurrency(totalNilaiStok)}</p>
              <p className="text-sm opacity-80">Nilai Total Stok</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 border-l-4 border-l-green-500">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">+{totalMasuk}</p>
              <p className="text-sm text-gray-500">Total Masuk</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 border-l-4 border-l-red-500">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">-{totalKeluar}</p>
              <p className="text-sm text-gray-500">Total Keluar</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 border-l-4 border-l-yellow-500">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-600">{itemStokRendah}</p>
              <p className="text-sm text-gray-500">Stok Rendah</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b">
        <button
          onClick={() => setActiveTab('movement')}
          className={`pb-3 px-4 font-medium transition-colors ${
            activeTab === 'movement'
              ? 'text-teal-600 border-b-2 border-teal-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Pergerakan Stok
        </button>
        <button
          onClick={() => setActiveTab('summary')}
          className={`pb-3 px-4 font-medium transition-colors ${
            activeTab === 'summary'
              ? 'text-teal-600 border-b-2 border-teal-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Ringkasan Stok
        </button>
      </div>

      {/* Movement or Summary Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              {activeTab === 'movement' ? 'Riwayat Pergerakan Stok' : 'Ringkasan Stok Periode'}
            </CardTitle>
            <span className="text-sm text-gray-500">
              {activeTab === 'movement' ? filteredMovement.length : stokSummary.length} item
            </span>
          </div>
        </CardHeader>
        <CardContent>
          {activeTab === 'movement' ? (
            <DataTable
              columns={movementColumns}
              data={filteredMovement}
              emptyMessage="Tidak ada data pergerakan stok"
            />
          ) : (
            <DataTable
              columns={summaryColumns}
              data={stokSummary}
              emptyMessage="Tidak ada data ringkasan stok"
            />
          )}
        </CardContent>
      </Card>

      {/* Quick Stats by Category */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Kategori Pergerakan Masuk</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { kategori: 'Pembelian', jumlah: 1700, persentase: 85 },
                { kategori: 'Retur', jumlah: 200, persentase: 10 },
                { kategori: 'Opname+', jumlah: 100, persentase: 5 },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-24 text-sm font-medium">{item.kategori}</div>
                  <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 rounded-full"
                      style={{ width: `${item.persentase}%` }}
                    />
                  </div>
                  <span className="w-16 text-sm font-semibold text-right text-green-600">+{item.jumlah}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Kategori Pergerakan Keluar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { kategori: 'Resep', jumlah: 800, persentase: 60 },
                { kategori: 'Pemakaian', jumlah: 350, persentase: 26 },
                { kategori: 'Kadaluarsa', jumlah: 150, persentase: 11 },
                { kategori: 'Opname-', jumlah: 40, persentase: 3 },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-24 text-sm font-medium">{item.kategori}</div>
                  <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-red-500 rounded-full"
                      style={{ width: `${item.persentase}%` }}
                    />
                  </div>
                  <span className="w-16 text-sm font-semibold text-right text-red-600">-{item.jumlah}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary Card */}
      <Card className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <CardContent className="py-8">
          <div className="text-center mb-6">
            <RotateCcw className="w-12 h-12 mx-auto mb-3 opacity-80" />
            <h3 className="text-xl font-semibold mb-2">Ringkasan Pergerakan Stok</h3>
            <p className="opacity-80">Periode: {formatDate(dateRange.start)} - {formatDate(dateRange.end)}</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold">{formatCurrency(totalNilaiStok)}</p>
              <p className="text-sm opacity-80 mt-1">Nilai Stok Akhir</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-300">+{totalMasuk}</p>
              <p className="text-sm opacity-80 mt-1">Total Masuk</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-red-300">-{totalKeluar}</p>
              <p className="text-sm opacity-80 mt-1">Total Keluar</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">{totalMasuk - totalKeluar}</p>
              <p className="text-sm opacity-80 mt-1">Selisih Bersih</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
