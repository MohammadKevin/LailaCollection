"use client";

import React, { useEffect, useMemo, useState } from "react";

import {
  BadgePercent,
  Calendar,
  Loader2,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";

import { toast } from "sonner";

import api from "@/lib/api";

type Discount = {
  id: string;

  name: string;

  code: string;

  type: "PERCENTAGE" | "FIXED";

  value: number;

  minPurchase?: number;

  maxDiscount?: number;

  startDate: string;

  endDate: string;

  isActive: boolean;

  createdAt: string;
};

const initialForm = {
  name: "",
  code: "",
  type: "PERCENTAGE",
  value: "",
  minPurchase: "",
  maxDiscount: "",
  startDate: "",
  endDate: "",
};

export default function DiscountsPage() {
  const [loading, setLoading] = useState(true);

  const [submitting, setSubmitting] = useState(false);

  const [deletingId, setDeletingId] = useState("");

  const [discounts, setDiscounts] = useState<Discount[]>([]);

  const [search, setSearch] = useState("");

  const [openModal, setOpenModal] = useState(false);

  const [editingDiscount, setEditingDiscount] =
    useState<Discount | null>(null);

  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    fetchDiscounts();
  }, []);

  const fetchDiscounts = async () => {
    try {
      setLoading(true);

      const response = await api.get("/discounts");

      setDiscounts(
        response.data.data || response.data || []
      );
    } catch (error: any) {
      console.error(error);

      toast.error(
        error?.response?.data?.message ||
          "Gagal mengambil discount"
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredDiscounts = useMemo(() => {
    return discounts.filter((discount) => {
      const keyword = search.toLowerCase();

      return (
        discount.name
          .toLowerCase()
          .includes(keyword) ||
        discount.code
          .toLowerCase()
          .includes(keyword)
      );
    });
  }, [discounts, search]);

  const resetForm = () => {
    setEditingDiscount(null);

    setForm(initialForm);
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      setSubmitting(true);

      const payload = {
        ...form,

        value: Number(form.value),

        minPurchase: form.minPurchase
          ? Number(form.minPurchase)
          : null,

        maxDiscount: form.maxDiscount
          ? Number(form.maxDiscount)
          : null,
      };

      if (editingDiscount) {
        await api.patch(
          `/discounts/${editingDiscount.id}`,
          payload
        );

        toast.success(
          "Discount berhasil diupdate"
        );
      } else {
        await api.post("/discounts", payload);

        toast.success(
          "Discount berhasil dibuat"
        );
      }

      resetForm();

      setOpenModal(false);

      fetchDiscounts();
    } catch (error: any) {
      console.error(error);

      toast.error(
        error?.response?.data?.message ||
          "Gagal menyimpan discount"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (discount: Discount) => {
    setEditingDiscount(discount);

    setForm({
      name: discount.name,
      code: discount.code,
      type: discount.type,
      value: String(discount.value),
      minPurchase: String(
        discount.minPurchase || ""
      ),
      maxDiscount: String(
        discount.maxDiscount || ""
      ),
      startDate:
        discount.startDate.split("T")[0],
      endDate:
        discount.endDate.split("T")[0],
    });

    setOpenModal(true);
  };

  const handleDelete = async (
    id: string
  ) => {
    const confirmed = confirm(
      "Hapus discount?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);

      await api.delete(`/discounts/${id}`);

      toast.success(
        "Discount berhasil dihapus"
      );

      fetchDiscounts();
    } catch (error: any) {
      console.error(error);

      toast.error(
        error?.response?.data?.message ||
          "Gagal menghapus discount"
      );
    } finally {
      setDeletingId("");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">
      {/* HEADER */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Discount
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            Kelola promo dan diskon toko
          </p>
        </div>

        <button
          onClick={() => {
            resetForm();

            setOpenModal(true);
          }}
          className="h-11 px-5 bg-slate-900 text-white rounded-2xl flex items-center gap-2 hover:bg-slate-800 transition"
        >
          <Plus className="w-4 h-4" />
          Tambah Discount
        </button>
      </div>

      {/* SEARCH */}
      <div className="bg-white border border-slate-200 rounded-3xl p-4 mt-5">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />

          <input
            type="text"
            placeholder="Cari discount..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-full h-11 border border-slate-300 rounded-2xl pl-10 pr-4 outline-none"
          />
        </div>
      </div>

      {/* CONTENT */}
      <div className="mt-5">
        {loading ? (
          <div className="bg-white border border-slate-200 rounded-3xl h-[300px] flex items-center justify-center">
            <Loader2 className="w-10 h-10 animate-spin text-slate-500" />
          </div>
        ) : filteredDiscounts.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-3xl h-[300px] flex flex-col items-center justify-center">
            <BadgePercent className="w-16 h-16 text-slate-300" />

            <p className="text-slate-500 mt-4">
              Tidak ada discount
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredDiscounts.map(
              (discount) => (
                <div
                  key={discount.id}
                  className="bg-white border border-slate-200 rounded-3xl p-5"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <BadgePercent className="w-5 h-5 text-pink-500" />

                        <h2 className="font-bold text-lg text-slate-800">
                          {discount.name}
                        </h2>
                      </div>

                      <p className="text-sm text-slate-500 mt-2">
                        Code:{" "}
                        <span className="font-semibold">
                          {discount.code}
                        </span>
                      </p>
                    </div>

                    <div
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        discount.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {discount.isActive
                        ? "Aktif"
                        : "Nonaktif"}
                    </div>
                  </div>

                  <div className="mt-5">
                    <h3 className="text-3xl font-bold text-slate-800">
                      {discount.type ===
                      "PERCENTAGE"
                        ? `${discount.value}%`
                        : `Rp ${discount.value.toLocaleString(
                            "id-ID"
                          )}`}
                    </h3>

                    <p className="text-sm text-slate-500 mt-2">
                      Min transaksi: Rp{" "}
                      {(
                        discount.minPurchase ||
                        0
                      ).toLocaleString(
                        "id-ID"
                      )}
                    </p>
                  </div>

                  <div className="mt-5 flex items-center gap-2 text-sm text-slate-500">
                    <Calendar className="w-4 h-4" />

                    <span>
                      {new Date(
                        discount.startDate
                      ).toLocaleDateString(
                        "id-ID"
                      )}{" "}
                      -{" "}
                      {new Date(
                        discount.endDate
                      ).toLocaleDateString(
                        "id-ID"
                      )}
                    </span>
                  </div>

                  <div className="mt-6 flex items-center gap-3">
                    <button
                      onClick={() =>
                        handleEdit(discount)
                      }
                      className="flex-1 h-11 rounded-2xl border border-slate-300 flex items-center justify-center gap-2 hover:bg-slate-100 transition"
                    >
                      <Pencil className="w-4 h-4" />
                      Edit
                    </button>

                    <button
                      disabled={
                        deletingId ===
                        discount.id
                      }
                      onClick={() =>
                        handleDelete(
                          discount.id
                        )
                      }
                      className="w-11 h-11 rounded-2xl border border-red-200 flex items-center justify-center hover:bg-red-50 transition"
                    >
                      {deletingId ===
                      discount.id ? (
                        <Loader2 className="w-4 h-4 animate-spin text-red-500" />
                      ) : (
                        <Trash2 className="w-4 h-4 text-red-500" />
                      )}
                    </button>
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </div>

      {/* MODAL */}
      {openModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-white rounded-3xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  {editingDiscount
                    ? "Edit Discount"
                    : "Tambah Discount"}
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Kelola promo toko
                </p>
              </div>

              <button
                onClick={() =>
                  setOpenModal(false)
                }
                className="w-10 h-10 rounded-xl hover:bg-slate-100 flex items-center justify-center"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <div>
                <label className="text-sm text-slate-600">
                  Nama Discount
                </label>

                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name: e.target.value,
                    })
                  }
                  className="w-full h-11 border border-slate-300 rounded-2xl px-4 mt-1 outline-none"
                />
              </div>

              <div>
                <label className="text-sm text-slate-600">
                  Code Discount
                </label>

                <input
                  type="text"
                  required
                  value={form.code}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      code: e.target.value,
                    })
                  }
                  className="w-full h-11 border border-slate-300 rounded-2xl px-4 mt-1 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-600">
                    Type
                  </label>

                  <select
                    value={form.type}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        type:
                          e.target.value as any,
                      })
                    }
                    className="w-full h-11 border border-slate-300 rounded-2xl px-4 mt-1 outline-none"
                  >
                    <option value="PERCENTAGE">
                      Percentage
                    </option>

                    <option value="FIXED">
                      Fixed
                    </option>
                  </select>
                </div>

                <div>
                  <label className="text-sm text-slate-600">
                    Nilai
                  </label>

                  <input
                    type="number"
                    required
                    value={form.value}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        value:
                          e.target.value,
                      })
                    }
                    className="w-full h-11 border border-slate-300 rounded-2xl px-4 mt-1 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-600">
                    Min Purchase
                  </label>

                  <input
                    type="number"
                    value={form.minPurchase}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        minPurchase:
                          e.target.value,
                      })
                    }
                    className="w-full h-11 border border-slate-300 rounded-2xl px-4 mt-1 outline-none"
                  />
                </div>

                <div>
                  <label className="text-sm text-slate-600">
                    Max Discount
                  </label>

                  <input
                    type="number"
                    value={form.maxDiscount}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        maxDiscount:
                          e.target.value,
                      })
                    }
                    className="w-full h-11 border border-slate-300 rounded-2xl px-4 mt-1 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-600">
                    Start Date
                  </label>

                  <input
                    type="date"
                    required
                    value={form.startDate}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        startDate:
                          e.target.value,
                      })
                    }
                    className="w-full h-11 border border-slate-300 rounded-2xl px-4 mt-1 outline-none"
                  />
                </div>

                <div>
                  <label className="text-sm text-slate-600">
                    End Date
                  </label>

                  <input
                    type="date"
                    required
                    value={form.endDate}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        endDate:
                          e.target.value,
                      })
                    }
                    className="w-full h-11 border border-slate-300 rounded-2xl px-4 mt-1 outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-medium transition"
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Menyimpan...
                  </span>
                ) : editingDiscount ? (
                  "Update Discount"
                ) : (
                  "Simpan Discount"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );