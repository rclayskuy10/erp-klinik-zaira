'use client';

import React, { useState, ReactNode } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import LayoutContext, { useLayout as useLayoutContext } from './LayoutContext';

export const useLayout = useLayoutContext;

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Simulated current user - in real app this would come from auth
  const currentUser = {
    id: 'USR001',
    nama: 'Admin Zaira',
    role: 'admin',
    email: 'admin@klinikzaira.com',
  };

  return (
    <LayoutContext.Provider value={{ sidebarOpen, setSidebarOpen, currentUser }}>
      <div className="min-h-screen bg-gray-50">
        <Sidebar />
        <div className={`transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`}>
          <Header />
          <main className="p-4 lg:p-6">
            {children}
          </main>
        </div>
      </div>
    </LayoutContext.Provider>
  );
}
