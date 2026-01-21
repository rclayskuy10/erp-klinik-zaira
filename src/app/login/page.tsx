'use client';

import React, { useState, useEffect } from 'react';
import { LogIn } from 'lucide-react';
import { Button, Card, CardHeader, CardTitle, CardContent } from '@/components/ui';

interface UserData {
  id: string;
  nama: string;
  role: 'admin' | 'dokter' | 'kasir' | 'farmasi' | 'perawat';
  email: string;
}

const availableUsers: UserData[] = [
  {
    id: 'USR001',
    nama: 'Admin Zaira',
    role: 'admin',
    email: 'admin@klinikzaira.com',
  },
  {
    id: 'USR002',
    nama: 'Dr. Ahmad Fauzi',
    role: 'dokter',
    email: 'ahmad.fauzi@klinikzaira.com',
  },
  {
    id: 'USR003',
    nama: 'Siti Nurhaliza',
    role: 'kasir',
    email: 'siti.nurhaliza@klinikzaira.com',
  },
  {
    id: 'USR004',
    nama: 'Budi Santoso',
    role: 'farmasi',
    email: 'budi.santoso@klinikzaira.com',
  },
  {
    id: 'USR005',
    nama: 'Dewi Lestari',
    role: 'perawat',
    email: 'dewi.lestari@klinikzaira.com',
  },
];

const getRoleBadgeColor = (role: string) => {
  const colors: Record<string, string> = {
    admin: 'bg-purple-100 text-purple-700',
    dokter: 'bg-blue-100 text-blue-700',
    kasir: 'bg-green-100 text-green-700',
    farmasi: 'bg-orange-100 text-orange-700',
    perawat: 'bg-pink-100 text-pink-700',
  };
  return colors[role] || 'bg-gray-100 text-gray-700';
};

export default function LoginPage() {
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);

  useEffect(() => {
    // If already logged in, redirect to dashboard
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      window.location.href = '/dashboard';
    }
  }, []);

  const handleLogin = () => {
    if (selectedUser) {
      // Save to localStorage
      localStorage.setItem('currentUser', JSON.stringify(selectedUser));
      // Force redirect to dashboard
      window.location.href = '/dashboard';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-500 to-cyan-600 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center border-b pb-6">
          <div className="w-16 h-16 bg-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <LogIn className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold text-gray-800">Klinik Zaira ERP</CardTitle>
          <p className="text-gray-500 mt-2">Pilih pengguna untuk login</p>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-3 mb-6">
            {availableUsers.map((user) => (
              <button
                key={user.id}
                onClick={() => setSelectedUser(user)}
                className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                  selectedUser?.id === user.id
                    ? 'border-teal-600 bg-teal-50'
                    : 'border-gray-200 hover:border-teal-300 bg-white'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-medium ${
                    selectedUser?.id === user.id ? 'bg-teal-600' : 'bg-gray-400'
                  }`}>
                    {user.nama.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-gray-800">{user.nama}</p>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                  {selectedUser?.id === user.id && (
                    <div className="w-6 h-6 bg-teal-600 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>

          <Button
            onClick={handleLogin}
            disabled={!selectedUser}
            className="w-full gap-2"
            size="lg"
          >
            <LogIn className="w-5 h-5" />
            Masuk sebagai {selectedUser?.nama || 'Pengguna'}
          </Button>

          <p className="text-center text-sm text-gray-500 mt-4">
            Demo Mode - Pilih user untuk mengakses sistem dengan role berbeda
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
