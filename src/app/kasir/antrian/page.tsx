'use client';

import React, { useState } from 'react';
import { Volume2, Check, X, User } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Button, Badge } from '@/components/ui';
import { registrasiList, getPasienById, getDokterById, getPoliById } from '@/data/dummy-data';
import { getStatusColor } from '@/lib/utils';

export default function AntrianPage() {
  const [selectedPoli, setSelectedPoli] = useState('');
  
  const antrianHariIni = registrasiList.filter(r => {
    const today = new Date();
    const regDate = new Date(r.tanggal);
    return regDate.toDateString() === today.toDateString();
  });

  const filteredAntrian = selectedPoli
    ? antrianHariIni.filter(a => a.poliId === selectedPoli)
    : antrianHariIni;

  const groupedByPoli = filteredAntrian.reduce((acc, reg) => {
    if (!acc[reg.poliId]) {
      acc[reg.poliId] = [];
    }
    acc[reg.poliId].push(reg);
    return acc;
  }, {} as Record<string, typeof antrianHariIni>);

  const handlePanggil = (id: string) => {
    alert(`Memanggil antrian ${id}`);
  };

  const handleSelesai = (id: string) => {
    alert(`Antrian ${id} selesai`);
  };

  const handleBatal = (id: string) => {
    alert(`Membatalkan antrian ${id}`);
  };

  return (
    <div className="space-y-6" suppressHydrationWarning>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Antrian Hari Ini</h1>
          <p className="text-gray-500">Kelola antrian pasien per poli</p>
        </div>
        <div className="flex gap-3">
          <select
            value={selectedPoli}
            onChange={(e) => setSelectedPoli(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="">Semua Poli</option>
            <option value="POL001">Poli Umum</option>
            <option value="POL002">Poli Gigi</option>
            <option value="POL003">Poli Anak</option>
            <option value="POL004">Poli KIA</option>
            <option value="POL005">Poli Mata</option>
          </select>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <p className="text-3xl font-bold text-gray-800">{antrianHariIni.length}</p>
          <p className="text-sm text-gray-500">Total Antrian</p>
        </Card>
        <Card className="p-4 text-center border-l-4 border-l-yellow-500">
          <p className="text-3xl font-bold text-yellow-600">
            {antrianHariIni.filter(a => a.status === 'menunggu').length}
          </p>
          <p className="text-sm text-gray-500">Menunggu</p>
        </Card>
        <Card className="p-4 text-center border-l-4 border-l-purple-500">
          <p className="text-3xl font-bold text-purple-600">
            {antrianHariIni.filter(a => a.status === 'diperiksa').length}
          </p>
          <p className="text-sm text-gray-500">Diperiksa</p>
        </Card>
        <Card className="p-4 text-center border-l-4 border-l-green-500">
          <p className="text-3xl font-bold text-green-600">
            {antrianHariIni.filter(a => a.status === 'selesai').length}
          </p>
          <p className="text-sm text-gray-500">Selesai</p>
        </Card>
      </div>

      {/* Queue Display by Poli */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Object.entries(groupedByPoli).map(([poliId, antrian]) => {
          const poli = getPoliById(poliId);
          const currentNumber = antrian.find(a => a.status === 'diperiksa')?.nomorAntrian || 
                               antrian.find(a => a.status === 'menunggu')?.nomorAntrian || 0;
          
          return (
            <Card key={poliId}>
              <CardHeader className="bg-teal-50">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-teal-800">{poli?.nama}</CardTitle>
                  <div className="text-center">
                    <p className="text-xs text-gray-500">Nomor Sekarang</p>
                    <p className="text-4xl font-bold text-teal-600">{currentNumber}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0 divide-y">
                {antrian.length > 0 ? (
                  antrian.map((reg) => {
                    const pasien = getPasienById(reg.pasienId);
                    const dokter = getDokterById(reg.dokterId);
                    return (
                      <div
                        key={reg.id}
                        className={`p-4 flex items-center gap-4 ${
                          reg.status === 'diperiksa' ? 'bg-purple-50' : ''
                        }`}
                      >
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold ${
                          reg.status === 'diperiksa' 
                            ? 'bg-purple-600 text-white' 
                            : reg.status === 'menunggu'
                            ? 'bg-yellow-100 text-yellow-600'
                            : 'bg-green-100 text-green-600'
                        }`}>
                          {reg.nomorAntrian}
                        </div>
                        
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">{pasien?.nama}</p>
                          <p className="text-xs text-gray-500">{pasien?.noRM} • {reg.jamRegistrasi}</p>
                          <div className="flex gap-2 mt-1">
                            <Badge variant={reg.jenisPembayaran === 'bpjs' ? 'success' : 'info'}>
                              {reg.jenisPembayaran.toUpperCase()}
                            </Badge>
                            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(reg.status)}`}>
                              {reg.status.charAt(0).toUpperCase() + reg.status.slice(1)}
                            </span>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          {reg.status === 'menunggu' && (
                            <>
                              <Button
                                type="button"
                                size="sm"
                                onClick={() => handlePanggil(reg.id)}
                                className="gap-1"
                                suppressHydrationWarning
                              >
                                <Volume2 className="w-4 h-4" />
                                Panggil
                              </Button>
                              <Button
                                type="button"
                                size="sm"
                                variant="danger"
                                onClick={() => handleBatal(reg.id)}
                                suppressHydrationWarning
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                          {reg.status === 'diperiksa' && (
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => handleSelesai(reg.id)}
                              className="gap-1"
                              suppressHydrationWarning
                            >
                              <Check className="w-4 h-4" />
                              Selesai
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    <User className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>Tidak ada antrian</p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}

        {Object.keys(groupedByPoli).length === 0 && (
          <Card className="col-span-full p-12 text-center">
            <User className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500 text-lg">Belum ada antrian hari ini</p>
          </Card>
        )}
      </div>

      {/* Large Display for Waiting Room (could be shown on TV) */}
      <Card className="bg-gradient-to-r from-teal-600 to-teal-800 text-white">
        <CardContent className="py-8">
          <div className="text-center">
            <p className="text-lg mb-2">Nomor Antrian Sekarang</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['POL001', 'POL002', 'POL003', 'POL004'].map(poliId => {
                const poli = getPoliById(poliId);
                const currentReg = antrianHariIni.find(a => a.poliId === poliId && a.status === 'diperiksa');
                return (
                  <div key={poliId} className="bg-white/10 rounded-xl p-4">
                    <p className="text-sm opacity-80">{poli?.nama}</p>
                    <p className="text-5xl font-bold mt-2">
                      {currentReg?.nomorAntrian || '-'}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
