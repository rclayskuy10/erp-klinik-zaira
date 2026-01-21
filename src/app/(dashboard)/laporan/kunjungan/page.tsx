'use client';

import React, { useState } from 'react';
import { Calendar, Users, TrendingUp, Download, Filter, Clock, UserCheck, UserX } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Button, Badge, DataTable } from '@/components/ui';
import { kunjunganList, getPasienById, getDokterById, getPoliById } from '@/data/dummy-data';
import { formatDate, getStatusColor } from '@/lib/utils';

export default function LaporanKunjunganPage() {
  const [dateRange, setDateRange] = useState({
    start: '2024-01-01',
    end: '2024-01-31',
  });
  const [filterPoli, setFilterPoli] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Filter kunjungan
  const filteredKunjungan = kunjunganList.filter(kunjungan => {
    const matchPoli = filterPoli ? kunjungan.poliId === filterPoli : true;
    const matchStatus = filterStatus ? kunjungan.status === filterStatus : true;
    return matchPoli && matchStatus;
  });

  // Calculate stats
  const totalKunjungan = filteredKunjungan.length;
  const selesai = filteredKunjungan.filter(k => k.status === 'selesai').length;
  const dibatalkan = filteredKunjungan.filter(k => k.status === 'batal').length;
  
  // Group by poli
  const kunjunganByPoli = filteredKunjungan.reduce((acc, k) => {
    const poli = getPoliById(k.poliId);
    const poliName = poli?.nama || 'Unknown';
    if (!acc[poliName]) acc[poliName] = 0;
    acc[poliName]++;
    return acc;
  }, {} as Record<string, number>);

  // Group by day of week
  const kunjunganByDay = filteredKunjungan.reduce((acc, k) => {
    const date = new Date(k.tanggal);
    const day = date.toLocaleDateString('id-ID', { weekday: 'long' });
    if (!acc[day]) acc[day] = 0;
    acc[day]++;
    return acc;
  }, {} as Record<string, number>);

  // Handle export to Excel (CSV format)
  const handleExportToExcel = () => {
    const headers = ['Tanggal', 'No. Kunjungan', 'No. RM', 'Nama Pasien', 'Poli', 'Dokter', 'Status', 'Jenis Pembayaran'];
    const rows = filteredKunjungan.map(item => {
      const pasien = getPasienById(item.pasienId);
      const poli = getPoliById(item.poliId);
      const dokter = getDokterById(item.dokterId);
      return [
        formatDate(item.tanggal),
        item.id,
        pasien?.noRM || '-',
        pasien?.nama || '-',
        poli?.nama || '-',
        dokter?.nama || '-',
        item.status,
        item.jenisPembayaran.toUpperCase(),
      ];
    });

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    const timestamp = new Date().toISOString().replace(/[-:]/g, '').replace('T', '_').split('.')[0];
    link.setAttribute('href', url);
    link.setAttribute('download', `laporan_kunjungan_${timestamp}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle export to PDF
  const handleExportToPDF = () => {
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Laporan Kunjungan</title>
        <style>
          @page { size: A4 portrait; margin: 15mm; }
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: Arial, sans-serif; font-size: 10pt; line-height: 1.4; }
          .header { text-align: center; margin-bottom: 20px; border-bottom: 2px solid #0d9488; padding-bottom: 10px; }
          .header h1 { font-size: 18pt; color: #0d9488; margin-bottom: 5px; }
          .header p { font-size: 10pt; color: #666; }
          .info { margin-bottom: 15px; }
          .info p { margin-bottom: 3px; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          th, td { border: 1px solid #ddd; padding: 6px; text-align: left; font-size: 9pt; }
          th { background-color: #0d9488; color: white; font-weight: bold; }
          tr:nth-child(even) { background-color: #f9f9f9; }
          .footer { margin-top: 30px; text-align: right; font-size: 9pt; }
          .status { display: inline-block; padding: 2px 8px; border-radius: 10px; font-size: 8pt; }
          .status-selesai { background-color: #dcfce7; color: #166534; }
          .status-diperiksa { background-color: #dbeafe; color: #1e40af; }
          .status-menunggu { background-color: #fef3c7; color: #92400e; }
          .status-batal { background-color: #fee2e2; color: #991b1b; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>LAPORAN KUNJUNGAN PASIEN</h1>
          <p>Klinik Zaira</p>
        </div>
        <div class="info">
          <p><strong>Periode:</strong> ${formatDate(dateRange.start)} - ${formatDate(dateRange.end)}</p>
          <p><strong>Total Kunjungan:</strong> ${totalKunjungan} kunjungan</p>
          <p><strong>Dicetak:</strong> ${formatDate(new Date().toISOString())}</p>
        </div>
        <table>
          <thead>
            <tr>
              <th>Tanggal</th>
              <th>No. Kunjungan</th>
              <th>No. RM</th>
              <th>Nama Pasien</th>
              <th>Poli</th>
              <th>Dokter</th>
              <th>Status</th>
              <th>Pembayaran</th>
            </tr>
          </thead>
          <tbody>
            ${filteredKunjungan.map(item => {
              const pasien = getPasienById(item.pasienId);
              const poli = getPoliById(item.poliId);
              const dokter = getDokterById(item.dokterId);
              return `
                <tr>
                  <td>${formatDate(item.tanggal)}</td>
                  <td>${item.id}</td>
                  <td>${pasien?.noRM || '-'}</td>
                  <td>${pasien?.nama || '-'}</td>
                  <td>${poli?.nama || '-'}</td>
                  <td>${dokter?.nama || '-'}</td>
                  <td><span class="status status-${item.status}">${item.status}</span></td>
                  <td>${item.jenisPembayaran.toUpperCase()}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
        <div class="footer">
          <p>Klinik Zaira - ${formatDate(new Date().toISOString())}</p>
        </div>
      </body>
      </html>
    `;

    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    
    const iframeDoc = iframe.contentWindow?.document;
    if (iframeDoc) {
      iframeDoc.open();
      iframeDoc.write(printContent);
      iframeDoc.close();
      
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
      
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 1000);
    }
  };

  const columns = [
    {
      header: 'Tanggal',
      key: 'tanggal',
      render: (item: typeof kunjunganList[0]) => formatDate(item.tanggal),
    },
    {
      header: 'No. Kunjungan',
      key: 'id',
      render: (item: typeof kunjunganList[0]) => (
        <span className="font-mono text-teal-600">{item.id}</span>
      ),
    },
    {
      header: 'Pasien',
      key: 'pasienId',
      render: (item: typeof kunjunganList[0]) => {
        const pasien = getPasienById(item.pasienId);
        return (
          <div>
            <p className="font-medium">{pasien?.nama}</p>
            <p className="text-xs text-gray-500">{pasien?.noRM}</p>
          </div>
        );
      },
    },
    {
      header: 'Poli',
      key: 'poliId',
      render: (item: typeof kunjunganList[0]) => getPoliById(item.poliId)?.nama,
    },
    {
      header: 'Dokter',
      key: 'dokterId',
      render: (item: typeof kunjunganList[0]) => getDokterById(item.dokterId)?.nama,
    },
    {
      header: 'Status',
      key: 'status',
      render: (item: typeof kunjunganList[0]) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
        </span>
      ),
    },
    {
      header: 'Jenis',
      key: 'jenisPembayaran',
      render: (item: typeof kunjunganList[0]) => (
        <Badge variant={item.jenisPembayaran === 'bpjs' ? 'success' : 'info'}>
          {item.jenisPembayaran.toUpperCase()}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-6" suppressHydrationWarning>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Laporan Kunjungan</h1>
          <p className="text-gray-500">Analisis data kunjungan pasien</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2" onClick={handleExportToExcel}>
            <Download className="w-4 h-4" />
            Export Excel
          </Button>
          <Button variant="outline" className="gap-2" onClick={handleExportToPDF}>
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
              value={filterPoli}
              onChange={(e) => setFilterPoli(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="">Semua Poli</option>
              <option value="POL001">Poli Umum</option>
              <option value="POL002">Poli Gigi</option>
              <option value="POL003">Poli Anak</option>
              <option value="POL004">Poli KIA</option>
              <option value="POL005">Poli Mata</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="">Semua Status</option>
              <option value="selesai">Selesai</option>
              <option value="diperiksa">Diperiksa</option>
              <option value="menunggu">Menunggu</option>
              <option value="batal">Batal</option>
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
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-teal-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalKunjungan}</p>
              <p className="text-sm text-gray-500">Total Kunjungan</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 border-l-4 border-l-green-500">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <UserCheck className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{selesai}</p>
              <p className="text-sm text-gray-500">Selesai</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 border-l-4 border-l-red-500">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <UserX className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{dibatalkan}</p>
              <p className="text-sm text-gray-500">Batal</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 border-l-4 border-l-blue-500">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">
              {totalKunjungan > 0 ? Math.round((selesai / totalKunjungan) * 100) : 0}%
            </p>
            <p className="text-sm text-gray-500">Tingkat Kehadiran</p>
          </div>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Kunjungan per Poli */}
        <Card>
          <CardHeader>
            <CardTitle>Kunjungan per Poli</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(kunjunganByPoli).map(([poli, count]) => (
                <div key={poli} className="flex items-center gap-3">
                  <div className="w-24 text-sm font-medium truncate">{poli}</div>
                  <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-teal-500 rounded-full"
                      style={{ width: `${(count / totalKunjungan) * 100}%` }}
                    />
                  </div>
                  <span className="w-12 text-sm font-semibold text-right">{count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Kunjungan per Hari */}
        <Card>
          <CardHeader>
            <CardTitle>Distribusi Hari Kunjungan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(kunjunganByDay).map(([day, count]) => (
                <div key={day} className="flex items-center gap-3">
                  <div className="w-24 text-sm font-medium">{day}</div>
                  <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${(count / totalKunjungan) * 100}%` }}
                    />
                  </div>
                  <span className="w-12 text-sm font-semibold text-right">{count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trend Card */}
      <Card className="bg-gradient-to-r from-teal-50 to-cyan-50">
        <CardContent className="py-6">
          <div className="flex items-center gap-4 mb-4">
            <TrendingUp className="w-8 h-8 text-teal-600" />
            <div>
              <h3 className="font-semibold text-teal-800">Ringkasan Periode</h3>
              <p className="text-sm text-teal-600">{formatDate(dateRange.start)} - {formatDate(dateRange.end)}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg">
              <p className="text-3xl font-bold text-teal-600">{totalKunjungan}</p>
              <p className="text-sm text-gray-500">Total Kunjungan</p>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <p className="text-3xl font-bold text-blue-600">
                {Math.round(totalKunjungan / 30)}
              </p>
              <p className="text-sm text-gray-500">Rata-rata/Hari</p>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <p className="text-3xl font-bold text-purple-600">
                {filteredKunjungan.filter(k => k.jenisPembayaran === 'bpjs').length}
              </p>
              <p className="text-sm text-gray-500">Pasien BPJS</p>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <p className="text-3xl font-bold text-orange-600">
                {filteredKunjungan.filter(k => k.jenisPembayaran === 'umum').length}
              </p>
              <p className="text-sm text-gray-500">Pasien Umum</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detail Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Detail Kunjungan</CardTitle>
            <span className="text-sm text-gray-500">{filteredKunjungan.length} data</span>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={filteredKunjungan}
            emptyMessage="Tidak ada data kunjungan"
          />
        </CardContent>
      </Card>
    </div>
  );
}
