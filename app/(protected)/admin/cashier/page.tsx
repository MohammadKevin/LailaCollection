"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

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
  Store,
  Trash2,
  Wallet,
} from "lucide-react";

import api from "@/lib/api";

type PaymentMethod =
  | "CASH"
  | "QRIS"
  | "DEBIT"
  | "TRANSFER";

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

function formatRupiah(
  amount: number,
) {
  return `Rp ${amount.toLocaleString(
    "id-ID",
  )}`;
}

function getOutletId() {
  try {
    const raw =
      localStorage.getItem(
        "user",
      );

    if (!raw) return "";

    const user =
      JSON.parse(raw);

    return (
      user?.outlet?.id || ""
    );
  } catch {
    return "";
  }
}

const PAYMENT_METHODS = [
  {
    key: "CASH",
    icon: Wallet,
    label: "Cash",
  },

  {
    key: "QRIS",
    icon: QrCode,
    label: "QRIS",
  },

  {
    key: "DEBIT",
    icon: Landmark,
    label: "Debit",
  },

  {
    key: "TRANSFER",
    icon: CreditCard,
    label: "Transfer",
  },
] as const;

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

  const [
    paymentMethod,
    setPaymentMethod,
  ] =
    useState<PaymentMethod>(
      "CASH",
    );

  const [paidAmount, setPaidAmount] =
    useState("");

  const [outletId, setOutletId] =
    useState("");

  const [openCategory, setOpenCategory] =
    useState<string | null>(null);

  const fetchProducts =
    useCallback(async () => {
      try {
        setLoading(true);

        const response =
          await api.get(
            "/products",
          );

        setProducts(
          response.data || [],
        );

        setOutletId(
          getOutletId(),
        );
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const categories =
    useMemo(() => {
      const names =
        products
          .map(
            (p) =>
              p.category
                ?.name,
          )
          .filter(
            Boolean,
          ) as string[];

      return [
        ...new Set(names),
      ];
    }, [products]);

  const total =
    useMemo(() => {
      return cart.reduce(
        (acc, item) =>
          acc +
          item.price *
            item.quantity,
        0,
      );
    }, [cart]);

  const change =
    Number(paidAmount) >
    total
      ? Number(
          paidAmount,
        ) - total
      : 0;

  const addToCart = (
    product: Product,
  ) => {
    if (
      product.stock <= 0
    ) {
      alert(
        "Stock habis",
      );

      return;
    }

    setCart((prev) => {
      const existing =
        prev.find(
          (item) =>
            item.productId ===
            product.id,
        );

      if (existing) {
        return prev.map(
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
        );
      }

      return [
        ...prev,
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
      ];
    });
  };

  const increaseQty = (
    id: string,
  ) => {
    setCart((prev) =>
      prev.map((item) =>
        item.productId ===
        id
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

  const decreaseQty = (
    id: string,
  ) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.productId ===
          id
            ? {
                ...item,
                quantity:
                  item.quantity -
                  1,
              }
            : item,
        )
        .filter(
          (item) =>
            item.quantity >
            0,
        ),
    );
  };

  const removeItem = (
    id: string,
  ) => {
    setCart((prev) =>
      prev.filter(
        (item) =>
          item.productId !==
          id,
      ),
    );
  };

  const handleCheckout =
    async () => {
      try {
        if (
          cart.length ===
          0
        ) {
          alert(
            "Keranjang kosong",
          );

          return;
        }

        if (
          paymentMethod ===
            "CASH" &&
          Number(
            paidAmount,
          ) < total
        ) {
          alert(
            "Pembayaran kurang",
          );

          return;
        }

        setSubmitting(
          true,
        );

        await api.post(
          "/sales",
          {
            paymentMethod,

            paidAmount:
              paymentMethod ===
              "CASH"
                ? Number(
                    paidAmount,
                  )
                : total,

            paymentProof:
              null,

            outletId,

            items:
              cart.map(
                (
                  item,
                ) => ({
                  productId:
                    item.productId,

                  quantity:
                    item.quantity,
                }),
              ),
          },
        );

        alert(
          "Transaksi berhasil",
        );

        setCart([]);

        setPaidAmount(
          "",
        );

        fetchProducts();
      } catch (error) {
        console.error(error);

        alert(
          "Checkout gagal",
        );
      } finally {
        setSubmitting(
          false,
        );
      }
    };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-slate-700" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
      <div className="flex-1 p-4 md:p-6 overflow-y-auto">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-6">
          <h1 className="text-2xl font-bold text-slate-800">
            Cashier
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            Transaksi
            penjualan
          </p>
        </div>

        <div className="relative mb-6">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />

          <input
            type="text"
            placeholder="Cari produk..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value,
              )
            }
            className="w-full h-12 border border-slate-200 rounded-2xl bg-white pl-11 pr-4 outline-none"
          />
        </div>

        <div className="space-y-4">
          {categories.map(
            (category) => {
              const filtered =
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

              if (
                filtered.length ===
                0
              )
                return null;

              const isOpen =
                openCategory ===
                category;

              return (
                <div
                  key={
                    category
                  }
                  className="bg-white border border-slate-200 rounded-2xl overflow-hidden"
                >
                  <button
                    onClick={() =>
                      setOpenCategory(
                        isOpen
                          ? null
                          : category,
                      )
                    }
                    className="w-full p-5 flex items-center justify-between hover:bg-slate-50 transition"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center">
                        <Package className="w-5 h-5 text-slate-700" />
                      </div>

                      <div className="text-left">
                        <h2 className="text-lg font-semibold text-slate-800">
                          {
                            category
                          }
                        </h2>

                        <p className="text-sm text-slate-400">
                          {
                            filtered.length
                          }{" "}
                          produk
                        </p>
                      </div>
                    </div>

                    <div
                      className={`transition-transform duration-300 ${
                        isOpen
                          ? "rotate-45"
                          : ""
                      }`}
                    >
                      <Plus className="w-5 h-5 text-slate-600" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="p-5 pt-0 border-t border-slate-100">
                      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mt-5">
                        {filtered.map(
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
                              className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden cursor-pointer hover:border-slate-300 transition"
                            >
                              <div className="relative h-40 bg-slate-100">
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
                                <h3 className="font-semibold text-slate-800">
                                  {
                                    product.name
                                  }
                                </h3>

                                <div className="flex items-center gap-2 text-xs text-slate-400 mt-2">
                                  <Store className="w-3 h-3" />
                                  Stock{" "}
                                  {
                                    product.stock
                                  }
                                </div>

                                <div className="flex items-center justify-between mt-5">
                                  <h4 className="text-lg font-bold text-slate-800">
                                    {formatRupiah(
                                      product.sellingPrice,
                                    )}
                                  </h4>

                                  <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
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

      <div className="w-full lg:w-[400px] bg-white border-l border-slate-200 flex flex-col">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-slate-700" />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-slate-800">
                Keranjang
              </h2>

              <p className="text-sm text-slate-400">
                {
                  cart.length
                }{" "}
                item
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cart.length ===
          0 ? (
            <div className="h-full flex flex-col items-center justify-center">
              <ShoppingCart className="w-10 h-10 text-slate-300" />

              <p className="text-sm text-slate-400 mt-3">
                Keranjang
                kosong
              </p>
            </div>
          ) : (
            cart.map(
              (item) => (
                <div
                  key={
                    item.productId
                  }
                  className="bg-slate-50 border border-slate-200 rounded-2xl p-4"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-slate-800">
                        {
                          item.name
                        }
                      </h3>

                      <p className="text-sm text-slate-400 mt-1">
                        {formatRupiah(
                          item.price,
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
                          decreaseQty(
                            item.productId,
                          )
                        }
                        className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center"
                      >
                        <Minus className="w-3 h-3" />
                      </button>

                      <span className="font-semibold w-5 text-center">
                        {
                          item.quantity
                        }
                      </span>

                      <button
                        onClick={() =>
                          increaseQty(
                            item.productId,
                          )
                        }
                        className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <h4 className="font-bold text-slate-800">
                      {formatRupiah(
                        item.price *
                          item.quantity,
                      )}
                    </h4>
                  </div>
                </div>
              ),
            )
          )}
        </div>

        <div className="p-4 border-t border-slate-200 space-y-4">
          <div className="bg-slate-100 rounded-2xl p-4 flex items-center justify-between">
            <span className="text-sm text-slate-500">
              Total
            </span>

            <h2 className="text-2xl font-bold text-slate-800">
              {formatRupiah(
                total,
              )}
            </h2>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {PAYMENT_METHODS.map(
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
                  className={`rounded-xl py-3 flex flex-col items-center gap-1 text-xs font-medium transition ${
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
                onChange={(e) =>
                  setPaidAmount(
                    e.target.value,
                  )
                }
                className="w-full h-12 border border-slate-200 rounded-2xl px-4 outline-none"
              />

              <div className="bg-green-50 border border-green-100 rounded-2xl p-4 flex items-center justify-between">
                <span className="text-sm text-green-600">
                  Kembalian
                </span>

                <h3 className="text-xl font-bold text-green-600">
                  {formatRupiah(
                    change,
                  )}
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
            className="w-full h-12 rounded-2xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-semibold flex items-center justify-center gap-2"
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