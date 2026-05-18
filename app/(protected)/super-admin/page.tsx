"use client";

import React, { useEffect, useState } from "react";

import {
  TrendingDown,
  TrendingUp,
  Store,
  Users,
  ShoppingBag,
  AlertTriangle,
  Loader2,
} from "lucide-react";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

export default function SuperAdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState<any>(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "https://laila-collections-production.up.railway.app/api/dashboard",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      setDashboard(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <Loader2 className="w-10 h-10 animate-spin text-slate-500" />
      </div>
    );
  }

  const salesChart = dashboard?.salesChart || [];
  const lowStockProducts = dashboard?.lowStockProducts || [];

  const cards = [
    {
      title: "Total Penjualan",
      value: `Rp ${dashboard?.totalRevenue?.toLocaleString("id-ID") || 0}`,
      icon: TrendingUp,
    },
    {
      title: "Total Profit",
      value: `Rp ${dashboard?.totalProfit?.toLocaleString("id-ID") || 0}`,
      icon: TrendingUp,
    },
    {
      title: "Pengeluaran",
      value: `Rp ${dashboard?.totalExpense?.toLocaleString("id-ID") || 0}`,
      icon: TrendingDown,
    },
    {
      title: "Total Transaksi",
      value: `${dashboard?.totalSales || 0} Invoice`,
      icon: ShoppingBag,
    },
  ];

  return (
    <div className="min-h-screen bg-[#f5f6fa] p-4 md:p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-800">
          Dashboard
        </h1>

        <p className="text-sm text-slate-500 mt-1">
          Ringkasan performa bisnis hari ini
        </p>
      </div>

      {/* Statistik */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {cards.map((item, index) => {
          const Icon = item.icon;

          return (
            <div
              key={index}
              className="bg-white rounded-2xl border border-slate-200 p-5"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">
                    {item.title}
                  </p>

                  <h2 className="text-2xl font-semibold text-slate-800 mt-2">
                    {item.value}
                  </h2>
                </div>

                <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-slate-600" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Chart + Info */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mt-6">
        {/* Chart */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-200 p-5">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-slate-800">
              Grafik Penjualan
            </h2>

            <p className="text-sm text-slate-500">
              Statistik penjualan terbaru
            </p>
          </div>

          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesChart}>
                <defs>
                  <linearGradient
                    id="sales"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="#3b82f6"
                      stopOpacity={0.2}
                    />

                    <stop
                      offset="95%"
                      stopColor="#3b82f6"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                />

                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                />

                <YAxis
                  tickLine={false}
                  axisLine={false}
                />

                <Tooltip />

                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#sales)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Info */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center">
                <Store className="w-5 h-5 text-slate-700" />
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Total Outlet
                </p>

                <h3 className="text-xl font-semibold text-slate-800">
                  {dashboard?.totalOutlets || 0}
                </h3>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center">
                <Users className="w-5 h-5 text-slate-700" />
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Total Admin
                </p>

                <h3 className="text-xl font-semibold text-slate-800">
                  {dashboard?.totalAdmins || 0}
                </h3>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-red-100 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-500" />
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Stok Menipis
                </p>

                <h3 className="text-xl font-semibold text-slate-800">
                  {lowStockProducts.length}
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Low Stock */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 mt-6">
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-slate-800">
            Produk Stok Menipis
          </h2>

          <p className="text-sm text-slate-500">
            Daftar produk yang perlu restock
          </p>
        </div>

        {lowStockProducts.length === 0 ? (
          <div className="py-10 text-center text-slate-500 text-sm">
            Semua stok masih aman
          </div>
        ) : (
          <div className="space-y-3">
            {lowStockProducts.map((product: any, index: number) => (
              <div
                key={index}
                className="flex items-center justify-between border border-slate-200 rounded-xl px-4 py-3"
              >
                <div>
                  <h3 className="font-medium text-slate-800">
                    {product.name}
                  </h3>

                  <p className="text-sm text-red-500">
                    Butuh restock
                  </p>
                </div>

                <div className="text-sm font-semibold text-slate-700">
                  Sisa {product.stock}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}