'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useLayout } from './LayoutContext';
import { 
  Menu, 
  Bell, 
  Search, 
  LogOut, 
  User,
  ChevronDown,
} from 'lucide-react';
import { getRoleColor } from '@/lib/utils';

export default function Header() {
  const router = useRouter();
  const { sidebarOpen, setSidebarOpen, currentUser } = useLayout();
  const [showUserMenu, setShowUserMenu] = React.useState(false);
  const [showNotifications, setShowNotifications] = React.useState(false);

  const handleLogout = () => {
    // Close menu
    setShowUserMenu(false);
    // Remove user data
    localStorage.removeItem('currentUser');
    // Force redirect
    window.location.href = '/login';
  };

  const notifications = [
    { id: 1, message: 'Obat Paracetamol stok hampir habis', time: '5 menit lalu', type: 'warning', link: '/farmasi/stok' },
    { id: 2, message: 'Pasien baru terdaftar: Dewi Lestari', time: '15 menit lalu', type: 'info', link: '/master/pasien' },
    { id: 3, message: '3 obat akan kadaluarsa bulan ini', time: '1 jam lalu', type: 'danger', link: '/farmasi/kadaluarsa' },
  ];

  return (
    <>
      {/* Backdrop overlay ketika menu dibuka */}
      {(showNotifications || showUserMenu) && (
        <div 
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
          onClick={() => {
            setShowNotifications(false);
            setShowUserMenu(false);
          }}
        />
      )}
      
      <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200">
        <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Left side */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 lg:hidden"
            suppressHydrationWarning
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowUserMenu(false);
              }}
              className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
              suppressHydrationWarning
            >
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-[60]">
                <div className="px-4 py-2 border-b border-gray-100">
                  <h3 className="font-semibold text-gray-800">Notifikasi</h3>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => {
                        setShowNotifications(false);
                        router.push(notif.link);
                      }}
                      className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-0 transition-colors"
                    >
                      <p className="text-sm text-gray-700">{notif.message}</p>
                      <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-2 border-t border-gray-100">
                  <button 
                    onClick={() => {
                      setShowNotifications(false);
                      router.push('/notifikasi');
                    }}
                    className="text-sm text-teal-600 hover:text-teal-700 font-medium transition-colors" 
                    suppressHydrationWarning
                  >
                    Lihat semua notifikasi
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => {
                setShowUserMenu(!showUserMenu);
                setShowNotifications(false);
              }}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              suppressHydrationWarning
            >
              <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center text-white text-sm font-medium">
                {currentUser.nama.charAt(0)}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-700">{currentUser.nama}</p>
                <p className={`text-xs px-1.5 py-0.5 rounded ${getRoleColor(currentUser.role)}`}>
                  {currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)}
                </p>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400 hidden md:block" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-[60]">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-800">{currentUser.nama}</p>
                  <p className="text-xs text-gray-500">{currentUser.email}</p>
                </div>
                <div className="py-1">
                  <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" suppressHydrationWarning>
                    <User className="w-4 h-4" />
                    Profil Saya
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50" 
                    suppressHydrationWarning
                  >
                    <LogOut className="w-4 h-4" />
                    Keluar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
    </>
  );
}
