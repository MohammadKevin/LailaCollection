"use client";

import React, {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    Users,
    Plus,
    Search,
    Mail,
    Store,
    Shield,
    Loader2,
    Sparkles,
    X,
    Lock,
    MoreHorizontal,
    Edit2,
    Trash2,
    Eye,
    EyeOff
} from "lucide-react";

import api from "@/lib/api";

type Outlet = {
    id: string;
    name: string;
};

type Admin = {
    id: string;
    name: string;
    email: string;
    role: string;
    outlet?: {
        id: string;
        name: string;
    };
};

export default function AdminsPage() {
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [search, setSearch] = useState("");
    const [error, setError] = useState("");
    const [admins, setAdmins] = useState<Admin[]>([]);
    const [outlets, setOutlets] = useState<Outlet[]>([]);
    
    // State UI & Dropdown Menu
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    // State Modal Create
    const [openCreate, setOpenCreate] = useState(false);
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        outletId: "",
    });

    // State Modal Edit
    const [openEdit, setOpenEdit] = useState(false);
    const [selectedAdminId, setSelectedAdminId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState({
        name: "",
        email: "",
        password: "", // Kosongkan jika tidak ingin mengubah password
        outletId: "",
    });

    const fetchData = async () => {
        try {
            setLoading(true);
            const [adminsResponse, outletsResponse] = await Promise.all([
                api.get("/users"),
                api.get("/outlets"),
            ]);

            setAdmins(adminsResponse.data);
            setOutlets(outletsResponse.data);
        } catch (error: any) {
            console.error(error);
            setError(
                error?.response?.data?.message || "Gagal mengambil data dari server"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const filteredAdmins = useMemo(() => {
        return admins.filter((admin) =>
            admin.name.toLowerCase().includes(search.toLowerCase()) ||
            admin.email.toLowerCase().includes(search.toLowerCase())
        );
    }, [admins, search]);

    // Handler Tambah Admin
    const handleCreateAdmin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setSubmitting(true);
            await api.post("/auth/create-admin", form);
            
            setOpenCreate(false);
            setForm({ name: "", email: "", password: "", outletId: "" });
            fetchData();
        } catch (error: any) {
            console.error(error);
            alert(error?.response?.data?.message || "Gagal menambah akun admin");
        } finally {
            setSubmitting(false);
        }
    };

    // Handler Buka Modal Edit & Isi Form Data Lama
    const handleOpenEditModal = (admin: Admin) => {
        setSelectedAdminId(admin.id);
        setEditForm({
            name: admin.name,
            email: admin.email,
            password: "", // Dikosongkan secara default untuk keamanan
            outletId: admin.outlet?.id || "",
        });
        setOpenEdit(true);
        setActiveDropdown(null);
    };

    // Handler Simpan Perubahan Edit
    const handleEditAdmin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedAdminId) return;

        try {
            setSubmitting(true);
            
            // Buat payload objek kiriman data
            const payload: any = {
                name: editForm.name,
                email: editForm.email,
                outletId: editForm.outletId,
            };
            // Hanya sertakan password jika admin sengaja mengisinya untuk diubah
            if (editForm.password.trim() !== "") {
                payload.password = editForm.password;
            }

            await api.patch(`/users/${selectedAdminId}`, payload);
            
            setOpenEdit(false);
            setSelectedAdminId(null);
            fetchData();
        } catch (error: any) {
            console.error(error);
            alert(error?.response?.data?.message || "Gagal memperbarui data admin");
        } finally {
            setSubmitting(false);
        }
    };

    // Handler Hapus Admin
    const handleDeleteAdmin = async (id: string, name: string) => {
        setActiveDropdown(null);
        if (confirm(`Apakah Anda yakin ingin menghapus akses admin untuk "${name}"?`)) {
            try {
                setLoading(true);
                await api.delete(`/users/${id}`);
                fetchData();
            } catch (error: any) {
                console.error(error);
                alert(error?.response?.data?.message || "Gagal menghapus admin");
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
                                Credentials & Access Management
                            </div>
                            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
                                Kelola Karyawan Admin
                            </h1>
                            <p className="text-slate-500 mt-1 text-sm font-medium">
                                Atur hak akses login kredensial kasir dan penugasan admin untuk setiap cabang butik.
                            </p>
                        </div>

                        <button
                            onClick={() => setOpenCreate(true)}
                            className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 transition-all text-white px-6 py-4 rounded-2xl flex items-center justify-center gap-2.5 font-bold text-sm shadow-md shadow-pink-200 hover:-translate-y-0.5 active:scale-95 whitespace-nowrap self-start sm:self-center"
                        >
                            <Plus className="w-5 h-5" />
                            Tambah Admin Baru
                        </button>
                    </div>

                    {/* Stats Summary Widgets */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex items-center justify-between group hover:border-pink-200 transition-all">
                            <div className="space-y-2">
                                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Akun Admin</p>
                                <h2 className="text-4xl font-black text-slate-800 transition-transform group-hover:scale-105 origin-left">
                                    {admins.length}
                                </h2>
                                <p className="text-pink-600 text-xs font-semibold bg-pink-50 px-2 py-0.5 rounded-md inline-block">
                                    Staf Terdaftar
                                </p>
                            </div>
                            <div className="w-16 h-16 rounded-2xl bg-pink-50 flex items-center justify-center text-pink-600">
                                <Users className="w-8 h-8" />
                            </div>
                        </div>

                        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex items-center justify-between group hover:border-sky-200 transition-all">
                            <div className="space-y-2">
                                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Penugasan Cabang</p>
                                <h2 className="text-4xl font-black text-slate-800 transition-transform group-hover:scale-105 origin-left">
                                    {outlets.length}
                                </h2>
                                <p className="text-sky-600 text-xs font-semibold bg-sky-50 px-2 py-0.5 rounded-md inline-block">
                                    Titik Lokasi Butik
                                </p>
                            </div>
                            <div className="w-16 h-16 rounded-2xl bg-sky-50 flex items-center justify-center text-sky-600">
                                <Store className="w-8 h-8" />
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden group">
                            <div className="absolute right-[-20px] bottom-[-20px] w-32 h-32 rounded-full bg-white/5 pointer-events-none" />
                            <div className="relative z-10 flex items-center justify-between h-full">
                                <div className="space-y-2">
                                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Keamanan Akses</p>
                                    <h2 className="text-3xl font-black tracking-tight text-pink-300">
                                        Enkripsi SSL
                                    </h2>
                                    <p className="text-slate-300 text-xs font-medium">Kredensial login terenkripsi aman</p>
                                </div>
                                <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-pink-400">
                                    <Shield className="w-7 h-7" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filter & Search Bar */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
                        <div className="relative w-full sm:max-w-md">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Cari admin berdasarkan nama atau email..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full bg-slate-50 text-slate-800 rounded-xl py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-pink-500/20 focus:bg-white border border-transparent focus:border-pink-500 transition-all font-medium text-sm"
                            />
                        </div>
                        <div className="bg-slate-100 text-slate-600 px-4 py-2 rounded-xl text-xs font-bold text-center self-stretch sm:self-center">
                            Menampilkan <span className="text-pink-600 font-extrabold">{filteredAdmins.length}</span> Pengguna
                        </div>
                    </div>

                    {/* Error Box */}
                    {error && (
                        <div className="bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl p-4 text-sm font-medium flex items-center gap-3">
                            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                            {error}
                        </div>
                    )}

                    {/* Main Grid Content */}
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-24 gap-3 bg-white/50 backdrop-blur-md rounded-3xl border border-slate-100">
                            <Loader2 className="w-10 h-10 animate-spin text-pink-600" />
                            <p className="text-slate-400 text-sm font-medium animate-pulse">Menghubungkan ke server...</p>
                        </div>
                    ) : filteredAdmins.length === 0 ? (
                        <div className="text-center py-24 bg-white rounded-3xl border border-slate-100 shadow-sm space-y-3">
                            <Users className="w-12 h-12 text-slate-300 mx-auto" />
                            <p className="text-slate-500 font-semibold">Tidak ada akun admin ditemukan</p>
                            <p className="text-slate-400 text-xs">Coba ubah kata kunci pencarian Anda atau daftarkan admin baru.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {filteredAdmins.map((admin) => (
                                <div
                                    key={admin.id}
                                    className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 hover:shadow-xl hover:border-slate-200/80 transition-all duration-300 flex flex-col justify-between relative group"
                                >
                                    <div>
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-50 to-rose-50 text-pink-600 flex items-center justify-center border border-pink-100/50 shrink-0">
                                                    <Users className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-bold text-slate-900 leading-snug group-hover:text-pink-600 transition-colors">
                                                        {admin.name}
                                                    </h3>
                                                    <div className="inline-flex items-center gap-1.5 bg-pink-50 text-pink-700 px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider mt-1.5">
                                                        <Shield className="w-3 h-3 text-pink-500" />
                                                        {admin.role}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Dropdown Menu Trigger */}
                                            <div className="relative">
                                                <button
                                                    onClick={() => setActiveDropdown(activeDropdown === admin.id ? null : admin.id)}
                                                    className="w-10 h-10 rounded-xl bg-slate-50 hover:bg-slate-100 transition-all flex items-center justify-center text-slate-500 border border-slate-100"
                                                >
                                                    <MoreHorizontal className="w-4 h-4" />
                                                </button>

                                                {activeDropdown === admin.id && (
                                                    <>
                                                        <div className="fixed inset-0 z-20" onClick={() => setActiveDropdown(null)} />
                                                        <div className="absolute right-0 mt-2 w-40 bg-white rounded-2xl border border-slate-100 shadow-xl py-2 z-30 animate-in fade-in slide-in-from-top-2 duration-150">
                                                            <button
                                                                onClick={() => handleOpenEditModal(admin)}
                                                                className="w-full px-4 py-2.5 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors"
                                                            >
                                                                <Edit2 className="w-4 h-4 text-sky-500" />
                                                                Edit Kredensial
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteAdmin(admin.id, admin.name)}
                                                                className="w-full px-4 py-2.5 text-left text-sm font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 transition-colors"
                                                            >
                                                                <Trash2 className="w-4 h-4 text-rose-500" />
                                                                Cabut Akses
                                                            </button>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        {/* Keterangan Akun */}
                                        <div className="space-y-2.5 mt-6 pt-4 border-t border-slate-50 text-xs text-slate-600 font-medium">
                                            <div className="flex items-center gap-2.5">
                                                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                                                <span className="truncate">{admin.email}</span>
                                            </div>
                                            <div className="flex items-center gap-2.5">
                                                <Store className="w-4 h-4 text-slate-400 shrink-0" />
                                                <span className="font-semibold text-slate-700">
                                                    Penugasan: {admin.outlet?.name || "Belum Ditugaskan"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Modal: TAMBAH ADMIN */}
            {openCreate && (
                <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
                    <div className="w-full max-w-lg bg-white rounded-3xl p-6 md:p-8 shadow-2xl animate-in zoom-in-95 duration-200 my-auto">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900">Registrasi Akun Admin</h2>
                                <p className="text-slate-400 text-xs mt-1">Buat kredensial login staf baru di sistem</p>
                            </div>
                            <button
                                onClick={() => setOpenCreate(false)}
                                className="w-10 h-10 rounded-xl bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-400"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleCreateAdmin} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500">Nama Lengkap Karyawan *</label>
                                <input
                                    type="text"
                                    placeholder="Masukkan nama lengkap"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    className="w-full bg-slate-50 rounded-xl p-3.5 border border-slate-200 outline-none focus:ring-2 focus:ring-pink-500/20 text-sm font-medium"
                                    required
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500">Alamat Email *</label>
                                <input
                                    type="email"
                                    placeholder="staf@lailacollections.com"
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    className="w-full bg-slate-50 rounded-xl p-3.5 border border-slate-200 outline-none focus:ring-2 focus:ring-pink-500/20 text-sm font-medium"
                                    required
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500">Kata Sandi (Password) *</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Minimal 6 karakter"
                                        value={form.password}
                                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                                        className="w-full bg-slate-50 rounded-xl py-3.5 pl-11 pr-11 border border-slate-200 outline-none focus:ring-2 focus:ring-pink-500/20 text-sm font-medium"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500">Penugasan Penempatan Outlet *</label>
                                <select
                                    value={form.outletId}
                                    onChange={(e) => setForm({ ...form, outletId: e.target.value })}
                                    className="w-full bg-slate-50 rounded-xl p-3.5 border border-slate-200 outline-none focus:ring-2 focus:ring-pink-500/20 text-sm font-medium"
                                    required
                                >
                                    <option value="">Pilih Cabang Butik</option>
                                    {outlets.map((outlet) => (
                                        <option key={outlet.id} value={outlet.id}>
                                            {outlet.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full bg-slate-900 hover:bg-slate-800 disabled:opacity-50 transition-all text-white py-4 rounded-xl font-bold text-sm shadow-md flex items-center justify-center gap-2 mt-2"
                            >
                                {submitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Mendaftarkan...
                                    </>
                                ) : (
                                    <>
                                        <Plus className="w-4 h-4" />
                                        Simpan & Kirim Akses
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal: EDIT ADMIN */}
            {openEdit && (
                <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
                    <div className="w-full max-w-lg bg-white rounded-3xl p-6 md:p-8 shadow-2xl animate-in zoom-in-95 duration-200 my-auto">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900">Ubah Profil Admin</h2>
                                <p className="text-slate-400 text-xs mt-1">Perbarui hak penugasan atau mutasi cabang</p>
                            </div>
                            <button
                                onClick={() => { setOpenEdit(false); setSelectedAdminId(null); }}
                                className="w-10 h-10 rounded-xl bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-400"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleEditAdmin} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500">Nama Lengkap *</label>
                                <input
                                    type="text"
                                    placeholder="Ubah nama karyawan"
                                    value={editForm.name}
                                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                    className="w-full bg-slate-50 rounded-xl p-3.5 border border-slate-200 outline-none focus:ring-2 focus:ring-pink-500/20 text-sm font-medium"
                                    required
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500">Alamat Email Login *</label>
                                <input
                                    type="email"
                                    placeholder="Ubah email login"
                                    value={editForm.email}
                                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                    className="w-full bg-slate-50 rounded-xl p-3.5 border border-slate-200 outline-none focus:ring-2 focus:ring-pink-500/20 text-sm font-medium"
                                    required
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500">Ubah Password (Opsional)</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Kosongkan jika tidak ingin mengganti password lama"
                                        value={editForm.password}
                                        onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                                        className="w-full bg-slate-50 rounded-xl py-3.5 pl-11 pr-11 border border-slate-200 outline-none focus:ring-2 focus:ring-pink-500/20 text-sm font-medium"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500">Lokasi Penugasan Baru *</label>
                                <select
                                    value={editForm.outletId}
                                    onChange={(e) => setEditForm({ ...editForm, outletId: e.target.value })}
                                    className="w-full bg-slate-50 rounded-xl p-3.5 border border-slate-200 outline-none focus:ring-2 focus:ring-pink-500/20 text-sm font-medium"
                                    required
                                >
                                    <option value="">Pilih Cabang Mutasi</option>
                                    {outlets.map((outlet) => (
                                        <option key={outlet.id} value={outlet.id}>
                                            {outlet.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full bg-pink-600 hover:bg-pink-700 disabled:opacity-50 transition-all text-white py-4 rounded-xl font-bold text-sm shadow-md flex items-center justify-center gap-2 mt-2"
                            >
                                {submitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Menyimpan Perubahan...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-4 h-4" />
                                        Perbarui Data Akun
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