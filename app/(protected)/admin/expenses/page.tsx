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
    Building2,
    ReceiptText,
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
                    expenseRes,
                    outletRes,
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
                        expenseRes.data,
                    )
                        ? expenseRes.data
                        : expenseRes
                              .data
                              ?.data || [],
                );

                setOutlets(
                    Array.isArray(
                        outletRes.data,
                    )
                        ? outletRes.data
                        : outletRes
                              .data
                              ?.data || [],
                );
            } catch (
                error: any
            ) {
                console.error(
                    error,
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
                    total,
                    expense,
                ) =>
                    total +
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
                    error,
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
            const confirmed =
                confirm(
                    "Hapus expense ini?",
                );

            if (
                !confirmed
            )
                return;

            try {
                await api.delete(
                    `/expenses/${id}`,
                );

                fetchData();

                alert(
                    "Expense berhasil dihapus",
                );
            } catch (
                error
            ) {
                console.error(
                    error,
                );

                alert(
                    "Gagal menghapus expense",
                );
            }
        };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-rose-50 p-4 md:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="relative overflow-hidden bg-white border border-slate-100 rounded-[32px] p-8 shadow-sm">
                    <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-rose-100 to-red-50 rounded-full blur-3xl opacity-70" />

                    <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                        <div>
                            <div className="inline-flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-full text-xs font-bold mb-4">
                                <Sparkles className="w-4 h-4" />
                                Expense Management
                            </div>

                            <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">
                                Kelola Expense
                                <span className="block text-red-600">
                                    Lebih Modern
                                </span>
                            </h1>

                            <p className="text-slate-500 mt-4 max-w-xl">
                                Pantau seluruh
                                pengeluaran outlet
                                dengan tampilan
                                modern, cepat,
                                dan elegan.
                            </p>
                        </div>

                        <button
                            onClick={() =>
                                setOpenModal(
                                    true,
                                )
                            }
                            className="bg-gradient-to-r from-red-500 to-rose-600 hover:scale-[1.02] active:scale-95 transition-all text-white px-7 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-lg shadow-red-200"
                        >
                            <Plus className="w-5 h-5" />
                            Tambah Expense
                        </button>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-5">
                    <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                    Total Expense
                                </p>

                                <h2 className="text-4xl font-black text-slate-900 mt-3">
                                    {
                                        expenses.length
                                    }
                                </h2>
                            </div>

                            <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
                                <ClipboardList className="w-8 h-8" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                    Total Pengeluaran
                                </p>

                                <h2 className="text-3xl font-black text-red-600 mt-3">
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
                    </div>

                    <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                    Total Outlet
                                </p>

                                <h2 className="text-4xl font-black text-slate-900 mt-3">
                                    {
                                        outlets.length
                                    }
                                </h2>
                            </div>

                            <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
                                <Building2 className="w-8 h-8" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />

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
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-red-500/20"
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="bg-white rounded-3xl border border-slate-100 p-20 flex items-center justify-center">
                        <Loader2 className="w-10 h-10 animate-spin text-red-600" />
                    </div>
                ) : filteredExpenses
                      .length === 0 ? (
                    <div className="bg-white rounded-3xl border border-slate-100 p-20 text-center">
                        <ReceiptText className="w-14 h-14 text-slate-300 mx-auto mb-4" />

                        <h2 className="text-2xl font-black text-slate-900">
                            Expense Tidak
                            Ditemukan
                        </h2>

                        <p className="text-slate-400 mt-2">
                            Belum ada data
                            expense tersedia
                        </p>
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
                                    className="group bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <h2 className="text-2xl font-black text-slate-900">
                                                {
                                                    expense.title
                                                }
                                            </h2>

                                            <p className="text-slate-400 mt-2 text-sm">
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
                                                className="w-11 h-11 rounded-2xl bg-blue-50 hover:bg-blue-100 text-blue-600 flex items-center justify-center transition-all"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </button>

                                            <button
                                                onClick={() =>
                                                    handleDelete(
                                                        expense.id,
                                                    )
                                                }
                                                className="w-11 h-11 rounded-2xl bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center transition-all"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-4 mt-6">
                                        <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-2xl p-5">
                                            <p className="text-xs uppercase font-bold tracking-wider text-red-400">
                                                Amount
                                            </p>

                                            <h3 className="text-3xl font-black text-red-600 mt-2">
                                                Rp{" "}
                                                {expense.amount.toLocaleString(
                                                    "id-ID",
                                                )}
                                            </h3>
                                        </div>

                                        <div className="bg-slate-50 rounded-2xl p-5">
                                            <p className="text-xs uppercase font-bold tracking-wider text-slate-400">
                                                Tanggal
                                            </p>

                                            <div className="flex items-center gap-2 mt-3 font-bold text-slate-700">
                                                <CalendarDays className="w-4 h-4" />

                                                {new Date(
                                                    expense.createdAt,
                                                ).toLocaleDateString(
                                                    "id-ID",
                                                )}
                                            </div>

                                            <p className="text-sm text-slate-500 mt-3">
                                                Outlet:{" "}
                                                {expense
                                                    .outlet
                                                    ?.name ||
                                                    "-"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ),
                        )}
                    </div>
                )}

                {openModal && (
                    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
                        <div className="w-full max-w-2xl bg-white rounded-[32px] p-7 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                            <div className="flex items-start justify-between mb-8">
                                <div>
                                    <h2 className="text-3xl font-black text-slate-900">
                                        {editingId
                                            ? "Edit Expense"
                                            : "Tambah Expense"}
                                    </h2>

                                    <p className="text-slate-400 mt-2">
                                        Kelola data
                                        pengeluaran
                                        outlet
                                    </p>
                                </div>

                                <button
                                    onClick={
                                        resetForm
                                    }
                                    className="w-11 h-11 rounded-2xl bg-slate-100 hover:bg-slate-200 transition-all flex items-center justify-center"
                                >
                                    <X className="w-5 h-5 text-slate-600" />
                                </button>
                            </div>

                            <form
                                onSubmit={
                                    handleSubmit
                                }
                                className="space-y-5"
                            >
                                <div>
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
                                        placeholder="Masukkan nama expense"
                                        className="w-full mt-2 bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-red-500/20"
                                    />
                                </div>

                                <div>
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
                                        placeholder="Masukkan deskripsi"
                                        className="w-full mt-2 bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 outline-none resize-none focus:ring-2 focus:ring-red-500/20"
                                    />
                                </div>

                                <div className="grid md:grid-cols-2 gap-5">
                                    <div>
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
                                            placeholder="Jumlah pengeluaran"
                                            className="w-full mt-2 bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-red-500/20"
                                        />
                                    </div>

                                    <div>
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
                                            className="w-full mt-2 bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-red-500/20"
                                        >
                                            <option value="">
                                                Pilih
                                                Outlet
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
                                    className="w-full bg-gradient-to-r from-red-500 to-rose-600 hover:opacity-90 disabled:opacity-50 transition-all text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 mt-4"
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
        </div>
    );
}