'use client';

import React, { useState } from 'react';
import { Search, Eye, FileText, Calendar, Clock } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Button, Badge, Modal } from '@/components/ui';
import { DataTable } from '@/components/ui/Table';
import { kunjunganList, getPasienById, getDokterById, getPoliById } from '@/data/dummy-data';
import { formatDate, formatShortDate, getStatusColor, getJenisPembayaranColor } from '@/lib/utils';
import { Kunjungan } from '@/types';
import Link from 'next/link';

export default function KunjunganPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPoli, setFilterPoli] = useState('');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedKunjungan, setSelectedKunjungan] = useState<Kunjungan | null>(null);

  const filteredKunjungan = kunjunganList.filter((k) => {
    const pasien = getPasienById(k.pasienId);
    const matchSearch = pasien?.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       k.noKunjungan.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = !filterStatus || k.status === filterStatus;
    const matchPoli = !filterPoli || k.poliId === filterPoli;
    return matchSearch && matchStatus && matchPoli;
  });

  const columns = [
    {
      key: 'noKunjungan',
      header: 'No. Kunjungan',
      render: (item: Kunjungan) => (
        <span className="font-mono text-sm text-teal-600">{item.noKunjungan}</span>
      ),
    },
    {
      key: 'tanggal',
      header: 'Tanggal',
      render: (item: Kunjungan) => (
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <div>
            <p className="text-sm">{formatShortDate(item.tanggal)}</p>
            <p className="text-xs text-gray-500">{item.jamMasuk}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'pasien',
      header: 'Pasien',
      render: (item: Kunjungan) => {
        const pasien = getPasienById(item.pasienId);
        return (
          <div>
            <p className="font-medium text-gray-800">{pasien?.nama}</p>
            <p className="text-xs text-gray-500">{pasien?.noRM}</p>
          </div>
        );
      },
    },
    {
      key: 'poli',
      header: 'Poli / Dokter',
      render: (item: Kunjungan) => {
        const poli = getPoliById(item.poliId);
        const dokter = getDokterById(item.dokterId);
        return (
          <div>
            <p className="font-medium text-gray-800">{poli?.nama}</p>
            <p className="text-xs text-gray-500">{dokter?.nama}</p>
          </div>
        );
      },
    },
    {
      key: 'jenis',
      header: 'Jenis',
      render: (item: Kunjungan) => (
        <div className="flex flex-col gap-1">
          <Badge variant={item.jenisKunjungan === 'baru' ? 'info' : 'default'}>
            {item.jenisKunjungan === 'baru' ? 'Baru' : 'Lama'}
          </Badge>
          <Badge variant={item.jenisPembayaran === 'bpjs' ? 'success' : item.jenisPembayaran === 'asuransi' ? 'purple' : 'info'}>
            {item.jenisPembayaran.toUpperCase()}
          </Badge>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (item: Kunjungan) => (
        <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${getStatusColor(item.status)}`}>
          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Aksi',
      render: (item: Kunjungan) => (
        <div className="flex gap-2">
          <Link href={`/emr/rekam-medis?kunjunganId=${item.id}`}>
            <button type="button" className="p-1.5 text-gray-500 hover:text-teal-600 hover:bg-teal-50 rounded" suppressHydrationWarning>
              <FileText className="w-4 h-4" />
            </button>
          </Link>
          <button 
            type="button" 
            onClick={() => {
              setSelectedKunjungan(item);
              setShowDetailModal(true);
            }}
            className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded" 
            suppressHydrationWarning
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  const statusCounts = {
    menunggu: kunjunganList.filter(k => k.status === 'menunggu').length,
    diperiksa: kunjunganList.filter(k => k.status === 'diperiksa').length,
    selesai: kunjunganList.filter(k => k.status === 'selesai').length,
  };

  return (
    <div className="space-y-6" suppressHydrationWarning>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Daftar Kunjungan</h1>
          <p className="text-gray-500">Kelola kunjungan pasien dan rekam medis</p>
        </div>
        <Link href="/kasir/registrasi">
          <Button>
            <Calendar className="w-4 h-4" />
            Registrasi Baru
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-sm text-gray-500">Total Kunjungan</p>
          <p className="text-2xl font-bold text-gray-800">{kunjunganList.length}</p>
        </Card>
        <Card className="p-4 border-l-4 border-l-yellow-500">
          <p className="text-sm text-gray-500">Menunggu</p>
          <p className="text-2xl font-bold text-yellow-600">{statusCounts.menunggu}</p>
        </Card>
        <Card className="p-4 border-l-4 border-l-purple-500">
          <p className="text-sm text-gray-500">Diperiksa</p>
          <p className="text-2xl font-bold text-purple-600">{statusCounts.diperiksa}</p>
        </Card>
        <Card className="p-4 border-l-4 border-l-green-500">
          <p className="text-sm text-gray-500">Selesai</p>
          <p className="text-2xl font-bold text-green-600">{statusCounts.selesai}</p>
        </Card>
      </div>

      {/* Search & Filter */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Cari pasien atau no kunjungan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="">Semua Status</option>
              <option value="menunggu">Menunggu</option>
              <option value="diperiksa">Diperiksa</option>
              <option value="selesai">Selesai</option>
              <option value="batal">Batal</option>
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
          <CardTitle>Daftar Kunjungan ({filteredKunjungan.length})</CardTitle>
        </CardHeader>
        <DataTable columns={columns} data={filteredKunjungan} />
      </Card>

      {/* Detail Modal */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedKunjungan(null);
        }}
        title="Detail Kunjungan"
        size="lg"
      >
        {selectedKunjungan && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">No. Kunjungan</p>
                <p className="font-medium text-teal-600">{selectedKunjungan.noKunjungan}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Tanggal & Waktu</p>
                <p className="font-medium">{formatDate(selectedKunjungan.tanggal)}</p>
                <p className="text-sm text-gray-600">{selectedKunjungan.jamMasuk} - {selectedKunjungan.jamKeluar || 'Sedang berlangsung'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Pasien</p>
                <p className="font-medium">{getPasienById(selectedKunjungan.pasienId)?.nama}</p>
                <p className="text-sm text-gray-600">{getPasienById(selectedKunjungan.pasienId)?.noRM}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Dokter</p>
                <p className="font-medium">{getDokterById(selectedKunjungan.dokterId)?.nama}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Poli</p>
                <Badge variant="info">{getPoliById(selectedKunjungan.poliId)?.nama}</Badge>
              </div>
              <div>
                <p className="text-sm text-gray-500">Jenis Kunjungan</p>
                <Badge variant={selectedKunjungan.jenisKunjungan === 'baru' ? 'info' : 'default'}>
                  {selectedKunjungan.jenisKunjungan === 'baru' ? 'Baru' : 'Lama'}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-gray-500">Jenis Pembayaran</p>
                <Badge variant={selectedKunjungan.jenisPembayaran === 'bpjs' ? 'success' : 'info'}>
                  {selectedKunjungan.jenisPembayaran.toUpperCase()}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <span className={`inline-block px-2.5 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedKunjungan.status)}`}>
                  {selectedKunjungan.status.charAt(0).toUpperCase() + selectedKunjungan.status.slice(1)}
                </span>
              </div>
            </div>
            
            {selectedKunjungan.keluhanUtama && (
              <div>
                <p className="text-sm text-gray-500 mb-2">Keluhan Utama</p>
                <p className="p-3 bg-gray-50 rounded-lg">{selectedKunjungan.keluhanUtama}</p>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={() => {
                setShowDetailModal(false);
                setSelectedKunjungan(null);
              }}>
                Tutup
              </Button>
              <Link href={`/emr/rekam-medis?kunjunganId=${selectedKunjungan.id}`}>
                <Button>
                  <FileText className="w-4 h-4" />
                  Lihat Rekam Medis
                </Button>
              </Link>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
