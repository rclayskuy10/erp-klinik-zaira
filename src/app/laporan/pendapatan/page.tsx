'use client';

import React, { useState } from 'react';
import { DollarSign, TrendingUp, TrendingDown, Download, Filter, CreditCard, Wallet, ArrowUpRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Button, Badge } from '@/components/ui';
import { invoiceList, getPasienById, getPoliById } from '@/data/dummy-data';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function LaporanPendapatanPage() {
  const [dateRange, setDateRange] = useState({
    start: '2024-01-01',
    end: '2024-01-31',
  });
  const [groupBy, setGroupBy] = useState<'day' | 'week' | 'month'>('day');

  // Calculate stats
  const totalPendapatan = invoiceList.reduce((acc, inv) => acc + (inv.status === 'lunas' ? inv.grandTotal : 0), 0);
  const totalPiutang = invoiceList.reduce((acc, inv) => acc + (inv.status === 'pending' ? inv.grandTotal : 0), 0);
  const totalInvoice = invoiceList.length;
  const invoiceLunas = invoiceList.filter(i => i.status === 'lunas').length;

  // Group pendapatan by payment type
  const pendapatanByType = invoiceList.reduce((acc, inv) => {
    if (inv.status === 'lunas' && inv.metodePembayaran) {
      if (!acc[inv.metodePembayaran]) acc[inv.metodePembayaran] = 0;
      acc[inv.metodePembayaran] += inv.grandTotal;
    }
    return acc;
  }, {} as Record<string, number>);

  // Daily data simulation
  const dailyData = [
    { tanggal: '2024-01-15', pendapatan: 2500000, transaksi: 12 },
    { tanggal: '2024-01-16', pendapatan: 1850000, transaksi: 8 },
    { tanggal: '2024-01-17', pendapatan: 3200000, transaksi: 15 },
    { tanggal: '2024-01-18', pendapatan: 2100000, transaksi: 10 },
    { tanggal: '2024-01-19', pendapatan: 2800000, transaksi: 14 },
    { tanggal: '2024-01-20', pendapatan: 1500000, transaksi: 7 },
    { tanggal: '2024-01-21', pendapatan: 500000, transaksi: 3 },
  ];

  const maxPendapatan = Math.max(...dailyData.map(d => d.pendapatan));

  // Kategori pendapatan simulation
  const pendapatanByKategori = [
    { kategori: 'Konsultasi', jumlah: 5500000, persentase: 35 },
    { kategori: 'Tindakan', jumlah: 4200000, persentase: 27 },
    { kategori: 'Obat', jumlah: 3800000, persentase: 24 },
    { kategori: 'Laboratorium', jumlah: 1500000, persentase: 10 },
    { kategori: 'Lain-lain', jumlah: 600000, persentase: 4 },
  ];

  return (
    <div className="space-y-6" suppressHydrationWarning>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Laporan Pendapatan</h1>
          <p className="text-gray-500">Analisis pendapatan dan keuangan klinik</p>
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
            <div className="flex gap-2">
              <Button
                type="button"
                variant={groupBy === 'day' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setGroupBy('day')}
                suppressHydrationWarning
              >
                Harian
              </Button>
              <Button
                type="button"
                variant={groupBy === 'week' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setGroupBy('week')}
                suppressHydrationWarning
              >
                Mingguan
              </Button>
              <Button
                type="button"
                variant={groupBy === 'month' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setGroupBy('month')}
                suppressHydrationWarning
              >
                Bulanan
              </Button>
            </div>
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
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold">{formatCurrency(totalPendapatan)}</p>
              <p className="text-sm opacity-80">Total Pendapatan</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 border-l-4 border-l-yellow-500">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <Wallet className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-600">{formatCurrency(totalPiutang)}</p>
              <p className="text-sm text-gray-500">Piutang</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 border-l-4 border-l-green-500">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">+15%</p>
              <p className="text-sm text-gray-500">vs Bulan Lalu</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 border-l-4 border-l-blue-500">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{invoiceLunas}/{totalInvoice}</p>
            <p className="text-sm text-gray-500">Invoice Lunas</p>
          </div>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Daily Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Pendapatan Harian</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {dailyData.map((day, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-20 text-xs text-gray-500">{formatDate(day.tanggal)}</div>
                  <div className="flex-1 h-8 bg-gray-100 rounded-lg overflow-hidden relative">
                    <div
                      className="h-full bg-gradient-to-r from-teal-400 to-teal-600 rounded-lg"
                      style={{ width: `${(day.pendapatan / maxPendapatan) * 100}%` }}
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-medium">
                      {formatCurrency(day.pendapatan)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pendapatan by Kategori */}
        <Card>
          <CardHeader>
            <CardTitle>Pendapatan per Kategori</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendapatanByKategori.map((item, idx) => {
                const colors = ['bg-teal-500', 'bg-blue-500', 'bg-purple-500', 'bg-orange-500', 'bg-gray-400'];
                return (
                  <div key={idx}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">{item.kategori}</span>
                      <span className="text-sm text-gray-500">{formatCurrency(item.jumlah)}</span>
                    </div>
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${colors[idx]} rounded-full`}
                        style={{ width: `${item.persentase}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-400 text-right mt-1">{item.persentase}%</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment Type Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Pendapatan per Jenis Pembayaran</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-green-50 rounded-xl text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <CreditCard className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-xl font-bold text-green-600">
                {formatCurrency(pendapatanByType['bpjs'] || 0)}
              </p>
              <p className="text-sm text-gray-500">BPJS</p>
              <Badge variant="success" className="mt-2">
                {Math.floor(pendapatanByType['tunai'] ? pendapatanByType['tunai'] / 200000 : 0)} invoice
              </Badge>
            </div>
            <div className="p-4 bg-blue-50 rounded-xl text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Wallet className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-xl font-bold text-blue-600">
                {formatCurrency(pendapatanByType['umum'] || 0)}
              </p>
              <p className="text-sm text-gray-500">Umum (Tunai)</p>
              <Badge variant="info" className="mt-2">
                {Math.floor(pendapatanByType['qris'] ? pendapatanByType['qris'] / 200000 : 0)} invoice
              </Badge>
            </div>
            <div className="p-4 bg-purple-50 rounded-xl text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <CreditCard className="w-6 h-6 text-purple-600" />
              </div>
              <p className="text-xl font-bold text-purple-600">
                {formatCurrency(pendapatanByType['asuransi'] || 0)}
              </p>
              <p className="text-sm text-gray-500">Asuransi</p>
              <Badge variant="default" className="mt-2">
                {Math.floor(pendapatanByType['transfer'] ? pendapatanByType['transfer'] / 200000 : 0)} invoice
              </Badge>
            </div>
            <div className="p-4 bg-teal-50 rounded-xl text-center">
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <ArrowUpRight className="w-6 h-6 text-teal-600" />
              </div>
              <p className="text-xl font-bold text-teal-600">
                {formatCurrency(totalPendapatan)}
              </p>
              <p className="text-sm text-gray-500">Total Semua</p>
              <Badge variant="info" className="mt-2">
                {invoiceLunas} invoice
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Card */}
      <Card className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white">
        <CardContent className="py-8">
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold mb-2">Ringkasan Keuangan</h3>
            <p className="opacity-80">Periode: {formatDate(dateRange.start)} - {formatDate(dateRange.end)}</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold">{formatCurrency(totalPendapatan)}</p>
              <p className="text-sm opacity-80 mt-1">Pendapatan Bersih</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">{formatCurrency(totalPiutang)}</p>
              <p className="text-sm opacity-80 mt-1">Total Piutang</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">{invoiceLunas}</p>
              <p className="text-sm opacity-80 mt-1">Transaksi Sukses</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">
                {invoiceLunas > 0 ? formatCurrency(Math.round(totalPendapatan / invoiceLunas)) : '-'}
              </p>
              <p className="text-sm opacity-80 mt-1">Rata-rata Transaksi</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
