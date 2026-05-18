"use client";

import React, { useEffect, useMemo, useState } from "react";

import {
  ArrowDownCircle,
  Loader2,
  Receipt,
  Search,
  Store,
  Wallet,
} from "lucide-react";

import api from "@/lib/api";

type Outlet = {
  id: string;
  name: string;
};

type Expense = {
  id: string;

  title: string;

  description?: string;

  type: string;

  amount: number;

  createdAt: string;

  outlet?: {
    name: string;
  };
};

export default function OperationalReportPage() {
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [selectedOutlet, setSelectedOutlet] = useState("");

  const [startDate, setStartDate] = useState("");

  const [endDate, setEndDate] = useState("");

  const [outlets, setOutlets] = useState<Outlet[]>([]);

  const [expenses, setExpenses] = useState<Expense[]>([]);

  const filteredExpenses = useMemo(() => {
    return expenses.filter(
      (expense) =>
        expense.title.toLowerCase().includes(search.toLowerCase()) ||
        expense.type.toLowerCase().includes(search.toLowerCase()),
    );
  }, [expenses, search]);

  const totalExpense = filteredExpenses.reduce(
    (acc, item) => acc + item.amount,
    0,
  );

  const fetchReports = async () => {
    try {
      setLoading(true);

      const [expensesResponse, outletsResponse] = await Promise.all([
        api.get("/expenses"),

        api.get("/outlets"),
      ]);

      let expenseData = expensesResponse.data || [];

      if (selectedOutlet) {
        expenseData = expenseData.filter((item: Expense) => item.outlet?.name);
      }

      if (startDate && endDate) {
        expenseData = expenseData.filter((item: Expense) => {
          const itemDate = new Date(item.createdAt);

          return (
            itemDate >= new Date(startDate) && itemDate <= new Date(endDate)
          );
        });
      }

      setExpenses(expenseData);

      setOutlets(outletsResponse.data || []);
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
            Laporan Operasional
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            Monitoring pengeluaran operasional outlet
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SummaryCard
            title="Total Pengeluaran"
            value={`Rp ${totalExpense.toLocaleString("id-ID")}`}
            icon={<Wallet className="w-5 h-5" />}
          />

          <SummaryCard
            title="Total Data"
            value={`${filteredExpenses.length}`}
            icon={<Receipt className="w-5 h-5" />}
          />
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />

            <input
              type="text"
              placeholder="Cari operasional..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-11 border border-slate-300 rounded-xl pl-10 pr-4 outline-none"
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="bg-white border border-slate-200 rounded-2xl h-[300px] flex items-center justify-center">
            <Loader2 className="w-7 h-7 animate-spin text-slate-600" />
          </div>
        ) : filteredExpenses.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl h-[300px] flex flex-col items-center justify-center">
            <Receipt className="w-12 h-12 text-slate-300" />

            <p className="text-slate-500 mt-4">Tidak ada data</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredExpenses.map((expense) => (
              <div
                key={expense.id}
                className="bg-white border border-slate-200 rounded-2xl p-5"
              >
                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center">
                    <ArrowDownCircle className="w-5 h-5 text-slate-700" />
                  </div>

                  <div>
                    <h2 className="font-semibold text-slate-800">
                      {expense.title}
                    </h2>

                    <p className="text-xs text-slate-400 mt-1">
                      {expense.type}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-5">
                  <div>
                    <p className="text-xs text-slate-400">Nominal</p>

                    <h3 className="text-xl font-bold text-slate-800 mt-1">
                      Rp
                      {expense.amount.toLocaleString("id-ID")}
                    </h3>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">Outlet</p>

                    <div className="flex items-center gap-2 mt-1">
                      <Store className="w-4 h-4 text-slate-500" />

                      <p className="font-medium text-slate-700">
                        {expense.outlet?.name || "-"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-5">
                  <p className="text-xs text-slate-400">Tanggal</p>

                  <p className="font-medium text-slate-700 mt-1">
                    {new Date(expense.createdAt).toLocaleDateString("id-ID")}
                  </p>
                </div>

                {expense.description && (
                  <div className="mt-5 border border-slate-200 rounded-xl p-4">
                    <p className="text-xs text-slate-400 mb-2">Keterangan</p>

                    <p className="text-sm text-slate-600 leading-relaxed">
                      {expense.description}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function SummaryCard({
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
        <p className="text-xs text-slate-400">{title}</p>

        <h2 className="text-2xl font-bold text-slate-800 mt-2">{value}</h2>
      </div>

      <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
        {icon}
      </div>
    </div>
  );
}
