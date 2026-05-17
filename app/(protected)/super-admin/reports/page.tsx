"use client";

import React, {
  useEffect,
  useState,
} from "react";

import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Store,
  Search,
  Sparkles,
  Loader2,
  Calendar,
  Receipt,
  CircleDollarSign,
  User,
  CreditCard,
} from "lucide-react";

import api from "@/lib/api";

type Outlet = {
  id: string;
  name: string;
};

type ProfitLoss = {
  totalSales: number;
  totalProfit: number;
  totalExpense: number;
  netProfit: number;
};

type Sale = {
  id: string;
  invoiceNumber: string;
  totalAmount: number;
  totalProfit: number;
  paymentMethod: string;
  createdAt: string;
  outlet?: {
    name: string;
  };
  cashier?: {
    name: string;
  };
};

export default function ReportsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [outlets, setOutlets] = useState<Outlet[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  
  const [report, setReport] = useState<ProfitLoss>({
    totalSales: 0,
    totalProfit: 0,
    totalExpense: 0,
    netProfit: 0,
  });

  // Filter conditions
  const [selectedOutlet, setSelectedOutlet] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchReports = async () => {
    try {
      setLoading(true);
      const query = new URLSearchParams();

      if (selectedOutlet) query.append("outletId", selectedOutlet);
      if (startDate) query.append("startDate", startDate);
      if (endDate) query.append("endDate", endDate);

      const [reportResponse, salesResponse, outletsResponse] = await Promise.all([
        api.get(`/reports/profit-loss?${query.toString()}`),
        api.get(`/reports/sales?${query.toString()}`),
        api.get("/outlets"),
      ]);

      setReport(reportResponse.data);
      setSales(salesResponse.data?.sales || []);
      setOutlets(outletsResponse.data);
    } catch (error: any) {
      console.error(error);
      setError(error?.response?.data?.message || "Gagal mengambil laporan keuangan");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [selectedOutlet, startDate, endDate]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 relative overflow-hidden font-sans font-medium">
      {/* Background Aesthetic Accents */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-pink-200/40 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-rose-200/40 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Header Dashboard section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <div>
              <div className="inline-flex items-center gap-2 bg-pink-50 text-pink-600 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                Audited Financial Reports
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
                Laporan Rugi Laba Keuangan
              </h1>
              <p className="text-slate-500 mt-1 text-sm">
                Rekap analitik arus kas masuk penjualan kasir, margin profit bersih, dan pembebanan expense harian.
              </p>
            </div>
          </div>

          {/* Advanced Filter Widgets Bar */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Lokasi Cabang</label>
              <select
                value={selectedOutlet}
                onChange={(e) => setSelectedOutlet(e.target.value)}
                className="w-full bg-slate-50 rounded-xl p-3 border border-slate-200 outline-none focus:ring-2 focus:ring-pink-500/20 text-xs font-semibold text-slate-700"
              >
                <option value="">Semua Outlet Cabang</option>
                {outlets.map((outlet) => (
                  <option key={outlet.id} value={outlet.id}>{outlet.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Mulai Dari</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-slate-50 rounded-xl p-2.5 border border-slate-200 outline-none focus:ring-2 focus:ring-pink-500/20 text-xs font-semibold text-slate-700"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Sampai Dengan</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-slate-50 rounded-xl p-2.5 border border-slate-200 outline-none focus:ring-2 focus:ring-pink-500/20 text-xs font-semibold text-slate-700"
              />
            </div>
          </div>

          {/* Financial Cards Grid Dashboard Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {/* Total Sales */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex items-center justify-between group hover:border-pink-200 transition-all">
              <div className="space-y-2">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Penjualan (Omzet)</p>
                <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                  Rp {report.totalSales.toLocaleString("id-ID")}
                </h2>
                <p className="text-pink-600 text-xs font-semibold bg-pink-50 px-2 py-0.5 rounded-md inline-block">Gross Sales</p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-pink-50 flex items-center justify-center text-pink-600 shrink-0">
                <Wallet className="w-7 h-7" />
              </div>
            </div>

            {/* Total Profit */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex items-center justify-between group hover:border-emerald-200 transition-all">
              <div className="space-y-2">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Akumulasi Margin Laba</p>
                <h2 className="text-2xl font-black text-emerald-600 tracking-tight">
                  Rp {report.totalProfit.toLocaleString("id-ID")}
                </h2>
                <p className="text-emerald-600 text-xs font-semibold bg-emerald-50 px-2 py-0.5 rounded-md inline-block">Gross Profit</p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                <TrendingUp className="w-7 h-7" />
              </div>
            </div>

            {/* Total Expense */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex items-center justify-between group hover:border-rose-200 transition-all">
              <div className="space-y-2">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Beban Pengeluaran</p>
                <h2 className="text-2xl font-black text-rose-500 tracking-tight">
                  Rp {report.totalExpense.toLocaleString("id-ID")}
                </h2>
                <p className="text-rose-600 text-xs font-semibold bg-rose-50 px-2 py-0.5 rounded-md inline-block">Total Expenses</p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-600 shrink-0">
                <TrendingDown className="w-7 h-7" />
              </div>
            </div>

            {/* Net Profit */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden group">
              <div className="absolute right-[-20px] bottom-[-20px] w-32 h-32 rounded-full bg-white/5 pointer-events-none" />
              <div className="relative z-10 flex items-center justify-between h-full w-full">
                <div className="space-y-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Pendapatan Bersih</p>
                  <h2 className="text-2xl font-black tracking-tight text-pink-300">
                    Rp {report.netProfit.toLocaleString("id-ID")}
                  </h2>
                  <p className="text-slate-300 text-xs font-medium">Laba Bersih Akhir (Netto)</p>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-pink-400 shrink-0">
                  <CircleDollarSign className="w-7 h-7" />
                </div>
              </div>
            </div>
          </div>

          {/* System Error Handling UI Notice */}
          {error && (
            <div className="bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl p-4 text-sm font-semibold flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              {error}
            </div>
          )}

          {/* Sales List Breakdown Render Layout */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3 bg-white/50 backdrop-blur-md rounded-3xl border border-slate-100">
              <Loader2 className="w-10 h-10 animate-spin text-pink-600" />
              <p className="text-slate-400 text-sm font-medium animate-pulse">Menyusun ringkasan audit neraca...</p>
            </div>
          ) : sales.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-3xl border border-slate-100 shadow-sm space-y-3">
              <Receipt className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="text-slate-500 font-semibold">Belum ada rincian invoice masuk</p>
              <p className="text-slate-400 text-xs">Ubah range filter kalender tanggal di atas untuk melihat data lama.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 pl-1">Rincian Riwayat Transaksi Kasir</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sales.map((sale) => (
                  <div
                    key={sale.id}
                    className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 hover:shadow-lg hover:border-slate-200/80 transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Header Card Info */}
                      <div className="flex items-center justify-between gap-4 border-b border-slate-50 pb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-xl bg-pink-50/80 text-pink-600 flex items-center justify-center shrink-0">
                            <Receipt className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-slate-900">{sale.invoiceNumber}</h4>
                            <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                              {new Date(sale.createdAt).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' })}
                            </p>
                          </div>
                        </div>

                        <span className="text-[10px] font-extrabold text-pink-600 bg-pink-50 px-2 py-0.5 rounded">
                          {sale.paymentMethod}
                        </span>
                      </div>

                      {/* Staf Cashier & Outlet Description metadata */}
                      <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 font-medium mt-4 bg-slate-50/50 rounded-xl p-3 border border-slate-100/50">
                        <div className="flex items-center gap-2">
                          <Store className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{sale.outlet?.name || "Butik Utama"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">Kasir: {sale.cashier?.name || "-"}</span>
                        </div>
                      </div>
                    </div>

                    {/* Pricing Financial Stats Block Grid split */}
                    <div className="grid grid-cols-2 gap-4 mt-5 pt-3 border-t border-slate-50">
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Penjualan</p>
                        <h5 className="text-base font-black text-slate-800 mt-0.5">
                          Rp {sale.totalAmount.toLocaleString("id-ID")}
                        </h5>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Keuntungan Bersih</p>
                        <h5 className="text-base font-black text-emerald-600 mt-0.5">
                          + Rp {sale.totalProfit.toLocaleString("id-ID")}
                        </h5>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}