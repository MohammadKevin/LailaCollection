"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
    CreditCard,
    Landmark,
    Loader2,
    Minus,
    Package,
    Plus,
    QrCode,
    Receipt,
    Search,
    ShoppingCart,
    Sparkles,
    Store,
    Trash2,
    Wallet,
} from "lucide-react";

import api from "@/lib/api";

// ─── Types ────────────────────────────────────────────────────────────────────

type PaymentMethod = "CASH" | "QRIS" | "DEBIT" | "TRANSFER" | "E_WALLET";

interface Category {
    id: string;
    name: string;
}

interface Product {
    id: string;
    name: string;
    sellingPrice: number;
    stock: number;
    imageUrl?: string;
    category?: Category;
}

interface CartItem {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    imageUrl?: string;
}

interface SalePayload {
    paymentMethod: PaymentMethod;
    paidAmount: number;
    paymentProof: null;
    outletId: string;
    items: { productId: string; quantity: number }[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatRupiah(amount: number): string {
    return `Rp ${amount.toLocaleString("id-ID")}`;
}

function getOutletId(): string {
    try {
        const raw = localStorage.getItem("user");
        if (!raw) return "";
        const user = JSON.parse(raw);
        return user?.outlet?.id ?? "";
    } catch {
        return "";
    }
}

function extractErrorMessage(error: unknown): string {
    if (error && typeof error === "object") {
        const axiosError = error as {
            response?: { status?: number; data?: { message?: string; error?: string } };
            message?: string;
            code?: string;
        };

        if (!axiosError.response) {
            return `Gagal terhubung ke server: ${axiosError.message ?? "Network error"}`;
        }

        const { status, data } = axiosError.response;
        const serverMessage = data?.message ?? data?.error;

        if (serverMessage) return `Error ${status}: ${serverMessage}`;
        if (data) return `Error ${status}: ${JSON.stringify(data)}`;
        return `Error ${status ?? "tidak diketahui"}`;
    }
    return "Terjadi kesalahan tidak diketahui";
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function LoadingScreen() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-pink-600" />
                <p className="text-sm text-slate-400 font-semibold">Loading kasir...</p>
            </div>
        </div>
    );
}

interface ProductCardProps {
    product: Product;
    onAdd: (product: Product) => void;
}

function ProductCard({ product, onAdd }: ProductCardProps) {
    return (
        <div
            onClick={() => onAdd(product)}
            className="bg-slate-50 border border-slate-100 rounded-3xl overflow-hidden hover:shadow-lg transition-all cursor-pointer"
        >
            <div className="relative w-full h-40 bg-slate-100">
                {product.imageUrl ? (
                    <Image
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        className="object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <ShoppingCart className="w-10 h-10 text-slate-300" />
                    </div>
                )}
            </div>

            <div className="p-4">
                <h3 className="font-bold text-slate-800">{product.name}</h3>

                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mt-2">
                    <Store className="w-3.5 h-3.5" />
                    Stock:
                    <span className="font-bold text-slate-700">{product.stock}</span>
                </div>

                <div className="flex items-center justify-between mt-5">
                    <h4 className="text-xl font-black text-pink-600">
                        {formatRupiah(product.sellingPrice)}
                    </h4>
                    <div className="w-10 h-10 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center">
                        <Plus className="w-4 h-4" />
                    </div>
                </div>
            </div>
        </div>
    );
}

interface CategorySectionProps {
    category: string;
    products: Product[];
    isOpen: boolean;
    onToggle: () => void;
    onAddToCart: (product: Product) => void;
}

function CategorySection({
    category,
    products,
    isOpen,
    onToggle,
    onAddToCart,
}: CategorySectionProps) {
    return (
        <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between p-6"
            >
                <div>
                    <h2 className="text-2xl font-black text-slate-900 text-left">{category}</h2>
                    <p className="text-sm text-slate-400 mt-1">{products.length} products</p>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center">
                    <Package className="w-7 h-7" />
                </div>
            </button>

            {isOpen && (
                <div className="px-6 pb-6">
                    {products.length === 0 ? (
                        <p className="text-sm text-slate-400 text-center py-4">
                            Tidak ada produk ditemukan.
                        </p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                            {products.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    onAdd={onAddToCart}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

interface CartItemRowProps {
    item: CartItem;
    onIncrease: (id: string) => void;
    onDecrease: (id: string) => void;
    onRemove: (id: string) => void;
}

function CartItemRow({ item, onIncrease, onDecrease, onRemove }: CartItemRowProps) {
    return (
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
            <div className="flex justify-between">
                <div>
                    <h4 className="font-bold text-sm text-slate-800">{item.name}</h4>
                    <p className="text-xs text-slate-400 font-semibold mt-1">
                        {formatRupiah(item.price)}
                    </p>
                </div>
                <button
                    onClick={() => onRemove(item.productId)}
                    className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center"
                    aria-label={`Hapus ${item.name}`}
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>

            <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => onDecrease(item.productId)}
                        className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center"
                        aria-label="Kurangi"
                    >
                        <Minus className="w-3 h-3" />
                    </button>

                    <span className="font-bold w-6 text-center">{item.quantity}</span>

                    <button
                        onClick={() => onIncrease(item.productId)}
                        className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center"
                        aria-label="Tambah"
                    >
                        <Plus className="w-3 h-3" />
                    </button>
                </div>

                <h4 className="font-black text-pink-600">
                    {formatRupiah(item.price * item.quantity)}
                </h4>
            </div>
        </div>
    );
}

// ─── Payment method config ────────────────────────────────────────────────────

const PAYMENT_METHODS: { key: PaymentMethod; icon: React.ElementType; label: string }[] = [
    { key: "CASH", icon: Wallet, label: "CASH" },
    { key: "QRIS", icon: QrCode, label: "QRIS" },
    { key: "DEBIT", icon: Landmark, label: "DEBIT" },
    { key: "TRANSFER", icon: CreditCard, label: "TRANSFER" },
];

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function SalesPage() {
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [products, setProducts] = useState<Product[]>([]);
    const [search, setSearch] = useState("");
    const [cart, setCart] = useState<CartItem[]>([]);
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("CASH");
    const [paidAmount, setPaidAmount] = useState("");
    const [outletId, setOutletId] = useState("");
    const [openCategory, setOpenCategory] = useState<string | null>(null);

    // ── Fetch products ──────────────────────────────────────────────────────

    const fetchProducts = useCallback(async () => {
        try {
            setLoading(true);
            const response = await api.get("/products");
            const data: Product[] = Array.isArray(response.data)
                ? response.data
                : response.data?.data ?? [];
            setProducts(data);
            setOutletId(getOutletId());
        } catch (error) {
            console.error("Fetch products error:", extractErrorMessage(error));
            alert("Gagal memuat produk. Silakan refresh halaman.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    // ── Derived state ───────────────────────────────────────────────────────

    const categories = useMemo<string[]>(() => {
        const names = products.map((p) => p.category?.name).filter(Boolean) as string[];
        return [...new Set(names)];
    }, [products]);

    const total = useMemo(
        () => cart.reduce((acc, item) => acc + item.price * item.quantity, 0),
        [cart],
    );

    const change = useMemo(() => {
        const paid = Number(paidAmount);
        return paid > total ? paid - total : 0;
    }, [paidAmount, total]);

    // ── Cart mutations ──────────────────────────────────────────────────────

    const addToCart = useCallback(
        (product: Product) => {
            if (product.stock <= 0) {
                alert("Stock produk habis");
                return;
            }

            setCart((prev) => {
                const existing = prev.find((item) => item.productId === product.id);

                if (existing) {
                    if (existing.quantity >= product.stock) {
                        alert(`Stock hanya tersedia ${product.stock}`);
                        return prev;
                    }
                    return prev.map((item) =>
                        item.productId === product.id
                            ? { ...item, quantity: item.quantity + 1 }
                            : item,
                    );
                }

                return [
                    ...prev,
                    {
                        productId: product.id,
                        name: product.name,
                        price: product.sellingPrice,
                        quantity: 1,
                        imageUrl: product.imageUrl,
                    },
                ];
            });
        },
        [],
    );

    const increaseQuantity = useCallback(
        (productId: string) => {
            const product = products.find((p) => p.id === productId);

            setCart((prev) => {
                const cartItem = prev.find((c) => c.productId === productId);
                if (product && cartItem && cartItem.quantity >= product.stock) {
                    alert(`Stock hanya tersedia ${product.stock}`);
                    return prev;
                }
                return prev.map((item) =>
                    item.productId === productId
                        ? { ...item, quantity: item.quantity + 1 }
                        : item,
                );
            });
        },
        [products],
    );

    const decreaseQuantity = useCallback((productId: string) => {
        setCart((prev) =>
            prev
                .map((item) =>
                    item.productId === productId
                        ? { ...item, quantity: item.quantity - 1 }
                        : item,
                )
                .filter((item) => item.quantity > 0),
        );
    }, []);

    const removeItem = useCallback((productId: string) => {
        setCart((prev) => prev.filter((item) => item.productId !== productId));
    }, []);

    // ── Checkout ────────────────────────────────────────────────────────────

    const buildPayload = (): SalePayload => ({
        paymentMethod,
        paidAmount: paymentMethod === "CASH" ? Number(paidAmount) : total,
        paymentProof: null,
        outletId,
        items: cart.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
        })),
    });

    const handleCheckout = async () => {
        if (!outletId) {
            alert("Outlet tidak ditemukan. Pastikan akun Anda terhubung ke outlet.");
            return;
        }

        if (cart.length === 0) {
            alert("Keranjang belanja masih kosong.");
            return;
        }

        if (paymentMethod === "CASH" && Number(paidAmount) < total) {
            alert("Jumlah pembayaran kurang dari total belanja.");
            return;
        }

        try {
            setSubmitting(true);
            const payload = buildPayload();
            await api.post("/sales", payload);

            alert("Transaksi berhasil!");
            setCart([]);
            setPaidAmount("");
            await fetchProducts();
        } catch (error) {
            const message = extractErrorMessage(error);
            console.error("Checkout error:", message);
            alert(message);
        } finally {
            setSubmitting(false);
        }
    };

    // ── Toggle category ─────────────────────────────────────────────────────

    const toggleCategory = useCallback((category: string) => {
        setOpenCategory((prev) => (prev === category ? null : category));
    }, []);

    // ── Render ──────────────────────────────────────────────────────────────

    if (loading) return <LoadingScreen />;

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
            {/* ── Product Panel ── */}
            <div className="flex-1 p-4 md:p-8 overflow-y-auto">
                {/* Header */}
                <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm mb-6">
                    <div className="inline-flex items-center gap-2 bg-pink-50 text-pink-600 px-3 py-1.5 rounded-full text-xs font-bold mb-3">
                        <Sparkles className="w-3.5 h-3.5" />
                        Point Of Sales
                    </div>
                    <h1 className="text-3xl font-black text-slate-900">Terminal Kasir</h1>
                    <p className="text-xs text-slate-400 font-medium mt-2">
                        Klik category untuk membuka produk
                    </p>
                </div>

                {/* Search */}
                <div className="relative mb-8">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Cari produk..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-white rounded-2xl py-4 pl-11 pr-4 border border-slate-100 outline-none focus:ring-2 focus:ring-pink-500/20 text-sm font-medium"
                    />
                </div>

                {/* Categories */}
                <div className="space-y-6">
                    {categories.length === 0 && (
                        <p className="text-sm text-slate-400 text-center py-10">
                            Tidak ada produk tersedia.
                        </p>
                    )}

                    {categories.map((category) => {
                        const filtered = products.filter(
                            (p) =>
                                p.category?.name === category &&
                                p.name.toLowerCase().includes(search.toLowerCase()),
                        );

                        return (
                            <CategorySection
                                key={category}
                                category={category}
                                products={filtered}
                                isOpen={openCategory === category}
                                onToggle={() => toggleCategory(category)}
                                onAddToCart={addToCart}
                            />
                        );
                    })}
                </div>
            </div>

            {/* ── Cart Panel ── */}
            <div className="w-full lg:w-[420px] bg-white border-l border-slate-100 flex flex-col">
                {/* Cart header */}
                <div className="p-6 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center">
                            <ShoppingCart className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-900">Keranjang</h2>
                            <p className="text-xs text-slate-400 font-medium">
                                {cart.length} produk
                            </p>
                        </div>
                    </div>
                </div>

                {/* Cart items */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {cart.length === 0 ? (
                        <div className="text-center py-20">
                            <ShoppingCart className="w-10 h-10 text-slate-300 mx-auto" />
                            <p className="text-xs text-slate-400 font-semibold mt-2">
                                Keranjang kosong
                            </p>
                        </div>
                    ) : (
                        cart.map((item) => (
                            <CartItemRow
                                key={item.productId}
                                item={item}
                                onIncrease={increaseQuantity}
                                onDecrease={decreaseQuantity}
                                onRemove={removeItem}
                            />
                        ))
                    )}
                </div>

                {/* Checkout panel */}
                <div className="p-4 border-t border-slate-100 space-y-4">
                    {/* Total */}
                    <div className="bg-slate-50 rounded-2xl p-4 flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                            Total
                        </span>
                        <h2 className="text-2xl font-black text-slate-900">
                            {formatRupiah(total)}
                        </h2>
                    </div>

                    {/* Payment methods */}
                    <div className="grid grid-cols-4 gap-2">
                        {PAYMENT_METHODS.map((method) => (
                            <button
                                key={method.key}
                                onClick={() => setPaymentMethod(method.key)}
                                className={`rounded-xl py-3 flex flex-col items-center gap-1 text-[10px] font-bold transition-colors ${
                                    paymentMethod === method.key
                                        ? "bg-slate-900 text-white"
                                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                }`}
                            >
                                <method.icon className="w-4 h-4" />
                                {method.label}
                            </button>
                        ))}
                    </div>

                    {/* Cash fields */}
                    {paymentMethod === "CASH" && (
                        <>
                            <input
                                type="number"
                                placeholder="Jumlah bayar"
                                value={paidAmount}
                                min={0}
                                onChange={(e) => setPaidAmount(e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-pink-500/20 text-sm font-semibold"
                            />
                            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex items-center justify-between">
                                <span className="text-xs font-bold uppercase tracking-wide text-emerald-700">
                                    Kembalian
                                </span>
                                <h3 className="text-xl font-black text-emerald-700">
                                    {formatRupiah(change)}
                                </h3>
                            </div>
                        </>
                    )}

                    {/* Checkout button */}
                    <button
                        onClick={handleCheckout}
                        disabled={submitting || cart.length === 0}
                        className="w-full bg-gradient-to-r from-pink-600 to-rose-600 hover:opacity-90 disabled:opacity-50 transition-all text-white py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2"
                    >
                        {submitting ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            <>
                                <Receipt className="w-4 h-4" />
                                Checkout
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}