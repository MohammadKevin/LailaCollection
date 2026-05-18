"use client";

import React, { useEffect, useState } from "react";

import {
  Calendar,
  CreditCard,
  Loader2,
  Receipt,
  Store,
  TrendingDown,
  TrendingUp,
  User,
  Wallet,
} from "lucide-react";

import api from "@/lib/api";

type Outlet = {
  id: string;
  name: string;
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

type ReportData = {
  totalTransactions: number;

  totalSales: number;

  totalProfit: number;

  sales: Sale[];
};

type ProfitLoss = {
  totalSales: number;

  totalProfit: number;

  totalExpense: number;

  netProfit: number;
};

export default function ReportsPage() {
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [outlets, setOutlets] = useState<Outlet[]>([]);

  const [sales, setSales] = useState<Sale[]>([]);

  const [report, setReport] = useState<ReportData>({
    totalTransactions: 0,

    totalSales: 0,

    totalProfit: 0,

    sales: [],
  });

  const [profitLoss, setProfitLoss] = useState<ProfitLoss>({
    totalSales: 0,

    totalProfit: 0,

    totalExpense: 0,

    netProfit: 0,
  });

  const [selectedOutlet, setSelectedOutlet] = useState("");

  const [startDate, setStartDate] = useState("");

  const [endDate, setEndDate] = useState("");

  const fetchReports = async () => {
    try {
      setLoading(true);

      const query = new URLSearchParams();

      if (selectedOutlet) {
        query.append("outletId", selectedOutlet);
      }

      if (startDate) {
        query.append("startDate", startDate);
      }

      if (endDate) {
        query.append("endDate", endDate);
      }

      const [salesResponse, outletsResponse, profitResponse] =
        await Promise.all([
          api.get(`/reports/sales?${query.toString()}`),

          api.get("/outlets"),

          api.get(`/reports/profit-loss?${query.toString()}`),
        ]);

      setReport(salesResponse.data);

      setSales(salesResponse.data?.sales || []);

      setOutlets(outletsResponse.data || []);

      setProfitLoss(profitResponse.data);
    } catch (error: any) {
      console.error(error);

      setError(error?.response?.data?.message || "Gagal mengambil laporan");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [selectedOutlet, startDate, endDate]);

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-6">
      <div className="space-y-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <h1 className="text-2xl font-bold text-slate-800">
            Laporan Penjualan
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            Monitoring penjualan outlet
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            value={selectedOutlet}
            onChange={(e) => setSelectedOutlet(e.target.value)}
            className="h-11 border border-slate-300 rounded-xl px-4 outline-none"
          >
            <option value="">Semua Outlet</option>

            {outlets.map((outlet) => (
              <option key={outlet.id} value={outlet.id}>
                {outlet.name}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="h-11 border border-slate-300 rounded-xl px-4 outline-none"
          />

          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="h-11 border border-slate-300 rounded-xl px-4 outline-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <Card
            title="Total Penjualan"
            value={`Rp ${report.totalSales.toLocaleString("id-ID")}`}
            icon={<Wallet className="w-5 h-5" />}
          />

          <Card
            title="Total Profit"
            value={`Rp ${report.totalProfit.toLocaleString("id-ID")}`}
            icon={<TrendingUp className="w-5 h-5" />}
          />

          <Card
            title="Total Expense"
            value={`Rp ${profitLoss.totalExpense.toLocaleString("id-ID")}`}
            icon={<TrendingDown className="w-5 h-5" />}
          />

          <Card
            title="Total Transaksi"
            value={`${report.totalTransactions}`}
            icon={<Receipt className="w-5 h-5" />}
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="bg-white border border-slate-200 rounded-2xl h-[300px] flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-slate-700" />
          </div>
        ) : sales.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl h-[300px] flex flex-col items-center justify-center">
            <Receipt className="w-14 h-14 text-slate-300" />

            <p className="text-slate-500 mt-4">Tidak ada data</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sales.map((sale) => (
              <div
                key={sale.id}
                className="bg-white border border-slate-200 rounded-2xl p-5"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center">
                      <Receipt className="w-5 h-5 text-slate-700" />
                    </div>

                    <div>
                      <h2 className="font-semibold text-slate-800">
                        {sale.invoiceNumber}
                      </h2>

                      <div className="flex flex-wrap gap-4 mt-3 text-sm text-slate-500">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />

                          {new Date(sale.createdAt).toLocaleDateString("id-ID")}
                        </div>

                        <div className="flex items-center gap-2">
                          <Store className="w-4 h-4" />

                          {sale.outlet?.name || "-"}
                        </div>

                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />

                          {sale.cashier?.name || "-"}
                        </div>

                        <div className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4" />

                          {sale.paymentMethod}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <PriceBox
                      title="Penjualan"
                      value={`Rp ${sale.totalAmount.toLocaleString("id-ID")}`}
                    />

                    <PriceBox
                      title="Profit"
                      value={`Rp ${sale.totalProfit.toLocaleString("id-ID")}`}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Card({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center justify-between">
      <div>
        <p className="text-sm text-slate-400">{title}</p>

        <h2 className="text-2xl font-bold text-slate-800 mt-2">{value}</h2>
      </div>

      <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
        {icon}
      </div>
    </div>
  );
}

function PriceBox({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-slate-100 rounded-xl p-4 min-w-[150px]">
      <p className="text-xs text-slate-500 uppercase">{title}</p>

      <h2 className="text-lg font-bold text-slate-800 mt-2">{value}</h2>
    </div>
  );
}
