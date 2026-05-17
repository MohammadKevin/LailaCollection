"use client";

import React, {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    BadgeDollarSign,
    BarChart3,
    CalendarDays,
    ClipboardList,
    CreditCard,
    Download,
    Loader2,
    Package,
    Receipt,
    Search,
    ShoppingBag,
    Sparkles,
    Store,
    TrendingDown,
    TrendingUp,
    Wallet,
} from "lucide-react";

import api from "@/lib/api";

type Sale = {
    id: string;
    totalAmount: number;
    paymentMethod: string;
    createdAt: string;

    outlet?: {
        id: string;
        name: string;
    };

    cashier?: {
        id: string;
        fullName: string;
    };
};

type Expense = {
    id: string;
    title: string;
    amount: number;
    createdAt: string;

    outlet?: {
        id: string;
        name: string;
    };
};

type Product = {
    id: string;
    name: string;
    stock: number;
    sellingPrice: number;
};

export default function ReportsPage() {
    const [loading, setLoading] =
        useState(true);

    const [sales, setSales] =
        useState<Sale[]>([]);

    const [expenses, setExpenses] =
        useState<Expense[]>([]);

    const [products, setProducts] =
        useState<Product[]>([]);

    const [search, setSearch] =
        useState("");

    const [selectedDate, setSelectedDate] =
        useState("");

    const fetchData =
        async () => {
            try {
                setLoading(true);

                const [
                    salesRes,
                    expensesRes,
                    productsRes,
                ] = await Promise.all([
                    api.get("/sales"),

                    api.get("/expenses"),

                    api.get("/products"),
                ]);

                setSales(
                    Array.isArray(
                        salesRes.data,
                    )
                        ? salesRes.data
                        : salesRes.data
                              ?.data || [],
                );

                setExpenses(
                    Array.isArray(
                        expensesRes.data,
                    )
                        ? expensesRes.data
                        : expensesRes
                              .data
                              ?.data || [],
                );

                setProducts(
                    Array.isArray(
                        productsRes.data,
                    )
                        ? productsRes.data
                        : productsRes
                              .data
                              ?.data || [],
                );
            } catch (
                error: any
            ) {
                console.error(
                    error
                        ?.response
                        ?.data || error,
                );

                alert(
                    "Gagal mengambil laporan",
                );
            } finally {
                setLoading(false);
            }
        };

    useEffect(() => {
        fetchData();
    }, []);

    const filteredSales =
        useMemo(() => {
            return sales.filter(
                (sale) => {
                    const matchSearch =
                        sale.outlet?.name
                            ?.toLowerCase()
                            .includes(
                                search.toLowerCase(),
                            ) ||
                        sale.cashier?.fullName
                            ?.toLowerCase()
                            .includes(
                                search.toLowerCase(),
                            );

                    const matchDate =
                        selectedDate
                            ? new Date(
                                  sale.createdAt,
                              )
                                  .toISOString()
                                  .split(
                                      "T",
                                  )[0] ===
                              selectedDate
                            : true;

                    return (
                        matchSearch &&
                        matchDate
                    );
                },
            );
        }, [
            sales,
            search,
            selectedDate,
        ]);

    const totalSales =
        useMemo(() => {
            return filteredSales.reduce(
                (
                    acc,
                    sale,
                ) =>
                    acc +
                    sale.totalAmount,
                0,
            );
        }, [filteredSales]);

    const totalExpenses =
        useMemo(() => {
            return expenses.reduce(
                (
                    acc,
                    expense,
                ) =>
                    acc +
                    expense.amount,
                0,
            );
        }, [expenses]);

    const totalProfit =
        totalSales -
        totalExpenses;

    const totalProducts =
        products.length;

    const totalStock =
        products.reduce(
            (
                acc,
                product,
            ) =>
                acc +
                product.stock,
            0,
        );

    const handleExport =
        () => {
            const csvRows = [
                [
                    "Tanggal",
                    "Outlet",
                    "Kasir",
                    "Payment",
                    "Total",
                ],
            ];

            filteredSales.forEach(
                (sale) => {
                    csvRows.push([
                        new Date(
                            sale.createdAt,
                        ).toLocaleDateString(
                            "id-ID",
                        ),

                        sale.outlet
                            ?.name ||
                            "-",

                        sale.cashier
                            ?.fullName ||
                            "-",

                        sale.paymentMethod,

                        String(
                            sale.totalAmount,
                        ),
                    ]);
                },
            );

            const csvContent =
                csvRows
                    .map((e) =>
                        e.join(","),
                    )
                    .join("\n");

            const blob =
                new Blob(
                    [csvContent],
                    {
                        type: "text/csv;charset=utf-8;",
                    },
                );

            const link =
                document.createElement(
                    "a",
                );

            link.href =
                URL.createObjectURL(
                    blob,
                );

            link.download =
                "reports.csv";

            link.click();
        };

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
                    <div>
                        <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-full text-xs font-bold mb-3">
                            <Sparkles className="w-4 h-4" />
                            Analytics & Reports
                        </div>

                        <h1 className="text-3xl font-black text-slate-900">
                            Reports Dashboard
                        </h1>

                        <p className="text-sm text-slate-400 mt-2">
                            Monitoring penjualan, pengeluaran dan profit toko
                        </p>
                    </div>

                    <button
                        onClick={
                            handleExport
                        }
                        className="bg-gradient-to-r from-emerald-500 to-green-600 hover:opacity-90 transition-all text-white px-6 py-4 rounded-2xl font-bold flex items-center justify-center gap-2"
                    >
                        <Download className="w-5 h-5" />
                        Export CSV
                    </button>
                </div>

                <div className="grid md:grid-cols-2 xl:grid-cols-5 gap-5">
                    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                        <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                            <TrendingUp className="w-7 h-7" />
                        </div>

                        <p className="text-xs uppercase font-bold tracking-wide text-slate-400 mt-5">
                            Total Sales
                        </p>

                        <h2 className="text-3xl font-black text-slate-900 mt-2">
                            Rp{" "}
                            {totalSales.toLocaleString(
                                "id-ID",
                            )}
                        </h2>
                    </div>

                    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                        <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
                            <TrendingDown className="w-7 h-7" />
                        </div>

                        <p className="text-xs uppercase font-bold tracking-wide text-slate-400 mt-5">
                            Total Expense
                        </p>

                        <h2 className="text-3xl font-black text-red-600 mt-2">
                            Rp{" "}
                            {totalExpenses.toLocaleString(
                                "id-ID",
                            )}
                        </h2>
                    </div>

                    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                        <div className="w-14 h-14 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center">
                            <BadgeDollarSign className="w-7 h-7" />
                        </div>

                        <p className="text-xs uppercase font-bold tracking-wide text-slate-400 mt-5">
                            Profit
                        </p>

                        <h2 className="text-3xl font-black text-sky-600 mt-2">
                            Rp{" "}
                            {totalProfit.toLocaleString(
                                "id-ID",
                            )}
                        </h2>
                    </div>

                    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                        <div className="w-14 h-14 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center">
                            <Package className="w-7 h-7" />
                        </div>

                        <p className="text-xs uppercase font-bold tracking-wide text-slate-400 mt-5">
                            Products
                        </p>

                        <h2 className="text-3xl font-black text-violet-600 mt-2">
                            {
                                totalProducts
                            }
                        </h2>
                    </div>

                    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                        <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                            <ClipboardList className="w-7 h-7" />
                        </div>

                        <p className="text-xs uppercase font-bold tracking-wide text-slate-400 mt-5">
                            Total Stock
                        </p>

                        <h2 className="text-3xl font-black text-amber-600 mt-2">
                            {
                                totalStock
                            }
                        </h2>
                    </div>
                </div>

                <div className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm grid md:grid-cols-2 gap-4">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

                        <input
                            type="text"
                            placeholder="Cari outlet / kasir..."
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
                            className="w-full bg-slate-50 rounded-2xl py-4 pl-11 pr-4 border border-slate-100 outline-none focus:ring-2 focus:ring-emerald-500/20"
                        />
                    </div>

                    <div className="relative">
                        <CalendarDays className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

                        <input
                            type="date"
                            value={
                                selectedDate
                            }
                            onChange={(
                                e,
                            ) =>
                                setSelectedDate(
                                    e
                                        .target
                                        .value,
                                )
                            }
                            className="w-full bg-slate-50 rounded-2xl py-4 pl-11 pr-4 border border-slate-100 outline-none focus:ring-2 focus:ring-emerald-500/20"
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="bg-white rounded-3xl border border-slate-100 p-20 flex items-center justify-center">
                        <Loader2 className="w-10 h-10 animate-spin text-emerald-600" />
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-slate-100 flex items-center gap-3">
                                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                    <Receipt className="w-6 h-6" />
                                </div>

                                <div>
                                    <h2 className="text-xl font-black text-slate-900">
                                        Sales Reports
                                    </h2>

                                    <p className="text-sm text-slate-400">
                                        Daftar transaksi penjualan
                                    </p>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-slate-50">
                                        <tr>
                                            <th className="text-left px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-400">
                                                Outlet
                                            </th>

                                            <th className="text-left px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-400">
                                                Kasir
                                            </th>

                                            <th className="text-left px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-400">
                                                Payment
                                            </th>

                                            <th className="text-left px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-400">
                                                Tanggal
                                            </th>

                                            <th className="text-right px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-400">
                                                Total
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {filteredSales.map(
                                            (
                                                sale,
                                            ) => (
                                                <tr
                                                    key={
                                                        sale.id
                                                    }
                                                    className="border-t border-slate-100"
                                                >
                                                    <td className="px-6 py-5">
                                                        <div className="flex items-center gap-2 font-bold text-slate-700">
                                                            <Store className="w-4 h-4 text-slate-400" />

                                                            {sale
                                                                .outlet
                                                                ?.name ||
                                                                "-"}
                                                        </div>
                                                    </td>

                                                    <td className="px-6 py-5 font-semibold text-slate-600">
                                                        {sale
                                                            .cashier
                                                            ?.fullName ||
                                                            "-"}
                                                    </td>

                                                    <td className="px-6 py-5">
                                                        <div className="inline-flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-full text-xs font-bold text-slate-700">
                                                            <CreditCard className="w-3.5 h-3.5" />

                                                            {
                                                                sale.paymentMethod
                                                            }
                                                        </div>
                                                    </td>

                                                    <td className="px-6 py-5 text-slate-500 font-medium">
                                                        {new Date(
                                                            sale.createdAt,
                                                        ).toLocaleDateString(
                                                            "id-ID",
                                                        )}
                                                    </td>

                                                    <td className="px-6 py-5 text-right font-black text-emerald-600">
                                                        Rp{" "}
                                                        {sale.totalAmount.toLocaleString(
                                                            "id-ID",
                                                        )}
                                                    </td>
                                                </tr>
                                            ),
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
                                        <Wallet className="w-6 h-6" />
                                    </div>

                                    <div>
                                        <h2 className="text-xl font-black text-slate-900">
                                            Expense Summary
                                        </h2>

                                        <p className="text-sm text-slate-400">
                                            Pengeluaran terbaru
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {expenses
                                        .slice(
                                            0,
                                            5,
                                        )
                                        .map(
                                            (
                                                expense,
                                            ) => (
                                                <div
                                                    key={
                                                        expense.id
                                                    }
                                                    className="bg-slate-50 rounded-2xl p-4 flex items-center justify-between"
                                                >
                                                    <div>
                                                        <h3 className="font-bold text-slate-800">
                                                            {
                                                                expense.title
                                                            }
                                                        </h3>

                                                        <p className="text-xs text-slate-400 mt-1">
                                                            {new Date(
                                                                expense.createdAt,
                                                            ).toLocaleDateString(
                                                                "id-ID",
                                                            )}
                                                        </p>
                                                    </div>

                                                    <h4 className="font-black text-red-600">
                                                        Rp{" "}
                                                        {expense.amount.toLocaleString(
                                                            "id-ID",
                                                        )}
                                                    </h4>
                                                </div>
                                            ),
                                        )}
                                </div>
                            </div>

                            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-12 h-12 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center">
                                        <ShoppingBag className="w-6 h-6" />
                                    </div>

                                    <div>
                                        <h2 className="text-xl font-black text-slate-900">
                                            Product Inventory
                                        </h2>

                                        <p className="text-sm text-slate-400">
                                            Stock product terbaru
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {products
                                        .slice(
                                            0,
                                            5,
                                        )
                                        .map(
                                            (
                                                product,
                                            ) => (
                                                <div
                                                    key={
                                                        product.id
                                                    }
                                                    className="bg-slate-50 rounded-2xl p-4 flex items-center justify-between"
                                                >
                                                    <div>
                                                        <h3 className="font-bold text-slate-800">
                                                            {
                                                                product.name
                                                            }
                                                        </h3>

                                                        <p className="text-xs text-slate-400 mt-1">
                                                            Harga: Rp{" "}
                                                            {product.sellingPrice.toLocaleString(
                                                                "id-ID",
                                                            )}
                                                        </p>
                                                    </div>

                                                    <div className="bg-violet-100 text-violet-700 px-3 py-1.5 rounded-full text-xs font-black">
                                                        Stock{" "}
                                                        {
                                                            product.stock
                                                        }
                                                    </div>
                                                </div>
                                            ),
                                        )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}   