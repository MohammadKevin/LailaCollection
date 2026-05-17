"use client";

import React, {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    Store,
    Plus,
    Search,
    MapPin,
    Phone,
    MoreHorizontal,
    TrendingUp,
    Users,
    ChevronRight,
    Loader2,
    Sparkles,
    X,
    ImagePlus,
    Edit2,
    Trash2,
} from "lucide-react";

import api from "@/lib/api";

type Outlet = {
    id: string;
    name: string;
    address?: string;
    noTelp?: string;
    qrisImage?: string;
    users?: any[];
};

export default function OutletsPage() {
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [totalSales, setTotalSales] = useState(0);
    const [outlets, setOutlets] = useState<Outlet[]>([]);

    // State untuk Dropdown Aksi (Edit/Delete) per Outlet ID
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

    // State untuk Modal Create
    const [openCreate, setOpenCreate] = useState(false);
    const [qrisImage, setQrisImage] = useState<File | null>(null);
    const [form, setForm] = useState({
        name: "",
        address: "",
        noTelp: "",
    });

    // State untuk Modal Edit
    const [openEdit, setOpenEdit] = useState(false);
    const [selectedOutletId, setSelectedOutletId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState({
        name: "",
        address: "",
        noTelp: "",
    });
    const [editQrisImage, setEditQrisImage] = useState<File | null>(null);

    const fetchOutlets = async () => {
        try {
            setLoading(true);
            const outletResponse = await api.get("/outlets");
            setOutlets(outletResponse.data);

            const reportResponse = await api.get("/reports/profit-loss");
            setTotalSales(reportResponse.data?.totalSales || 0);
        } catch (error: any) {
            console.error(error);
            setError(
                error?.response?.data?.message ||
                "Gagal mengambil data dari server"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOutlets();
    }, []);

    const filteredOutlets = useMemo(() => {
        return outlets.filter((outlet) =>
            outlet.name.toLowerCase().includes(search.toLowerCase())
        );
    }, [outlets, search]);

    const totalAdmin = outlets.reduce(
        (acc, outlet) => acc + (outlet.users?.length || 0),
        0
    );

    // Handler Tambah Outlet
    const handleCreateOutlet = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setSubmitting(true);
            const formData = new FormData();
            formData.append("name", form.name);
            formData.append("address", form.address);
            formData.append("noTelp", form.noTelp);
            if (qrisImage) {
                formData.append("qrisImage", qrisImage);
            }

            await api.post("/outlets", formData);
            setOpenCreate(false);
            setForm({ name: "", address: "", noTelp: "" });
            setQrisImage(null);
            fetchOutlets();
        } catch (error: any) {
            console.error(error);
            alert(error?.response?.data?.message || "Gagal menambah outlet");
        } finally {
            setSubmitting(false);
        }
    };

    // Handler Trigger Modal Edit & Mengisi Data Lama
    const handleOpenEditModal = (outlet: Outlet) => {
        setSelectedOutletId(outlet.id);
        setEditForm({
            name: outlet.name,
            address: outlet.address || "",
            noTelp: outlet.noTelp || "",
        });
        setEditQrisImage(null);
        setOpenEdit(true);
        setActiveDropdown(null); // Tutup dropdown
    };

    // Handler Simpan Perubahan Edit
    // Handler Simpan Perubahan Edit
    const handleEditOutlet = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedOutletId) return;

        try {
            setSubmitting(true);
            const formData = new FormData();
            formData.append("name", editForm.name);
            formData.append("address", editForm.address);
            formData.append("noTelp", editForm.noTelp);

            // Hanya kirim file jika user memilih file baru
            if (editQrisImage) {
                formData.append("qrisImage", editQrisImage);
            }

            // SEBELUMNYA: await api.put(...)
            // DISESUAIKAN: Menggunakan api.patch sesuai dengan decorator @Patch(':id') di NestJS
            await api.patch(`/outlets/${selectedOutletId}`, formData);

            setOpenEdit(false);
            setSelectedOutletId(null);
            fetchOutlets(); // Refresh data setelah berhasil
        } catch (error: any) {
            console.error(error);
            alert(error?.response?.data?.message || "Gagal memperbarui outlet");
        } finally {
            setSubmitting(false);
        }
    };

    // Handler Hapus Outlet
    const handleDeleteOutlet = async (id: string, name: string) => {
        setActiveDropdown(null);
        if (confirm(`Apakah Anda yakin ingin menghapus outlet "${name}"?`)) {
            try {
                setLoading(true);
                await api.delete(`/outlets/${id}`);
                fetchOutlets();
            } catch (error: any) {
                console.error(error);
                alert(error?.response?.data?.message || "Gagal menghapus outlet");
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
                                HQ Management Dashboard
                            </div>
                            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
                                Kelola Cabang Outlet
                            </h1>
                            <p className="text-slate-500 mt-1 text-sm font-medium">
                                Pantau seluruh performa bisnis, tim admin, dan operasional butik secara realtime.
                            </p>
                        </div>

                        <button
                            onClick={() => setOpenCreate(true)}
                            className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 transition-all text-white px-6 py-4 rounded-2xl flex items-center justify-center gap-2.5 font-bold text-sm shadow-md shadow-pink-200 hover:-translate-y-0.5 active:scale-95 whitespace-nowrap self-start sm:self-center"
                        >
                            <Plus className="w-5 h-5" />
                            Tambah Outlet Baru
                        </button>
                    </div>

                    {/* Stats Widget Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Stat 1 */}
                        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex items-center justify-between group hover:border-pink-200 transition-all">
                            <div className="space-y-2">
                                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Outlet</p>
                                <h2 className="text-4xl font-black text-slate-800 transition-transform group-hover:scale-105 origin-left">
                                    {outlets.length}
                                </h2>
                                <p className="text-emerald-600 text-xs font-semibold bg-emerald-50 px-2 py-0.5 rounded-md inline-block">
                                    Cabang Aktif
                                </p>
                            </div>
                            <div className="w-16 h-16 rounded-2xl bg-pink-50 flex items-center justify-center text-pink-600">
                                <Store className="w-8 h-8" />
                            </div>
                        </div>

                        {/* Stat 2 */}
                        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex items-center justify-between group hover:border-sky-200 transition-all">
                            <div className="space-y-2">
                                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total SDM Admin</p>
                                <h2 className="text-4xl font-black text-slate-800 transition-transform group-hover:scale-105 origin-left">
                                    {totalAdmin}
                                </h2>
                                <p className="text-sky-600 text-xs font-semibold bg-sky-50 px-2 py-0.5 rounded-md inline-block">
                                    Terdaftar di Outlet
                                </p>
                            </div>
                            <div className="w-16 h-16 rounded-2xl bg-sky-50 flex items-center justify-center text-sky-600">
                                <Users className="w-8 h-8" />
                            </div>
                        </div>

                        {/* Stat 3 */}
                        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden group">
                            <div className="absolute right-[-20px] bottom-[-20px] w-32 h-32 rounded-full bg-white/5 pointer-events-none" />
                            <div className="relative z-10 flex items-center justify-between h-full">
                                <div className="space-y-2">
                                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Akumulasi Pendapatan</p>
                                    <h2 className="text-2xl lg:text-3xl font-black tracking-tight text-pink-300">
                                        Rp {totalSales.toLocaleString("id-ID")}
                                    </h2>
                                    <p className="text-slate-300 text-xs font-medium">Dari seluruh transaksi digital & manual</p>
                                </div>
                                <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-pink-400">
                                    <TrendingUp className="w-7 h-7" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filter Bar & Search */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
                        <div className="relative w-full sm:max-w-md">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Cari berdasarkan nama outlet..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full bg-slate-50 text-slate-800 rounded-xl py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-pink-500/20 focus:bg-white border border-transparent focus:border-pink-500 transition-all font-medium text-sm"
                            />
                        </div>
                        <div className="bg-slate-100 text-slate-600 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap self-stretch sm:self-center text-center">
                            Menampilkan <span className="text-pink-600 font-extrabold">{filteredOutlets.length}</span> Outlet
                        </div>
                    </div>

                    {/* Error Notice */}
                    {error && (
                        <div className="bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl p-4 text-sm font-medium flex items-center gap-3">
                            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                            {error}
                        </div>
                    )}

                    {/* Content Section: Loading vs Grid Card */}
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-24 gap-3 bg-white/50 backdrop-blur-md rounded-3xl border border-slate-100">
                            <Loader2 className="w-10 h-10 animate-spin text-pink-600" />
                            <p className="text-slate-400 text-sm font-medium animate-pulse">Menghubungkan ke server...</p>
                        </div>
                    ) : filteredOutlets.length === 0 ? (
                        <div className="text-center py-24 bg-white rounded-3xl border border-slate-100 shadow-sm space-y-3">
                            <Store className="w-12 h-12 text-slate-300 mx-auto" />
                            <p className="text-slate-500 font-semibold">Tidak ada outlet ditemukan</p>
                            <p className="text-slate-400 text-xs">Coba ubah kata kunci pencarian Anda atau tambahkan outlet baru.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {filteredOutlets.map((outlet) => (
                                <div
                                    key={outlet.id}
                                    className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 hover:shadow-xl hover:border-slate-200/80 transition-all duration-300 flex flex-col justify-between relative group"
                                >
                                    <div>
                                        {/* Top Card Section */}
                                        <div className="flex items-start justify-between gap-4 relative">
                                            <div className="flex items-center gap-4">
                                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-50 to-rose-50 text-pink-600 flex items-center justify-center border border-pink-100/50 shrink-0">
                                                    <Store className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-bold text-slate-900 leading-snug group-hover:text-pink-600 transition-colors">
                                                        {outlet.name}
                                                    </h3>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                                        <span className="text-slate-400 text-xs font-medium">Operasional Aktif</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Action Dropdown Menu Button */}
                                            <div className="relative">
                                                <button
                                                    onClick={() => setActiveDropdown(activeDropdown === outlet.id ? null : outlet.id)}
                                                    className="w-10 h-10 rounded-xl bg-slate-50 hover:bg-slate-100 transition-all flex items-center justify-center text-slate-500 border border-slate-100"
                                                >
                                                    <MoreHorizontal className="w-4 h-4" />
                                                </button>

                                                {/* Action Popover Box */}
                                                {activeDropdown === outlet.id && (
                                                    <>
                                                        <div className="fixed inset-0 z-20" onClick={() => setActiveDropdown(null)} />
                                                        <div className="absolute right-0 mt-2 w-40 bg-white rounded-2xl border border-slate-100 shadow-xl py-2 z-30 animate-in fade-in slide-in-from-top-2 duration-150">
                                                            <button
                                                                onClick={() => handleOpenEditModal(outlet)}
                                                                className="w-full px-4 py-2.5 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors"
                                                            >
                                                                <Edit2 className="w-4 h-4 text-sky-500" />
                                                                Ubah / Edit
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteOutlet(outlet.id, outlet.name)}
                                                                className="w-full px-4 py-2.5 text-left text-sm font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 transition-colors"
                                                            >
                                                                <Trash2 className="w-4 h-4 text-rose-500" />
                                                                Hapus Cabang
                                                            </button>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        {/* Details Section */}
                                        <div className="space-y-2.5 mt-6 pt-4 border-t border-slate-50 text-xs text-slate-600 font-medium">
                                            <div className="flex items-start gap-2.5">
                                                <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                                                <span className="leading-relaxed">
                                                    {outlet.address || "Alamat belum dilengkapi"}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2.5">
                                                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                                                <span>{outlet.noTelp || "No. Telepon belum ada"}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Bottom Info Grid */}
                                    <div className="mt-6 space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-slate-50/80 rounded-2xl p-3 border border-slate-100 text-center">
                                                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Staf Admin</p>
                                                <h4 className="text-xl font-extrabold text-slate-800 mt-0.5">{outlet.users?.length || 0} Orang</h4>
                                            </div>
                                            <div className="bg-slate-50/80 rounded-2xl p-3 border border-slate-100 text-center">
                                                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Metode Bayar</p>
                                                <span className={`inline-block text-xs font-bold px-2 py-0.5 rounded mt-1.5 ${outlet.qrisImage ? 'bg-pink-50 text-pink-600' : 'bg-amber-50 text-amber-600'}`}>
                                                    {outlet.qrisImage ? "QRIS" : "Manual / Cash"}
                                                </span>
                                            </div>
                                        </div>

                                        <button className="w-full bg-slate-900 hover:bg-slate-800 transition-all text-white px-4 py-3.5 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 group-hover:bg-pink-600 shadow-sm">
                                            Buka Dashboard Cabang
                                            <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Modal: TAMBAH OUTLET */}
            {openCreate && (
                <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
                    <div className="w-full max-w-lg bg-white rounded-3xl p-6 md:p-8 shadow-2xl animate-in zoom-in-95 duration-200 my-auto">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900">Registrasi Cabang Baru</h2>
                                <p className="text-slate-400 text-xs mt-1">Lengkapi info instansi butik di bawah ini</p>
                            </div>
                            <button
                                onClick={() => { setOpenCreate(false); setQrisImage(null); }}
                                className="w-10 h-10 rounded-xl bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-400"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleCreateOutlet} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500">Nama Cabang/Outlet *</label>
                                <input
                                    type="text"
                                    placeholder="Contoh: Butik Cabang Bandung"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    className="w-full bg-slate-50 rounded-xl p-3.5 border border-slate-200 outline-none focus:ring-2 focus:ring-pink-500/20 text-sm font-medium"
                                    required
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500">Alamat Lengkap</label>
                                <textarea
                                    placeholder="Jl. Raya No. 123, Kota Bandung"
                                    value={form.address}
                                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                                    className="w-full bg-slate-50 rounded-xl p-3.5 border border-slate-200 outline-none focus:ring-2 focus:ring-pink-500/20 text-sm font-medium min-h-[90px] resize-none"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500">No. Telepon Aktif</label>
                                <input
                                    type="text"
                                    placeholder="08123xxxx"
                                    value={form.noTelp}
                                    onChange={(e) => setForm({ ...form, noTelp: e.target.value })}
                                    className="w-full bg-slate-50 rounded-xl p-3.5 border border-slate-200 outline-none focus:ring-2 focus:ring-pink-500/20 text-sm font-medium"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500">E-Wallet QRIS Code (Gambar)</label>
                                <label className="w-full bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-slate-100/70 transition-all">
                                    <ImagePlus className="w-8 h-8 text-slate-400" />
                                    <div className="text-center">
                                        <p className="font-bold text-xs text-slate-600">Klik untuk jelajahi file gambar</p>
                                        <p className="text-[10px] text-slate-400 mt-0.5">Mendukung format PNG, JPG up to 2MB</p>
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => setQrisImage(e.target.files?.[0] || null)}
                                    />
                                </label>
                            </div>

                            {qrisImage && (
                                <div className="bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-xl px-4 py-2.5 font-medium text-xs flex items-center justify-between">
                                    <span className="truncate max-w-[85%]">{qrisImage.name}</span>
                                    <X className="w-4 h-4 cursor-pointer text-emerald-500 shrink-0" onClick={() => setQrisImage(null)} />
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full bg-slate-900 hover:bg-slate-800 disabled:opacity-50 transition-all text-white py-4 rounded-xl font-bold text-sm shadow-md flex items-center justify-center gap-2 mt-2"
                            >
                                {submitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Sedang Mendaftarkan...
                                    </>
                                ) : (
                                    <>
                                        <Plus className="w-4 h-4" />
                                        Simpan & Sinkronisasi
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal: EDIT OUTLET */}
            {openEdit && (
                <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
                    <div className="w-full max-w-lg bg-white rounded-3xl p-6 md:p-8 shadow-2xl animate-in zoom-in-95 duration-200 my-auto">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900">Ubah Data Outlet</h2>
                                <p className="text-slate-400 text-xs mt-1">Perbarui data atau relokasi informasi cabang</p>
                            </div>
                            <button
                                onClick={() => { setOpenEdit(false); setSelectedOutletId(null); }}
                                className="w-10 h-10 rounded-xl bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-400"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleEditOutlet} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500">Nama Cabang/Outlet *</label>
                                <input
                                    type="text"
                                    placeholder="Ubah nama outlet"
                                    value={editForm.name}
                                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                    className="w-full bg-slate-50 rounded-xl p-3.5 border border-slate-200 outline-none focus:ring-2 focus:ring-pink-500/20 text-sm font-medium"
                                    required
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500">Alamat Baru</label>
                                <textarea
                                    placeholder="Ubah alamat lengkap"
                                    value={editForm.address}
                                    onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                                    className="w-full bg-slate-50 rounded-xl p-3.5 border border-slate-200 outline-none focus:ring-2 focus:ring-pink-500/20 text-sm font-medium min-h-[90px] resize-none"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500">No. Telepon Baru</label>
                                <input
                                    type="text"
                                    placeholder="Ubah nomor telepon"
                                    value={editForm.noTelp}
                                    onChange={(e) => setEditForm({ ...editForm, noTelp: e.target.value })}
                                    className="w-full bg-slate-50 rounded-xl p-3.5 border border-slate-200 outline-none focus:ring-2 focus:ring-pink-500/20 text-sm font-medium"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500">Ganti QRIS Code (Opsional)</label>
                                <label className="w-full bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-slate-100/70 transition-all">
                                    <ImagePlus className="w-8 h-8 text-slate-400" />
                                    <div className="text-center">
                                        <p className="font-bold text-xs text-slate-600">Pilih gambar baru</p>
                                        <p className="text-[10px] text-slate-400 mt-0.5">Kosongkan jika tidak ingin mengubah QRIS lama</p>
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => setEditQrisImage(e.target.files?.[0] || null)}
                                    />
                                </label>
                            </div>

                            {editQrisImage && (
                                <div className="bg-pink-50 text-pink-700 border border-pink-100 rounded-xl px-4 py-2.5 font-medium text-xs flex items-center justify-between">
                                    <span className="truncate max-w-[85%]">{editQrisImage.name}</span>
                                    <X className="w-4 h-4 cursor-pointer text-pink-500 shrink-0" onClick={() => setEditQrisImage(null)} />
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full bg-pink-600 hover:bg-pink-700 disabled:opacity-50 transition-all text-white py-4 rounded-xl font-bold text-sm shadow-md flex items-center justify-center gap-2 mt-2"
                            >
                                {submitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Sedang Menyimpan...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-4 h-4" />
                                        Perbarui Data Cabang
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