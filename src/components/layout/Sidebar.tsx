'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLayout } from './LayoutContext';
import {
  LayoutDashboard,
  Users,
  UserCog,
  Stethoscope,
  FileText,
  Receipt,
  Pill,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Building2,
  ClipboardList,
  CreditCard,
  Package,
  FileBarChart,
  UserCircle,
  Layers,
  Activity,
} from 'lucide-react';

interface MenuItem {
  name: string;
  href: string;
  icon: React.ElementType;
  roles?: string[]; // roles that can access this menu
  children?: MenuItem[];
}

const menuItems: MenuItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['admin', 'dokter', 'kasir', 'farmasi', 'perawat'] },
  {
    name: 'Master Data',
    href: '/master',
    icon: Layers,
    roles: ['admin', 'dokter', 'kasir', 'perawat'],
    children: [
      { name: 'Data Pasien', href: '/master/pasien', icon: Users, roles: ['admin', 'dokter', 'kasir', 'perawat'] },
      { name: 'Dokter & Tenaga Medis', href: '/master/dokter', icon: UserCog, roles: ['admin'] },
      { name: 'Poli', href: '/master/poli', icon: Building2, roles: ['admin'] },
      { name: 'Layanan', href: '/master/layanan', icon: ClipboardList, roles: ['admin'] },
      { name: 'Obat & Alat Medis', href: '/master/obat', icon: Pill, roles: ['admin'] },
      { name: 'Kategori Tarif', href: '/master/tarif', icon: CreditCard, roles: ['admin'] },
    ],
  },
  {
    name: 'Rekam Medis',
    href: '/emr',
    icon: FileText,
    roles: ['admin', 'dokter', 'perawat'],
    children: [
      { name: 'Daftar Kunjungan', href: '/emr/kunjungan', icon: Activity, roles: ['admin', 'dokter', 'perawat'] },
      { name: 'Rekam Medis', href: '/emr/rekam-medis', icon: FileText, roles: ['admin', 'dokter', 'perawat'] },
    ],
  },
  {
    name: 'Kasir & Billing',
    href: '/kasir',
    icon: Receipt,
    roles: ['admin', 'kasir', 'perawat'],
    children: [
      { name: 'Registrasi', href: '/kasir/registrasi', icon: ClipboardList, roles: ['admin', 'kasir', 'perawat'] },
      { name: 'Antrian', href: '/kasir/antrian', icon: Users, roles: ['admin', 'kasir', 'perawat'] },
      { name: 'Pembayaran', href: '/kasir/pembayaran', icon: CreditCard, roles: ['admin', 'kasir'] },
      { name: 'Daftar Invoice', href: '/kasir/invoice', icon: Receipt, roles: ['admin', 'kasir'] },
    ],
  },
  {
    name: 'Farmasi & Inventory',
    href: '/farmasi',
    icon: Pill,
    roles: ['admin', 'farmasi'],
    children: [
      { name: 'Stok Obat', href: '/farmasi/stok', icon: Package, roles: ['admin', 'farmasi'] },
      { name: 'Stok Masuk', href: '/farmasi/stok-masuk', icon: Package, roles: ['admin', 'farmasi'] },
      { name: 'Stok Keluar', href: '/farmasi/stok-keluar', icon: Package, roles: ['admin', 'farmasi'] },
      { name: 'Obat Kadaluarsa', href: '/farmasi/kadaluarsa', icon: Pill, roles: ['admin', 'farmasi'] },
      { name: 'Supplier', href: '/farmasi/supplier', icon: Building2, roles: ['admin', 'farmasi'] },
    ],
  },
  {
    name: 'Laporan',
    href: '/laporan',
    icon: BarChart3,
    roles: ['admin', 'dokter', 'kasir', 'farmasi'],
    children: [
      { name: 'Laporan Kunjungan', href: '/laporan/kunjungan', icon: FileBarChart, roles: ['admin', 'dokter'] },
      { name: 'Laporan Pendapatan', href: '/laporan/pendapatan', icon: FileBarChart, roles: ['admin', 'kasir'] },
      { name: 'Laporan Obat', href: '/laporan/obat', icon: FileBarChart, roles: ['admin', 'farmasi'] },
      { name: 'Laporan Stok', href: '/laporan/stok', icon: FileBarChart, roles: ['admin', 'farmasi'] },
    ],
  },
  {
    name: 'Pengguna',
    href: '/pengguna',
    icon: UserCircle,
    roles: ['admin'],
  },
  { name: 'Pengaturan', href: '/pengaturan', icon: Settings, roles: ['admin'] },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, setSidebarOpen, currentUser } = useLayout();
  const [expandedMenus, setExpandedMenus] = React.useState<string[]>(['Master Data', 'Rekam Medis', 'Kasir & Billing', 'Farmasi & Inventory', 'Laporan']);

  // Filter menu items based on user role
  const filteredMenuItems = menuItems.filter(item => {
    if (!item.roles) return true;
    return item.roles.includes(currentUser.role);
  }).map(item => {
    if (item.children) {
      return {
        ...item,
        children: item.children.filter(child => {
          if (!child.roles) return true;
          return child.roles.includes(currentUser.role);
        })
      };
    }
    return item;
  });

  const toggleMenu = (name: string) => {
    setExpandedMenus(prev =>
      prev.includes(name)
        ? prev.filter(item => item !== name)
        : [...prev, name]
    );
  };

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/' || pathname === '/dashboard';
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen bg-gradient-to-b from-teal-700 to-teal-900 text-white transition-all duration-300 flex flex-col ${
          sidebarOpen ? 'w-64' : 'w-20'
        } ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Logo */}
        <div className={`flex items-center h-16 px-4 border-b border-teal-600 flex-shrink-0 ${
          sidebarOpen ? 'justify-between' : 'justify-center'
        }`}>
          {sidebarOpen ? (
            <div className="flex items-center gap-2">
              <Stethoscope className="w-8 h-8" />
              <div>
                <h1 className="font-bold text-lg leading-tight">Klinik Zaira</h1>
                <p className="text-xs text-teal-200">ERP System</p>
              </div>
            </div>
          ) : (
            <Stethoscope className="w-8 h-8" />
          )}
        </div>

        {/* Toggle button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute -right-3 top-20 bg-teal-600 rounded-full p-1 shadow-lg hover:bg-teal-500 transition-colors hidden lg:block"
        >
          {sidebarOpen ? (
            <ChevronLeft className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </button>

        {/* Navigation */}
        <nav className="flex-1 py-4 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <ul className="space-y-0.5 px-3">
            {menuItems.map((item) => (
              <li key={item.name}>
                {item.children ? (
                  <div>
                    <button
                      onClick={() => toggleMenu(item.name)}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                        isActive(item.href)
                          ? 'bg-white/10 text-white'
                          : 'text-teal-100 hover:bg-white/5 hover:text-white'
                      } ${!sidebarOpen && 'justify-center'}`}
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      {sidebarOpen && (
                        <>
                          <span className="flex-1 text-left">{item.name}</span>
                          <ChevronRight
                            className={`w-4 h-4 transition-transform flex-shrink-0 ${
                              expandedMenus.includes(item.name) ? 'rotate-90' : ''
                            }`}
                          />
                        </>
                      )}
                    </button>
                    {sidebarOpen && expandedMenus.includes(item.name) && (
                      <ul className="mt-0.5 space-y-0.5 py-1">
                        {item.children.map((child) => (
                          <li key={child.name}>
                            <Link
                              href={child.href}
                              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all ml-3 ${
                                pathname === child.href
                                  ? 'bg-white/15 text-white font-medium'
                                  : 'text-teal-200 hover:bg-white/5 hover:text-white'
                              }`}
                            >
                              <child.icon className="w-4 h-4 flex-shrink-0" />
                              <span className="flex-1">{child.name}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      isActive(item.href)
                        ? 'bg-white/10 text-white'
                        : 'text-teal-100 hover:bg-white/5 hover:text-white'
                    } ${!sidebarOpen && 'justify-center'}`}
                    title={!sidebarOpen ? item.name : undefined}
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    {sidebarOpen && <span className="flex-1">{item.name}</span>}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
}
