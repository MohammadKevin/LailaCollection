"use client";

import React, { useEffect, useState } from "react";

import {
  Wallet,
  ShoppingCart,
  Package,
  TrendingUp,
  Loader2,
  AlertTriangle,
  Clock3,
  Receipt,
  Store,
  Activity,
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

    quantity: number;

    product: {
      name: string;
    };
  }[];
};

type Product = {
  id: string;

  name: string;

  stock: number;

  minStock: number;
};

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);

  const [sales, setSales] = useState<Sale[]>([]);

  const [products, setProducts] = useState<Product[]>([]);

  const [summary, setSummary] = useState({
    totalSales: 0,

    totalProfit: 0,

    totalTransactions: 0,

    totalProducts: 0,
  });

  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const [salesResponse, productsResponse] = await Promise.all([
        api.get("/reports/sales"),

        api.get("/products"),
      ]);

      const salesData = salesResponse.data?.sales || [];

      const productsData = productsResponse.data || [];

      setSales(salesData);

      setProducts(productsData);

      const totalSales = salesData.reduce(
        (acc: number, sale: Sale) => acc + sale.totalAmount,
        0,
      );

      const totalProfit = salesData.reduce(
        (acc: number, sale: Sale) => acc + sale.totalProfit,
        0,
      );

      setSummary({
        totalSales,

        totalProfit,

        totalTransactions: salesData.length,

        totalProducts: productsData.length,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchDashboard();
  }, []);

  const lowStockProducts = products.filter(
    (product) => product.stock <= product.minStock,
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-slate-700" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">
      <div className="space-y-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>

            <p className="text-sm text-slate-500 mt-1">
              Monitoring toko & transaksi
            </p>
          </div>

          <div className="flex items-center gap-2 bg-green-50 text-green-600 px-4 py-2 rounded-xl text-sm font-medium">
            <Activity className="w-4 h-4" />
            System Active
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <Card
            title="Total Sales"
            value={`Rp ${summary.totalSales.toLocaleString("id-ID")}`}
            icon={<Wallet className="w-5 h-5" />}
          />

          <Card
            title="Transactions"
            value={`${summary.totalTransactions}`}
            icon={<ShoppingCart className="w-5 h-5" />}
          />

          <Card
            title="Products"
            value={`${summary.totalProducts}`}
            icon={<Package className="w-5 h-5" />}
          />

          <Card
            title="Profit"
            value={`Rp ${summary.totalProfit.toLocaleString("id-ID")}`}
            icon={<TrendingUp className="w-5 h-5" />}
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 bg-white border border-slate-200 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-slate-800">
                  Riwayat Transactions
                </h2>

                <p className="text-sm text-slate-400 mt-1">Transaksi terbaru</p>
              </div>

              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                <Receipt className="w-5 h-5 text-slate-600" />
              </div>
            </div>

            {sales.length === 0 ? (
              <div className="h-[300px] flex items-center justify-center text-slate-400">
                Belum ada transaksi
              </div>
            ) : (
              <div className="space-y-4">
                {sales.slice(0, 5).map((sale) => (
                  <div
                    key={sale.id}
                    className="border border-slate-200 rounded-2xl p-4 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center">
                        <Receipt className="w-5 h-5 text-slate-600" />
                      </div>

                      <div>
                        <h3 className="font-semibold text-slate-800 max-w-[300px] truncate">
                          {sale.items && sale.items.length > 0
                            ? sale.items
                                .map(
                                  (item) =>
                                    `${item.product.name} (${item.quantity})`,
                                )
                                .join(", ")
                            : sale.invoiceNumber}
                        </h3>

                        <div className="flex items-center gap-2 text-sm text-slate-400 mt-1">
                          <Store className="w-4 h-4" />

                          {sale.outlet?.name || "-"}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <h3 className="font-bold text-slate-800">
                        Rp
                        {sale.totalAmount.toLocaleString("id-ID")}
                      </h3>

                      <div className="flex items-center justify-end gap-1 text-xs text-slate-400 mt-1">
                        <Clock3 className="w-3 h-3" />

                        {new Date(sale.createdAt).toLocaleDateString("id-ID")}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-lg font-semibold text-slate-800">
                    Low Stock
                  </h2>

                  <p className="text-sm text-slate-400 mt-1">
                    Produk hampir habis
                  </p>
                </div>

                <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                </div>
              </div>

              {lowStockProducts.length === 0 ? (
                <div className="h-[200px] flex items-center justify-center text-slate-400">
                  Semua stok aman
                </div>
              ) : (
                <div className="space-y-3">
                  {lowStockProducts.slice(0, 5).map((product) => (
                    <div
                      key={product.id}
                      className="border border-slate-200 rounded-xl p-4 flex items-center justify-between"
                    >
                      <div>
                        <h3 className="font-medium text-slate-800 text-sm">
                          {product.name}
                        </h3>

                        <p className="text-xs text-red-500 mt-1">
                          Restock segera
                        </p>
                      </div>

                      <div className="bg-red-50 text-red-600 px-3 py-1 rounded-lg text-sm font-semibold">
                        {product.stock}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-slate-900 text-white rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wider text-slate-400">
                    Status
                  </p>

                  <h2 className="text-2xl font-bold mt-2">Online</h2>

                  <p className="text-sm text-slate-400 mt-2">
                    Semua sistem berjalan normal
                  </p>
                </div>

                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                  <Activity className="w-6 h-6 text-green-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
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
