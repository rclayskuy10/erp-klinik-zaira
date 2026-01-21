'use client';

import React, { useState, ReactNode, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import Header from './Header';
import LayoutContext, { useLayout as useLayoutContext } from './LayoutContext';
import { PageSkeleton } from '@/components/ui';

export const useLayout = useLayoutContext;

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentUser, setCurrentUser] = useState({
    id: 'USR001',
    nama: 'Admin Zaira',
    role: 'admin',
    email: 'admin@klinikzaira.com',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setCurrentUser(userData);
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('currentUser');
        window.location.href = '/login';
        return;
      }
    } else {
      // Redirect to login if no user
      window.location.href = '/login';
      return;
    }
    setIsLoading(false);
  }, []);

  // Add navigation loading effect
  useEffect(() => {
    setIsNavigating(true);
    const timer = setTimeout(() => {
      setIsNavigating(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-teal-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <LayoutContext.Provider value={{ sidebarOpen, setSidebarOpen, currentUser }}>
      <div className="min-h-screen bg-gray-50">
        <Sidebar />
        <div className={`transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`}>
          <Header />
          <main className="p-4 lg:p-6">
            {isNavigating ? (
              <PageSkeleton />
            ) : (
              children
            )}
          </main>
        </div>
      </div>
    </LayoutContext.Provider>
  );
}
