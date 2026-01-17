'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, Eye, FileText, Edit, Printer, Download } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Button, Badge, Modal } from '@/components/ui';
import { DataTable } from '@/components/ui/Table';
import { rekamMedisList, getPasienById, getDokterById, kunjunganList } from '@/data/dummy-data';
import { formatDate, formatCurrency } from '@/lib/utils';
import { RekamMedis } from '@/types';

function RekamMedisContent() {
  const searchParams = useSearchParams();
  const pasienIdFromUrl = searchParams.get('pasienId');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedRM, setSelectedRM] = useState<RekamMedis | null>(null);

  // Set search term dari pasien yang dipilih
  useEffect(() => {
    if (pasienIdFromUrl) {
      const pasien = getPasienById(pasienIdFromUrl);
      if (pasien) {
        setSearchTerm(pasien.nama);
      }
    }
  }, [pasienIdFromUrl]);

  const filteredRM = rekamMedisList.filter((rm) => {
    const pasien = getPasienById(rm.pasienId);
    
    // Filter berdasarkan pasienId dari URL jika ada
    if (pasienIdFromUrl && rm.pasienId !== pasienIdFromUrl) {
      return false;
    }
    
    // Filter berdasarkan search term
    if (searchTerm) {
      return pasien?.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
             pasien?.noRM.toLowerCase().includes(searchTerm.toLowerCase());
    }
    
    return true;
  });

  const handleView = (rm: RekamMedis) => {
    setSelectedRM(rm);
    setShowDetailModal(true);
  };

  const columns = [
    {
      key: 'tanggal',
      header: 'Tanggal',
      render: (item: RekamMedis) => formatDate(item.tanggal),
    },
    {
      key: 'pasien',
      header: 'Pasien',
      render: (item: RekamMedis) => {
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
      key: 'dokter',
      header: 'Dokter',
      render: (item: RekamMedis) => {
        const dokter = getDokterById(item.dokterId);
        return dokter?.nama;
      },
    },
    {
      key: 'diagnosis',
      header: 'Diagnosis',
      render: (item: RekamMedis) => (
        <div className="flex flex-wrap gap-1">
          {item.diagnosis.slice(0, 2).map((d) => (
            <Badge key={d.id} variant={d.tipe === 'utama' ? 'info' : 'default'}>
              {d.nama}
            </Badge>
          ))}
          {item.diagnosis.length > 2 && (
            <Badge variant="default">+{item.diagnosis.length - 2}</Badge>
          )}
        </div>
      ),
    },
    {
      key: 'resep',
      header: 'Resep',
      render: (item: RekamMedis) => `${item.resep.length} obat`,
    },
    {
      key: 'tindakan',
      header: 'Tindakan',
      render: (item: RekamMedis) => `${item.tindakan.length} tindakan`,
    },
    {
      key: 'actions',
      header: 'Aksi',
      render: (item: RekamMedis) => (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleView(item);
            }}
            className="p-1.5 text-gray-500 hover:text-teal-600 hover:bg-teal-50 rounded"
            suppressHydrationWarning
          >
            <Eye className="w-4 h-4" />
          </button>
          <button type="button" className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded" suppressHydrationWarning>
            <Edit className="w-4 h-4" />
          </button>
          <button type="button" className="p-1.5 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded" suppressHydrationWarning>
            <Printer className="w-4 h-4" />
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
          <h1 className="text-2xl font-bold text-gray-800">Rekam Medis</h1>
          <p className="text-gray-500">Kelola rekam medis elektronik pasien</p>
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Cari pasien atau no RM..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <input
              type="date"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          
          {/* Info Filter Pasien */}
          {pasienIdFromUrl && (
            <div className="mt-3 p-3 bg-teal-50 border border-teal-200 rounded-lg">
              <p className="text-sm text-teal-700">
                Menampilkan rekam medis untuk pasien: <span className="font-semibold">{getPasienById(pasienIdFromUrl)?.nama}</span> ({getPasienById(pasienIdFromUrl)?.noRM})
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Rekam Medis ({filteredRM.length})</CardTitle>
        </CardHeader>
        {filteredRM.length > 0 ? (
          <DataTable columns={columns} data={filteredRM} onRowClick={handleView} />
        ) : (
          <div className="p-8 text-center text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-lg font-medium">Tidak ada rekam medis ditemukan</p>
            <p className="text-sm">
              {pasienIdFromUrl 
                ? 'Pasien ini belum memiliki rekam medis' 
                : searchTerm 
                  ? 'Coba ubah kata kunci pencarian' 
                  : 'Belum ada rekam medis yang terdaftar'}
            </p>
          </div>
        )}
      </Card>

      {/* Detail Modal */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title="Detail Rekam Medis"
        size="xl"
      >
        {selectedRM && (
          <div className="space-y-6">
            {/* Header Info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-500">Tanggal</p>
                <p className="font-medium">{formatDate(selectedRM.tanggal)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Pasien</p>
                <p className="font-medium">{getPasienById(selectedRM.pasienId)?.nama}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">No. RM</p>
                <p className="font-medium">{getPasienById(selectedRM.pasienId)?.noRM}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Dokter</p>
                <p className="font-medium">{getDokterById(selectedRM.dokterId)?.nama}</p>
              </div>
            </div>

            {/* SOAP */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-800 border-b pb-2">SOAP Notes</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-2">Subjective</h4>
                  <p className="text-sm text-gray-700">{selectedRM.soap.subjective}</p>
                </div>
                
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-800 mb-2">Objective</h4>
                  <div className="text-sm text-gray-700 space-y-1">
                    {selectedRM.soap.objective.tekananDarah && (
                      <p>TD: {selectedRM.soap.objective.tekananDarah} mmHg</p>
                    )}
                    {selectedRM.soap.objective.suhu && (
                      <p>Suhu: {selectedRM.soap.objective.suhu}°C</p>
                    )}
                    {selectedRM.soap.objective.nadi && (
                      <p>Nadi: {selectedRM.soap.objective.nadi}x/menit</p>
                    )}
                    {selectedRM.soap.objective.pernapasan && (
                      <p>RR: {selectedRM.soap.objective.pernapasan}x/menit</p>
                    )}
                    {selectedRM.soap.objective.beratBadan && (
                      <p>BB: {selectedRM.soap.objective.beratBadan} kg</p>
                    )}
                    {selectedRM.soap.objective.pemeriksaanFisik && (
                      <p className="mt-2">{selectedRM.soap.objective.pemeriksaanFisik}</p>
                    )}
                  </div>
                </div>
                
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <h4 className="font-medium text-yellow-800 mb-2">Assessment</h4>
                  <p className="text-sm text-gray-700">{selectedRM.soap.assessment}</p>
                </div>
                
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-medium text-purple-800 mb-2">Plan</h4>
                  <p className="text-sm text-gray-700">{selectedRM.soap.plan}</p>
                </div>
              </div>
            </div>

            {/* Diagnosis */}
            <div>
              <h3 className="font-semibold text-gray-800 border-b pb-2 mb-3">Diagnosis</h3>
              <div className="space-y-2">
                {selectedRM.diagnosis.map((d) => (
                  <div key={d.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                    <Badge variant={d.tipe === 'utama' ? 'info' : 'default'}>
                      {d.tipe === 'utama' ? 'Utama' : 'Sekunder'}
                    </Badge>
                    <span className="font-mono text-sm text-gray-500">{d.kodeICD10}</span>
                    <span className="text-gray-800">{d.nama}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Resep */}
            {selectedRM.resep.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-800 border-b pb-2 mb-3">Resep Obat</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-3 py-2 text-left">Nama Obat</th>
                        <th className="px-3 py-2 text-left">Jumlah</th>
                        <th className="px-3 py-2 text-left">Aturan Pakai</th>
                        <th className="px-3 py-2 text-right">Harga</th>
                        <th className="px-3 py-2 text-right">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {selectedRM.resep.map((r) => (
                        <tr key={r.id}>
                          <td className="px-3 py-2">{r.namaObat}</td>
                          <td className="px-3 py-2">{r.jumlah} {r.satuan}</td>
                          <td className="px-3 py-2">{r.aturanPakai}</td>
                          <td className="px-3 py-2 text-right">{formatCurrency(r.harga)}</td>
                          <td className="px-3 py-2 text-right font-medium">{formatCurrency(r.subtotal)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-gray-50 font-medium">
                        <td colSpan={4} className="px-3 py-2 text-right">Total:</td>
                        <td className="px-3 py-2 text-right">
                          {formatCurrency(selectedRM.resep.reduce((sum, r) => sum + r.subtotal, 0))}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            )}

            {/* Tindakan */}
            {selectedRM.tindakan.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-800 border-b pb-2 mb-3">Tindakan Medis</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-3 py-2 text-left">Nama Tindakan</th>
                        <th className="px-3 py-2 text-left">Jumlah</th>
                        <th className="px-3 py-2 text-right">Tarif</th>
                        <th className="px-3 py-2 text-right">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {selectedRM.tindakan.map((t) => (
                        <tr key={t.id}>
                          <td className="px-3 py-2">{t.namaLayanan}</td>
                          <td className="px-3 py-2">{t.jumlah}</td>
                          <td className="px-3 py-2 text-right">{formatCurrency(t.tarif)}</td>
                          <td className="px-3 py-2 text-right font-medium">{formatCurrency(t.subtotal)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-gray-50 font-medium">
                        <td colSpan={3} className="px-3 py-2 text-right">Total:</td>
                        <td className="px-3 py-2 text-right">
                          {formatCurrency(selectedRM.tindakan.reduce((sum, t) => sum + t.subtotal, 0))}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            )}

            {/* Catatan */}
            {selectedRM.catatan && (
              <div>
                <h3 className="font-semibold text-gray-800 border-b pb-2 mb-3">Catatan</h3>
                <p className="text-gray-700 p-3 bg-gray-50 rounded">{selectedRM.catatan}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={() => setShowDetailModal(false)}>
                Tutup
              </Button>
              <Button variant="outline">
                <Printer className="w-4 h-4" />
                Cetak
              </Button>
              <Button>
                <Download className="w-4 h-4" />
                Download PDF
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default function RekamMedisPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <RekamMedisContent />
    </Suspense>
  );
}
