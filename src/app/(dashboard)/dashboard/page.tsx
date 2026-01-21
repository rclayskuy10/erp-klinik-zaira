'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { 
  Users, 
  Calendar, 
  Package, 
  DollarSign,
  TrendingUp,
  Activity,
  Clock,
  AlertCircle
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();

  const stats = [
    {
      title: 'Total Pasien Hari Ini',
      value: '48',
      icon: Users,
      color: 'bg-blue-500',
      trend: '+12%',
    },
    {
      title: 'Pendapatan Hari Ini',
      value: 'Rp 12.5 Jt',
      icon: DollarSign,
      color: 'bg-green-500',
      trend: '+8%',
    },
    {
      title: 'Antrian Aktif',
      value: '12',
      icon: Clock,
      color: 'bg-orange-500',
      trend: '-3',
    },
    {
      title: 'Stok Obat Menipis',
      value: '8',
      icon: AlertCircle,
      color: 'bg-red-500',
      trend: 'Perlu perhatian',
    },
  ];

  const recentActivities = [
    { id: 1, type: 'Kunjungan', patient: 'Dewi Lestari', time: '10 menit lalu', status: 'Selesai' },
    { id: 2, type: 'Pembayaran', patient: 'Ahmad Fauzi', time: '15 menit lalu', status: 'Lunas' },
    { id: 3, type: 'Kunjungan', patient: 'Siti Nurhaliza', time: '25 menit lalu', status: 'Proses' },
    { id: 4, type: 'Resep', patient: 'Budi Santoso', time: '30 menit lalu', status: 'Selesai' },
  ];

  const upcomingAppointments = [
    { id: 1, patient: 'Rini Kusuma', doctor: 'Dr. Sarah', time: '10:00', poli: 'Poli Umum' },
    { id: 2, patient: 'Andi Wijaya', doctor: 'Dr. Budi', time: '10:30', poli: 'Poli Gigi' },
    { id: 3, patient: 'Linda Sari', doctor: 'Dr. Sarah', time: '11:00', poli: 'Poli Umum' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500 mt-1">Selamat datang di ERP Klinik Zaira</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-medium">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-800 mt-2">{stat.value}</p>
                  <p className="text-sm text-gray-600 mt-2 flex items-center gap-1">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    {stat.trend}
                  </p>
                </div>
                <div className={`w-14 h-14 ${stat.color} rounded-xl flex items-center justify-center`}>
                  <stat.icon className="w-7 h-7 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts and Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Aktivitas Terkini
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{activity.patient}</p>
                    <p className="text-sm text-gray-500">{activity.type} • {activity.time}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    activity.status === 'Selesai' ? 'bg-green-100 text-green-700' :
                    activity.status === 'Lunas' ? 'bg-blue-100 text-blue-700' :
                    'bg-orange-100 text-orange-700'
                  }`}>
                    {activity.status}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Appointments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Jadwal Hari Ini
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingAppointments.map((appointment) => (
                <div key={appointment.id} className="p-3 border border-gray-200 rounded-lg hover:border-teal-300 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-800 text-sm">{appointment.time}</span>
                    <span className="text-xs px-2 py-1 bg-teal-100 text-teal-700 rounded-full">
                      {appointment.poli}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-gray-700">{appointment.patient}</p>
                  <p className="text-xs text-gray-500">{appointment.doctor}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Aksi Cepat</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4" suppressHydrationWarning>
            <button 
              type="button" 
              onClick={() => router.push('/master/pasien')}
              className="p-4 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors group cursor-pointer" 
              suppressHydrationWarning
            >
              <Users className="w-8 h-8 text-teal-600 mb-2 mx-auto group-hover:scale-110 transition-transform" />
              <p className="text-sm font-medium text-gray-700 text-center">Daftar Pasien</p>
            </button>
            <button 
              type="button" 
              onClick={() => router.push('/kasir/registrasi')}
              className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors group cursor-pointer" 
              suppressHydrationWarning
            >
              <Calendar className="w-8 h-8 text-blue-600 mb-2 mx-auto group-hover:scale-110 transition-transform" />
              <p className="text-sm font-medium text-gray-700 text-center">Buat Janji</p>
            </button>
            <button 
              type="button" 
              onClick={() => router.push('/kasir/pembayaran')}
              className="p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors group cursor-pointer" 
              suppressHydrationWarning
            >
              <DollarSign className="w-8 h-8 text-green-600 mb-2 mx-auto group-hover:scale-110 transition-transform" />
              <p className="text-sm font-medium text-gray-700 text-center">Pembayaran</p>
            </button>
            <button 
              type="button" 
              onClick={() => router.push('/farmasi/stok')}
              className="p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors group cursor-pointer" 
              suppressHydrationWarning
            >
              <Package className="w-8 h-8 text-orange-600 mb-2 mx-auto group-hover:scale-110 transition-transform" />
              <p className="text-sm font-medium text-gray-700 text-center">Stok Farmasi</p>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
