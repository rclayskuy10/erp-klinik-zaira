'use client';

import React, { useState } from 'react';
import { Search, Printer, FileText, Download, Eye, Filter } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Button, Input, Badge, DataTable, Modal } from '@/components/ui';
import { invoiceList, getPasienById, getDokterById, getPoliById, layananList, obatList } from '@/data/dummy-data';
import { formatCurrency, formatDate, getStatusColor } from '@/lib/utils';
import { Invoice } from '@/types';

export default function InvoicePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<string>('');
  const [selectedInvoice, setSelectedInvoice] = useState<(typeof invoiceList)[0] | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showPrintPreview, setShowPrintPreview] = useState(false);

  // Filter invoices
  const filteredInvoices = invoiceList.filter(inv => {
    const pasien = getPasienById(inv.pasienId);
    const matchSearch = pasien?.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       inv.noInvoice.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter ? inv.status === statusFilter : true;
    return matchSearch && matchStatus;
  });

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
          body { font-family: Arial, sans-serif; padding: 20px; font-size: 12px; }
          .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 15px; margin-bottom: 20px; }
          .header h1 { font-size: 24px; margin-bottom: 5px; }
          .header p { font-size: 11px; color: #333; }
          .invoice-title { text-align: center; font-size: 18px; font-weight: bold; margin: 20px 0; }
          .info-section { display: flex; justify-content: space-between; margin-bottom: 20px; }
          .info-box { flex: 1; }
          .info-label { font-size: 11px; color: #666; }
          .info-value { font-weight: 600; margin-bottom: 5px; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { border: 1px solid #000; padding: 8px; text-align: left; font-size: 11px; }
          th { background: #f3f4f6; font-weight: 600; }
          .text-center { text-align: center; }
          .text-right { text-align: right; }
          .totals { margin-top: 10px; float: right; width: 300px; }
          .total-row { display: flex; justify-content: space-between; padding: 5px 0; border-bottom: 1px solid #ddd; font-size: 11px; }
          .grand-total { font-weight: bold; font-size: 14px; border-top: 2px solid #000; padding-top: 8px; margin-top: 5px; }
          .footer { margin-top: 60px; text-align: center; font-size: 10px; color: #666; border-top: 1px solid #ddd; padding-top: 15px; }
          .status-badge { display: inline-block; padding: 4px 12px; border-radius: 12px; font-size: 10px; font-weight: 600; }
          .status-lunas { background: #d1fae5; color: #065f46; }
          .status-pending { background: #fef3c7; color: #92400e; }
          @page { margin: 1.5cm; size: A4; }
          @media print { body { padding: 0; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>KLINIK ZAIRA</h1>
          <p>Jl. Kesehatan No. 123, Kota Sehat</p>
          <p>Telp: (021) 1234567 | Email: info@klinikzaira.com</p>
        </div>
        
        <div class="invoice-title">INVOICE</div>
        
        <div class="info-section">
          <div class="info-box">
            <p class="info-label">Kepada Yth:</p>
            <p class="info-value">${pasien?.nama}</p>
            <p style="font-size: 11px;">${pasien?.alamat}</p>
            <p style="font-size: 11px;">Telp: ${pasien?.telepon}</p>
            <p style="font-size: 11px;">No. RM: ${pasien?.noRM}</p>
          </div>
          <div class="info-box" style="text-align: right;">
            <p class="info-label">No. Invoice:</p>
            <p class="info-value" style="color: #0d9488;">${invoice.noInvoice}</p>
            <p class="info-label" style="margin-top: 10px;">Tanggal:</p>
            <p class="info-value">${formatDate(invoice.tanggal)}</p>
            <p class="info-label" style="margin-top: 10px;">Status:</p>
            <p><span class="status-badge ${invoice.status === 'lunas' ? 'status-lunas' : 'status-pending'}">
              ${invoice.status === 'lunas' ? 'LUNAS' : 'BELUM BAYAR'}
            </span></p>
            ${invoice.metodePembayaran ? `
            <p class="info-label" style="margin-top: 10px;">Metode Pembayaran:</p>
            <p class="info-value">${invoice.metodePembayaran.toUpperCase()}</p>
            ` : ''}
          </div>
        </div>
        
        <table>
          <thead>
            <tr>
              <th style="width: 40px;">No</th>
              <th>Deskripsi</th>
              <th class="text-center" style="width: 80px;">Qty</th>
              <th class="text-right" style="width: 120px;">Harga</th>
              <th class="text-right" style="width: 120px;">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${invoice.items.map((item, idx) => `
              <tr>
                <td class="text-center">${idx + 1}</td>
                <td>${item.nama}</td>
                <td class="text-center">${item.jumlah}</td>
                <td class="text-right">${formatCurrency(item.harga)}</td>
                <td class="text-right">${formatCurrency(item.subtotal)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div style="clear: both;"></div>
        <div class="totals">
          <div class="total-row">
            <span>Subtotal</span>
            <span>${formatCurrency(invoice.subtotal)}</span>
          </div>
          ${invoice.diskon > 0 ? `
          <div class="total-row">
            <span>Diskon</span>
            <span style="color: #dc2626;">-${formatCurrency(invoice.diskon)}</span>
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
            <span style="color: #0d9488;">${formatCurrency(invoice.grandTotal)}</span>
          </div>
        </div>
        
        <div style="clear: both;"></div>
        <div class="footer">
          <p>Terima kasih atas kepercayaan Anda kepada Klinik Zaira</p>
          <p style="margin-top: 5px;">Invoice ini sah dan diproses secara elektronik</p>
          <p style="margin-top: 5px;">Untuk pertanyaan, hubungi: (021) 1234567</p>
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

  const handleExportToCSV = () => {
    // Prepare CSV content
    const headers = ['No. Invoice', 'Tanggal', 'Pasien', 'No. RM', 'Metode Pembayaran', 'Subtotal', 'Diskon', 'Pajak', 'Total', 'Status'];
    
    const rows = filteredInvoices.map(invoice => {
      const pasien = getPasienById(invoice.pasienId);
      return [
        invoice.noInvoice,
        formatDate(invoice.tanggal),
        pasien?.nama || '',
        pasien?.noRM || '',
        invoice.metodePembayaran?.toUpperCase() || 'BELUM DIBAYAR',
        invoice.subtotal,
        invoice.diskon,
        invoice.pajak,
        invoice.grandTotal,
        invoice.status === 'lunas' ? 'Lunas' : invoice.status === 'pending' ? 'Belum Bayar' : invoice.status === 'draft' ? 'Draft' : 'Batal'
      ];
    });

    // Create CSV string
    let csvContent = headers.join(',') + '\n';
    rows.forEach(row => {
      csvContent += row.map(cell => {
        // Escape quotes and wrap in quotes if contains comma
        const cellStr = String(cell);
        if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
          return '"' + cellStr.replace(/"/g, '""') + '"';
        }
        return cellStr;
      }).join(',') + '\n';
    });

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    const today = new Date();
    const timestamp = today.toISOString().replace(/[-:]/g, '').replace('T', '_').split('.')[0];
    
    link.setAttribute('href', url);
    link.setAttribute('download', `invoice_${timestamp}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const columns = [
    {
      key: 'noInvoice',
      header: 'No. Invoice',
      render: (invoice: Invoice) => (
        <span className="font-mono text-teal-600 font-medium">{invoice.noInvoice}</span>
      ),
    },
    {
      key: 'tanggal',
      header: 'Tanggal',
      render: (invoice: Invoice) => formatDate(invoice.tanggal),
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
      key: 'metodePembayaran',
      header: 'Metode',
      render: (invoice: Invoice) => (
        <Badge variant={invoice.metodePembayaran === 'tunai' ? 'success' : 'info'}>
          {invoice.metodePembayaran?.toUpperCase() || 'BELUM DIBAYAR'}
        </Badge>
      ),
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
            title="Lihat Detail"
            suppressHydrationWarning
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => handlePrintInvoice(invoice)}
            title="Cetak"
            suppressHydrationWarning
          >
            <Printer className="w-4 h-4" />
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
          <h1 className="text-2xl font-bold text-gray-800">Daftar Invoice</h1>
          <p className="text-gray-500">Kelola dan cetak invoice pembayaran</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2" onClick={handleExportToCSV}>
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <p className="text-3xl font-bold text-gray-800">{invoiceList.length}</p>
          <p className="text-sm text-gray-500">Total Invoice</p>
        </Card>
        <Card className="p-4 text-center border-l-4 border-l-green-500">
          <p className="text-3xl font-bold text-green-600">
            {invoiceList.filter(i => i.status === 'lunas').length}
          </p>
          <p className="text-sm text-gray-500">Lunas</p>
        </Card>
        <Card className="p-4 text-center border-l-4 border-l-yellow-500">
          <p className="text-3xl font-bold text-yellow-600">
            {invoiceList.filter(i => i.status === 'pending').length}
          </p>
          <p className="text-sm text-gray-500">Belum Bayar</p>
        </Card>
        <Card className="p-4 text-center border-l-4 border-l-teal-500">
          <p className="text-3xl font-bold text-teal-600">
            {formatCurrency(invoiceList.reduce((acc, i) => acc + i.grandTotal, 0))}
          </p>
          <p className="text-sm text-gray-500">Total Nilai</p>
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
                placeholder="Cari no. invoice atau nama pasien..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
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
          <CardTitle>Invoice</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={filteredInvoices}
            emptyMessage="Tidak ada invoice ditemukan"
          />
        </CardContent>
      </Card>

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
            {/* Header */}
            <div className="flex justify-between items-start pb-4 border-b">
              <div>
                <h3 className="text-lg font-bold text-teal-600">{selectedInvoice.noInvoice}</h3>
                <p className="text-gray-500">{formatDate(selectedInvoice.tanggal)}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedInvoice.status)}`}>
                {selectedInvoice.status === 'lunas' ? 'Lunas' : 'Belum Bayar'}
              </span>
            </div>

            {/* Patient Info */}
            <div className="grid grid-cols-2 gap-4 pb-4 border-b">
              <div>
                <p className="text-sm text-gray-500">Pasien</p>
                <p className="font-medium">{getPasienById(selectedInvoice.pasienId)?.nama}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">No. RM</p>
                <p className="font-medium">{getPasienById(selectedInvoice.pasienId)?.noRM}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Metode Pembayaran</p>
                <Badge variant={selectedInvoice.metodePembayaran === 'tunai' ? 'success' : 'info'}>
                  {selectedInvoice.metodePembayaran?.toUpperCase() || 'BELUM DIBAYAR'}
                </Badge>
              </div>
            </div>

            {/* Items */}
            <div className="space-y-2">
              <p className="font-medium">Rincian Layanan & Obat</p>
              <div className="bg-gray-50 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="text-left py-2 px-3">Item</th>
                      <th className="text-center py-2 px-3">Qty</th>
                      <th className="text-right py-2 px-3">Harga</th>
                      <th className="text-right py-2 px-3">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {selectedInvoice.items.map((item, idx) => {
                      return (
                        <tr key={idx}>
                          <td className="py-2 px-3">
                            <p>{item.nama}</p>
                            <p className="text-xs text-gray-500">{item.tipe}</p>
                          </td>
                          <td className="text-center py-2 px-3">{item.jumlah}</td>
                          <td className="text-right py-2 px-3">{formatCurrency(item.harga)}</td>
                          <td className="text-right py-2 px-3 font-medium">{formatCurrency(item.subtotal)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Summary */}
            <div className="bg-teal-50 p-4 rounded-lg">
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
              <div className="flex justify-between font-bold text-lg mt-3 pt-3 border-t border-teal-200">
                <span>Total</span>
                <span className="text-teal-700">{formatCurrency(selectedInvoice.grandTotal)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                className="flex-1 gap-2"
                onClick={() => handlePrintInvoice(selectedInvoice)}
              >
                <Printer className="w-4 h-4" />
                Cetak
              </Button>
              <Button variant="outline" className="flex-1 gap-2">
                <Download className="w-4 h-4" />
                Download PDF
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Print Preview Modal */}
      <Modal
        isOpen={showPrintPreview}
        onClose={() => {
          setShowPrintPreview(false);
          setSelectedInvoice(null);
        }}
        title="Print Preview"
        size="lg"
      >
        {selectedInvoice && (
          <div className="space-y-6">
            {/* Print Preview Content */}
            <div className="bg-white border-2 border-gray-200 p-8 rounded-lg" id="invoice-print">
              {/* Clinic Header */}
              <div className="text-center border-b-2 border-gray-800 pb-4 mb-4">
                <h1 className="text-2xl font-bold text-gray-800">KLINIK ZAIRA</h1>
                <p className="text-sm text-gray-600">Jl. Kesehatan No. 123, Jakarta Selatan</p>
                <p className="text-sm text-gray-600">Telp: (021) 123-4567 | Email: info@klinikzaira.com</p>
              </div>

              {/* Invoice Title */}
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold">INVOICE</h2>
                <p className="text-lg font-mono">{selectedInvoice.noInvoice}</p>
              </div>

              {/* Patient & Invoice Info */}
              <div className="grid grid-cols-2 gap-8 mb-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Kepada:</p>
                  <p className="font-medium">{getPasienById(selectedInvoice.pasienId)?.nama}</p>
                  <p className="text-sm">{getPasienById(selectedInvoice.pasienId)?.alamat}</p>
                  <p className="text-sm">{getPasienById(selectedInvoice.pasienId)?.telepon}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Tanggal: {formatDate(selectedInvoice.tanggal)}</p>
                  <p className="text-sm text-gray-500">No. RM: {getPasienById(selectedInvoice.pasienId)?.noRM}</p>
                  <p className="text-sm text-gray-500">Pembayaran: {selectedInvoice.metodePembayaran?.toUpperCase() || 'BELUM DIBAYAR'}</p>
                </div>
              </div>

              {/* Items Table */}
              <table className="w-full text-sm border-collapse border border-gray-300 mb-6">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 py-2 px-3 text-left">No</th>
                    <th className="border border-gray-300 py-2 px-3 text-left">Deskripsi</th>
                    <th className="border border-gray-300 py-2 px-3 text-center">Qty</th>
                    <th className="border border-gray-300 py-2 px-3 text-right">Harga</th>
                    <th className="border border-gray-300 py-2 px-3 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedInvoice.items.map((item, idx) => {
                    return (
                      <tr key={idx}>
                        <td className="border border-gray-300 py-2 px-3">{idx + 1}</td>
                        <td className="border border-gray-300 py-2 px-3">
                          {item.nama}
                        </td>
                        <td className="border border-gray-300 py-2 px-3 text-center">{item.jumlah}</td>
                        <td className="border border-gray-300 py-2 px-3 text-right">{formatCurrency(item.harga)}</td>
                        <td className="border border-gray-300 py-2 px-3 text-right">{formatCurrency(item.subtotal)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Totals */}
              <div className="flex justify-end">
                <div className="w-64">
                  <div className="flex justify-between py-1 border-b">
                    <span>Subtotal</span>
                    <span>{formatCurrency(selectedInvoice.subtotal)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b">
                    <span>Diskon</span>
                    <span className="text-red-500">-{formatCurrency(selectedInvoice.diskon)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b">
                    <span>Pajak</span>
                    <span>{formatCurrency(selectedInvoice.pajak)}</span>
                  </div>
                  <div className="flex justify-between py-2 font-bold text-lg">
                    <span>Total</span>
                    <span>{formatCurrency(selectedInvoice.grandTotal)}</span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-8 pt-4 border-t text-center text-sm text-gray-500">
                <p>Terima kasih atas kepercayaan Anda kepada Klinik Zaira</p>
                <p>Invoice ini sah dan diproses secara elektronik</p>
              </div>
            </div>

            {/* Print Actions */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setShowPrintPreview(false);
                  setSelectedInvoice(null);
                }}
              >
                Tutup
              </Button>
              <Button
                className="flex-1 gap-2"
                onClick={() => window.print()}
              >
                <Printer className="w-4 h-4" />
                Cetak Sekarang
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
