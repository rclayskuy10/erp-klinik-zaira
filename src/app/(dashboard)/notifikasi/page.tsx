'use client';

import React, { useState } from 'react';
import { Bell, Check, Trash2, Filter, AlertTriangle, Info, CheckCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Badge, Button } from '@/components/ui';

type NotificationType = 'all' | 'warning' | 'info' | 'danger' | 'success';

export default function NotifikasiPage() {
  const [filter, setFilter] = useState<NotificationType>('all');
  const [notifications, setNotifications] = useState([
    { 
      id: 1, 
      message: 'Obat Paracetamol stok hampir habis', 
      detail: 'Stok tersisa 15 box dari minimum 50 box',
      time: '5 menit lalu', 
      type: 'warning' as const,
      link: '/farmasi/stok',
      isRead: false,
    },
    { 
      id: 2, 
      message: 'Pasien baru terdaftar: Dewi Lestari', 
      detail: 'Pasien baru dengan No. RM P00089 telah berhasil didaftarkan',
      time: '15 menit lalu', 
      type: 'info' as const,
      link: '/master/pasien',
      isRead: false,
    },
    { 
      id: 3, 
      message: '3 obat akan kadaluarsa bulan ini', 
      detail: 'Obat: Amoxicillin, Cetirizine, Vitamin C',
      time: '1 jam lalu', 
      type: 'danger' as const,
      link: '/farmasi/kadaluarsa',
      isRead: false,
    },
    { 
      id: 4, 
      message: 'Pembayaran berhasil - Invoice #INV-2024-001', 
      detail: 'Pembayaran sebesar Rp 250.000 telah diterima',
      time: '2 jam lalu', 
      type: 'success' as const,
      link: '/kasir/pembayaran',
      isRead: true,
    },
    { 
      id: 5, 
      message: 'Stok obat Amoxicillin sudah habis', 
      detail: 'Segera lakukan pemesanan ulang',
      time: '3 jam lalu', 
      type: 'danger' as const,
      link: '/farmasi/stok',
      isRead: true,
    },
    { 
      id: 6, 
      message: '10 pasien baru bulan ini', 
      detail: 'Total pasien aktif: 850 pasien',
      time: '5 jam lalu', 
      type: 'info' as const,
      link: '/master/pasien',
      isRead: true,
    },
    { 
      id: 7, 
      message: 'Backup data berhasil dilakukan', 
      detail: 'Backup otomatis telah selesai pada 21 Jan 2026 03:00',
      time: '1 hari lalu', 
      type: 'success' as const,
      link: '/pengaturan',
      isRead: true,
    },
    { 
      id: 8, 
      message: 'Stok minimum obat Ibuprofen tercapai', 
      detail: 'Stok tersisa 50 box (minimum)',
      time: '2 hari lalu', 
      type: 'warning' as const,
      link: '/farmasi/stok',
      isRead: true,
    },
  ]);

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const handleDeleteAll = () => {
    const confirmed = confirm('Apakah Anda yakin ingin menghapus semua notifikasi?');
    if (confirmed) {
      setNotifications([]);
    }
  };

  const handleMarkAsRead = (id: number) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    ));
  };

  const handleDeleteNotification = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const filteredNotifications = filter === 'all' 
    ? notifications 
    : notifications.filter(n => n.type === filter);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'danger':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      default:
        return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  const getNotificationBg = (type: string, isRead: boolean) => {
    if (isRead) return 'bg-gray-50';
    
    switch (type) {
      case 'warning':
        return 'bg-yellow-50 border-l-4 border-yellow-500';
      case 'danger':
        return 'bg-red-50 border-l-4 border-red-500';
      case 'success':
        return 'bg-green-50 border-l-4 border-green-500';
      default:
        return 'bg-blue-50 border-l-4 border-blue-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Bell className="w-7 h-7" />
            Notifikasi
          </h1>
          <p className="text-gray-500 mt-1">
            {unreadCount > 0 ? `${unreadCount} notifikasi belum dibaca` : 'Semua notifikasi sudah dibaca'}
          </p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2"
            onClick={handleMarkAllAsRead}
            disabled={unreadCount === 0}
          >
            <Check className="w-4 h-4" />
            Tandai Semua Dibaca
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2"
            onClick={handleDeleteAll}
            disabled={notifications.length === 0}
          >
            <Trash2 className="w-4 h-4" />
            Hapus Semua
          </Button>
        </div>
      </div>

      {/* Filter */}
      <Card>
        <CardContent className="py-4">
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-4 h-4 text-gray-500" />
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-teal-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Semua ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('danger')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                filter === 'danger'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Penting ({notifications.filter(n => n.type === 'danger').length})
            </button>
            <button
              onClick={() => setFilter('warning')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                filter === 'warning'
                  ? 'bg-yellow-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Peringatan ({notifications.filter(n => n.type === 'warning').length})
            </button>
            <button
              onClick={() => setFilter('info')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                filter === 'info'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Sukses ({notifications.filter(n => n.type === 'success').length})
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Tidak ada notifikasi</p>
            </CardContent>
          </Card>
        ) : (
          filteredNotifications.map((notif) => (
            <Card
              key={notif.id}
              className={`hover:shadow-md transition-shadow cursor-pointer ${getNotificationBg(notif.type, notif.isRead)}`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notif.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <p className={`text-sm font-medium ${notif.isRead ? 'text-gray-600' : 'text-gray-800'}`}>
                          {notif.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{notif.detail}</p>
                        <p className="text-xs text-gray-400 mt-2">{notif.time}</p>
                      </div>
                      {!notif.isRead && (
                        <span className="flex-shrink-0 w-2 h-2 bg-teal-600 rounded-full mt-2"></span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMarkAsRead(notif.id);
                      }}
                      className="p-2 hover:bg-white rounded-lg transition-colors"
                      title="Tandai dibaca"
                      disabled={notif.isRead}
                    >
                      <Check className={`w-4 h-4 ${notif.isRead ? 'text-gray-300' : 'text-gray-500 hover:text-green-600'}`} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteNotification(notif.id);
                      }}
                      className="p-2 hover:bg-white rounded-lg transition-colors"
                      title="Hapus"
                    >
                      <Trash2 className="w-4 h-4 text-gray-500 hover:text-red-600" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Summary */}
      {filteredNotifications.length > 0 && (
        <div className="text-center text-sm text-gray-500">
          Menampilkan {filteredNotifications.length} dari {notifications.length} notifikasi
        </div>
      )}
    </div>
  );
}
