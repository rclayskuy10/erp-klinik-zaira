'use client';

import React from 'react';
import { 
  Users, 
  Calendar, 
  DollarSign, 
  AlertTriangle, 
  Clock,
  TrendingUp,
  Activity,
  Pill,
  FileText,
  ArrowRight,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, StatCard, Badge, Button } from '@/components/ui';
import { 
  dashboardStats, 
  registrasiList, 
  pasienList, 
  dokterList, 
  poliList,
  obatList,
  getPasienById,
  getDokterById,
  getPoliById,
} from '@/data/dummy-data';
import { formatCurrency, getStatusColor, getJenisPembayaranColor } from '@/lib/utils';
import Link from 'next/link';

export default function DashboardContent() {
  const antrianHariIni = registrasiList.filter(r => {
    const today = new Date();
    const regDate = new Date(r.tanggal);
    return regDate.toDateString() === today.toDateString();
  });

  const obatHampirHabis = obatList.filter(o => o.stok <= o.minimumStok);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-500">Selamat datang di Klinik Zaira ERP System</p>
        </div>
        <div className="flex gap-3">
          <Link href="/kasir/registrasi">
            <Button>
              <Calendar className="w-4 h-4" />
              Registrasi Baru
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Pasien"
          value={dashboardStats.totalPasien}
          icon={Users}
          color="blue"
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Kunjungan Hari Ini"
          value={dashboardStats.kunjunganHariIni}
          icon={Activity}
          color="green"
        />
        <StatCard
          title="Pendapatan Hari Ini"
          value={formatCurrency(dashboardStats.pendapatanHariIni)}
          icon={DollarSign}
          color="teal"
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          title="Antrian Menunggu"
          value={dashboardStats.antrianMenunggu}
          icon={Clock}
          color="yellow"
        />
      </div>

      {/* Second Row Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Pendapatan Bulan Ini"
          value={formatCurrency(dashboardStats.pendapatanBulanIni)}
          icon={TrendingUp}
          color="green"
          trend={{ value: 15, isPositive: true }}
        />
        <StatCard
          title="Obat Hampir Habis"
          value={dashboardStats.obatHampirHabis}
          icon={Pill}
          color="red"
        />
        <StatCard
          title="Obat Kadaluarsa"
          value={dashboardStats.obatKadaluarsa}
          icon={AlertTriangle}
          color="red"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Antrian Hari Ini */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Antrian Hari Ini</CardTitle>
            <Link href="/kasir/antrian">
              <Button variant="ghost" size="sm">
                Lihat Semua
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">No. Antrian</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Pasien</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Poli</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Dokter</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Jenis</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {antrianHariIni.slice(0, 5).map((reg) => {
                    const pasien = getPasienById(reg.pasienId);
                    const dokter = getDokterById(reg.dokterId);
                    const poli = getPoliById(reg.poliId);
                    return (
                      <tr key={reg.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <span className="font-semibold text-teal-600">{reg.nomorAntrian}</span>
                        </td>
                        <td className="px-4 py-3">
                          <div>
                            <p className="font-medium text-gray-800">{pasien?.nama}</p>
                            <p className="text-xs text-gray-500">{pasien?.noRM}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-700">{poli?.nama}</td>
                        <td className="px-4 py-3 text-gray-700">{dokter?.nama}</td>
                        <td className="px-4 py-3">
                          <Badge variant={reg.jenisPembayaran === 'bpjs' ? 'success' : 'info'}>
                            {reg.jenisPembayaran.toUpperCase()}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(reg.status)}`}>
                            {reg.status.charAt(0).toUpperCase() + reg.status.slice(1)}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats / Alerts */}
        <div className="space-y-6">
          {/* Obat Hampir Habis Alert */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
                Stok Menipis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {obatHampirHabis.slice(0, 4).map((obat) => (
                <div key={obat.id} className="flex items-center justify-between p-2 bg-yellow-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800 text-sm">{obat.nama}</p>
                    <p className="text-xs text-gray-500">Min: {obat.minimumStok}</p>
                  </div>
                  <Badge variant="warning">{obat.stok} {obat.satuan}</Badge>
                </div>
              ))}
              <Link href="/farmasi/stok">
                <Button variant="outline" size="sm" className="w-full">
                  Lihat Semua
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Dokter Praktik Hari Ini */}
          <Card>
            <CardHeader>
              <CardTitle>Dokter Praktik Hari Ini</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {dokterList.slice(0, 4).map((dokter) => {
                const poli = getPoliById(dokter.poliId);
                return (
                  <div key={dokter.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 font-semibold">
                      {dokter.nama.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800 text-sm">{dokter.nama}</p>
                      <p className="text-xs text-gray-500">{poli?.nama}</p>
                    </div>
                    <Badge variant={dokter.isActive ? 'success' : 'default'}>
                      {dokter.isActive ? 'Aktif' : 'Tidak Aktif'}
                    </Badge>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Patients */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Pasien Terbaru</CardTitle>
            <Link href="/master/pasien">
              <Button variant="ghost" size="sm">
                Lihat Semua
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {pasienList.slice(0, 5).map((pasien) => (
              <div key={pasien.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                  {pasien.nama.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800 text-sm">{pasien.nama}</p>
                  <p className="text-xs text-gray-500">{pasien.noRM}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">{pasien.telepon}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Summary by Poli */}
        <Card>
          <CardHeader>
            <CardTitle>Kunjungan per Poli</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {poliList.map((poli, index) => {
              const count = Math.floor(Math.random() * 20) + 5;
              const percentage = (count / 50) * 100;
              return (
                <div key={poli.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">{poli.nama}</span>
                    <span className="text-sm text-gray-500">{count} kunjungan</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-teal-600 h-2 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
