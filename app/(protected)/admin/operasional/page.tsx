"use client";

import React, { useEffect, useMemo, useState } from "react";

import {
  Building2,
  CalendarDays,
  ClipboardList,
  Loader2,
  Pencil,
  Plus,
  ReceiptText,
  Search,
  Trash2,
  Wallet,
  X,
} from "lucide-react";

import api from "@/lib/api";

type Outlet = {
  id: string;
  name: string;
};

type Expense = {
  id: string;
  title: string;
  description?: string;
  type?: string;
  amount: number;
  createdAt: string;

  outlet?: {
    id: string;
    name: string;
  };
};

type ExpenseForm = {
  title: string;
  description: string;
  type: string;
  amount: string;
  outletId: string;
};

const initialForm: ExpenseForm = {
  title: "",
  description: "",
  type: "",
  amount: "",
  outletId: "",
};

export default function OperasionalPage() {
  const [loading, setLoading] = useState(true);

  const [submitting, setSubmitting] = useState(false);

  const [expenses, setExpenses] = useState<Expense[]>([]);

  const [outlets, setOutlets] = useState<Outlet[]>([]);

  const [search, setSearch] = useState("");

  const [openModal, setOpenModal] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState<ExpenseForm>(initialForm);

  const fetchData = async () => {
    try {
      setLoading(true);

      const [expenseRes, outletRes] = await Promise.all([
        api.get("/expenses"),

        api.get("/outlets"),
      ]);

      setExpenses(expenseRes.data || []);

      setOutlets(outletRes.data || []);
    } catch (error: any) {
      console.error(error);

      alert(error?.response?.data?.message || "Gagal mengambil data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredExpenses = useMemo(() => {
    return expenses.filter(
      (expense) =>
        expense.title.toLowerCase().includes(search.toLowerCase()) ||
        expense.type?.toLowerCase().includes(search.toLowerCase()),
    );
  }, [expenses, search]);

  const totalExpense = useMemo(() => {
    return expenses.reduce((total, expense) => total + expense.amount, 0);
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
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSubmitting(true);

      const payload = {
        title: form.title,

        description: form.description,

        type: form.type,

        amount: Number(form.amount),

        outletId: form.outletId,
      };

      if (editingId) {
        await api.patch(`/expenses/${editingId}`, payload);

        alert("Expense berhasil diupdate");
      } else {
        await api.post("/expenses", payload);

        alert("Expense berhasil dibuat");
      }

      resetForm();

      fetchData();
    } catch (error: any) {
      console.error(error);

      alert(error?.response?.data?.message || "Gagal menyimpan data");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (expense: Expense) => {
    setEditingId(expense.id);

    setForm({
      title: expense.title,

      description: expense.description || "",

      type: expense.type || "",

      amount: String(expense.amount),

      outletId: expense.outlet?.id || "",
    });

    setOpenModal(true);
  };

  const handleDelete = async (id: string) => {
    const confirmed = confirm("Hapus expense ini?");

    if (!confirmed) return;

    try {
      await api.delete(`/expenses/${id}`);

      fetchData();

      alert("Expense berhasil dihapus");
    } catch (error: any) {
      console.error(error);

      alert(error?.response?.data?.message || "Gagal menghapus data");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div>
            <div className="inline-flex items-center gap-2 bg-slate-100 text-slate-700 px-3 py-1.5 rounded-full text-xs font-semibold mb-3">
              <Wallet className="w-4 h-4" />
              Operasional Management
            </div>

            <h1 className="text-3xl font-bold text-slate-900">Operasional</h1>

            <p className="text-sm text-slate-400 mt-2">
              Kelola data operasional outlet
            </p>
          </div>

          <button
            onClick={() => setOpenModal(true)}
            className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-2xl font-semibold flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Tambah Operasional
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide font-semibold text-slate-400">
                  Total Operasional
                </p>

                <h2 className="text-3xl font-bold text-slate-900 mt-2">
                  {expenses.length}
                </h2>
              </div>

              <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center">
                <ClipboardList className="w-7 h-7 text-slate-700" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide font-semibold text-slate-400">
                  Total Pengeluaran
                </p>

                <h2 className="text-2xl font-bold text-slate-900 mt-2">
                  Rp {totalExpense.toLocaleString("id-ID")}
                </h2>
              </div>

              <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center">
                <Wallet className="w-7 h-7 text-slate-700" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide font-semibold text-slate-400">
                  Total Outlet
                </p>

                <h2 className="text-3xl font-bold text-slate-900 mt-2">
                  {outlets.length}
                </h2>
              </div>

              <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center">
                <Building2 className="w-7 h-7 text-slate-700" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />

            <input
              type="text"
              placeholder="Cari expense..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-slate-300"
            />
          </div>
        </div>

        {loading ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-20 flex items-center justify-center">
            <Loader2 className="w-10 h-10 animate-spin text-slate-700" />
          </div>
        ) : filteredExpenses.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-20 text-center">
            <ReceiptText className="w-14 h-14 text-slate-300 mx-auto mb-4" />

            <h2 className="text-2xl font-bold text-slate-900">
              Operasional Tidak Ditemukan
            </h2>

            <p className="text-slate-400 mt-2">Belum ada data operasional</p>
          </div>
        ) : (
          <div className="grid xl:grid-cols-2 gap-5">
            {filteredExpenses.map((expense) => (
              <div
                key={expense.id}
                className="bg-white border border-slate-200 rounded-2xl p-6"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      {expense.title}
                    </h2>

                    <p className="text-sm text-slate-400 mt-2">
                      {expense.description || "Tidak ada deskripsi"}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(expense)}
                      className="w-11 h-11 rounded-2xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center"
                    >
                      <Pencil className="w-4 h-4 text-slate-700" />
                    </button>

                    <button
                      onClick={() => handleDelete(expense.id)}
                      className="w-11 h-11 rounded-2xl bg-red-50 hover:bg-red-100 flex items-center justify-center"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mt-6">
                  <div className="bg-slate-100 rounded-2xl p-5">
                    <p className="text-xs uppercase tracking-wide font-semibold text-slate-500">
                      Amount
                    </p>

                    <h3 className="text-2xl font-bold text-slate-900 mt-2">
                      Rp {expense.amount.toLocaleString("id-ID")}
                    </h3>

                    <p className="text-sm text-slate-500 mt-3">
                      Type: {expense.type || "-"}
                    </p>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
                    <p className="text-xs uppercase tracking-wide font-semibold text-slate-500">
                      Tanggal
                    </p>

                    <div className="flex items-center gap-2 mt-3 text-slate-700 font-semibold">
                      <CalendarDays className="w-4 h-4" />

                      {new Date(expense.createdAt).toLocaleDateString("id-ID")}
                    </div>

                    <p className="text-sm text-slate-500 mt-3">
                      Outlet: {expense.outlet?.name || "-"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {openModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-white rounded-2xl p-7">
              <div className="flex items-start justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-slate-900">
                    {editingId ? "Edit Expense" : "Tambah Expense"}
                  </h2>

                  <p className="text-slate-400 mt-2">Kelola data operasional</p>
                </div>

                <button
                  onClick={resetForm}
                  className="w-11 h-11 rounded-2xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center"
                >
                  <X className="w-5 h-5 text-slate-600" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="text-sm font-semibold text-slate-700">
                    Nama Expense
                  </label>

                  <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    className="w-full mt-2 bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 outline-none"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-700">
                    Deskripsi
                  </label>

                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full mt-2 bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 outline-none resize-none"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="text-sm font-semibold text-slate-700">
                      Type
                    </label>

                    <input
                      type="text"
                      name="type"
                      value={form.type}
                      onChange={handleChange}
                      className="w-full mt-2 bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-slate-700">
                      Amount
                    </label>

                    <input
                      type="number"
                      name="amount"
                      value={form.amount}
                      onChange={handleChange}
                      className="w-full mt-2 bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-700">
                    Outlet
                  </label>

                  <select
                    name="outletId"
                    value={form.outletId}
                    onChange={handleChange}
                    className="w-full mt-2 bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 outline-none"
                  >
                    <option value="">Pilih Outlet</option>

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
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-2xl font-semibold flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5" />

                      {editingId ? "Update Expense" : "Tambah Expense"}
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
