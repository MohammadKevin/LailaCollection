"use client";

import React, {
  useEffect,
  useState,
} from "react";

import {
  ShoppingCart,
  Wallet,
  Package,
  TrendingUp,
  Clock3,
  Sparkles,
  AlertTriangle,
  Loader2,
  Receipt,
  Store,
} from "lucide-react";

import api from "@/lib/api";

type Sale = {
  id: string;
  invoiceNumber: string;
  totalAmount: number;
  totalProfit: number;
  createdAt: string;

  outlet?: {
    name: string;
  };

  items?: {
    id: string;
  }[];
};

type Product = {
  id: string;
  name: string;
  stock: number;
  minStock: number;
};

export default function AdminDashboardPage() {
  const [loading, setLoading] =
    useState(true);

  const [sales, setSales] =
    useState<Sale[]>([]);

  const [products, setProducts] =
    useState<Product[]>([]);

  const [totalSales, setTotalSales] =
    useState(0);

  const [
    totalTransactions,
    setTotalTransactions,
  ] = useState(0);

  const [totalProducts, setTotalProducts] =
    useState(0);

  const [totalProfit, setTotalProfit] =
    useState(0);

  const [
    lowStockProducts,
    setLowStockProducts,
  ] = useState<Product[]>([]);

  const fetchDashboard =
    async () => {
      try {
        setLoading(true);

        const [
          salesResponse,
          productsResponse,
        ] = await Promise.all([
          api.get(
            "/reports/sales",
          ),

          api.get(
            "/products",
          ),
        ]);

        const salesData =
          salesResponse.data
            ?.sales || [];

        const productsData =
          productsResponse.data ||
          [];

        setSales(salesData);

        setProducts(
          productsData,
        );

        setTotalTransactions(
          salesData.length,
        );

        setTotalProducts(
          productsData.length,
        );

        const salesAmount =
          salesData.reduce(
            (
              acc: number,
              sale: Sale,
            ) =>
              acc +
              sale.totalAmount,
            0,
          );

        setTotalSales(
          salesAmount,
        );

        const profitAmount =
          salesData.reduce(
            (
              acc: number,
              sale: Sale,
            ) =>
              acc +
              sale.totalProfit,
            0,
          );

        setTotalProfit(
          profitAmount,
        );

        const lowStock =
          productsData.filter(
            (
              product: Product,
            ) =>
              product.stock <=
              product.minStock,
          );

        setLowStockProducts(
          lowStock,
        );
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF5F7] flex items-center justify-center">
        <div className="flex flex-col items-center gap-5">
          <Loader2 className="w-14 h-14 animate-spin text-pink-500" />

          <p className="text-pink-400 font-semibold">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 bg-pink-100 text-pink-700 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-5">
            <Sparkles className="w-4 h-4" />
            Admin Dashboard
          </div>

          <h1 className="text-5xl font-black tracking-tight text-pink-950">
            Dashboard
          </h1>

          <p className="text-pink-400 mt-3 text-sm font-medium max-w-xl">
            Monitor transaksi,
            penjualan, profit,
            dan stok produk
            realtime
          </p>
        </div>

        <div className="bg-gradient-to-br from-pink-600 to-rose-600 rounded-[2.5rem] px-8 py-6 text-white shadow-2xl shadow-pink-200">
          <p className="text-xs uppercase tracking-[0.25em] text-pink-100 font-black">
            System Status
          </p>

          <h2 className="text-3xl font-black mt-3">
            Online
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-[2.5rem] p-8 border border-pink-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-pink-400 font-black">
                Total Sales
              </p>

              <h2 className="text-3xl font-black mt-5">
                Rp{" "}
                {totalSales.toLocaleString(
                  "id-ID",
                )}
              </h2>

              <p className="text-pink-400 text-sm mt-3 font-medium">
                Semua transaksi
              </p>
            </div>

            <div className="w-20 h-20 rounded-[2rem] bg-pink-100 flex items-center justify-center text-pink-600">
              <Wallet className="w-10 h-10" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] p-8 border border-pink-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-pink-400 font-black">
                Transactions
              </p>

              <h2 className="text-5xl font-black mt-5">
                {
                  totalTransactions
                }
              </h2>

              <p className="text-pink-400 text-sm mt-3 font-medium">
                Total transaksi
              </p>
            </div>

            <div className="w-20 h-20 rounded-[2rem] bg-sky-100 flex items-center justify-center text-sky-600">
              <ShoppingCart className="w-10 h-10" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] p-8 border border-pink-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-pink-400 font-black">
                Products
              </p>

              <h2 className="text-5xl font-black mt-5">
                {
                  totalProducts
                }
              </h2>

              <p className="text-pink-400 text-sm mt-3 font-medium">
                Product aktif
              </p>
            </div>

            <div className="w-20 h-20 rounded-[2rem] bg-emerald-100 flex items-center justify-center text-emerald-600">
              <Package className="w-10 h-10" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-pink-600 to-rose-600 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-pink-200 relative overflow-hidden">
          <div className="absolute right-[-40px] bottom-[-40px] w-48 h-48 rounded-full bg-white/10" />

          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-pink-100 font-black">
                  Total Profit
                </p>

                <h2 className="text-3xl font-black mt-5">
                  Rp{" "}
                  {totalProfit.toLocaleString(
                    "id-ID",
                  )}
                </h2>

                <p className="text-pink-100 text-sm mt-3 font-medium">
                  Profit bersih
                </p>
              </div>

              <TrendingUp className="w-12 h-12" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 bg-white rounded-[3rem] border border-pink-100 p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-black text-pink-950">
                Recent Transactions
              </h2>

              <p className="text-pink-400 text-sm mt-2">
                Transaksi terbaru
              </p>
            </div>
          </div>

          <div className="space-y-5">
            {sales
              .slice(0, 5)
              .map((sale) => (
                <div
                  key={sale.id}
                  className="bg-pink-50 rounded-[2rem] p-5 flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center text-pink-600 shadow-sm">
                      <Receipt className="w-7 h-7" />
                    </div>

                    <div>
                      <h3 className="font-black text-pink-950">
                        {
                          sale.invoiceNumber
                        }
                      </h3>

                      <p className="text-pink-400 text-sm mt-1">
                        {sale
                          .outlet
                          ?.name ||
                          "Outlet"}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <h3 className="font-black text-pink-600 text-lg">
                      Rp{" "}
                      {sale.totalAmount.toLocaleString(
                        "id-ID",
                      )}
                    </h3>

                    <div className="flex items-center gap-2 text-pink-400 text-sm mt-1 justify-end">
                      <Clock3 className="w-4 h-4" />

                      {new Date(
                        sale.createdAt,
                      ).toLocaleDateString(
                        "id-ID",
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white rounded-[3rem] border border-pink-100 p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-black text-pink-950">
                  Low Stock
                </h2>

                <p className="text-pink-400 text-sm mt-2">
                  Product hampir
                  habis
                </p>
              </div>

              <AlertTriangle className="w-10 h-10 text-amber-500" />
            </div>

            <div className="space-y-4">
              {lowStockProducts
                .slice(0, 5)
                .map((product) => (
                  <div
                    key={product.id}
                    className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex items-center justify-between"
                  >
                    <div>
                      <h3 className="font-black text-pink-950">
                        {
                          product.name
                        }
                      </h3>

                      <p className="text-amber-600 text-sm mt-1">
                        Stock menipis
                      </p>
                    </div>

                    <div className="bg-amber-100 text-amber-700 px-4 py-2 rounded-xl text-sm font-black">
                      {
                        product.stock
                      }
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-pink-600 to-rose-600 rounded-[3rem] p-8 text-white shadow-2xl shadow-pink-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-pink-100 font-black">
                  Store Status
                </p>

                <h2 className="text-5xl font-black mt-5">
                  Active
                </h2>

                <p className="text-pink-100 text-sm mt-4 leading-relaxed">
                  Semua sistem
                  berjalan normal
                </p>
              </div>

              <Store className="w-14 h-14" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}