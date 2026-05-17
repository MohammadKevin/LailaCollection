"use client";

import React, {
    useEffect,
    useMemo,
    useState,
} from "react";

import Image from "next/image";

import {
    Search,
    ShoppingCart,
    Trash2,
    Wallet,
    CreditCard,
    QrCode,
    Loader2,
    Sparkles,
    Plus,
    Minus,
    Package,
    Store,
    Receipt,
    Landmark,
    Smartphone,
} from "lucide-react";

import api from "@/lib/api";

type PaymentMethod =
    | "CASH"
    | "QRIS"
    | "DEBIT"
    | "TRANSFER"
    | "E_WALLET";

type Product = {
    id: string;
    name: string;
    sellingPrice: number;
    stock: number;
    imageUrl?: string;

    category?: {
        id: string;
        name: string;
    };
};

type CartItem = {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    imageUrl?: string;
};

export default function SalesPage() {
    const [loading, setLoading] =
        useState(true);

    const [submitting, setSubmitting] =
        useState(false);

    const [products, setProducts] =
        useState<Product[]>([]);

    const [search, setSearch] =
        useState("");

    const [cart, setCart] =
        useState<CartItem[]>([]);

    const [paymentMethod, setPaymentMethod] =
        useState<PaymentMethod>(
            "CASH",
        );

    const [paidAmount, setPaidAmount] =
        useState("");

    const [outletId, setOutletId] =
        useState("");

    const [openCategory, setOpenCategory] =
        useState<string | null>(
            null,
        );

    const fetchProducts =
        async () => {
            try {
                setLoading(true);

                const response =
                    await api.get(
                        "/products",
                    );

                const data =
                    Array.isArray(
                        response.data,
                    )
                        ? response.data
                        : response.data
                              ?.data || [];

                setProducts(data);

                if (
                    typeof window !==
                    "undefined"
                ) {
                    const user =
                        JSON.parse(
                            localStorage.getItem(
                                "user",
                            ) || "{}",
                        );

                    if (
                        user?.outlet
                            ?.id
                    ) {
                        setOutletId(
                            user.outlet.id,
                        );
                    }
                }
            } catch (
                error
            ) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

    useEffect(() => {
        fetchProducts();
    }, []);

    const categories =
        useMemo(() => {
            const uniqueCategories =
                products
                    .map(
                        (
                            product,
                        ) =>
                            product
                                .category
                                ?.name,
                    )
                    .filter(Boolean);

            return [
                ...new Set(
                    uniqueCategories,
                ),
            ];
        }, [products]);

    const addToCart = (
        product: Product,
    ) => {
        if (
            product.stock <= 0
        ) {
            alert(
                "Stock produk habis",
            );
            return;
        }

        const existing =
            cart.find(
                (item) =>
                    item.productId ===
                    product.id,
            );

        if (existing) {
            if (
                existing.quantity >=
                product.stock
            ) {
                alert(
                    `Stock hanya tersedia ${product.stock}`,
                );

                return;
            }

            setCart(
                cart.map(
                    (item) =>
                        item.productId ===
                        product.id
                            ? {
                                  ...item,
                                  quantity:
                                      item.quantity +
                                      1,
                              }
                            : item,
                ),
            );

            return;
        }

        setCart([
            ...cart,
            {
                productId:
                    product.id,
                name: product.name,
                price:
                    product.sellingPrice,
                quantity: 1,
                imageUrl:
                    product.imageUrl,
            },
        ]);
    };

    const increaseQuantity =
        (
            productId: string,
        ) => {
            const product =
                products.find(
                    (p) =>
                        p.id ===
                        productId,
                );

            const cartItem =
                cart.find(
                    (c) =>
                        c.productId ===
                        productId,
                );

            if (
                product &&
                cartItem &&
                cartItem.quantity >=
                    product.stock
            ) {
                alert(
                    `Stock hanya tersedia ${product.stock}`,
                );

                return;
            }

            setCart((prev) =>
                prev.map(
                    (
                        item,
                    ) =>
                        item.productId ===
                        productId
                            ? {
                                  ...item,
                                  quantity:
                                      item.quantity +
                                      1,
                              }
                            : item,
                ),
            );
        };

    const decreaseQuantity =
        (
            productId: string,
        ) => {
            setCart((prev) =>
                prev
                    .map(
                        (
                            item,
                        ) =>
                            item.productId ===
                            productId
                                ? {
                                      ...item,
                                      quantity:
                                          item.quantity -
                                          1,
                                  }
                                : item,
                    )
                    .filter(
                        (
                            item,
                        ) =>
                            item.quantity >
                            0,
                    ),
            );
        };

    const removeItem = (
        productId: string,
    ) => {
        setCart((prev) =>
            prev.filter(
                (item) =>
                    item.productId !==
                    productId,
            ),
        );
    };

    const total =
        cart.reduce(
            (acc, item) =>
                acc +
                item.price *
                    item.quantity,
            0,
        );

    const change =
        Number(
            paidAmount,
        ) - total;

    const buildSalePayload =
        () => ({
            paymentMethod,

            paidAmount:
                paymentMethod ===
                "CASH"
                    ? Number(
                          paidAmount,
                      )
                    : total,

            paymentProof: null,

            outletId,

            items: cart.map(
                (item) => ({
                    productId:
                        item.productId,

                    quantity:
                        Number(
                            item.quantity,
                        ),
                }),
            ),
        });

    const handleCheckout =
        async () => {
            if (
                !outletId
            ) {
                alert(
                    "Outlet tidak ditemukan",
                );
                return;
            }

            if (
                cart.length ===
                0
            ) {
                alert(
                    "Keranjang kosong",
                );
                return;
            }

            const isCash =
                paymentMethod ===
                "CASH";

            const paid =
                Number(
                    paidAmount,
                );

            if (
                isCash &&
                paid < total
            ) {
                alert(
                    "Uang pembayaran kurang",
                );
                return;
            }

            try {
                setSubmitting(
                    true,
                );

                const payload =
                    buildSalePayload();

                console.log(
                    payload,
                );

                await api.post(
                    "/sales",
                    payload,
                );

                alert(
                    "Transaction berhasil",
                );

                setCart([]);

                setPaidAmount(
                    "",
                );

                await fetchProducts();
            } catch (
                error: any
            ) {
                console.error(
                    error
                        ?.response
                        ?.data || error,
                );

                alert(
                    error
                        ?.response
                        ?.data
                        ?.message ||
                        "Transaction gagal",
                );
            } finally {
                setSubmitting(
                    false,
                );
            }
        };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 animate-spin text-pink-600" />

                    <p className="text-sm text-slate-400 font-semibold">
                        Loading kasir...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
            <div className="flex-1 p-4 md:p-8 overflow-y-auto">
                <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm mb-6">
                    <div className="inline-flex items-center gap-2 bg-pink-50 text-pink-600 px-3 py-1.5 rounded-full text-xs font-bold mb-3">
                        <Sparkles className="w-3.5 h-3.5" />
                        Point Of Sales
                    </div>

                    <h1 className="text-3xl font-black text-slate-900">
                        Terminal Kasir
                    </h1>

                    <p className="text-xs text-slate-400 font-medium mt-2">
                        Klik category untuk membuka produk
                    </p>
                </div>

                <div className="relative mb-8">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

                    <input
                        type="text"
                        placeholder="Cari product..."
                        value={
                            search
                        }
                        onChange={(
                            e,
                        ) =>
                            setSearch(
                                e
                                    .target
                                    .value,
                            )
                        }
                        className="w-full bg-white rounded-2xl py-4 pl-11 pr-4 border border-slate-100 outline-none focus:ring-2 focus:ring-pink-500/20 text-sm font-medium"
                    />
                </div>

                <div className="space-y-6">
                    {categories.map(
                        (
                            category,
                        ) => {
                            const categoryProducts =
                                products.filter(
                                    (
                                        product,
                                    ) =>
                                        product
                                            .category
                                            ?.name ===
                                            category &&
                                        product.name
                                            .toLowerCase()
                                            .includes(
                                                search.toLowerCase(),
                                            ),
                                );

                            const isOpen =
                                openCategory ===
                                category;

                            return (
                                <div
                                    key={
                                        category
                                    }
                                    className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm"
                                >
                                    <button
                                        onClick={() =>
                                            setOpenCategory(
                                                isOpen
                                                    ? null
                                                    : category,
                                            )
                                        }
                                        className="w-full flex items-center justify-between p-6"
                                    >
                                        <div>
                                            <h2 className="text-2xl font-black text-slate-900 text-left">
                                                {
                                                    category
                                                }
                                            </h2>

                                            <p className="text-sm text-slate-400 mt-1">
                                                {
                                                    categoryProducts.length
                                                }{" "}
                                                products
                                            </p>
                                        </div>

                                        <div className="w-14 h-14 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center">
                                            <Package className="w-7 h-7" />
                                        </div>
                                    </button>

                                    {isOpen && (
                                        <div className="px-6 pb-6">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                                                {categoryProducts.map(
                                                    (
                                                        product,
                                                    ) => (
                                                        <div
                                                            key={
                                                                product.id
                                                            }
                                                            onClick={() =>
                                                                addToCart(
                                                                    product,
                                                                )
                                                            }
                                                            className="bg-slate-50 border border-slate-100 rounded-3xl overflow-hidden hover:shadow-lg transition-all cursor-pointer"
                                                        >
                                                            <div className="relative w-full h-40 bg-slate-100">
                                                                {product.imageUrl ? (
                                                                    <Image
                                                                        src={
                                                                            product.imageUrl
                                                                        }
                                                                        alt={
                                                                            product.name
                                                                        }
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
                                                                <h3 className="font-bold text-slate-800">
                                                                    {
                                                                        product.name
                                                                    }
                                                                </h3>

                                                                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mt-2">
                                                                    <Store className="w-3.5 h-3.5" />

                                                                    Stock:
                                                                    <span className="font-bold text-slate-700">
                                                                        {
                                                                            product.stock
                                                                        }
                                                                    </span>
                                                                </div>

                                                                <div className="flex items-center justify-between mt-5">
                                                                    <h4 className="text-xl font-black text-pink-600">
                                                                        Rp{" "}
                                                                        {product.sellingPrice.toLocaleString(
                                                                            "id-ID",
                                                                        )}
                                                                    </h4>

                                                                    <div className="w-10 h-10 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center">
                                                                        <Plus className="w-4 h-4" />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ),
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        },
                    )}
                </div>
            </div>

            <div className="w-full lg:w-[420px] bg-white border-l border-slate-100 flex flex-col">
                <div className="p-6 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center">
                            <ShoppingCart className="w-6 h-6" />
                        </div>

                        <div>
                            <h2 className="text-lg font-bold text-slate-900">
                                Keranjang
                            </h2>

                            <p className="text-xs text-slate-400 font-medium">
                                {
                                    cart.length
                                }{" "}
                                produk
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {cart.length ===
                    0 ? (
                        <div className="text-center py-20">
                            <ShoppingCart className="w-10 h-10 text-slate-300 mx-auto" />

                            <p className="text-xs text-slate-400 font-semibold mt-2">
                                Keranjang kosong
                            </p>
                        </div>
                    ) : (
                        cart.map(
                            (
                                item,
                            ) => (
                                <div
                                    key={
                                        item.productId
                                    }
                                    className="bg-slate-50 border border-slate-100 rounded-2xl p-4"
                                >
                                    <div className="flex justify-between">
                                        <div>
                                            <h4 className="font-bold text-sm text-slate-800">
                                                {
                                                    item.name
                                                }
                                            </h4>

                                            <p className="text-xs text-slate-400 font-semibold mt-1">
                                                Rp{" "}
                                                {item.price.toLocaleString(
                                                    "id-ID",
                                                )}
                                            </p>
                                        </div>

                                        <button
                                            onClick={() =>
                                                removeItem(
                                                    item.productId,
                                                )
                                            }
                                            className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <div className="flex items-center justify-between mt-4">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() =>
                                                    decreaseQuantity(
                                                        item.productId,
                                                    )
                                                }
                                                className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center"
                                            >
                                                <Minus className="w-3 h-3" />
                                            </button>

                                            <span className="font-bold">
                                                {
                                                    item.quantity
                                                }
                                            </span>

                                            <button
                                                onClick={() =>
                                                    increaseQuantity(
                                                        item.productId,
                                                    )
                                                }
                                                className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center"
                                            >
                                                <Plus className="w-3 h-3" />
                                            </button>
                                        </div>

                                        <h4 className="font-black text-pink-600">
                                            Rp{" "}
                                            {(
                                                item.price *
                                                item.quantity
                                            ).toLocaleString(
                                                "id-ID",
                                            )}
                                        </h4>
                                    </div>
                                </div>
                            ),
                        )
                    )}
                </div>

                <div className="p-4 border-t border-slate-100 space-y-4">
                    <div className="bg-slate-50 rounded-2xl p-4 flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                            Total
                        </span>

                        <h2 className="text-2xl font-black text-slate-900">
                            Rp{" "}
                            {total.toLocaleString(
                                "id-ID",
                            )}
                        </h2>
                    </div>

                    <div className="grid grid-cols-5 gap-2">
                        {[
                            {
                                key: "CASH",
                                icon: Wallet,
                                label: "CASH",
                            },
                            {
                                key: "QRIS",
                                icon: QrCode,
                                label: "QRIS",
                            },
                            {
                                key: "DEBIT",
                                icon: Landmark,
                                label: "DEBIT",
                            },
                            {
                                key: "TRANSFER",
                                icon: CreditCard,
                                label: "TF",
                            },
                            {
                                key: "E_WALLET",
                                icon: Smartphone,
                                label: "EW",
                            },
                        ].map(
                            (
                                method,
                            ) => (
                                <button
                                    key={
                                        method.key
                                    }
                                    onClick={() =>
                                        setPaymentMethod(
                                            method.key as PaymentMethod,
                                        )
                                    }
                                    className={`rounded-xl py-3 flex flex-col items-center gap-1 text-[10px] font-bold ${
                                        paymentMethod ===
                                        method.key
                                            ? "bg-slate-900 text-white"
                                            : "bg-slate-100 text-slate-600"
                                    }`}
                                >
                                    <method.icon className="w-4 h-4" />

                                    {
                                        method.label
                                    }
                                </button>
                            ),
                        )}
                    </div>

                    {paymentMethod ===
                        "CASH" && (
                        <>
                            <input
                                type="number"
                                placeholder="Jumlah bayar"
                                value={
                                    paidAmount
                                }
                                onChange={(
                                    e,
                                ) =>
                                    setPaidAmount(
                                        e
                                            .target
                                            .value,
                                    )
                                }
                                className="w-full bg-white border border-slate-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-pink-500/20 text-sm font-semibold"
                            />

                            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex items-center justify-between">
                                <span className="text-xs font-bold uppercase tracking-wide text-emerald-700">
                                    Kembalian
                                </span>

                                <h3 className="text-xl font-black text-emerald-700">
                                    Rp{" "}
                                    {change >
                                        0 &&
                                    paidAmount
                                        ? change.toLocaleString(
                                              "id-ID",
                                          )
                                        : 0}
                                </h3>
                            </div>
                        </>
                    )}

                    <button
                        onClick={
                            handleCheckout
                        }
                        disabled={
                            submitting ||
                            cart.length ===
                                0
                        }
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