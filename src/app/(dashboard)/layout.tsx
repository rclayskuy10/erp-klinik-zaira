'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import MainLayout from "@/components/layout/MainLayout";

// Define role permissions
const rolePermissions: Record<string, string[]> = {
  admin: ['*'], // Admin has access to everything
  dokter: ['/dashboard', '/emr'],
  kasir: ['/dashboard', '/kasir'],
  farmasi: ['/dashboard', '/farmasi'],
  perawat: ['/dashboard', '/emr'],
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (!storedUser) {
      router.push('/login');
      return;
    }

    try {
      const user = JSON.parse(storedUser);
      const userPermissions = rolePermissions[user.role] || [];
      
      // Admin has access to everything
      if (user.role === 'admin' || userPermissions.includes('*')) {
        setIsAuthorized(true);
        setIsChecking(false);
        return;
      }

      // Check if user has permission to access current path
      const hasAccess = userPermissions.some(permission => 
        pathname.startsWith(permission)
      );

      if (hasAccess) {
        setIsAuthorized(true);
      } else {
        alert(`Akses ditolak! Role "${user.role}" tidak memiliki akses ke halaman ini.`);
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Error checking permissions:', error);
      router.push('/login');
    }
    setIsChecking(false);
  }, [pathname, router]);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-teal-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Checking access...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return <MainLayout>{children}</MainLayout>;
}
