"use client";

import React, {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    Wallet,
    Search,
    Loader2,
    Sparkles,
    TrendingDown,
    Store,
    Calendar,
    Receipt,
    Plus,
    X,
    MoreHorizontal,
    Edit2,
    Trash2,
    AlignLeft,
} from "lucide-react";

import api from "@/lib/api";

type Expense = {
    id: string;
    title: string;
    description?: string;
    amount: number;
    createdAt: string;
    outlet?: {
        id: string;
        name: string;
    };
};

type Outlet = {
    id: string;
    name: string;
};

export default function ExpensesPage() {
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    
    // Master data arrays
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [outlets, setOutlets] = useState<Outlet[]>([]);
    
    // Filter states
    const [selectedOutlet, setSelectedOutlet] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    // UI state dropdown per-item
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

    // State Modal & Form Create
    const [openCreate, setOpenCreate] = useState(false);
    const [form, setForm] = useState({
        title: "",
        description: "",
        amount: "",
        outletId: "",
    });

    // State Modal & Form Edit
    const [openEdit, setOpenEdit] = useState(false);
    const [selectedExpenseId, setSelectedExpenseId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState({
        title: "",
        description: "",
        amount: "",
        outletId: "",
    });

    const fetchData = async () => {
        try {
            setLoading(true);
            const query = new URLSearchParams();

            if (selectedOutlet) query.append("outletId", selectedOutlet);
            if (startDate) query.append("startDate", startDate);
            if (endDate) query.append("endDate", endDate);

            const [expenseResponse, outletResponse] = await Promise.all([
                api.get(`/reports/expenses?${query.toString()}`),
                api.get("/outlets"),
            ]);

            setExpenses(expenseResponse.data?.expenses || []);
            setOutlets(outletResponse.data || []);
        } catch (error: any) {
            console.error(error);
            setError(error?.response?.data?.message || "Gagal mengambil data expense");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [selectedOutlet, startDate, endDate]);

    const filteredExpenses = useMemo(() => {
        return expenses.filter((expense) =>
            expense.title.toLowerCase().includes(search.toLowerCase()) ||
            expense.outlet?.name?.toLowerCase().includes(search.toLowerCase())
        );
    }, [expenses, search]);

    const totalExpense = filteredExpenses.reduce((acc, expense) => acc + expense.amount, 0);

    // Handler Tambah Expense Baru
    const handleCreateExpense = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setSubmitting(true);
            await api.post("/expenses", {
                ...form,
                amount: Number(form.amount),
            });
            setOpenCreate(false);
            setForm({ title: "", description: "", amount: "", outletId: "" });
            fetchData();
        } catch (error: any) {
            console.error(error);
            alert(error?.response?.data?.message || "Gagal mencatat pengeluaran");
        } finally {
            setSubmitting(false);
        }
    };

    // Handler Trigger Modal Edit & Mengisi Data Lama
    const handleOpenEditModal = (expense: Expense) => {
        setSelectedExpenseId(expense.id);
        setEditForm({
            title: expense.title,
            description: expense.description || "",
            amount: expense.amount.toString(),
            outletId: expense.outlet?.id || "",
        });
        setOpenEdit(true);
        setActiveDropdown(null);
    };

    // Handler Simpan Perubahan Edit (PATCH)
    const handleEditExpense = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedExpenseId) return;

        try {
            setSubmitting(true);
            await api.patch(`/expenses/${selectedExpenseId}`, {
                ...editForm,
                amount: Number(editForm.amount),
            });
            setOpenEdit(false);
            setSelectedExpenseId(null);
            fetchData();
        } catch (error: any) {
            console.error(error);
            alert(error?.response?.data?.message || "Gagal memperbarui data pengeluaran");
        } finally {
            setSubmitting(false);
        }
    };

    // Handler Hapus Pencatatan Expense
    const handleDeleteExpense = async (id: string, title: string) => {
        setActiveDropdown(null);
        if (confirm(`Hapus pencatatan pengeluaran "${title}"?\nTindakan ini akan memengaruhi laporan laba rugi.`)) {
            try {
                setLoading(true);
                await api.delete(`/expenses/${id}`);
                fetchData();
            } catch (error: any) {
                console.error(error);
                alert(error?.response?.data?.message || "Gagal menghapus log pengeluaran");
                setLoading(false);
            }
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 relative overflow-hidden font-sans">
            {/* Background Aesthetic Accents */}
            <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-pink-200/40 rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-rose-200/40 rounded-full blur-[120px] pointer-events-none" />

            <div className="relative z-10 p-4 md:p-8">
                <div className="max-w-7xl mx-auto space-y-8">
                    
                    {/* Header Section */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                        <div>
                            <div className="inline-flex items-center gap-2 bg-pink-50 text-pink-600 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wider mb-3">
                                <Sparkles className="w-3.5 h-3.5" />
                                Operational Cost Tracking
                            </div>
                            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
                                Log Pengeluaran (Expense)
                            </h1>
                            <p className="text-slate-500 mt-1 text-sm font-medium">
                                Pantau pengeluaran dana operasional harian, tagihan listrik, sewa, dan pengadaan perlengkapan cabang butik.
                            </p>
                        </div>

                        <button
                            onClick={() => setOpenCreate(true)}
                            className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 transition-all text-white px-6 py-4 rounded-2xl flex items-center justify-center gap-2.5 font-bold text-sm shadow-md shadow-pink-200 hover:-translate-y-0.5 active:scale-95 whitespace-nowrap self-start sm:self-center"
                        >
                            <Plus className="w-5 h-5" />
                            Catat Expense Baru
                        </button>
                    </div>

                    {/* Stats Widget Metrics Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex items-center justify-between group hover:border-rose-200 transition-all">
                            <div className="space-y-2">
                                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Anggaran Keluar</p>
                                <h2 className="text-2xl lg:text-3xl font-black text-rose-600 transition-transform group-hover:scale-105 origin-left">
                                    Rp {totalExpense.toLocaleString("id-ID")}
                                </h2>
                                <p className="text-slate-400 text-xs font-medium">Akumulasi pengeluaran terfilter</p>
                            </div>
                            <div className="w-16 h-16 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-600">
                                <Wallet className="w-8 h-8" />
                            </div>
                        </div>

                        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex items-center justify-between group hover:border-pink-200 transition-all">
                            <div className="space-y-2">
                                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Volume Transaksi Log</p>
                                <h2 className="text-4xl font-black text-slate-800 transition-transform group-hover:scale-105 origin-left">
                                    {filteredExpenses.length}
                                </h2>
                                <p className="text-pink-600 text-xs font-semibold bg-pink-50 px-2 py-0.5 rounded-md inline-block">Item Invoice</p>
                            </div>
                            <div className="w-16 h-16 rounded-2xl bg-pink-50 flex items-center justify-center text-pink-600">
                                <Receipt className="w-8 h-8" />
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden group">
                            <div className="absolute right-[-20px] bottom-[-20px] w-32 h-32 rounded-full bg-white/5 pointer-events-none" />
                            <div className="relative z-10 flex items-center justify-between h-full">
                                <div className="space-y-2">
                                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Arus Beban Finansial</p>
                                    <h2 className="text-3xl font-black tracking-tight text-pink-300">
                                        Monitoring
                                    </h2>
                                    <p className="text-slate-300 text-xs font-medium">Data pengeluaran bersifat absolut</p>
                                </div>
                                <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-pink-400">
                                    <TrendingDown className="w-7 h-7" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filter & Advanced Search Controls Container */}
                    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-4">
                        <div className="relative w-full">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Cari berdasarkan judul pengeluaran atau nama cabang..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full bg-slate-50 text-slate-800 rounded-xl py-3.5 pl-11 pr-4 outline-none focus:ring-2 focus:ring-pink-500/20 focus:bg-white border border-transparent focus:border-pink-500 transition-all font-medium text-sm"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Pilih Cabang</label>
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
                                <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Tanggal Mulai</label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="w-full bg-slate-50 rounded-xl p-2.5 border border-slate-200 outline-none focus:ring-2 focus:ring-pink-500/20 text-xs font-semibold text-slate-700"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Tanggal Akhir</label>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="w-full bg-slate-50 rounded-xl p-2.5 border border-slate-200 outline-none focus:ring-2 focus:ring-pink-500/20 text-xs font-semibold text-slate-700"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Notice handling box */}
                    {error && (
                        <div className="bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl p-4 text-sm font-medium flex items-center gap-3">
                            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                            {error}
                        </div>
                    )}

                    {/* Main Content Render Grid */}
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-24 gap-3 bg-white/50 backdrop-blur-md rounded-3xl border border-slate-100">
                            <Loader2 className="w-10 h-10 animate-spin text-pink-600" />
                            <p className="text-slate-400 text-sm font-medium animate-pulse">Menghimpun log operasional...</p>
                        </div>
                    ) : filteredExpenses.length === 0 ? (
                        <div className="text-center py-24 bg-white rounded-3xl border border-slate-100 shadow-sm space-y-3">
                            <Wallet className="w-12 h-12 text-slate-300 mx-auto" />
                            <p className="text-slate-500 font-semibold">Tidak ada data expense harian</p>
                            <p className="text-slate-400 text-xs">Kosong untuk filter terpilih atau kata kunci tidak cocok.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                            {filteredExpenses.map((expense) => (
                                <div
                                    key={expense.id}
                                    className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 hover:shadow-xl hover:border-slate-200/80 transition-all duration-300 flex flex-col justify-between group"
                                >
                                    <div>
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-50 to-pink-50 text-rose-600 flex items-center justify-center border border-rose-100/50 shrink-0">
                                                    <Wallet className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-pink-600 transition-colors line-clamp-1">
                                                        {expense.title}
                                                    </h3>
                                                    <div className="flex items-center gap-4 mt-1.5 text-xs text-slate-500 font-medium">
                                                        <div className="flex items-center gap-1.5">
                                                            <Store className="w-3.5 h-3.5 text-slate-400" />
                                                            <span>{expense.outlet?.name || "Gudang Utama"}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1.5">
                                                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                                            <span>{new Date(expense.createdAt).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Action popover menu toggle box */}
                                            <div className="relative">
                                                <button
                                                    onClick={() => setActiveDropdown(activeDropdown === expense.id ? null : expense.id)}
                                                    className="w-10 h-10 rounded-xl bg-slate-50 hover:bg-slate-100 transition-all flex items-center justify-center text-slate-500 border border-slate-100"
                                                >
                                                    <MoreHorizontal className="w-4 h-4" />
                                                </button>

                                                {activeDropdown === expense.id && (
                                                    <>
                                                        <div className="fixed inset-0 z-20" onClick={() => setActiveDropdown(null)} />
                                                        <div className="absolute right-0 mt-2 w-36 bg-white rounded-2xl border border-slate-100 shadow-xl py-2 z-30 animate-in fade-in slide-in-from-top-2 duration-150">
                                                            <button
                                                                onClick={() => handleOpenEditModal(expense)}
                                                                className="w-full px-4 py-2 text-left text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors"
                                                            >
                                                                <Edit2 className="w-3.5 h-3.5 text-sky-500" />
                                                                Edit Log
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteExpense(expense.id, expense.title)}
                                                                className="w-full px-4 py-2 text-left text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 transition-colors"
                                                            >
                                                                <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                                                                Hapus Data
                                                            </button>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        {expense.description && (
                                            <div className="mt-4 bg-slate-50 border border-slate-100 rounded-2xl p-4 text-xs text-slate-500 font-medium leading-relaxed">
                                                {expense.description}
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-5 pt-3 border-t border-slate-50 flex items-center justify-between">
                                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Nominal Keluar</span>
                                        <div className="text-sm font-extrabold text-rose-600 bg-rose-50 px-3 py-1 rounded-xl border border-rose-100/50">
                                            - Rp {expense.amount.toLocaleString("id-ID")}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Modal: CATAT EXPENSE BARU */}
            {openCreate && (
                <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
                    <div className="w-full max-w-lg bg-white rounded-3xl p-6 md:p-8 shadow-2xl animate-in zoom-in-95 duration-200 my-auto">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">Catat Beban Biaya Harian</h2>
                                <p className="text-slate-400 text-xs mt-0.5">Input log operasional kas kecil cabang butik</p>
                            </div>
                            <button
                                onClick={() => setOpenCreate(false)}
                                className="w-9 h-9 rounded-xl bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-400"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <form onSubmit={handleCreateExpense} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500">Judul Pengeluaran *</label>
                                <input
                                    type="text"
                                    placeholder="Contoh: Pembelian Token Listrik / Gaji Staf"
                                    value={form.title}
                                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                                    className="w-full bg-slate-50 rounded-xl p-3 border border-slate-200 outline-none focus:ring-2 focus:ring-pink-500/20 text-sm font-medium"
                                    required
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500">Nominal Biaya Keluar (Rp) *</label>
                                <input
                                    type="number"
                                    placeholder="0"
                                    value={form.amount}
                                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                                    className="w-full bg-slate-50 rounded-xl p-3 border border-slate-200 outline-none focus:ring-2 focus:ring-pink-500/20 text-sm font-medium"
                                    required
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500">Penempatan Beban Cabang *</label>
                                <select
                                    value={form.outletId}
                                    onChange={(e) => setForm({ ...form, outletId: e.target.value })}
                                    className="w-full bg-slate-50 rounded-xl p-3 border border-slate-200 outline-none focus:ring-2 focus:ring-pink-500/20 text-sm font-medium"
                                    required
                                >
                                    <option value="">Pilih Outlet</option>
                                    {outlets.map((outlet) => (
                                        <option key={outlet.id} value={outlet.id}>{outlet.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500">Keterangan / Deskripsi Tambahan</label>
                                <div className="relative">
                                    <AlignLeft className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                                    <textarea
                                        placeholder="Tulis rincian atau catatan khusus log belanja (Opsional)"
                                        value={form.description}
                                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                                        className="w-full bg-slate-50 rounded-xl py-3 pl-10 pr-3 border border-slate-200 outline-none focus:ring-2 focus:ring-pink-500/20 text-sm font-medium min-h-[90px] resize-none"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full bg-slate-900 hover:bg-slate-800 disabled:opacity-50 transition-all text-white py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-md flex items-center justify-center gap-2 mt-2"
                            >
                                {submitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Sedang Menyimpan...
                                    </>
                                ) : (
                                    <>
                                        <Plus className="w-4 h-4" />
                                        Simpan Entri Expense
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal: EDIT EXPENSE */}
            {openEdit && (
                <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
                    <div className="w-full max-w-lg bg-white rounded-3xl p-6 md:p-8 shadow-2xl animate-in zoom-in-95 duration-200 my-auto">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">Koreksi Data Expense</h2>
                                <p className="text-slate-400 text-xs mt-0.5">Perbarui rincian nominal atau pemindahan beban cabang</p>
                            </div>
                            <button
                                onClick={() => { setOpenEdit(false); setSelectedExpenseId(null); }}
                                className="w-9 h-9 rounded-xl bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-400"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <form onSubmit={handleEditExpense} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500">Judul Pengeluaran *</label>
                                <input
                                    type="text"
                                    value={editForm.title}
                                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                    className="w-full bg-slate-50 rounded-xl p-3 border border-slate-200 outline-none focus:ring-2 focus:ring-pink-500/20 text-sm font-medium"
                                    required
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500">Nominal Biaya Keluar (Rp) *</label>
                                <input
                                    type="number"
                                    value={editForm.amount}
                                    onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
                                    className="w-full bg-slate-50 rounded-xl p-3 border border-slate-200 outline-none focus:ring-2 focus:ring-pink-500/20 text-sm font-medium"
                                    required
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500">Penempatan Beban Cabang *</label>
                                <select
                                    value={editForm.outletId}
                                    onChange={(e) => setEditForm({ ...editForm, outletId: e.target.value })}
                                    className="w-full bg-slate-50 rounded-xl p-3 border border-slate-200 outline-none focus:ring-2 focus:ring-pink-500/20 text-sm font-medium"
                                    required
                                >
                                    <option value="">Pilih Outlet</option>
                                    {outlets.map((outlet) => (
                                        <option key={outlet.id} value={outlet.id}>{outlet.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500">Keterangan / Deskripsi Tambahan</label>
                                <div className="relative">
                                    <AlignLeft className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                                    <textarea
                                        value={editForm.description}
                                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                        className="w-full bg-slate-50 rounded-xl py-3 pl-10 pr-3 border border-slate-200 outline-none focus:ring-2 focus:ring-pink-500/20 text-sm font-medium min-h-[90px] resize-none"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full bg-pink-600 hover:bg-pink-700 disabled:opacity-50 transition-all text-white py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-md flex items-center justify-center gap-2 mt-2"
                            >
                                {submitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Sedang Memperbarui...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-4 h-4" />
                                        Simpan Perubahan Log
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}