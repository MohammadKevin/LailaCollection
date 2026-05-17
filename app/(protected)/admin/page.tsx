"use client";

import React, {
    useEffect,
    useState,
} from "react";

import {
    Wallet,
    ShoppingCart,
    Package,
    TrendingUp,
    Loader2,
    AlertTriangle,
    Clock3,
    Receipt,
    Sparkles,
    Store,
    Activity,
    ArrowUpRight,
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
                0
            );

            const totalProfit = salesData.reduce(
                (acc: number, sale: Sale) => acc + sale.totalProfit,
                0
            );

            setSummary({
                totalSales,
                totalProfit,
                totalTransactions: salesData.length,
                totalProducts: productsData.length,
            });
        } catch (error) {
            console.error("Gagal memuat data dashboard:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchDashboard();
    }, []);

    const lowStockProducts = products.filter(
        (product) => product.stock <= product.minStock
    );

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
                <Loader2 className="w-12 h-12 animate-spin text-pink-600" />
                <p className="text-slate-400 text-sm font-medium animate-pulse">
                    Mempersiapkan statistik toko...
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 relative overflow-hidden font-sans">
            {/* Background Aesthetic Accents */}
            <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-pink-200/40 rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-rose-200/40 rounded-full blur-[120px] pointer-events-none" />

            <div className="relative z-10 p-4 md:p-8 space-y-8 max-w-7xl mx-auto">
                
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <div>
                        <div className="inline-flex items-center gap-2 bg-pink-50 text-pink-600 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wider mb-2">
                            <Sparkles className="w-3.5 h-3.5" />
                            Branch Monitoring Center
                        </div>
                        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
                            Dashboard Admin
                        </h1>
                        <p className="text-slate-500 mt-1 text-sm font-medium">
                            Pantau ringkasan transaksi, estimasi profit harian, dan ketersediaan stok produk butik.
                        </p>
                    </div>

                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl px-5 py-3.5 text-white flex items-center gap-3 self-start sm:self-center shadow-md">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                        <div>
                            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Status Sistem</p>
                            <h4 className="text-sm font-extrabold text-white">Online Realtime</h4>
                        </div>
                    </div>
                </div>

                {/* Grid 4 Kartu Ringkasan Utama */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                    {/* Total Sales */}
                    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex items-center justify-between group hover:border-pink-200 transition-all">
                        <div className="space-y-2">
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Sales</p>
                            <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                                Rp {summary.totalSales.toLocaleString("id-ID")}
                            </h2>
                            <p className="text-pink-600 text-xs font-semibold bg-pink-50 px-2 py-0.5 rounded-md inline-block">
                                Omzet Kotor
                            </p>
                        </div>
                        <div className="w-14 h-14 rounded-2xl bg-pink-50 flex items-center justify-center text-pink-600 shrink-0">
                            <Wallet className="w-7 h-7" />
                        </div>
                    </div>

                    {/* Total Transactions */}
                    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex items-center justify-between group hover:border-sky-200 transition-all">
                        <div className="space-y-2">
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Transactions</p>
                            <h2 className="text-3xl font-black text-slate-800 tracking-tight">
                                {summary.totalTransactions}
                            </h2>
                            <p className="text-sky-600 text-xs font-semibold bg-sky-50 px-2 py-0.5 rounded-md inline-block">
                                Invoice Berhasil
                            </p>
                        </div>
                        <div className="w-14 h-14 rounded-2xl bg-sky-50 flex items-center justify-center text-sky-600 shrink-0">
                            <ShoppingCart className="w-7 h-7" />
                        </div>
                    </div>

                    {/* Total Products */}
                    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex items-center justify-between group hover:border-emerald-200 transition-all">
                        <div className="space-y-2">
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Products SKU</p>
                            <h2 className="text-3xl font-black text-slate-800 tracking-tight">
                                {summary.totalProducts}
                            </h2>
                            <p className="text-emerald-600 text-xs font-semibold bg-emerald-50 px-2 py-0.5 rounded-md inline-block">
                                Varian Aktif
                            </p>
                        </div>
                        <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                            <Package className="w-7 h-7" />
                        </div>
                    </div>

                    {/* Total Profit */}
                    <div className="bg-gradient-to-br from-pink-600 to-rose-600 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden group">
                        <div className="absolute right-[-20px] bottom-[-20px] w-32 h-32 rounded-full bg-white/5 pointer-events-none" />
                        <div className="relative z-10 flex items-center justify-between h-full w-full">
                            <div className="space-y-2">
                                <p className="text-xs font-bold uppercase tracking-wider text-pink-100">Total Profit</p>
                                <h2 className="text-2xl font-black tracking-tight text-pink-200">
                                    Rp {summary.totalProfit.toLocaleString("id-ID")}
                                </h2>
                                <p className="text-white/80 text-xs font-medium">Estimasi Laba Bersih</p>
                            </div>
                            <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-pink-300 shrink-0">
                                <TrendingUp className="w-7 h-7" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Grid Konten Detail */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    {/* Kolom Kiri: Riwayat Transaksi Terbaru */}
                    <div className="xl:col-span-2 bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900">Recent Transactions</h2>
                                    <p className="text-xs text-slate-400 mt-0.5">Daftar 5 aktivitas invoice penjualan kasir terbaru</p>
                                </div>
                                <span className="p-2 bg-slate-50 text-slate-400 rounded-xl border border-slate-100">
                                    <Receipt className="w-4 h-4" />
                                </span>
                            </div>

                            {sales.length === 0 ? (
                                <div className="text-center py-16 border-2 border-dashed border-slate-100 rounded-2xl">
                                    <p className="text-slate-400 text-sm font-medium">Belum ada invoice penjualan masuk hari ini</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {sales.slice(0, 5).map((sale) => (
                                        <div
                                            key={sale.id}
                                            className="bg-slate-50/80 border border-slate-100 rounded-2xl p-4 flex items-center justify-between group hover:bg-pink-50/30 hover:border-pink-100 transition-all"
                                        >
                                            <div className="flex items-center gap-4 truncate mr-2">
                                                <div className="w-12 h-12 rounded-xl bg-white text-slate-700 flex items-center justify-center border border-slate-100 shadow-sm shrink-0 group-hover:text-pink-600 transition-colors">
                                                    <Receipt className="w-5 h-5" />
                                                </div>
                                                <div className="truncate">
                                                    <h4 className="font-bold text-sm text-slate-800 truncate">
                                                        {sale.invoiceNumber}
                                                    </h4>
                                                    <p className="text-xs text-slate-400 font-medium mt-0.5 flex items-center gap-1.5">
                                                        <Store className="w-3.5 h-3.5 shrink-0" />
                                                        <span className="truncate">{sale.outlet?.name || "Gudang Utama"}</span>
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="text-right shrink-0">
                                                <h4 className="font-extrabold text-pink-600 text-sm md:text-base flex items-center justify-end gap-1">
                                                    Rp {sale.totalAmount.toLocaleString("id-ID")}
                                                </h4>
                                                <p className="text-[10px] text-slate-400 font-bold mt-0.5 flex items-center gap-1 justify-end uppercase tracking-wider">
                                                    <Clock3 className="w-3 h-3" />
                                                    {new Date(sale.createdAt).toLocaleDateString("id-ID", { day: 'numeric', month: 'short' })}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Kolom Kanan: Peringatan Stok Menipis & Status Toko */}
                    <div className="space-y-6">
                        {/* Box Peringatan Stok */}
                        <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-5">
                                <div>
                                    <h2 className="text-lg font-bold text-slate-900">Low Stock Control</h2>
                                    <p className="text-xs text-slate-400 mt-0.5">Produk di bawah batas minimum</p>
                                </div>
                                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center border border-amber-100">
                                    <AlertTriangle className="w-5 h-5" />
                                </div>
                            </div>

                            {lowStockProducts.length === 0 ? (
                                <div className="text-center py-12 bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
                                    <p className="text-slate-400 text-xs font-semibold">Stok Aman! Semua kuantitas barang terpenuhi.</p>
                                </div>
                            ) : (
                                <div className="space-y-3.5">
                                    {lowStockProducts.slice(0, 5).map((product) => (
                                        <div
                                            key={product.id}
                                            className="bg-amber-50/60 border border-amber-100 rounded-xl p-3.5 flex items-center justify-between gap-4"
                                        >
                                            <div className="truncate">
                                                <h4 className="font-bold text-xs text-slate-800 truncate">
                                                    {product.name}
                                                </h4>
                                                <p className="text-[10px] text-amber-600 font-bold uppercase tracking-wider mt-0.5">
                                                    Restock Segera
                                                </p>
                                            </div>
                                            <div className="bg-amber-100 text-amber-800 px-2.5 py-1 rounded-lg text-xs font-black shrink-0">
                                                Sisa {product.stock}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Box Status Toko */}
                        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden group">
                            <div className="absolute right-[-20px] bottom-[-20px] w-32 h-32 rounded-full bg-white/5 pointer-events-none" />
                            <div className="relative z-10 flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Operational Mode</p>
                                    <h3 className="text-3xl font-black tracking-tight text-pink-400">Active</h3>
                                    <p className="text-slate-300 text-xs mt-2 leading-relaxed max-w-[85%]">
                                        Seluruh ekosistem POS kasir dan sinkronisasi cloud API berjalan normal tanpa kendala.
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-pink-400 shrink-0">
                                    <Activity className="w-6 h-6 animate-pulse" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}