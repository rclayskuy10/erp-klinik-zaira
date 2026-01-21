'use client';

import React, { useState } from 'react';
import { Search, Plus, User, Shield, Edit, Trash2, Eye, EyeOff, Key, Check, X } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Button, Input, Badge, DataTable, Modal } from '@/components/ui';
import { users } from '@/data/dummy-data';
import { formatDate, getRoleColor } from '@/lib/utils';
import { User as UserType } from '@/types';

type TabType = 'users' | 'roles';

interface Permission {
  id: string;
  nama: string;
  deskripsi: string;
}

interface Role {
  id: string;
  nama: string;
  deskripsi: string;
  permissions: string[];
  jumlahUser: number;
}

const permissionsList: Permission[] = [
  { id: 'dashboard.view', nama: 'Lihat Dashboard', deskripsi: 'Akses ke halaman dashboard' },
  { id: 'master.view', nama: 'Lihat Master Data', deskripsi: 'Akses ke data master' },
  { id: 'master.edit', nama: 'Edit Master Data', deskripsi: 'Edit data pasien, dokter, dll' },
  { id: 'emr.view', nama: 'Lihat Rekam Medis', deskripsi: 'Akses ke rekam medis pasien' },
  { id: 'emr.edit', nama: 'Edit Rekam Medis', deskripsi: 'Input dan edit rekam medis' },
  { id: 'kasir.view', nama: 'Lihat Kasir', deskripsi: 'Akses ke modul kasir' },
  { id: 'kasir.process', nama: 'Proses Pembayaran', deskripsi: 'Memproses pembayaran pasien' },
  { id: 'farmasi.view', nama: 'Lihat Farmasi', deskripsi: 'Akses ke modul farmasi' },
  { id: 'farmasi.manage', nama: 'Kelola Stok', deskripsi: 'Kelola stok obat dan alat' },
  { id: 'laporan.view', nama: 'Lihat Laporan', deskripsi: 'Akses ke modul laporan' },
  { id: 'laporan.export', nama: 'Export Laporan', deskripsi: 'Export laporan ke Excel/PDF' },
  { id: 'users.view', nama: 'Lihat Pengguna', deskripsi: 'Akses ke daftar pengguna' },
  { id: 'users.manage', nama: 'Kelola Pengguna', deskripsi: 'Tambah, edit, hapus pengguna' },
  { id: 'settings.view', nama: 'Lihat Pengaturan', deskripsi: 'Akses ke pengaturan' },
  { id: 'settings.edit', nama: 'Edit Pengaturan', deskripsi: 'Ubah pengaturan klinik' },
];

const rolesList: Role[] = [
  {
    id: 'ROLE001',
    nama: 'Admin',
    deskripsi: 'Akses penuh ke semua fitur',
    permissions: permissionsList.map(p => p.id),
    jumlahUser: 2,
  },
  {
    id: 'ROLE002',
    nama: 'Dokter',
    deskripsi: 'Akses rekam medis dan kunjungan pasien',
    permissions: ['dashboard.view', 'master.view', 'emr.view', 'emr.edit', 'farmasi.view'],
    jumlahUser: 5,
  },
  {
    id: 'ROLE003',
    nama: 'Perawat',
    deskripsi: 'Akses untuk input data pasien dan asistensi',
    permissions: ['dashboard.view', 'master.view', 'emr.view', 'farmasi.view'],
    jumlahUser: 6,
  },
  {
    id: 'ROLE004',
    nama: 'Kasir',
    deskripsi: 'Akses modul kasir dan pembayaran',
    permissions: ['dashboard.view', 'kasir.view', 'kasir.process', 'laporan.view'],
    jumlahUser: 2,
  },
  {
    id: 'ROLE005',
    nama: 'Apoteker',
    deskripsi: 'Akses penuh ke modul farmasi',
    permissions: ['dashboard.view', 'farmasi.view', 'farmasi.manage', 'laporan.view'],
    jumlahUser: 2,
  },
];

export default function PenggunaPage() {
  const [activeTab, setActiveTab] = useState<TabType>('users');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [showFormModal, setShowFormModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [userFormData, setUserFormData] = useState({
    nama: '',
    email: '',
    username: '',
    password: '',
    role: 'staff' as UserType['role'],
    status: 'aktif' as UserType['status'],
  });

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchSearch = 
      user.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase());
    const matchRole = filterRole ? user.role === filterRole : true;
    return matchSearch && matchRole;
  });

  const handleSubmitUser = () => {
    alert(isEditing ? 'Pengguna berhasil diperbarui!' : 'Pengguna baru berhasil ditambahkan!');
    setShowFormModal(false);
    resetUserForm();
  };

  const resetUserForm = () => {
    setUserFormData({
      nama: '',
      email: '',
      username: '',
      password: '',
      role: 'staff',
      status: 'aktif',
    });
    setIsEditing(false);
    setShowPassword(false);
  };

  const handleEditUser = (user: UserType) => {
    setUserFormData({
      nama: user.nama,
      email: user.email,
      username: user.username,
      password: '',
      role: user.role,
      status: user.status,
    });
    setSelectedUser(user);
    setIsEditing(true);
    setShowFormModal(true);
  };

  const userColumns = [
    {
      header: 'Pengguna',
      key: 'nama',
      render: (item: UserType) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
            <span className="text-teal-600 font-semibold">
              {item.nama.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </span>
          </div>
          <div>
            <p className="font-medium">{item.nama}</p>
            <p className="text-xs text-gray-500">@{item.username}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Email',
      key: 'email',
      render: (item: UserType) => item.email,
    },
    {
      header: 'Role',
      key: 'role',
      render: (item: UserType) => (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(item.role)}`}>
          {item.role.charAt(0).toUpperCase() + item.role.slice(1)}
        </span>
      ),
    },
    {
      header: 'Status',
      key: 'status',
      render: (item: UserType) => (
        <Badge variant={item.status === 'aktif' ? 'success' : 'danger'}>
          {item.status === 'aktif' ? 'Aktif' : 'Non-Aktif'}
        </Badge>
      ),
    },
    {
      header: 'Login Terakhir',
      key: 'lastLogin',
      render: (item: UserType) => item.lastLogin ? formatDate(item.lastLogin) : '-',
    },
    {
      header: 'Aksi',
      key: 'id',
      render: (item: UserType) => (
        <div className="flex gap-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => {
              setSelectedUser(item);
              setShowDetailModal(true);
            }}
            suppressHydrationWarning
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => handleEditUser(item)}
            suppressHydrationWarning
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => alert(`Reset password untuk ${item.nama}`)}
            suppressHydrationWarning
          >
            <Key className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6" suppressHydrationWarning>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Kelola Pengguna</h1>
          <p className="text-gray-500">Atur pengguna dan hak akses sistem</p>
        </div>
        <Button type="button" onClick={() => setShowFormModal(true)} className="gap-2" suppressHydrationWarning>
          <Plus className="w-5 h-5" />
          Tambah Pengguna
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
              <User className="w-6 h-6 text-teal-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{users.length}</p>
              <p className="text-sm text-gray-500">Total Pengguna</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 border-l-4 border-l-green-500">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {users.filter(u => u.status === 'aktif').length}
            </p>
            <p className="text-sm text-gray-500">Aktif</p>
          </div>
        </Card>
        <Card className="p-4 border-l-4 border-l-purple-500">
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">{rolesList.length}</p>
            <p className="text-sm text-gray-500">Role</p>
          </div>
        </Card>
        <Card className="p-4 border-l-4 border-l-blue-500">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">
              {users.filter(u => u.role === 'admin').length}
            </p>
            <p className="text-sm text-gray-500">Admin</p>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b">
        <button
          onClick={() => setActiveTab('users')}
          className={`pb-3 px-4 font-medium transition-colors flex items-center gap-2 ${
            activeTab === 'users'
              ? 'text-teal-600 border-b-2 border-teal-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <User className="w-4 h-4" />
          Pengguna ({users.length})
        </button>
        <button
          onClick={() => setActiveTab('roles')}
          className={`pb-3 px-4 font-medium transition-colors flex items-center gap-2 ${
            activeTab === 'roles'
              ? 'text-teal-600 border-b-2 border-teal-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Shield className="w-4 h-4" />
          Role & Hak Akses ({rolesList.length})
        </button>
      </div>

      {activeTab === 'users' ? (
        <>
          {/* Filter & Search */}
          <Card>
            <CardContent className="py-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Cari pengguna..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="">Semua Role</option>
                  <option value="admin">Admin</option>
                  <option value="dokter">Dokter</option>
                  <option value="perawat">Perawat</option>
                  <option value="apoteker">Apoteker</option>
                  <option value="kasir">Kasir</option>
                  <option value="staff">Staff</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Users Table */}
          <Card>
            <CardHeader>
              <CardTitle>Daftar Pengguna</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={userColumns}
                data={filteredUsers}
                emptyMessage="Tidak ada pengguna ditemukan"
              />
            </CardContent>
          </Card>
        </>
      ) : (
        <>
          {/* Roles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rolesList.map(role => (
              <Card key={role.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                      <Shield className="w-6 h-6 text-purple-600" />
                    </div>
                    <Badge variant="info">{role.jumlahUser} user</Badge>
                  </div>
                  <h3 className="text-lg font-semibold mb-1">{role.nama}</h3>
                  <p className="text-sm text-gray-500 mb-4">{role.deskripsi}</p>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {role.permissions.slice(0, 3).map(perm => (
                      <span key={perm} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                        {perm.split('.')[0]}
                      </span>
                    ))}
                    {role.permissions.length > 3 && (
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                        +{role.permissions.length - 3} lainnya
                      </span>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      setSelectedRole(role);
                      setShowRoleModal(true);
                    }}
                  >
                    Lihat Detail
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* User Form Modal */}
      <Modal
        isOpen={showFormModal}
        onClose={() => {
          setShowFormModal(false);
          resetUserForm();
        }}
        title={isEditing ? 'Edit Pengguna' : 'Tambah Pengguna Baru'}
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap *</label>
            <Input
              value={userFormData.nama}
              onChange={(e) => setUserFormData({ ...userFormData, nama: e.target.value })}
              placeholder="Masukkan nama lengkap"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <Input
              type="email"
              value={userFormData.email}
              onChange={(e) => setUserFormData({ ...userFormData, email: e.target.value })}
              placeholder="email@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username *</label>
            <Input
              value={userFormData.username}
              onChange={(e) => setUserFormData({ ...userFormData, username: e.target.value })}
              placeholder="username"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password {isEditing ? '(kosongkan jika tidak ingin mengubah)' : '*'}
            </label>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                value={userFormData.password}
                onChange={(e) => setUserFormData({ ...userFormData, password: e.target.value })}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
              <select
                value={userFormData.role}
                onChange={(e) => setUserFormData({ ...userFormData, role: e.target.value as any })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="admin">Admin</option>
                <option value="dokter">Dokter</option>
                <option value="perawat">Perawat</option>
                <option value="apoteker">Apoteker</option>
                <option value="kasir">Kasir</option>
                <option value="staff">Staff</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={userFormData.status}
                onChange={(e) => setUserFormData({ ...userFormData, status: e.target.value as any })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="aktif">Aktif</option>
                <option value="nonaktif">Non-Aktif</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                setShowFormModal(false);
                resetUserForm();
              }}
            >
              Batal
            </Button>
            <Button
              className="flex-1"
              onClick={handleSubmitUser}
              disabled={!userFormData.nama || !userFormData.email || !userFormData.username || (!isEditing && !userFormData.password)}
            >
              {isEditing ? 'Simpan Perubahan' : 'Tambah Pengguna'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* User Detail Modal */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedUser(null);
        }}
        title="Detail Pengguna"
        size="md"
      >
        {selectedUser && (
          <div className="space-y-4">
            <div className="text-center pb-4 border-b">
              <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-teal-600 font-bold text-2xl">
                  {selectedUser.nama.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </span>
              </div>
              <h3 className="text-xl font-bold">{selectedUser.nama}</h3>
              <p className="text-gray-500">@{selectedUser.username}</p>
              <div className="flex justify-center gap-2 mt-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(selectedUser.role)}`}>
                  {selectedUser.role.charAt(0).toUpperCase() + selectedUser.role.slice(1)}
                </span>
                <Badge variant={selectedUser.status === 'aktif' ? 'success' : 'danger'}>
                  {selectedUser.status === 'aktif' ? 'Aktif' : 'Non-Aktif'}
                </Badge>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500">Email</span>
                <span className="font-medium">{selectedUser.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Login Terakhir</span>
                <span className="font-medium">
                  {selectedUser.lastLogin ? formatDate(selectedUser.lastLogin) : 'Belum pernah login'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Dibuat</span>
                <span className="font-medium">{formatDate(selectedUser.createdAt)}</span>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setShowDetailModal(false);
                  handleEditUser(selectedUser);
                }}
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => alert('Reset password')}
              >
                <Key className="w-4 h-4 mr-2" />
                Reset Password
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Role Detail Modal */}
      <Modal
        isOpen={showRoleModal}
        onClose={() => {
          setShowRoleModal(false);
          setSelectedRole(null);
        }}
        title="Detail Role & Permissions"
        size="lg"
      >
        {selectedRole && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 pb-4 border-b">
              <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center">
                <Shield className="w-8 h-8 text-purple-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold">{selectedRole.nama}</h3>
                <p className="text-gray-500">{selectedRole.deskripsi}</p>
                <Badge variant="info" className="mt-1">{selectedRole.jumlahUser} pengguna</Badge>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">Hak Akses ({selectedRole.permissions.length})</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {permissionsList.map(perm => {
                  const hasPermission = selectedRole.permissions.includes(perm.id);
                  return (
                    <div
                      key={perm.id}
                      className={`p-3 rounded-lg border flex items-start gap-3 ${
                        hasPermission ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                        hasPermission ? 'bg-green-500' : 'bg-gray-300'
                      }`}>
                        {hasPermission ? (
                          <Check className="w-3 h-3 text-white" />
                        ) : (
                          <X className="w-3 h-3 text-white" />
                        )}
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${hasPermission ? 'text-green-800' : 'text-gray-500'}`}>
                          {perm.nama}
                        </p>
                        <p className="text-xs text-gray-400">{perm.deskripsi}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
