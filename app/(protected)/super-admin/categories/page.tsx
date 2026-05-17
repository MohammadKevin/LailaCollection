"use client";

import React, {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    Tag,
    Plus,
    Search,
    Loader2,
    Sparkles,
    X,
    Package,
    Shapes,
    MoreHorizontal,
    Edit2,
    Trash2,
} from "lucide-react";

import api from "@/lib/api";

type Category = {
    id: string;
    name: string;
    createdAt?: string;
};

export default function CategoriesPage() {
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [search, setSearch] = useState("");
    const [error, setError] = useState("");
    const [categories, setCategories] = useState<Category[]>([]);
    
    // State UI & Dropdown Menu
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

    // State Modal Create
    const [openCreate, setOpenCreate] = useState(false);
    const [name, setName] = useState("");

    // State Modal Edit
    const [openEdit, setOpenEdit] = useState(false);
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
    const [editName, setEditName] = useState("");

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const response = await api.get("/categories");
            setCategories(response.data);
        } catch (error: any) {
            console.error(error);
            setError(
                error?.response?.data?.message || "Gagal mengambil data category"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const filteredCategories = useMemo(() => {
        return categories.filter((category) =>
            category.name.toLowerCase().includes(search.toLowerCase())
        );
    }, [categories, search]);

    // Handler Tambah Kategori
    const handleCreateCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setSubmitting(true);
            await api.post("/categories", { name });
            setName("");
            setOpenCreate(false);
            fetchCategories();
        } catch (error: any) {
            console.error(error);
            alert(error?.response?.data?.message || "Gagal menyimpan kategori baru");
        } finally {
            setSubmitting(false);
        }
    };

    // Handler Buka Modal Edit & Set Data Lama
    const handleOpenEditModal = (category: Category) => {
        setSelectedCategoryId(category.id);
        setEditName(category.name);
        setOpenEdit(true);
        setActiveDropdown(null);
    };

    // Handler Perbarui Kategori (PATCH)
    const handleEditCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCategoryId) return;

        try {
            setSubmitting(true);
            await api.patch(`/categories/${selectedCategoryId}`, { name: editName });
            setOpenEdit(false);
            setSelectedCategoryId(null);
            fetchCategories();
        } catch (error: any) {
            console.error(error);
            alert(error?.response?.data?.message || "Gagal memperbarui kategori");
        } finally {
            setSubmitting(false);
        }
    };

    // Handler Hapus Kategori
    const handleDeleteCategory = async (id: string, catName: string) => {
        setActiveDropdown(null);
        if (confirm(`Apakah Anda yakin ingin menghapus kategori "${catName}"?\nProduk dengan kategori ini mungkin akan kehilangan relasinya.`)) {
            try {
                setLoading(true);
                await api.delete(`/categories/${id}`);
                fetchCategories();
            } catch (error: any) {
                console.error(error);
                alert(error?.response?.data?.message || "Gagal menghapus kategori");
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
                                Product Grouping & Sorting
                            </div>
                            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
                                Kelola Kategori Produk
                            </h1>
                            <p className="text-slate-500 mt-1 text-sm font-medium">
                                Atur kelompok taksonomi baju, gaun, dan kain butik untuk mempermudah filter transaksi kasir.
                            </p>
                        </div>

                        <button
                            onClick={() => setOpenCreate(true)}
                            className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 transition-all text-white px-6 py-4 rounded-2xl flex items-center justify-center gap-2.5 font-bold text-sm shadow-md shadow-pink-200 hover:-translate-y-0.5 active:scale-95 whitespace-nowrap self-start sm:self-center"
                        >
                            <Plus className="w-5 h-5" />
                            Tambah Kategori
                        </button>
                    </div>

                    {/* Stats Widget */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex items-center justify-between group hover:border-pink-200 transition-all">
                            <div className="space-y-2">
                                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Kategori</p>
                                <h2 className="text-4xl font-black text-slate-800 transition-transform group-hover:scale-105 origin-left">
                                    {categories.length}
                                </h2>
                                <p className="text-pink-600 text-xs font-semibold bg-pink-50 Hitung px-2 py-0.5 rounded-md inline-block">
                                    Master Data
                                </p>
                            </div>
                            <div className="w-16 h-16 rounded-2xl bg-pink-50 flex items-center justify-center text-pink-600">
                                <Tag className="w-8 h-8" />
                            </div>
                        </div>

                        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex items-center justify-between group hover:border-sky-200 transition-all">
                            <div className="space-y-2">
                                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Kategori Terfilter</p>
                                <h2 className="text-4xl font-black text-slate-800 transition-transform group-hover:scale-105 origin-left">
                                    {filteredCategories.length}
                                </h2>
                                <p className="text-sky-600 text-xs font-semibold bg-sky-50 px-2 py-0.5 rounded-md inline-block">
                                    Hasil Pencarian
                                </p>
                            </div>
                            <div className="w-16 h-16 rounded-2xl bg-sky-50 flex items-center justify-center text-sky-600">
                                <Package className="w-8 h-8" />
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden group">
                            <div className="absolute right-[-20px] bottom-[-20px] w-32 h-32 rounded-full bg-white/5 pointer-events-none" />
                            <div className="relative z-10 flex items-center justify-between h-full">
                                <div className="space-y-2">
                                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Status Modul</p>
                                    <h2 className="text-3xl font-black tracking-tight text-pink-300">
                                        Aktif Bersama
                                    </h2>
                                    <p className="text-slate-300 text-xs font-medium">Kategori sinkron di semua kasir</p>
                                </div>
                                <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-pink-400">
                                    <Shapes className="w-7 h-7" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filter Bar */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
                        <div className="relative w-full sm:max-w-md">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Cari nama kategori..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full bg-slate-50 text-slate-800 rounded-xl py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-pink-500/20 focus:bg-white border border-transparent focus:border-pink-500 transition-all font-medium text-sm"
                            />
                        </div>
                        <div className="bg-slate-100 text-slate-600 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap text-center self-stretch sm:self-center">
                            Menampilkan <span className="text-pink-600 font-extrabold">{filteredCategories.length}</span> Kategori
                        </div>
                    </div>

                    {/* Error Notice */}
                    {error && (
                        <div className="bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl p-4 text-sm font-medium flex items-center gap-3">
                            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                            {error}
                        </div>
                    )}

                    {/* Main List Content */}
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-24 gap-3 bg-white/50 backdrop-blur-md rounded-3xl border border-slate-100">
                            <Loader2 className="w-10 h-10 animate-spin text-pink-600" />
                            <p className="text-slate-400 text-sm font-medium animate-pulse">Menghubungkan database...</p>
                        </div>
                    ) : filteredCategories.length === 0 ? (
                        <div className="text-center py-24 bg-white rounded-3xl border border-slate-100 shadow-sm space-y-3">
                            <Tag className="w-12 h-12 text-slate-300 mx-auto" />
                            <p className="text-slate-500 font-semibold">Tidak ada kategori ditemukan</p>
                            <p className="text-slate-400 text-xs">Coba ubah kata pencarian Anda atau tambahkan master kategori baru.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {filteredCategories.map((category) => (
                                <div
                                    key={category.id}
                                    className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 hover:shadow-xl hover:border-slate-200/80 transition-all duration-300 flex flex-col justify-between group relative"
                                >
                                    <div>
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-50 to-rose-50 text-pink-600 flex items-center justify-center border border-pink-100/50 shrink-0">
                                                    <Tag className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <h3 className="text-base font-bold text-slate-900 group-hover:text-pink-600 transition-colors">
                                                        {category.name}
                                                    </h3>
                                                    <p className="text-slate-400 text-[11px] mt-0.5">ID: {category.id.slice(0, 8)}...</p>
                                                </div>
                                            </div>

                                            {/* Action Popover Dropdown Button */}
                                            <div className="relative">
                                                <button
                                                    onClick={() => setActiveDropdown(activeDropdown === category.id ? null : category.id)}
                                                    className="w-9 h-9 rounded-xl bg-slate-50 hover:bg-slate-100 transition-all flex items-center justify-center text-slate-500 border border-slate-100"
                                                >
                                                    <MoreHorizontal className="w-4 h-4" />
                                                </button>

                                                {activeDropdown === category.id && (
                                                    <>
                                                        <div className="fixed inset-0 z-20" onClick={() => setActiveDropdown(null)} />
                                                        <div className="absolute right-0 mt-2 w-36 bg-white rounded-2xl border border-slate-100 shadow-xl py-1.5 z-30 animate-in fade-in slide-in-from-top-2 duration-150">
                                                            <button
                                                                onClick={() => handleOpenEditModal(category)}
                                                                className="w-full px-4 py-2 text-left text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors"
                                                            >
                                                                <Edit2 className="w-3.5 h-3.5 text-sky-500" />
                                                                Ubah Nama
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteCategory(category.id, category.name)}
                                                                className="w-full px-4 py-2 text-left text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors"
                                                            >
                                                                <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                                                                Hapus Data
                                                            </button>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-6 pt-3 border-t border-slate-50 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                                        <span>Status Penjualan</span>
                                        <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md font-bold">Aktif Terhubung</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Modal: TAMBAH CATEGORY */}
            {openCreate && (
                <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between mb-5">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">Tambah Kategori Master</h2>
                                <p className="text-slate-400 text-xs mt-0.5">Gunakan nama yang ringkas dan jelas</p>
                            </div>
                            <button
                                onClick={() => setOpenCreate(false)}
                                className="w-9 h-9 rounded-xl bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-400"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <form onSubmit={handleCreateCategory} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500">Nama Kategori *</label>
                                <input
                                    type="text"
                                    placeholder="Contoh: Hijab Pasmina, Blouse Silk"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-slate-50 rounded-xl p-3 border border-slate-200 outline-none focus:ring-2 focus:ring-pink-500/20 text-sm font-medium"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full bg-slate-900 hover:bg-slate-800 disabled:opacity-50 transition-all text-white py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-md flex items-center justify-center gap-2 mt-2"
                            >
                                {submitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Menyimpan Kategori...
                                    </>
                                ) : (
                                    <>
                                        <Plus className="w-4 h-4" />
                                        Simpan Kategori
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal: EDIT CATEGORY */}
            {openEdit && (
                <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between mb-5">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">Ubah Nama Kategori</h2>
                                <p className="text-slate-400 text-xs mt-0.5">Sunting nomenklatur penamaan master grup</p>
                            </div>
                            <button
                                onClick={() => { setOpenEdit(false); setSelectedCategoryId(null); }}
                                className="w-9 h-9 rounded-xl bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-400"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <form onSubmit={handleEditCategory} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500">Nama Kategori Baru *</label>
                                <input
                                    type="text"
                                    placeholder="Masukkan nama baru"
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    className="w-full bg-slate-50 rounded-xl p-3 border border-slate-200 outline-none focus:ring-2 focus:ring-pink-500/20 text-sm font-medium"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full bg-pink-600 hover:bg-pink-700 disabled:opacity-50 transition-all text-white py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-md flex items-center justify-center gap-2 mt-2"
                            >
                                {submitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Menyimpan Perubahan...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-4 h-4" />
                                        Perbarui Nama Kategori
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