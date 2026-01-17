'use client';

import React, { useState } from 'react';
import { Pill, TrendingUp, Download, Filter, Package, ShoppingCart, AlertTriangle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Button, Badge, DataTable } from '@/components/ui';
import { obatList } from '@/data/dummy-data';
import { formatCurrency, formatDate } from '@/lib/utils';

interface ObatSales {
  id: string;
  kode: string;
  nama: string;
  kategori: string;
  terjual: number;
  satuan: string;
  hargaJual: number;
  pendapatan: number;
  stokAwal: number;
  stokAkhir: number;
}

// Simulated sales data
const obatSalesData: ObatSales[] = [
  { id: '1', kode: 'OBT001', nama: 'Paracetamol 500mg', kategori: 'analgesik', terjual: 250, satuan: 'tablet', hargaJual: 1500, pendapatan: 375000, stokAwal: 500, stokAkhir: 250 },
  { id: '2', kode: 'OBT002', nama: 'Amoxicillin 500mg', kategori: 'antibiotik', terjual: 180, satuan: 'kapsul', hargaJual: 2500, pendapatan: 450000, stokAwal: 350, stokAkhir: 170 },
  { id: '3', kode: 'OBT003', nama: 'Cetirizine 10mg', kategori: 'antihistamin', terjual: 120, satuan: 'tablet', hargaJual: 1200, pendapatan: 144000, stokAwal: 200, stokAkhir: 80 },
  { id: '4', kode: 'OBT004', nama: 'Omeprazole 20mg', kategori: 'antasida', terjual: 100, satuan: 'kapsul', hargaJual: 3000, pendapatan: 300000, stokAwal: 150, stokAkhir: 50 },
  { id: '5', kode: 'OBT005', nama: 'Vitamin C 500mg', kategori: 'vitamin', terjual: 300, satuan: 'tablet', hargaJual: 1000, pendapatan: 300000, stokAwal: 600, stokAkhir: 300 },
  { id: '6', kode: 'OBT006', nama: 'Metformin 500mg', kategori: 'antidiabetes', terjual: 90, satuan: 'tablet', hargaJual: 1500, pendapatan: 135000, stokAwal: 200, stokAkhir: 110 },
  { id: '7', kode: 'OBT007', nama: 'Amlodipine 5mg', kategori: 'antihipertensi', terjual: 80, satuan: 'tablet', hargaJual: 2000, pendapatan: 160000, stokAwal: 150, stokAkhir: 70 },
  { id: '8', kode: 'OBT008', nama: 'Ibuprofen 400mg', kategori: 'antiinflamasi', terjual: 150, satuan: 'tablet', hargaJual: 1800, pendapatan: 270000, stokAwal: 300, stokAkhir: 150 },
];

export default function LaporanObatPage() {
  const [dateRange, setDateRange] = useState({
    start: '2024-01-01',
    end: '2024-01-31',
  });
  const [filterKategori, setFilterKategori] = useState('');
  const [sortBy, setSortBy] = useState<'terjual' | 'pendapatan'>('terjual');

  // Filter and sort
  const filteredData = obatSalesData
    .filter(obat => filterKategori ? obat.kategori === filterKategori : true)
    .sort((a, b) => sortBy === 'terjual' ? b.terjual - a.terjual : b.pendapatan - a.pendapatan);

  // Calculate stats
  const totalPendapatan = obatSalesData.reduce((acc, o) => acc + o.pendapatan, 0);
  const totalTerjual = obatSalesData.reduce((acc, o) => acc + o.terjual, 0);
  const topObat = obatSalesData.reduce((a, b) => a.terjual > b.terjual ? a : b);

  // Group by kategori
  const salesByKategori = obatSalesData.reduce((acc, obat) => {
    if (!acc[obat.kategori]) acc[obat.kategori] = { terjual: 0, pendapatan: 0 };
    acc[obat.kategori].terjual += obat.terjual;
    acc[obat.kategori].pendapatan += obat.pendapatan;
    return acc;
  }, {} as Record<string, { terjual: number; pendapatan: number }>);

  const kategoriColors: Record<string, string> = {
    analgesik: 'bg-red-500',
    antibiotik: 'bg-blue-500',
    antihistamin: 'bg-purple-500',
    antasida: 'bg-yellow-500',
    vitamin: 'bg-green-500',
    antidiabetes: 'bg-pink-500',
    antihipertensi: 'bg-indigo-500',
    antiinflamasi: 'bg-orange-500',
  };

  const columns = [
    {
      header: 'Kode',
      key: 'kode',
      render: (item: ObatSales) => (
        <span className="font-mono text-teal-600">{item.kode}</span>
      ),
    },
    {
      header: 'Nama Obat',
      key: 'nama',
      render: (item: ObatSales) => (
        <div>
          <p className="font-medium">{item.nama}</p>
          <Badge variant="default" className="text-xs mt-1">
            {item.kategori}
          </Badge>
        </div>
      ),
    },
    {
      header: 'Qty Terjual',
      key: 'terjual',
      render: (item: ObatSales) => (
        <div className="flex items-center gap-2">
          <span className="font-semibold">{item.terjual}</span>
          <span className="text-gray-500 text-sm">{item.satuan}</span>
        </div>
      ),
    },
    {
      header: 'Harga Jual',
      key: 'hargaJual',
      render: (item: ObatSales) => formatCurrency(item.hargaJual),
    },
    {
      header: 'Pendapatan',
      key: 'pendapatan',
      render: (item: ObatSales) => (
        <span className="font-semibold text-teal-600">{formatCurrency(item.pendapatan)}</span>
      ),
    },
    {
      header: 'Stok',
      key: 'stokAkhir',
      render: (item: ObatSales) => {
        const persentase = Math.round((item.stokAkhir / item.stokAwal) * 100);
        return (
          <div>
            <span className={item.stokAkhir < 50 ? 'text-red-600 font-medium' : ''}>{item.stokAkhir}</span>
            <span className="text-gray-400 text-sm"> / {item.stokAwal}</span>
            {item.stokAkhir < 50 && (
              <AlertTriangle className="w-4 h-4 text-red-500 inline ml-1" />
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6" suppressHydrationWarning>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Laporan Penjualan Obat</h1>
          <p className="text-gray-500">Analisis penjualan obat dan farmasi</p>
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
              value={filterKategori}
              onChange={(e) => setFilterKategori(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="">Semua Kategori</option>
              <option value="antibiotik">Antibiotik</option>
              <option value="analgesik">Analgesik</option>
              <option value="antihistamin">Antihistamin</option>
              <option value="vitamin">Vitamin</option>
              <option value="antasida">Antasida</option>
              <option value="antidiabetes">Antidiabetes</option>
              <option value="antihipertensi">Antihipertensi</option>
              <option value="antiinflamasi">Antiinflamasi</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="terjual">Urutkan: Qty Terjual</option>
              <option value="pendapatan">Urutkan: Pendapatan</option>
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
              <ShoppingCart className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold">{formatCurrency(totalPendapatan)}</p>
              <p className="text-sm opacity-80">Total Pendapatan</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 border-l-4 border-l-blue-500">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalTerjual}</p>
              <p className="text-sm text-gray-500">Total Item Terjual</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 border-l-4 border-l-purple-500">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{obatSalesData.length}</p>
              <p className="text-sm text-gray-500">Jenis Obat Terjual</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 border-l-4 border-l-green-500">
          <div className="text-center">
            <p className="text-xl font-bold text-green-600">{topObat.nama}</p>
            <p className="text-sm text-gray-500">Obat Terlaris</p>
            <Badge variant="success" className="mt-1">{topObat.terjual} terjual</Badge>
          </div>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top 5 Obat */}
        <Card>
          <CardHeader>
            <CardTitle>Top 5 Obat Terlaris</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {obatSalesData
                .sort((a, b) => b.terjual - a.terjual)
                .slice(0, 5)
                .map((obat, idx) => (
                  <div key={obat.id} className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                      idx === 0 ? 'bg-yellow-500' : idx === 1 ? 'bg-gray-400' : idx === 2 ? 'bg-amber-600' : 'bg-gray-300'
                    }`}>
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{obat.nama}</p>
                      <div className="h-2 bg-gray-100 rounded-full mt-1">
                        <div
                          className="h-full bg-teal-500 rounded-full"
                          style={{ width: `${(obat.terjual / topObat.terjual) * 100}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-sm font-semibold">{obat.terjual}</span>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Sales by Kategori */}
        <Card>
          <CardHeader>
            <CardTitle>Penjualan per Kategori</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(salesByKategori)
                .sort((a, b) => b[1].pendapatan - a[1].pendapatan)
                .map(([kategori, data]) => (
                  <div key={kategori} className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${kategoriColors[kategori] || 'bg-gray-400'}`} />
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium capitalize">{kategori}</span>
                        <span className="text-sm text-gray-500">{formatCurrency(data.pendapatan)}</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full">
                        <div
                          className={`h-full rounded-full ${kategoriColors[kategori] || 'bg-gray-400'}`}
                          style={{ width: `${(data.pendapatan / totalPendapatan) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detail Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Detail Penjualan Obat</CardTitle>
            <span className="text-sm text-gray-500">{filteredData.length} obat</span>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={filteredData}
            emptyMessage="Tidak ada data penjualan obat"
          />
        </CardContent>
      </Card>

      {/* Summary Card */}
      <Card className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <CardContent className="py-8">
          <div className="text-center mb-6">
            <Pill className="w-12 h-12 mx-auto mb-3 opacity-80" />
            <h3 className="text-xl font-semibold mb-2">Ringkasan Penjualan Farmasi</h3>
            <p className="opacity-80">Periode: {formatDate(dateRange.start)} - {formatDate(dateRange.end)}</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold">{formatCurrency(totalPendapatan)}</p>
              <p className="text-sm opacity-80 mt-1">Total Pendapatan</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">{totalTerjual}</p>
              <p className="text-sm opacity-80 mt-1">Item Terjual</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">{obatSalesData.length}</p>
              <p className="text-sm opacity-80 mt-1">Jenis Obat</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">
                {formatCurrency(Math.round(totalPendapatan / totalTerjual))}
              </p>
              <p className="text-sm opacity-80 mt-1">Rata-rata/Item</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
