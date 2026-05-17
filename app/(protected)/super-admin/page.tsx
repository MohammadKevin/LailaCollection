"use client";

import React, {
    useEffect,
    useState,
} from "react";

import {
    TrendingUp,
    TrendingDown,
    AlertTriangle,
    CreditCard,
    Package,
    Users,
    Store,
    ShoppingBag,
    Loader2,
    DollarSign,
    Layers,
    Activity,
} from "lucide-react";

import {
    ResponsiveContainer,
    AreaChart,
    Area,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    PieChart,
    Pie,
    Cell,
    Legend,
} from "recharts";

const COLORS = [
    "#BE185D", // Dark Pink / Rose 700
    "#EC4899", // Vivid Pink 500
    "#F472B6", // Light Pink 400
    "#FDA4AF", // Rose 300
];

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
                },
            );

            const data = await response.json();
            setDashboard(data);
        } catch (error) {
            console.error("Dashboard fetch error:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col gap-4 items-center justify-center">
                <Loader2 className="w-12 h-12 animate-spin text-pink-600" />
                <p className="text-slate-400 text-sm font-medium animate-pulse">Memuat data analisis bisnis...</p>
            </div>
        );
    }

    const salesChart = dashboard?.salesChart || [];
    const paymentStats = dashboard?.paymentStats || [];
    const lowStockProducts = dashboard?.lowStockProducts || [];

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-10 space-y-8 font-sans text-slate-800 relative overflow-hidden">
            {/* Dekorasi Estetik Latar Belakang */}
            <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-pink-200/30 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-rose-200/30 rounded-full blur-[100px] pointer-events-none" />

            {/* Header Konten */}
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <div>
                    <div className="inline-flex items-center gap-2 bg-pink-50 text-pink-600 px-3 py-1.5 rounded-full text-xs font-bold tracking-wider mb-2">
                        <Activity className="w-3.5 h-3.5" />
                        Live Monitoring Center
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900">
                        Dashboard Super Admin
                    </h1>
                    <p className="text-slate-500 mt-1 text-sm font-medium">
                        Ringkasan performa finansial, inventaris, dan operasional Laila Collection.
                    </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-2xl flex items-center gap-3 self-start md:self-center">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                    <span className="text-xs font-bold text-slate-600 tracking-wide uppercase">Sistem Sinkron</span>
                </div>
            </div>

            {/* Grid 4 Kartu Utama Finansial & Penjualan */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 relative z-10">
                {/* Pendapatan */}
                <div className="bg-gradient-to-br from-pink-600 to-rose-600 text-white p-6 rounded-3xl shadow-xl shadow-pink-100 flex flex-col justify-between group hover:-translate-y-1 transition-transform">
                    <div className="flex items-start justify-between">
                        <div className="space-y-1">
                            <p className="text-xs uppercase tracking-widest text-pink-100 font-bold opacity-90">Total Pendapatan</p>
                            <h2 className="text-2xl lg:text-3xl font-black tracking-tight">
                                Rp {dashboard?.totalRevenue?.toLocaleString("id-ID") || 0}
                            </h2>
                        </div>
                        <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-white shrink-0">
                            <DollarSign className="w-6 h-6" />
                        </div>
                    </div>
                    <div className="flex items-center gap-1.5 mt-6 text-xs font-bold text-pink-100">
                        <TrendingUp className="w-3.5 h-3.5" />
                        Kotor seluruh cabang
                    </div>
                </div>

                {/* Profit Bersih */}
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between group hover:border-pink-200 transition-all">
                    <div className="flex items-start justify-between">
                        <div className="space-y-1">
                            <p className="text-xs uppercase tracking-widest text-slate-400 font-bold">Net Profit</p>
                            <h2 className="text-2xl lg:text-3xl font-black tracking-tight text-slate-900">
                                Rp {dashboard?.totalProfit?.toLocaleString("id-ID") || 0}
                            </h2>
                        </div>
                        <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 shrink-0">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                    </div>
                    <div className="mt-6">
                        <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md uppercase tracking-wider">
                            Margin Stabil
                        </span>
                    </div>
                </div>

                {/* Pengeluaran */}
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between group hover:border-rose-200 transition-all">
                    <div className="flex items-start justify-between">
                        <div className="space-y-1">
                            <p className="text-xs uppercase tracking-widest text-slate-400 font-bold">Total Pengeluaran</p>
                            <h2 className="text-2xl lg:text-3xl font-black tracking-tight text-slate-900">
                                Rp {dashboard?.totalExpense?.toLocaleString("id-ID") || 0}
                            </h2>
                        </div>
                        <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600 shrink-0">
                            <TrendingDown className="w-6 h-6" />
                        </div>
                    </div>
                    <div className="mt-6">
                        <span className="text-[10px] font-extrabold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-md uppercase tracking-wider">
                            Biaya Operasional
                        </span>
                    </div>
                </div>

                {/* Transaksi */}
                <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl flex flex-col justify-between group hover:-translate-y-1 transition-transform">
                    <div className="flex items-start justify-between">
                        <div className="space-y-1">
                            <p className="text-xs uppercase tracking-widest text-slate-400 font-bold">Transaksi Berhasil</p>
                            <h2 className="text-2xl lg:text-3xl font-black tracking-tight text-pink-400">
                                {dashboard?.totalSales || 0} Invoice
                            </h2>
                        </div>
                        <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-pink-400 shrink-0">
                            <Layers className="w-6 h-6" />
                        </div>
                    </div>
                    <div className="flex items-center gap-1.5 mt-6 text-xs font-bold text-slate-400">
                        <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
                        Pembaruan otomatis
                    </div>
                </div>
            </div>

            {/* Grid Grafik Utama */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 relative z-10">
                {/* Grafik Analitik Penjualan */}
                <div className="xl:col-span-2 bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-lg font-bold text-slate-900">Analisis Grafik Penjualan</h2>
                            <p className="text-xs text-slate-400 mt-0.5">Akumulasi grafik omzet dalam 7 hari terakhir</p>
                        </div>
                        <span className="bg-pink-50 text-pink-600 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider">
                            Live Data
                        </span>
                    </div>

                    <div className="h-[320px] w-full -ml-6 md:-ml-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={salesChart}>
                                <defs>
                                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#EC4899" stopOpacity={0.25} />
                                        <stop offset="95%" stopColor="#EC4899" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#F1F5F9" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: "#64748B", fontSize: 11, fontWeight: 500 }}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: "#64748B", fontSize: 11 }}
                                    tickFormatter={(val) => `Rp ${val >= 1000000 ? (val / 1000000).toFixed(1) + 'M' : val.toLocaleString('id-ID')}`}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff' }}
                                    formatter={(value: any) => [`Rp ${value.toLocaleString('id-ID')}`, 'Pendapatan']}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="sales"
                                    stroke="#EC4899"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorSales)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Donut Chart Metode Pembayaran */}
                <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="text-lg font-bold text-slate-900">Metode Pembayaran</h2>
                            <p className="text-xs text-slate-400 mt-0.5">Preferensi transaksi dari pembeli</p>
                        </div>
                        <CreditCard className="w-5 h-5 text-slate-400" />
                    </div>

                    <div className="h-[240px] w-full flex items-center justify-center relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={paymentStats}
                                    cx="50%"
                                    cy="40%"
                                    innerRadius={65}
                                    outerRadius={85}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {paymentStats.map((entry: any, index: number) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value) => [`${value} Transaksi`, 'Volume']} />
                                <Legend
                                    verticalAlign="bottom"
                                    iconType="circle"
                                    iconSize={8}
                                    wrapperStyle={{ fontSize: '12px', fontWeight: 600, paddingTop: '10px' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Grid 4 Mini-Cards Informasi Sistem */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 relative z-10">
                <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center shrink-0">
                        <Store className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Total Cabang</p>
                        <h4 className="text-xl font-black text-slate-800 mt-0.5">{dashboard?.totalOutlets || 0} Outlet</h4>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                        <Users className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Staf Kasir/Admin</p>
                        <h4 className="text-xl font-black text-slate-800 mt-0.5">{dashboard?.totalAdmins || 0} Akun</h4>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                        <ShoppingBag className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Katalog Produk</p>
                        <h4 className="text-xl font-black text-slate-800 mt-0.5">{dashboard?.totalProducts || 0} Item</h4>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                        <AlertTriangle className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Stok Menipis</p>
                        <h4 className="text-xl font-black text-slate-800 mt-0.5">{lowStockProducts.length} Produk</h4>
                    </div>
                </div>
            </div>

            {/* Bagian Alert Stok Produk Menipis */}
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm relative z-10">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">Peringatan Manajemen Stok</h2>
                        <p className="text-xs text-slate-400 mt-0.5">Daftar produk dengan jumlah stok di bawah batas minimal penjualan</p>
                    </div>
                    <Package className="w-5 h-5 text-slate-400" />
                </div>

                {lowStockProducts.length === 0 ? (
                    <div className="text-center py-8 bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
                        <p className="text-slate-400 text-sm font-medium">Kondisi Aman! Semua stok produk di gudang dan butik terpenuhi.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {lowStockProducts.map((product: any, index: number) => (
                            <div
                                key={index}
                                className="flex items-center justify-between bg-slate-50 border border-slate-100 rounded-2xl p-4 group hover:bg-rose-50/50 hover:border-rose-100 transition-colors"
                            >
                                <div className="space-y-1 truncate max-w-[70%]">
                                    <h3 className="font-bold text-sm text-slate-800 truncate group-hover:text-rose-950">
                                        {product.name}
                                    </h3>
                                    <p className="text-[10px] text-rose-500 font-bold uppercase tracking-wider">
                                        Butuh Restock
                                    </p>
                                </div>
                                <div className="bg-rose-100 text-rose-700 px-3 py-1.5 rounded-xl text-xs font-black shrink-0">
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