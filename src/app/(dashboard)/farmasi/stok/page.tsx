'use client';

import React, { useState } from 'react';
import { Search, Package, AlertTriangle, Filter, Plus, Minus, Eye, ArrowUpDown } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, StatCard, Button, Input, Badge, DataTable, Modal } from '@/components/ui';
import { obatList, alatMedisList, batchObatList } from '@/data/dummy-data';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Obat, AlatMedis } from '@/types';

type TabType = 'obat' | 'alat';

export default function StokPage() {
  const [activeTab, setActiveTab] = useState<TabType>('obat');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterKategori, setFilterKategori] = useState('');
  const [filterStok, setFilterStok] = useState<'all' | 'low' | 'out'>('all');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Calculate stats
  const totalObat = obatList.length;
  const obatStokRendah = obatList.filter(o => o.stok <= o.minimumStok).length;
  const obatHabis = obatList.filter(o => o.stok === 0).length;
  const totalNilaiStok = obatList.reduce((acc, o) => acc + (o.stok * o.hargaBeli), 0);

  // Filter obat
  const filteredObat = obatList.filter(obat => {
    const matchSearch = obat.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       obat.kode.toLowerCase().includes(searchQuery.toLowerCase());
    const matchKategori = filterKategori ? obat.kategori === filterKategori : true;
    let matchStok = true;
    if (filterStok === 'low') matchStok = obat.stok <= obat.minimumStok && obat.stok > 0;
    if (filterStok === 'out') matchStok = obat.stok === 0;
    return matchSearch && matchKategori && matchStok;
  });

  // Filter alat medis
  const filteredAlat = alatMedisList.filter(alat => {
    const matchSearch = alat.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       alat.kode.toLowerCase().includes(searchQuery.toLowerCase());
    const matchKategori = filterKategori ? alat.kategori === filterKategori : true;
    let matchStok = true;
    if (filterStok === 'low') matchStok = alat.stok <= alat.minimumStok && alat.stok > 0;
    if (filterStok === 'out') matchStok = alat.stok === 0;
    return matchSearch && matchKategori && matchStok;
  });

  const obatColumns = [
    {
      header: 'Kode',
      key: 'kode',
      render: (obat: Obat) => (
        <span className="font-mono text-teal-600">{obat.kode}</span>
      ),
    },
    {
      header: 'Nama Obat',
      key: 'nama',
      render: (obat: Obat) => (
        <div>
          <p className="font-medium">{obat.nama}</p>
          <p className="text-xs text-gray-500">{obat.satuan} • {obat.kategori}</p>
        </div>
      ),
    },
    {
      header: 'Kategori',
      key: 'kategori',
      render: (obat: Obat) => (
        <Badge variant="info">{obat.kategori}</Badge>
      ),
    },
    {
      key: 'stok',
      header: 'Stok',
      render: (obat: Obat) => {
        const isLow = obat.stok <= obat.minimumStok;
        const isOut = obat.stok === 0;
        return (
          <div className={`flex items-center gap-2 ${isOut ? 'text-red-600' : isLow ? 'text-yellow-600' : 'text-gray-800'}`}>
            {(isOut || isLow) && <AlertTriangle className="w-4 h-4" />}
            <span className="font-semibold">{obat.stok} {obat.satuan}</span>
          </div>
        );
      },
    },
    {
      key: 'minimumStok',
      header: 'Min. Stok',
      render: (obat: Obat) => (
        <span className="text-gray-500">{obat.minimumStok} {obat.satuan}</span>
      ),
    },
    {
      header: 'Harga Jual',
      key: 'hargaJual',
      render: (obat: Obat) => formatCurrency(obat.hargaJual),
    },
    {
      header: 'Aksi',
      key: 'id',
      render: (obat: Obat) => (
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => {
            setSelectedItem(obat);
            setShowDetailModal(true);
          }}
          suppressHydrationWarning
        >
          <Eye className="w-4 h-4" />
        </Button>
      ),
    },
  ];

  const alatColumns = [
    {
      header: 'Kode',
      key: 'kode',
      render: (alat: AlatMedis) => (
        <span className="font-mono text-teal-600">{alat.kode}</span>
      ),
    },
    {
      header: 'Nama Alat',
      key: 'nama',
      render: (alat: AlatMedis) => (
        <div>
          <p className="font-medium">{alat.nama}</p>
          <p className="text-xs text-gray-500">{alat.satuan}</p>
        </div>
      ),
    },
    {
      header: 'Kategori',
      key: 'kategori',
      render: (alat: AlatMedis) => (
        <Badge variant="default">{alat.kategori}</Badge>
      ),
    },
    {
      key: 'stok',
      header: 'Stok',
      render: (alat: AlatMedis) => {
        const isLow = alat.stok <= alat.minimumStok;
        const isOut = alat.stok === 0;
        return (
          <div className={`flex items-center gap-2 ${isOut ? 'text-red-600' : isLow ? 'text-yellow-600' : 'text-gray-800'}`}>
            {(isOut || isLow) && <AlertTriangle className="w-4 h-4" />}
            <span className="font-semibold">{alat.stok} {alat.satuan}</span>
          </div>
        );
      },
    },
    {
      key: 'minimumStok',
      header: 'Min. Stok',
      render: (alat: AlatMedis) => (
        <span className="text-gray-500">{alat.minimumStok} {alat.satuan}</span>
      ),
    },
    {
      header: 'Harga',
      key: 'harga',
      render: (alat: AlatMedis) => formatCurrency(alat.harga),
    },
    {
      header: 'Aksi',
      key: 'id',
      render: (alat: AlatMedis) => (
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => {
            setSelectedItem(alat);
            setShowDetailModal(true);
          }}
          suppressHydrationWarning
        >
          <Eye className="w-4 h-4" />
        </Button>
      ),
    },
  ];

  const kategoriObat = ['antibiotik', 'analgesik', 'antihistamin', 'vitamin', 'antasida', 'antidiabetes', 'antihipertensi', 'antiinflamasi', 'antipiretik'];
  const kategoriAlat = ['habis_pakai', 'instrumen', 'diagnostik'];

  return (
    <div className="space-y-6" suppressHydrationWarning>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Stok Farmasi</h1>
          <p className="text-gray-500">Overview stok obat dan alat medis</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Item"
          value={totalObat + alatMedisList.length}
          icon={Package}
          trend={{ value: 5, isPositive: true }}
        />
        <StatCard
          title="Stok Rendah"
          value={obatStokRendah}
          icon={AlertTriangle}
        />
        <StatCard
          title="Stok Habis"
          value={obatHabis}
          icon={AlertTriangle}
        />
        <StatCard
          title="Nilai Stok"
          value={formatCurrency(totalNilaiStok)}
          icon={Package}
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b">
        <button
          type="button"
          onClick={() => {
            setActiveTab('obat');
            setFilterKategori('');
          }}
          className={`pb-3 px-4 font-medium transition-colors ${
            activeTab === 'obat'
              ? 'text-teal-600 border-b-2 border-teal-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          suppressHydrationWarning
        >
          Obat-obatan ({obatList.length})
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveTab('alat');
            setFilterKategori('');
          }}
          className={`pb-3 px-4 font-medium transition-colors ${
            activeTab === 'alat'
              ? 'text-teal-600 border-b-2 border-teal-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          suppressHydrationWarning
        >
          Alat Medis ({alatMedisList.length})
        </button>
      </div>

      {/* Filter & Search */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder={`Cari ${activeTab === 'obat' ? 'obat' : 'alat medis'}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={filterKategori}
              onChange={(e) => setFilterKategori(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="">Semua Kategori</option>
              {(activeTab === 'obat' ? kategoriObat : kategoriAlat).map(kat => (
                <option key={kat} value={kat}>
                  {kat.charAt(0).toUpperCase() + kat.slice(1).replace('_', ' ')}
                </option>
              ))}
            </select>
            <select
              value={filterStok}
              onChange={(e) => setFilterStok(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="all">Semua Stok</option>
              <option value="low">Stok Rendah</option>
              <option value="out">Stok Habis</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              {activeTab === 'obat' ? 'Daftar Obat' : 'Daftar Alat Medis'}
            </CardTitle>
            <span className="text-sm text-gray-500">
              {activeTab === 'obat' ? filteredObat.length : filteredAlat.length} item
            </span>
          </div>
        </CardHeader>
        <CardContent>
          {activeTab === 'obat' ? (
            <DataTable
              columns={obatColumns}
              data={filteredObat}
              emptyMessage="Tidak ada obat ditemukan"
            />
          ) : (
            <DataTable
              columns={alatColumns}
              data={filteredAlat}
              emptyMessage="Tidak ada alat medis ditemukan"
            />
          )}
        </CardContent>
      </Card>

      {/* Detail Modal */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedItem(null);
        }}
        title={`Detail ${activeTab === 'obat' ? 'Obat' : 'Alat Medis'}`}
        size="lg"
      >
        {selectedItem && (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-start pb-4 border-b">
              <div>
                <p className="font-mono text-teal-600">{selectedItem.kode}</p>
                <h3 className="text-xl font-bold">{selectedItem.nama}</h3>
                <Badge variant="info" className="mt-2">
                  {selectedItem.kategori.replace('_', ' ')}
                </Badge>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Stok Saat Ini</p>
                <p className={`text-3xl font-bold ${
                  selectedItem.stok === 0 
                    ? 'text-red-600' 
                    : selectedItem.stok <= selectedItem.minimumStok 
                    ? 'text-yellow-600' 
                    : 'text-green-600'
                }`}>
                  {selectedItem.stok}
                </p>
                <p className="text-sm text-gray-500">{selectedItem.satuan}</p>
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-4">
              {activeTab === 'obat' && (
                <>
                  <div>
                    <p className="text-sm text-gray-500">Golongan</p>
                    <p className="font-medium">{selectedItem.golongan}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Produsen</p>
                    <p className="font-medium">{selectedItem.produsen}</p>
                  </div>
                </>
              )}
              <div>
                <p className="text-sm text-gray-500">Stok Minimum</p>
                <p className="font-medium">{selectedItem.minimumStok} {selectedItem.satuan}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Lokasi</p>
                <p className="font-medium">{selectedItem.lokasi}</p>
              </div>
              {activeTab === 'obat' && (
                <>
                  <div>
                    <p className="text-sm text-gray-500">Harga Beli</p>
                    <p className="font-medium">{formatCurrency(selectedItem.hargaBeli)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Harga Jual</p>
                    <p className="font-medium text-teal-600">{formatCurrency(selectedItem.hargaJual)}</p>
                  </div>
                </>
              )}
              {activeTab === 'alat' && (
                <div>
                  <p className="text-sm text-gray-500">Harga</p>
                  <p className="font-medium text-teal-600">{formatCurrency(selectedItem.harga)}</p>
                </div>
              )}
            </div>

            {/* Batch Info for Obat */}
            {activeTab === 'obat' && (
              <div>
                <h4 className="font-medium mb-3">Batch Tersedia</h4>
                <div className="bg-gray-50 rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="text-left py-2 px-3">No. Batch</th>
                        <th className="text-center py-2 px-3">Stok</th>
                        <th className="text-right py-2 px-3">Kadaluarsa</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {batchObatList
                        .filter(b => b.obatId === selectedItem.id)
                        .map(batch => {
                          const expDate = new Date(batch.tanggalKadaluarsa);
                          const today = new Date();
                          const diffDays = Math.ceil((expDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                          const isExpiringSoon = diffDays <= 90;
                          return (
                            <tr key={batch.id}>
                              <td className="py-2 px-3 font-mono">{batch.noBatch}</td>
                              <td className="py-2 px-3 text-center">{batch.sisaStok}</td>
                              <td className={`py-2 px-3 text-right ${isExpiringSoon ? 'text-red-600' : ''}`}>
                                {formatDate(batch.tanggalKadaluarsa)}
                                {isExpiringSoon && <span className="ml-2 text-xs">⚠️</span>}
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Stock Movement Summary */}
            <div className="bg-teal-50 p-4 rounded-lg">
              <h4 className="font-medium mb-3">Ringkasan Stok</h4>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-green-600">
                    <Plus className="w-4 h-4 inline mr-1" />
                    150
                  </p>
                  <p className="text-xs text-gray-500">Masuk (Bulan ini)</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-red-600">
                    <Minus className="w-4 h-4 inline mr-1" />
                    78
                  </p>
                  <p className="text-xs text-gray-500">Keluar (Bulan ini)</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">
                    {selectedItem.stok}
                  </p>
                  <p className="text-xs text-gray-500">Saldo Akhir</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
