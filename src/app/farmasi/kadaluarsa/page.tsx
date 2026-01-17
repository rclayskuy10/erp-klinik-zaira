'use client';

import React, { useState } from 'react';
import { AlertTriangle, Calendar, Package, Clock, AlertCircle, Trash2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, StatCard, Button, Badge, DataTable } from '@/components/ui';
import { batchObatList, obatList } from '@/data/dummy-data';
import { formatDate } from '@/lib/utils';

type FilterType = 'all' | 'expired' | '30days' | '90days' | '180days';

export default function KadaluarsaPage() {
  const [filter, setFilter] = useState<FilterType>('all');

  const today = new Date();

  // Calculate days until expiry for each batch
  const batchesWithExpiry = batchObatList.map(batch => {
    const expDate = new Date(batch.tanggalKadaluarsa);
    const diffTime = expDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const obat = obatList.find(o => o.id === batch.obatId);
    return {
      ...batch,
      namaObat: obat?.nama || 'Unknown',
      kodeObat: obat?.kode || '-',
      satuan: obat?.satuan || 'pcs',
      daysUntilExpiry: diffDays,
      isExpired: diffDays < 0,
      status: diffDays < 0 ? 'expired' : diffDays <= 30 ? 'critical' : diffDays <= 90 ? 'warning' : diffDays <= 180 ? 'notice' : 'safe',
    };
  }).sort((a, b) => a.daysUntilExpiry - b.daysUntilExpiry);

  // Filter batches
  const filteredBatches = batchesWithExpiry.filter(batch => {
    switch (filter) {
      case 'expired':
        return batch.isExpired;
      case '30days':
        return !batch.isExpired && batch.daysUntilExpiry <= 30;
      case '90days':
        return !batch.isExpired && batch.daysUntilExpiry <= 90;
      case '180days':
        return !batch.isExpired && batch.daysUntilExpiry <= 180;
      default:
        return batch.daysUntilExpiry <= 180 || batch.isExpired;
    }
  });

  // Stats
  const expiredCount = batchesWithExpiry.filter(b => b.isExpired).length;
  const criticalCount = batchesWithExpiry.filter(b => !b.isExpired && b.daysUntilExpiry <= 30).length;
  const warningCount = batchesWithExpiry.filter(b => !b.isExpired && b.daysUntilExpiry > 30 && b.daysUntilExpiry <= 90).length;
  const noticeCount = batchesWithExpiry.filter(b => !b.isExpired && b.daysUntilExpiry > 90 && b.daysUntilExpiry <= 180).length;

  const getStatusBadge = (status: string, days: number) => {
    switch (status) {
      case 'expired':
        return <Badge variant="danger">Kadaluarsa</Badge>;
      case 'critical':
        return <Badge variant="danger">{days} hari lagi</Badge>;
      case 'warning':
        return <Badge variant="warning">{days} hari lagi</Badge>;
      case 'notice':
        return <Badge variant="info">{days} hari lagi</Badge>;
      default:
        return <Badge variant="success">{days} hari lagi</Badge>;
    }
  };

  const columns = [
    {
      header: 'Kode Obat',
      key: 'kodeObat',
      render: (item: any) => (
        <span className="font-mono text-teal-600">{item.kodeObat}</span>
      ),
    },
    {
      header: 'Nama Obat',
      key: 'namaObat',
      render: (item: any) => (
        <span className="font-medium">{item.namaObat}</span>
      ),
    },
    {
      header: 'No. Batch',
      key: 'noBatch',
      render: (item: any) => (
        <span className="font-mono text-sm">{item.noBatch}</span>
      ),
    },
    {
      header: 'Stok',
      key: 'sisaStok',
      render: (item: any) => (
        <span>{item.sisaStok} {item.satuan}</span>
      ),
    },
    {
      header: 'Tgl Kadaluarsa',
      key: 'tanggalKadaluarsa',
      render: (item: any) => (
        <span className={item.isExpired ? 'text-red-600 font-medium' : ''}>
          {formatDate(item.tanggalKadaluarsa)}
        </span>
      ),
    },
    {
      header: 'Status',
      key: 'status',
      render: (item: any) => getStatusBadge(item.status, item.daysUntilExpiry),
    },
    {
      header: 'Aksi',
      key: 'id',
      render: (item: any) => (
        <div className="flex gap-2">
          {item.isExpired && (
            <Button
              type="button"
              size="sm"
              variant="danger"
              onClick={() => alert(`Menghapus batch ${item.noBatch} dari stok`)}
              className="gap-1"
              suppressHydrationWarning
            >
              <Trash2 className="w-4 h-4" />
              Hapus
            </Button>
          )}
          {!item.isExpired && item.daysUntilExpiry <= 90 && (
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => alert(`Mengirim notifikasi untuk batch ${item.noBatch}`)}
              suppressHydrationWarning
            >
              Notifikasi
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6" suppressHydrationWarning>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Monitor Kadaluarsa</h1>
          <p className="text-gray-500">Pantau obat yang akan/sudah kadaluarsa</p>
        </div>
      </div>

      {/* Alert Banner */}
      {expiredCount > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-4">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-red-800">Perhatian!</h3>
            <p className="text-red-700">
              Terdapat <span className="font-bold">{expiredCount} batch obat</span> yang sudah kadaluarsa dan harus segera dibuang.
            </p>
          </div>
          <Button type="button" variant="danger" onClick={() => setFilter('expired')} suppressHydrationWarning>
            Lihat Detail
          </Button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div onClick={() => setFilter('expired')} className={`cursor-pointer transition-all ${filter === 'expired' ? 'ring-2 ring-red-500 rounded-lg' : ''}`}>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-3xl font-bold text-red-600">{expiredCount}</p>
                <p className="text-sm text-gray-500">Kadaluarsa</p>
              </div>
            </div>
          </Card>
        </div>
        <div onClick={() => setFilter('30days')} className={`cursor-pointer transition-all ${filter === '30days' ? 'ring-2 ring-orange-500 rounded-lg' : ''}`}>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-3xl font-bold text-orange-600">{criticalCount}</p>
                <p className="text-sm text-gray-500">&lt; 30 hari</p>
              </div>
            </div>
          </Card>
        </div>
        <div onClick={() => setFilter('90days')} className={`cursor-pointer transition-all ${filter === '90days' ? 'ring-2 ring-yellow-500 rounded-lg' : ''}`}>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-3xl font-bold text-yellow-600">{warningCount}</p>
                <p className="text-sm text-gray-500">30-90 hari</p>
              </div>
            </div>
          </Card>
        </div>
        <div onClick={() => setFilter('180days')} className={`cursor-pointer transition-all ${filter === '180days' ? 'ring-2 ring-blue-500 rounded-lg' : ''}`}>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-3xl font-bold text-blue-600">{noticeCount}</p>
                <p className="text-sm text-gray-500">90-180 hari</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        <Button
          variant={filter === 'all' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setFilter('all')}
        >
          Semua (&lt; 6 bulan)
        </Button>
        <Button
          variant={filter === 'expired' ? 'danger' : 'outline'}
          size="sm"
          onClick={() => setFilter('expired')}
        >
          Kadaluarsa ({expiredCount})
        </Button>
        <Button
          variant={filter === '30days' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setFilter('30days')}
        >
          &lt; 30 hari ({criticalCount})
        </Button>
        <Button
          variant={filter === '90days' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setFilter('90days')}
        >
          &lt; 90 hari ({criticalCount + warningCount})
        </Button>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Daftar Batch Obat</CardTitle>
            <span className="text-sm text-gray-500">{filteredBatches.length} batch ditemukan</span>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={filteredBatches}
            emptyMessage="Tidak ada obat yang akan kadaluarsa dalam rentang waktu ini"
          />
        </CardContent>
      </Card>

      {/* Summary Card */}
      <Card className="bg-gradient-to-r from-teal-50 to-cyan-50">
        <CardContent className="py-6">
          <h3 className="font-semibold text-teal-800 mb-4">Ringkasan Monitoring Kadaluarsa</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <p className="text-2xl font-bold text-red-600">{expiredCount}</p>
              <p className="text-xs text-gray-500">Sudah Kadaluarsa</p>
              <p className="text-xs text-gray-400">Harus dibuang</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <p className="text-2xl font-bold text-orange-600">{criticalCount}</p>
              <p className="text-xs text-gray-500">Kritis (30 hari)</p>
              <p className="text-xs text-gray-400">Prioritas jual</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <p className="text-2xl font-bold text-yellow-600">{warningCount}</p>
              <p className="text-xs text-gray-500">Peringatan (90 hari)</p>
              <p className="text-xs text-gray-400">Perlu perhatian</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <p className="text-2xl font-bold text-blue-600">{noticeCount}</p>
              <p className="text-xs text-gray-500">Notifikasi (180 hari)</p>
              <p className="text-xs text-gray-400">Pantau berkala</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
