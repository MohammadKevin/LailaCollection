"use client";

import React, {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    BadgeDollarSign,
    CalendarDays,
    ClipboardList,
    Loader2,
    Pencil,
    Plus,
    Search,
    Sparkles,
    Trash2,
    Wallet,
    X,
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

type ExpenseForm = {
    title: string;
    description: string;
    amount: string;
    outletId: string;
};

const initialForm: ExpenseForm = {
    title: "",
    description: "",
    amount: "",
    outletId: "",
};

export default function AdminExpensePage() {
    const [loading, setLoading] =
        useState(true);

    const [submitting, setSubmitting] =
        useState(false);

    const [expenses, setExpenses] =
        useState<Expense[]>([]);

    const [outlets, setOutlets] =
        useState<Outlet[]>([]);

    const [search, setSearch] =
        useState("");

    const [openModal, setOpenModal] =
        useState(false);

    const [editingId, setEditingId] =
        useState<string | null>(
            null,
        );

    const [form, setForm] =
        useState<ExpenseForm>(
            initialForm,
        );

    const fetchData =
        async () => {
            try {
                setLoading(true);

                const [
                    expensesRes,
                    outletsRes,
                ] = await Promise.all([
                    api.get(
                        "/expenses",
                    ),

                    api.get(
                        "/outlets",
                    ),
                ]);

                setExpenses(
                    Array.isArray(
                        expensesRes.data,
                    )
                        ? expensesRes.data
                        : expensesRes
                              .data
                              ?.data || [],
                );

                setOutlets(
                    Array.isArray(
                        outletsRes.data,
                    )
                        ? outletsRes.data
                        : outletsRes
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
                    "Gagal mengambil data expense",
                );
            } finally {
                setLoading(false);
            }
        };

    useEffect(() => {
        fetchData();
    }, []);

    const filteredExpenses =
        useMemo(() => {
            return expenses.filter(
                (expense) =>
                    expense.title
                        .toLowerCase()
                        .includes(
                            search.toLowerCase(),
                        ),
            );
        }, [expenses, search]);

    const totalExpense =
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

    const resetForm = () => {
        setForm(initialForm);

        setEditingId(null);

        setOpenModal(false);
    };

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >,
    ) => {
        setForm({
            ...form,
            [e.target.name]:
                e.target.value,
        });
    };

    const handleSubmit =
        async (
            e: React.FormEvent,
        ) => {
            e.preventDefault();

            if (
                !form.title ||
                !form.amount ||
                !form.outletId
            ) {
                alert(
                    "Lengkapi form expense",
                );

                return;
            }

            try {
                setSubmitting(
                    true,
                );

                const payload = {
                    title: form.title,

                    description:
                        form.description,

                    amount: Number(
                        form.amount,
                    ),

                    outletId:
                        form.outletId,
                };

                if (
                    editingId
                ) {
                    await api.patch(
                        `/expenses/${editingId}`,
                        payload,
                    );

                    alert(
                        "Expense berhasil diupdate",
                    );
                } else {
                    await api.post(
                        "/expenses",
                        payload,
                    );

                    alert(
                        "Expense berhasil ditambahkan",
                    );
                }

                resetForm();

                fetchData();
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
                        "Gagal menyimpan expense",
                );
            } finally {
                setSubmitting(
                    false,
                );
            }
        };

    const handleEdit = (
        expense: Expense,
    ) => {
        setEditingId(
            expense.id,
        );

        setForm({
            title: expense.title,

            description:
                expense.description ||
                "",

            amount: String(
                expense.amount,
            ),

            outletId:
                expense.outlet
                    ?.id || "",
        });

        setOpenModal(true);
    };

    const handleDelete =
        async (
            id: string,
        ) => {
            const confirmDelete =
                confirm(
                    "Hapus expense ini?",
                );

            if (
                !confirmDelete
            )
                return;

            try {
                await api.delete(
                    `/expenses/${id}`,
                );

                alert(
                    "Expense berhasil dihapus",
                );

                fetchData();
            } catch (
                error: any
            ) {
                console.error(
                    error
                        ?.response
                        ?.data || error,
                );

                alert(
                    "Gagal menghapus expense",
                );
            }
        };

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
                    <div>
                        <div className="inline-flex items-center gap-2 bg-red-50 text-red-600 px-3 py-1.5 rounded-full text-xs font-bold mb-3">
                            <Sparkles className="w-4 h-4" />
                            Expense Management
                        </div>

                        <h1 className="text-3xl font-black text-slate-900">
                            Admin Expense
                        </h1>

                        <p className="text-sm text-slate-400 mt-2">
                            Kelola semua pengeluaran outlet
                        </p>
                    </div>

                    <button
                        onClick={() =>
                            setOpenModal(
                                true,
                            )
                        }
                        className="bg-gradient-to-r from-red-500 to-rose-600 hover:opacity-90 transition-all text-white px-6 py-4 rounded-2xl font-bold flex items-center justify-center gap-2"
                    >
                        <Plus className="w-5 h-5" />
                        Tambah Expense
                    </button>
                </div>

                <div className="grid md:grid-cols-3 gap-5">
                    <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-xs uppercase tracking-wider font-bold text-slate-400">
                                Total Expense
                            </p>

                            <h2 className="text-4xl font-black text-slate-900 mt-2">
                                {
                                    expenses.length
                                }
                            </h2>
                        </div>

                        <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
                            <ClipboardList className="w-8 h-8" />
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-xs uppercase tracking-wider font-bold text-slate-400">
                                Total Pengeluaran
                            </p>

                            <h2 className="text-2xl font-black text-red-600 mt-2">
                                Rp{" "}
                                {totalExpense.toLocaleString(
                                    "id-ID",
                                )}
                            </h2>
                        </div>

                        <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
                            <BadgeDollarSign className="w-8 h-8" />
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-xs uppercase tracking-wider font-bold text-slate-400">
                                Outlet
                            </p>

                            <h2 className="text-4xl font-black text-slate-900 mt-2">
                                {
                                    outlets.length
                                }
                            </h2>
                        </div>

                        <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
                            <Wallet className="w-8 h-8" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

                        <input
                            type="text"
                            placeholder="Cari expense..."
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
                            className="w-full bg-slate-50 rounded-2xl py-4 pl-11 pr-4 border border-slate-100 outline-none focus:ring-2 focus:ring-red-500/20"
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="bg-white rounded-3xl border border-slate-100 p-20 flex items-center justify-center">
                        <Loader2 className="w-10 h-10 animate-spin text-red-600" />
                    </div>
                ) : (
                    <div className="grid xl:grid-cols-2 gap-6">
                        {filteredExpenses.map(
                            (
                                expense,
                            ) => (
                                <div
                                    key={
                                        expense.id
                                    }
                                    className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <h2 className="text-xl font-black text-slate-900">
                                                {
                                                    expense.title
                                                }
                                            </h2>

                                            <p className="text-sm text-slate-400 mt-2">
                                                {expense.description ||
                                                    "Tidak ada deskripsi"}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() =>
                                                    handleEdit(
                                                        expense,
                                                    )
                                                }
                                                className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </button>

                                            <button
                                                onClick={() =>
                                                    handleDelete(
                                                        expense.id,
                                                    )
                                                }
                                                className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-4 mt-6">
                                        <div className="bg-slate-50 rounded-2xl p-4">
                                            <p className="text-xs uppercase font-bold tracking-wide text-slate-400">
                                                Amount
                                            </p>

                                            <h3 className="text-2xl font-black text-red-600 mt-2">
                                                Rp{" "}
                                                {expense.amount.toLocaleString(
                                                    "id-ID",
                                                )}
                                            </h3>
                                        </div>

                                        <div className="bg-slate-50 rounded-2xl p-4">
                                            <p className="text-xs uppercase font-bold tracking-wide text-slate-400">
                                                Tanggal
                                            </p>

                                            <div className="flex items-center gap-2 mt-2 text-slate-700 font-bold">
                                                <CalendarDays className="w-4 h-4" />

                                                {new Date(
                                                    expense.createdAt,
                                                ).toLocaleDateString(
                                                    "id-ID",
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ),
                        )}
                    </div>
                )}
            </div>

            {openModal && (
                <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="w-full max-w-xl bg-white rounded-3xl p-6 shadow-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-2xl font-black text-slate-900">
                                    {editingId
                                        ? "Edit Expense"
                                        : "Tambah Expense"}
                                </h2>

                                <p className="text-sm text-slate-400 mt-1">
                                    Kelola data pengeluaran
                                </p>
                            </div>

                            <button
                                onClick={
                                    resetForm
                                }
                                className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form
                            onSubmit={
                                handleSubmit
                            }
                            className="space-y-5"
                        >
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700">
                                    Nama Expense
                                </label>

                                <input
                                    type="text"
                                    name="title"
                                    value={
                                        form.title
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    className="w-full bg-slate-50 rounded-2xl p-4 border border-slate-200 outline-none focus:ring-2 focus:ring-red-500/20"
                                    placeholder="Masukkan nama expense"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700">
                                    Deskripsi
                                </label>

                                <textarea
                                    name="description"
                                    value={
                                        form.description
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    rows={4}
                                    className="w-full bg-slate-50 rounded-2xl p-4 border border-slate-200 outline-none focus:ring-2 focus:ring-red-500/20 resize-none"
                                    placeholder="Deskripsi expense"
                                />
                            </div>

                            <div className="grid md:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">
                                        Amount
                                    </label>

                                    <input
                                        type="number"
                                        name="amount"
                                        value={
                                            form.amount
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        className="w-full bg-slate-50 rounded-2xl p-4 border border-slate-200 outline-none focus:ring-2 focus:ring-red-500/20"
                                        placeholder="Jumlah pengeluaran"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">
                                        Outlet
                                    </label>

                                    <select
                                        name="outletId"
                                        value={
                                            form.outletId
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        className="w-full bg-slate-50 rounded-2xl p-4 border border-slate-200 outline-none focus:ring-2 focus:ring-red-500/20"
                                    >
                                        <option value="">
                                            Pilih Outlet
                                        </option>

                                        {outlets.map(
                                            (
                                                outlet,
                                            ) => (
                                                <option
                                                    key={
                                                        outlet.id
                                                    }
                                                    value={
                                                        outlet.id
                                                    }
                                                >
                                                    {
                                                        outlet.name
                                                    }
                                                </option>
                                            ),
                                        )}
                                    </select>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={
                                    submitting
                                }
                                className="w-full bg-gradient-to-r from-red-500 to-rose-600 hover:opacity-90 disabled:opacity-50 transition-all text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2"
                            >
                                {submitting ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <Plus className="w-5 h-5" />

                                        {editingId
                                            ? "Update Expense"
                                            : "Tambah Expense"}
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