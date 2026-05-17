"use client";

import React, {
    useEffect,
    useMemo,
    useState,
} from "react";

import Image from "next/image";

import {
    Package,
    Plus,
    Search,
    Loader2,
    Sparkles,
    X,
    Boxes,
    Store,
    Tag,
    ImagePlus,
    Wallet,
    Archive,
    MoreHorizontal,
    Edit2,
    Trash2,
    Layers,
    DollarSign,
} from "lucide-react";

import api from "@/lib/api";

type Product = {
    id: string;
    name: string;
    sku?: string;
    barcode?: string;
    stock: number;
    costPrice?: number;
    minStock?: number;
    sellingPrice: number;
    imageUrl?: string;
    category?: {
        id: string;
        name: string;
    };
    outlet?: {
        id: string;
        name: string;
    };
};

type Category = {
    id: string;
    name: string;
};

type Outlet = {
    id: string;
    name: string;
};

export default function ProductsPage() {
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [search, setSearch] = useState("");
    const [error, setError] = useState("");
    
    // UI Dropdown state
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

    // Master list arrays
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [outlets, setOutlets] = useState<Outlet[]>([]);

    // State Modal & Form Tambah
    const [openCreate, setOpenCreate] = useState(false);
    const [image, setImage] = useState<File | null>(null);
    const [form, setForm] = useState({
        name: "",
        stock: "",
        minStock: "",
        costPrice: "",
        sellingPrice: "",
        categoryId: "",
        outletId: "",
    });

    // State Modal & Form Edit
    const [openEdit, setOpenEdit] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
    const [editImage, setEditImage] = useState<File | null>(null);
    const [editForm, setEditForm] = useState({
        name: "",
        stock: "",
        minStock: "",
        costPrice: "",
        sellingPrice: "",
        categoryId: "",
        outletId: "",
    });

    const fetchData = async () => {
        try {
            setLoading(true);
            const [productsResponse, categoriesResponse, outletsResponse] = await Promise.all([
                api.get("/products"),
                api.get("/categories"),
                api.get("/outlets"),
            ]);

            setProducts(productsResponse.data);
            setCategories(categoriesResponse.data);
            setOutlets(outletsResponse.data);
        } catch (error: any) {
            console.error(error);
            setError(
                error?.response?.data?.message || "Gagal mengambil data inventory"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const filteredProducts = useMemo(() => {
        return products.filter((product) =>
            product.name.toLowerCase().includes(search.toLowerCase()) ||
            product.sku?.toLowerCase().includes(search.toLowerCase())
        );
    }, [products, search]);

    const totalStock = products.reduce((acc, product) => acc + product.stock, 0);
    const totalValue = products.reduce((acc, product) => acc + (product.stock * product.sellingPrice), 0);

    // Handler Tambah Produk
    const handleCreateProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setSubmitting(true);
            const formData = new FormData();
            Object.entries(form).forEach(([key, value]) => formData.append(key, value));
            if (image) formData.append("image", image);

            await api.post("/products", formData);
            setOpenCreate(false);
            setImage(null);
            setForm({ name: "", stock: "", minStock: "", costPrice: "", sellingPrice: "", categoryId: "", outletId: "" });
            fetchData();
        } catch (error: any) {
            console.error(error);
            alert(error?.response?.data?.message || "Gagal menambah produk");
        } finally {
            setSubmitting(false);
        }
    };

    // Handler Buka Modal Edit & Prefill Form Data Lama
    const handleOpenEditModal = (product: Product) => {
        setSelectedProductId(product.id);
        setEditForm({
            name: product.name,
            stock: product.stock.toString(),
            minStock: product.minStock?.toString() || "0",
            costPrice: product.costPrice?.toString() || "0",
            sellingPrice: product.sellingPrice.toString(),
            categoryId: product.category?.id || "",
            outletId: product.outlet?.id || "",
        });
        setEditImage(null);
        setOpenEdit(true);
        setActiveDropdown(null);
    };

    // Handler Perbarui Produk (PATCH)
    const handleEditProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedProductId) return;

        try {
            setSubmitting(true);
            const formData = new FormData();
            Object.entries(editForm).forEach(([key, value]) => formData.append(key, value));
            if (editImage) formData.append("image", editImage);

            await api.patch(`/products/${selectedProductId}`, formData);
            setOpenEdit(false);
            setSelectedProductId(null);
            fetchData();
        } catch (error: any) {
            console.error(error);
            alert(error?.response?.data?.message || "Gagal memperbarui data produk");
        } finally {
            setSubmitting(false);
        }
    };

    // Handler Hapus Produk
    const handleDeleteProduct = async (id: string, prodName: string) => {
        setActiveDropdown(null);
        if (confirm(`Apakah Anda yakin ingin menghapus produk "${prodName}" dari katalog gudang?`)) {
            try {
                setLoading(true);
                await api.delete(`/products/${id}`);
                fetchData();
            } catch (error: any) {
                console.error(error);
                alert(error?.response?.data?.message || "Gagal menghapus produk");
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
                                Inventory Catalog Stock
                            </div>
                            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
                                Master Katalog Produk
                            </h1>
                            <p className="text-slate-500 mt-1 text-sm font-medium">
                                Kelola stok garmen, SKU, harga pokok modal, dan visual gambar katalog baju butik.
                            </p>
                        </div>

                        <button
                            onClick={() => setOpenCreate(true)}
                            className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 transition-all text-white px-6 py-4 rounded-2xl flex items-center justify-center gap-2.5 font-bold text-sm shadow-md shadow-pink-200 hover:-translate-y-0.5 active:scale-95 whitespace-nowrap self-start sm:self-center"
                        >
                            <Plus className="w-5 h-5" />
                            Tambah Produk Baru
                        </button>
                    </div>

                    {/* Stats Metrics Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex items-center justify-between group hover:border-pink-200 transition-all">
                            <div className="space-y-2">
                                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Ragam Produk</p>
                                <h2 className="text-4xl font-black text-slate-800 transition-transform group-hover:scale-105 origin-left">
                                    {products.length}
                                </h2>
                                <p className="text-pink-600 text-xs font-semibold bg-pink-50 px-2 py-0.5 rounded-md inline-block">Items SKU</p>
                            </div>
                            <div className="w-16 h-16 rounded-2xl bg-pink-50 flex items-center justify-center text-pink-600">
                                <Package className="w-8 h-8" />
                            </div>
                        </div>

                        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex items-center justify-between group hover:border-sky-200 transition-all">
                            <div className="space-y-2">
                                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Kuantitas Koli</p>
                                <h2 className="text-4xl font-black text-slate-800 transition-transform group-hover:scale-105 origin-left">
                                    {totalStock}
                                </h2>
                                <p className="text-sky-600 text-xs font-semibold bg-sky-50 px-2 py-0.5 rounded-md inline-block">Pcs Tersedia</p>
                            </div>
                            <div className="w-16 h-16 rounded-2xl bg-sky-50 flex items-center justify-center text-sky-600">
                                <Boxes className="w-8 h-8" />
                            </div>
                        </div>

                        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex items-center justify-between group hover:border-emerald-200 transition-all">
                            <div className="space-y-2">
                                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Grup Kategori</p>
                                <h2 className="text-4xl font-black text-slate-800 transition-transform group-hover:scale-105 origin-left">
                                    {categories.length}
                                </h2>
                                <p className="text-emerald-600 text-xs font-semibold bg-emerald-50 px-2 py-0.5 rounded-md inline-block">Kategori Induk</p>
                            </div>
                            <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                                <Tag className="w-8 h-8" />
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden group">
                            <div className="absolute right-[-20px] bottom-[-20px] w-32 h-32 rounded-full bg-white/5 pointer-events-none" />
                            <div className="relative z-10 flex items-center justify-between h-full">
                                <div className="space-y-2">
                                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Valuasi Nilai Aset</p>
                                    <h2 className="text-xl lg:text-2xl font-black tracking-tight text-pink-300">
                                        Rp {totalValue.toLocaleString("id-ID")}
                                    </h2>
                                    <p className="text-slate-300 text-xs font-medium">Berdasarkan akumulasi harga jual</p>
                                </div>
                                <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-pink-400">
                                    <Wallet className="w-7 h-7" />
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
                                placeholder="Cari berdasarkan nama produk atau SKU..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full bg-slate-50 text-slate-800 rounded-xl py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-pink-500/20 focus:bg-white border border-transparent focus:border-pink-500 transition-all font-medium text-sm"
                            />
                        </div>
                        <div className="bg-slate-100 text-slate-600 px-4 py-2 rounded-xl text-xs font-bold text-center self-stretch sm:self-center">
                            Menampilkan <span className="text-pink-600 font-extrabold">{filteredProducts.length}</span> Produk Terdaftar
                        </div>
                    </div>

                    {/* Error Handling UI Notice */}
                    {error && (
                        <div className="bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl p-4 text-sm font-medium flex items-center gap-3">
                            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                            {error}
                        </div>
                    )}

                    {/* Grid Product List Cards */}
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-24 gap-3 bg-white/50 backdrop-blur-md rounded-3xl border border-slate-100">
                            <Loader2 className="w-10 h-10 animate-spin text-pink-600" />
                            <p className="text-slate-400 text-sm font-medium animate-pulse">Menyinkronkan daftar produk...</p>
                        </div>
                    ) : filteredProducts.length === 0 ? (
                        <div className="text-center py-24 bg-white rounded-3xl border border-slate-100 shadow-sm space-y-3">
                            <Package className="w-12 h-12 text-slate-300 mx-auto" />
                            <p className="text-slate-500 font-semibold">Produk tidak ditemukan</p>
                            <p className="text-slate-400 text-xs">Katalog kosong atau kata kunci tidak sesuai.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                            {filteredProducts.map((product) => (
                                <div
                                    key={product.id}
                                    className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden hover:shadow-xl hover:border-slate-200/80 transition-all duration-300 flex flex-col group relative"
                                >
                                    {/* Product Visual Frame */}
                                    <div className="relative w-full h-56 bg-slate-100 overflow-hidden">
                                        {product.imageUrl ? (
                                            <Image
                                                src={product.imageUrl}
                                                alt={product.name}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                <Package className="w-16 h-16" />
                                            </div>
                                        )}
                                        
                                        {/* Floating Stock Tag indicator */}
                                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm shadow-sm text-slate-800 px-3 py-1 rounded-xl text-xs font-bold border border-slate-100">
                                            Stok: {product.stock} pcs
                                        </div>

                                        {/* Floating Action Dots Context Menu */}
                                        <div className="absolute top-4 right-4 z-10">
                                            <button
                                                onClick={() => setActiveDropdown(activeDropdown === product.id ? null : product.id)}
                                                className="w-8 h-8 rounded-xl bg-white/90 backdrop-blur-sm shadow-sm flex items-center justify-center text-slate-600 border border-slate-100 hover:bg-white"
                                            >
                                                <MoreHorizontal className="w-4 h-4" />
                                            </button>

                                            {activeDropdown === product.id && (
                                                <>
                                                    <div className="fixed inset-0 z-20" onClick={() => setActiveDropdown(null)} />
                                                    <div className="absolute right-0 mt-2 w-36 bg-white rounded-xl border border-slate-100 shadow-xl py-1 z-30 animate-in fade-in slide-in-from-top-2 duration-150">
                                                        <button
                                                            onClick={() => handleOpenEditModal(product)}
                                                            className="w-full px-3.5 py-2 text-left text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors"
                                                        >
                                                            <Edit2 className="w-3.5 h-3.5 text-sky-500" />
                                                            Edit Produk
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteProduct(product.id, product.name)}
                                                            className="w-full px-3.5 py-2 text-left text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                                                            Hapus Katalog
                                                        </button>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {/* Card Metadata Details */}
                                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                                        <div>
                                            <h3 className="text-base font-bold text-slate-900 group-hover:text-pink-600 transition-colors line-clamp-1">
                                                {product.name}
                                            </h3>
                                            <p className="text-xs text-slate-400 font-medium mt-1">SKU: {product.sku || "-"}</p>

                                            <div className="space-y-1.5 mt-4 text-xs text-slate-500 font-medium">
                                                <div className="flex items-center gap-2">
                                                    <Tag className="w-3.5 h-3.5 text-slate-400" />
                                                    <span>Kategori: {product.category?.name || "Uncategorized"}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Store className="w-3.5 h-3.5 text-slate-400" />
                                                    <span>Penempatan: {product.outlet?.name || "Gudang Pusat"}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Archive className="w-3.5 h-3.5 text-slate-400" />
                                                    <span>Barcode: {product.barcode || "-"}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-3 border-t border-slate-50 flex items-center justify-between">
                                            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Harga Jual Toko</span>
                                            <h4 className="text-lg font-black text-pink-600">
                                                Rp {product.sellingPrice.toLocaleString("id-ID")}
                                            </h4>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Modal: TAMBAH PRODUCT */}
            {openCreate && (
                <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
                    <div className="w-full max-w-xl bg-white rounded-3xl p-6 md:p-8 shadow-2xl animate-in zoom-in-95 duration-200 my-auto">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">Registrasi Produk Kain/Baju</h2>
                                <p className="text-slate-400 text-xs mt-0.5">Isi seluruh properti barang dengan akurat</p>
                            </div>
                            <button
                                onClick={() => setOpenCreate(false)}
                                className="w-9 h-9 rounded-xl bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-400"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <form onSubmit={handleCreateProduct} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500">Nama Produk Dagang *</label>
                                <input
                                    type="text"
                                    placeholder="Contoh: Gamis Rayon Premium Diamond XL"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    className="w-full bg-slate-50 rounded-xl p-3 border border-slate-200 outline-none focus:ring-2 focus:ring-pink-500/20 text-sm font-medium"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500">Stok Awal Masuk *</label>
                                    <input
                                        type="number"
                                        placeholder="0"
                                        value={form.stock}
                                        onChange={(e) => setForm({ ...form, stock: e.target.value })}
                                        className="w-full bg-slate-50 rounded-xl p-3 border border-slate-200 outline-none focus:ring-2 focus:ring-pink-500/20 text-sm font-medium"
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500">Batas Minimal Stok *</label>
                                    <input
                                        type="number"
                                        placeholder="5"
                                        value={form.minStock}
                                        onChange={(e) => setForm({ ...form, minStock: e.target.value })}
                                        className="w-full bg-slate-50 rounded-xl p-3 border border-slate-200 outline-none focus:ring-2 focus:ring-pink-500/20 text-sm font-medium"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500">Harga Modal HPP (Rp) *</label>
                                    <input
                                        type="number"
                                        placeholder="HPP modal produksi"
                                        value={form.costPrice}
                                        onChange={(e) => setForm({ ...form, costPrice: e.target.value })}
                                        className="w-full bg-slate-50 rounded-xl p-3 border border-slate-200 outline-none focus:ring-2 focus:ring-pink-500/20 text-sm font-medium"
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500">Harga Jual Retail (Rp) *</label>
                                    <input
                                        type="number"
                                        placeholder="Harga banderol kasir"
                                        value={form.sellingPrice}
                                        onChange={(e) => setForm({ ...form, sellingPrice: e.target.value })}
                                        className="w-full bg-slate-50 rounded-xl p-3 border border-slate-200 outline-none focus:ring-2 focus:ring-pink-500/20 text-sm font-medium"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500">Kategori Sandang *</label>
                                    <select
                                        value={form.categoryId}
                                        onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                                        className="w-full bg-slate-50 rounded-xl p-3 border border-slate-200 outline-none focus:ring-2 focus:ring-pink-500/20 text-sm font-medium"
                                        required
                                    >
                                        <option value="">Pilih Category</option>
                                        {categories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500">Gudang Cabang/Outlet *</label>
                                    <select
                                        value={form.outletId}
                                        onChange={(e) => setForm({ ...form, outletId: e.target.value })}
                                        className="w-full bg-slate-50 rounded-xl p-3 border border-slate-200 outline-none focus:ring-2 focus:ring-pink-500/20 text-sm font-medium"
                                        required
                                    >
                                        <option value="">Pilih Outlet</option>
                                        {outlets.map((out) => (
                                            <option key={out.id} value={out.id}>{out.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500">Foto Katalog Produk</label>
                                <label className="w-full bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-5 flex flex-col items-center justify-center gap-1.5 cursor-pointer hover:bg-slate-100/70 transition-all">
                                    <ImagePlus className="w-6 h-6 text-slate-400" />
                                    <span className="font-bold text-xs text-slate-600">Klik untuk jelajahi file gambar</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => setImage(e.target.files?.[0] || null)}
                                    />
                                </label>
                            </div>

                            {image && (
                                <div className="bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-xl px-4 py-2 font-medium text-xs flex items-center justify-between">
                                    <span className="truncate max-w-[90%]">{image.name}</span>
                                    <X className="w-4 h-4 cursor-pointer text-emerald-500 shrink-0" onClick={() => setImage(null)} />
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full bg-slate-900 hover:bg-slate-800 disabled:opacity-50 transition-all text-white py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-md flex items-center justify-center gap-2 mt-2"
                            >
                                {submitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Mendaftarkan Item...
                                    </>
                                ) : (
                                    <>
                                        <Plus className="w-4 h-4" />
                                        Simpan & Sinkronisasi Produk
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal: EDIT PRODUCT */}
            {openEdit && (
                <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
                    <div className="w-full max-w-xl bg-white rounded-3xl p-6 md:p-8 shadow-2xl animate-in zoom-in-95 duration-200 my-auto">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">Ubah Atribut Gambar & Stok</h2>
                                <p className="text-slate-400 text-xs mt-0.5">Mutasi kuantitas barang, penyesuaian HPP, atau ganti gambar</p>
                            </div>
                            <button
                                onClick={() => { setOpenEdit(false); setSelectedProductId(null); }}
                                className="w-9 h-9 rounded-xl bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-400"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <form onSubmit={handleEditProduct} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500">Nama Produk Dagang *</label>
                                <input
                                    type="text"
                                    placeholder="Ubah nama produk"
                                    value={editForm.name}
                                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                    className="w-full bg-slate-50 rounded-xl p-3 border border-slate-200 outline-none focus:ring-2 focus:ring-pink-500/20 text-sm font-medium"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500">Kuantitas Stok Sekarang *</label>
                                    <input
                                        type="number"
                                        placeholder="0"
                                        value={editForm.stock}
                                        onChange={(e) => setEditForm({ ...editForm, stock: e.target.value })}
                                        className="w-full bg-slate-50 rounded-xl p-3 border border-slate-200 outline-none focus:ring-2 focus:ring-pink-500/20 text-sm font-medium"
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500">Batas Minimal Stok *</label>
                                    <input
                                        type="number"
                                        placeholder="5"
                                        value={editForm.minStock}
                                        onChange={(e) => setEditForm({ ...editForm, minStock: e.target.value })}
                                        className="w-full bg-slate-50 rounded-xl p-3 border border-slate-200 outline-none focus:ring-2 focus:ring-pink-500/20 text-sm font-medium"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500">Harga Pokok HPP (Rp) *</label>
                                    <input
                                        type="number"
                                        placeholder="Modal HPP"
                                        value={editForm.costPrice}
                                        onChange={(e) => setEditForm({ ...editForm, costPrice: e.target.value })}
                                        className="w-full bg-slate-50 rounded-xl p-3 border border-slate-200 outline-none focus:ring-2 focus:ring-pink-500/20 text-sm font-medium"
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500">Harga Jual Bandrol (Rp) *</label>
                                    <input
                                        type="number"
                                        placeholder="Harga retail toko"
                                        value={editForm.sellingPrice}
                                        onChange={(e) => setEditForm({ ...editForm, sellingPrice: e.target.value })}
                                        className="w-full bg-slate-50 rounded-xl p-3 border border-slate-200 outline-none focus:ring-2 focus:ring-pink-500/20 text-sm font-medium"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500">Kategori Grup *</label>
                                    <select
                                        value={editForm.categoryId}
                                        onChange={(e) => setEditForm({ ...editForm, categoryId: e.target.value })}
                                        className="w-full bg-slate-50 rounded-xl p-3 border border-slate-200 outline-none focus:ring-2 focus:ring-pink-500/20 text-sm font-medium"
                                        required
                                    >
                                        <option value="">Pilih Category</option>
                                        {categories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500">Mutasi Tempat Outlet *</label>
                                    <select
                                        value={editForm.outletId}
                                        onChange={(e) => setEditForm({ ...editForm, outletId: e.target.value })}
                                        className="w-full bg-slate-50 rounded-xl p-3 border border-slate-200 outline-none focus:ring-2 focus:ring-pink-500/20 text-sm font-medium"
                                        required
                                    >
                                        <option value="">Pilih Outlet</option>
                                        {outlets.map((out) => (
                                            <option key={out.id} value={out.id}>{out.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500">Ganti Gambar Item (Opsional)</label>
                                <label className="w-full bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-5 flex flex-col items-center justify-center gap-1.5 cursor-pointer hover:bg-slate-100/70 transition-all">
                                    <ImagePlus className="w-6 h-6 text-slate-400" />
                                    <span className="font-bold text-xs text-slate-600">Klik untuk mengganti foto produk</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => setEditImage(e.target.files?.[0] || null)}
                                    />
                                </label>
                            </div>

                            {editImage && (
                                <div className="bg-pink-50 text-pink-700 border border-pink-100 rounded-xl px-4 py-2 font-medium text-xs flex items-center justify-between">
                                    <span className="truncate max-w-[90%]">{editImage.name}</span>
                                    <X className="w-4 h-4 cursor-pointer text-pink-500 shrink-0" onClick={() => setEditImage(null)} />
                                </div>
                            )}

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
                                        Perbarui Atribut Produk
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