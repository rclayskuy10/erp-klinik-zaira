'use client';

import React, { useState } from 'react';
import { Search, CreditCard, Banknote, QrCode, Printer, Check, Clock, Eye } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Button, Input, Badge, DataTable, Modal } from '@/components/ui';
import { kunjunganList, invoiceList, getPasienById, getDokterById, getPoliById, layananList, obatList } from '@/data/dummy-data';
import { formatCurrency, formatDate, getStatusColor } from '@/lib/utils';
import { Invoice } from '@/types';

type PaymentMethod = 'tunai' | 'kartu' | 'qris';

export default function PembayaranPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [selectedInvoice, setSelectedInvoice] = useState<(typeof invoiceList)[0] | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('tunai');
  const [cashAmount, setCashAmount] = useState('');
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Filter invoices
  const filteredInvoices = invoiceList.filter(inv => {
    const pasien = getPasienById(inv.pasienId);
    const matchSearch = pasien?.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       inv.noInvoice.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter ? inv.status === statusFilter : true;
    return matchSearch && matchStatus;
  });

  const handlePayment = () => {
    if (selectedInvoice) {
      alert(`Pembayaran berhasil!\n\nInvoice: ${selectedInvoice.noInvoice}\nMetode: ${paymentMethod}\nTotal: ${formatCurrency(selectedInvoice.grandTotal)}`);
      setShowPaymentModal(false);
      setSelectedInvoice(null);
      setCashAmount('');
    }
  };

  // Fungsi untuk generate konten print invoice
  const generateInvoicePrintContent = (invoice: Invoice) => {
    const pasien = getPasienById(invoice.pasienId);
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title></title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: Arial, sans-serif; padding: 20px; font-size: 12px; max-width: 80mm; margin: 0 auto; }
          .header { text-align: center; border-bottom: 1px dashed #000; padding-bottom: 10px; margin-bottom: 10px; }
          .header h1 { font-size: 16px; margin-bottom: 5px; }
          .header p { font-size: 10px; }
          .info { margin-bottom: 10px; font-size: 11px; }
          .info-row { display: flex; justify-content: space-between; margin: 3px 0; }
          .items { border-top: 1px dashed #000; border-bottom: 1px dashed #000; padding: 10px 0; margin: 10px 0; }
          .item { margin-bottom: 8px; }
          .item-name { font-weight: 600; }
          .item-detail { display: flex; justify-content: space-between; font-size: 11px; color: #666; }
          .totals { margin-top: 10px; }
          .total-row { display: flex; justify-content: space-between; margin: 3px 0; font-size: 11px; }
          .grand-total { font-weight: bold; font-size: 14px; border-top: 1px dashed #000; padding-top: 8px; margin-top: 8px; }
          .footer { text-align: center; margin-top: 15px; font-size: 10px; color: #666; }
          @page { margin: 5mm; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>KLINIK ZAIRA</h1>
          <p>Jl. Kesehatan No. 123, Kota Sehat</p>
          <p>Telp: (021) 1234567</p>
        </div>
        
        <div class="info">
          <div class="info-row">
            <span>No. Invoice</span>
            <span><strong>${invoice.noInvoice}</strong></span>
          </div>
          <div class="info-row">
            <span>Tanggal</span>
            <span>${formatDate(invoice.tanggal)}</span>
          </div>
          <div class="info-row">
            <span>Pasien</span>
            <span>${pasien?.nama}</span>
          </div>
          <div class="info-row">
            <span>No. RM</span>
            <span>${pasien?.noRM}</span>
          </div>
        </div>
        
        <div class="items">
          ${invoice.items.map(item => `
            <div class="item">
              <div class="item-name">${item.nama}</div>
              <div class="item-detail">
                <span>${item.jumlah} x ${formatCurrency(item.harga)}</span>
                <span>${formatCurrency(item.subtotal)}</span>
              </div>
            </div>
          `).join('')}
        </div>
        
        <div class="totals">
          <div class="total-row">
            <span>Subtotal</span>
            <span>${formatCurrency(invoice.subtotal)}</span>
          </div>
          ${invoice.diskon > 0 ? `
          <div class="total-row">
            <span>Diskon</span>
            <span>-${formatCurrency(invoice.diskon)}</span>
          </div>
          ` : ''}
          ${invoice.pajak > 0 ? `
          <div class="total-row">
            <span>Pajak</span>
            <span>${formatCurrency(invoice.pajak)}</span>
          </div>
          ` : ''}
          <div class="total-row grand-total">
            <span>TOTAL</span>
            <span>${formatCurrency(invoice.grandTotal)}</span>
          </div>
        </div>
        
        <div class="footer">
          <p>Status: ${invoice.status === 'lunas' ? 'LUNAS' : 'BELUM BAYAR'}</p>
          <p style="margin-top: 10px;">Terima kasih atas kunjungan Anda</p>
          <p>Semoga lekas sembuh</p>
        </div>
      </body>
      </html>
    `;
  };

  const handlePrintInvoice = (invoice: Invoice) => {
    const printContent = generateInvoicePrintContent(invoice);
    
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);
    
    const iframeDoc = iframe.contentWindow?.document;
    if (iframeDoc) {
      iframeDoc.open();
      iframeDoc.write(printContent);
      iframeDoc.close();
      
      iframe.onload = () => {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
        setTimeout(() => {
          document.body.removeChild(iframe);
        }, 1000);
      };
    }
  };

  const columns = [
    {
      key: 'noInvoice',
      header: 'No. Invoice',
      render: (invoice: Invoice) => (
        <span className="font-mono text-teal-600">{invoice.noInvoice}</span>
      ),
    },
    {
      key: 'pasienId',
      header: 'Pasien',
      render: (invoice: Invoice) => {
        const pasien = getPasienById(invoice.pasienId);
        return (
          <div>
            <p className="font-medium">{pasien?.nama}</p>
            <p className="text-xs text-gray-500">{pasien?.noRM}</p>
          </div>
        );
      },
    },
    {
      key: 'tanggal',
      header: 'Tanggal',
      render: (invoice: Invoice) => formatDate(invoice.tanggal),
    },
    {
      key: 'grandTotal',
      header: 'Total',
      render: (invoice: Invoice) => (
        <span className="font-semibold">{formatCurrency(invoice.grandTotal)}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (invoice: Invoice) => (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
          {invoice.status === 'lunas' ? 'Lunas' : invoice.status === 'pending' ? 'Belum Bayar' : invoice.status === 'draft' ? 'Draft' : 'Batal'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Aksi',
      render: (invoice: Invoice) => (
        <div className="flex gap-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => {
              setSelectedInvoice(invoice);
              setShowDetailModal(true);
            }}
            suppressHydrationWarning
          >
            <Eye className="w-4 h-4" />
          </Button>
          {invoice.status !== 'lunas' && (
            <Button
              type="button"
              size="sm"
              onClick={() => {
                setSelectedInvoice(invoice);
                setShowPaymentModal(true);
              }}
              suppressHydrationWarning
            >
              <CreditCard className="w-4 h-4 mr-1" />
              Bayar
            </Button>
          )}
          <Button 
            type="button" 
            size="sm" 
            variant="outline" 
            onClick={() => handlePrintInvoice(invoice)}
            suppressHydrationWarning
          >
            <Printer className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  const calculateChange = () => {
    const cash = parseFloat(cashAmount) || 0;
    const total = selectedInvoice?.grandTotal || 0;
    return cash - total;
  };

  return (
    <div className="space-y-6" suppressHydrationWarning>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Pembayaran</h1>
          <p className="text-gray-500">Kelola pembayaran invoice pasien</p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-teal-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {formatCurrency(invoiceList.filter(i => i.status === 'lunas').reduce((acc, i) => acc + i.grandTotal, 0))}
              </p>
              <p className="text-sm text-gray-500">Total Terbayar</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 border-l-4 border-l-yellow-500">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {formatCurrency(invoiceList.filter(i => i.status === 'pending').reduce((acc, i) => acc + i.grandTotal, 0))}
              </p>
              <p className="text-sm text-gray-500">Belum Dibayar</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {invoiceList.filter(i => i.status === 'lunas').length}
            </p>
            <p className="text-sm text-gray-500">Invoice Lunas</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-600">
              {invoiceList.filter(i => i.status === 'pending').length}
            </p>
            <p className="text-sm text-gray-500">Menunggu Pembayaran</p>
          </div>
        </Card>
      </div>

      {/* Filter & Search */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Cari invoice atau nama pasien..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="">Semua Status</option>
              <option value="pending">Belum Bayar</option>
              <option value="sebagian">Sebagian</option>
              <option value="lunas">Lunas</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Invoice Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Invoice</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={filteredInvoices}
            emptyMessage="Tidak ada invoice ditemukan"
          />
        </CardContent>
      </Card>

      {/* Payment Modal */}
      <Modal
        isOpen={showPaymentModal}
        onClose={() => {
          setShowPaymentModal(false);
          setSelectedInvoice(null);
          setCashAmount('');
        }}
        title="Proses Pembayaran"
        size="lg"
      >
        {selectedInvoice && (
          <div className="space-y-6">
            {/* Invoice Summary */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-medium text-lg">{getPasienById(selectedInvoice.pasienId)?.nama}</p>
                  <p className="text-sm text-gray-500">{selectedInvoice.noInvoice}</p>
                </div>
                <Badge variant="warning">Belum Bayar</Badge>
              </div>
              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span>{formatCurrency(selectedInvoice.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-gray-500">Diskon</span>
                  <span className="text-red-500">-{formatCurrency(selectedInvoice.diskon)}</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-gray-500">Pajak</span>
                  <span>{formatCurrency(selectedInvoice.pajak)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg mt-3 pt-3 border-t">
                  <span>Total</span>
                  <span className="text-teal-600">{formatCurrency(selectedInvoice.grandTotal)}</span>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Metode Pembayaran</label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('tunai')}
                  className={`p-4 border-2 rounded-lg flex flex-col items-center gap-2 transition-colors ${
                    paymentMethod === 'tunai'
                      ? 'border-teal-500 bg-teal-50 text-teal-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Banknote className="w-8 h-8" />
                  <span className="font-medium">Tunai</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('kartu')}
                  className={`p-4 border-2 rounded-lg flex flex-col items-center gap-2 transition-colors ${
                    paymentMethod === 'kartu'
                      ? 'border-teal-500 bg-teal-50 text-teal-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <CreditCard className="w-8 h-8" />
                  <span className="font-medium">Kartu</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('qris')}
                  className={`p-4 border-2 rounded-lg flex flex-col items-center gap-2 transition-colors ${
                    paymentMethod === 'qris'
                      ? 'border-teal-500 bg-teal-50 text-teal-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <QrCode className="w-8 h-8" />
                  <span className="font-medium">QRIS</span>
                </button>
              </div>
            </div>

            {/* Cash Input */}
            {paymentMethod === 'tunai' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Jumlah Uang Diterima</label>
                <Input
                  type="number"
                  placeholder="Masukkan jumlah..."
                  value={cashAmount}
                  onChange={(e) => setCashAmount(e.target.value)}
                  className="text-lg"
                />
                <div className="grid grid-cols-4 gap-2 mt-3">
                  {[50000, 100000, 200000, 500000].map(amount => (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => setCashAmount(amount.toString())}
                      className="py-2 px-3 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      {formatCurrency(amount)}
                    </button>
                  ))}
                </div>
                {cashAmount && parseFloat(cashAmount) >= (selectedInvoice?.grandTotal || 0) && (
                  <div className="mt-4 p-4 bg-green-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-green-700 font-medium">Kembalian</span>
                      <span className="text-2xl font-bold text-green-600">
                        {formatCurrency(calculateChange())}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* QRIS Display */}
            {paymentMethod === 'qris' && (
              <div className="text-center">
                <div className="inline-block p-4 bg-white border-2 border-gray-200 rounded-xl">
                  <div className="w-48 h-48 bg-gray-100 flex items-center justify-center rounded">
                    <QrCode className="w-32 h-32 text-gray-400" />
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-3">Scan QR code di atas untuk membayar</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setShowPaymentModal(false);
                  setSelectedInvoice(null);
                  setCashAmount('');
                }}
              >
                Batal
              </Button>
              <Button
                className="flex-1 gap-2"
                onClick={handlePayment}
                disabled={paymentMethod === 'tunai' && parseFloat(cashAmount) < (selectedInvoice?.grandTotal || 0)}
              >
                <Check className="w-5 h-5" />
                Konfirmasi Pembayaran
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Detail Modal */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedInvoice(null);
        }}
        title="Detail Invoice"
        size="lg"
      >
        {selectedInvoice && (
          <div className="space-y-4">
            <div className="flex justify-between items-start pb-4 border-b">
              <div>
                <h3 className="text-lg font-bold">{selectedInvoice.noInvoice}</h3>
                <p className="text-gray-500">{formatDate(selectedInvoice.tanggal)}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedInvoice.status)}`}>
                {selectedInvoice.status === 'lunas' ? 'Lunas' : 'Belum Bayar'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 pb-4 border-b">
              <div>
                <p className="text-sm text-gray-500">Pasien</p>
                <p className="font-medium">{getPasienById(selectedInvoice.pasienId)?.nama}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">No. RM</p>
                <p className="font-medium">{getPasienById(selectedInvoice.pasienId)?.noRM}</p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="font-medium">Rincian Biaya</p>
              {selectedInvoice.items.map((item, idx) => {
                return (
                  <div key={idx} className="flex justify-between py-2 border-b border-gray-100">
                    <div>
                      <p>{item.nama}</p>
                      <p className="text-sm text-gray-500">{item.jumlah} x {formatCurrency(item.harga)}</p>
                    </div>
                    <p className="font-medium">{formatCurrency(item.subtotal)}</p>
                  </div>
                );
              })}
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>{formatCurrency(selectedInvoice.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span>Diskon</span>
                <span className="text-red-500">-{formatCurrency(selectedInvoice.diskon)}</span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span>Pajak</span>
                <span>{formatCurrency(selectedInvoice.pajak)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg mt-3 pt-3 border-t">
                <span>Total</span>
                <span className="text-teal-600">{formatCurrency(selectedInvoice.grandTotal)}</span>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button 
                variant="outline" 
                className="flex-1 gap-2"
                onClick={() => handlePrintInvoice(selectedInvoice)}
              >
                <Printer className="w-4 h-4" />
                Cetak Invoice
              </Button>
              {selectedInvoice.status !== 'lunas' && (
                <Button
                  className="flex-1 gap-2"
                  onClick={() => {
                    setShowDetailModal(false);
                    setShowPaymentModal(true);
                  }}
                >
                  <CreditCard className="w-4 h-4" />
                  Bayar Sekarang
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
