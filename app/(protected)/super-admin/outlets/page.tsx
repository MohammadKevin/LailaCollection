"use client";

import React, { useEffect, useMemo, useState } from "react";

import Image from "next/image";

import {
  Store,
  Plus,
  Search,
  MapPin,
  Phone,
  Users,
  Loader2,
  Edit,
  Trash2,
  X,
  ImagePlus,
} from "lucide-react";

import { toast } from "sonner";

import api from "@/lib/api";

type Outlet = {
  id: string;
  name: string;
  address?: string;
  noTelp?: string;
  qrisImage?: string;
  users?: any[];
};

const initialForm = {
  name: "",
  address: "",
  noTelp: "",
};

export default function OutletsPage() {
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);

  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");

  const [outlets, setOutlets] = useState<Outlet[]>([]);

  const [openCreate, setOpenCreate] = useState(false);

  const [openEdit, setOpenEdit] = useState(false);

  const [selectedOutlet, setSelectedOutlet] =
    useState<Outlet | null>(null);

  const [qrisImage, setQrisImage] =
    useState<File | null>(null);

  const [editQrisImage, setEditQrisImage] =
    useState<File | null>(null);

  const [imagePreview, setImagePreview] =
    useState("");

  const [editImagePreview, setEditImagePreview] =
    useState("");

  const [form, setForm] = useState(initialForm);

  const [editForm, setEditForm] =
    useState(initialForm);

  useEffect(() => {
    fetchOutlets();
  }, []);

  useEffect(() => {
    return () => {
      clearPreview(imagePreview);
      clearPreview(editImagePreview);
    };
  }, [imagePreview, editImagePreview]);

  const clearPreview = (preview: string) => {
    if (preview && preview.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }
  };

  const fetchOutlets = async () => {
    try {
      setLoading(true);

      setError("");

      const response = await api.get("/outlets");

      setOutlets(
        response.data?.data || response.data || []
      );
    } catch (error: any) {
      console.error(error);

      setError(
        error?.response?.data?.message ||
          "Gagal mengambil data outlet"
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredOutlets = useMemo(() => {
    return outlets.filter((outlet) =>
      outlet.name
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [outlets, search]);

  const resetCreateForm = () => {
    setForm(initialForm);

    setQrisImage(null);

    clearPreview(imagePreview);

    setImagePreview("");
  };

  const resetEditForm = () => {
    setEditForm(initialForm);

    setEditQrisImage(null);

    clearPreview(editImagePreview);

    setEditImagePreview("");

    setSelectedOutlet(null);
  };

  const handleImageChange = (
    file: File,
    type: "create" | "edit"
  ) => {
    const preview = URL.createObjectURL(file);

    if (type === "create") {
      clearPreview(imagePreview);

      setQrisImage(file);

      setImagePreview(preview);
    } else {
      clearPreview(editImagePreview);

      setEditQrisImage(file);

      setEditImagePreview(preview);
    }
  };

  const handleCreateOutlet = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      setSubmitting(true);

      const formData = new FormData();

      formData.append("name", form.name);

      formData.append("address", form.address);

      formData.append("noTelp", form.noTelp);

      if (qrisImage) {
        formData.append("qrisImage", qrisImage);
      }

      await api.post("/outlets", formData, {
        headers: {
          "Content-Type":
            "multipart/form-data",
        },
      });

      toast.success("Outlet berhasil dibuat");

      setOpenCreate(false);

      resetCreateForm();

      fetchOutlets();
    } catch (error: any) {
      console.error(error);

      toast.error(
        error?.response?.data?.message ||
          "Gagal membuat outlet"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenEditModal = (
    outlet: Outlet
  ) => {
    setSelectedOutlet(outlet);

    setEditForm({
      name: outlet.name || "",
      address: outlet.address || "",
      noTelp: outlet.noTelp || "",
    });

    setEditImagePreview(
      outlet.qrisImage || ""
    );

    setOpenEdit(true);
  };

  const handleEditOutlet = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!selectedOutlet) return;

    try {
      setSubmitting(true);

      const formData = new FormData();

      formData.append("name", editForm.name);

      formData.append(
        "address",
        editForm.address
      );

      formData.append(
        "noTelp",
        editForm.noTelp
      );

      if (editQrisImage) {
        formData.append(
          "qrisImage",
          editQrisImage
        );
      }

      await api.patch(
        `/outlets/${selectedOutlet.id}`,
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      toast.success("Outlet berhasil diupdate");

      setOpenEdit(false);

      resetEditForm();

      fetchOutlets();
    } catch (error: any) {
      console.error(error);

      toast.error(
        error?.response?.data?.message ||
          "Gagal update outlet"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteOutlet = async (
    id: string,
    name: string
  ) => {
    const confirmed = confirm(
      `Hapus outlet ${name}?`
    );

    if (!confirmed) return;

    try {
      await api.delete(`/outlets/${id}`);

      toast.success("Outlet berhasil dihapus");

      fetchOutlets();
    } catch (error: any) {
      console.error(error);

      toast.error(
        error?.response?.data?.message ||
          "Gagal menghapus outlet"
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-6">
      <div className="space-y-5">
        {/* HEADER */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              Outlet
            </h1>

            <p className="text-slate-500 mt-2">
              Kelola seluruh outlet bisnis
            </p>
          </div>

          <button
            onClick={() => setOpenCreate(true)}
            className="h-12 px-5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl flex items-center gap-2 transition"
          >
            <Plus className="w-5 h-5" />
            Tambah Outlet
          </button>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <StatCard
            title="Total Outlet"
            value={outlets.length}
            icon={<Store className="w-5 h-5" />}
          />

          <StatCard
            title="Total Admin"
            value={outlets.reduce(
              (acc, item) =>
                acc + (item.users?.length || 0),
              0
            )}
            icon={<Users className="w-5 h-5" />}
          />

          <StatCard
            title="Outlet Aktif"
            value={outlets.length}
            icon={<Store className="w-5 h-5" />}
          />
        </div>

        {/* SEARCH */}
        <div className="bg-white border border-slate-200 rounded-3xl p-4">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              placeholder="Cari outlet..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="w-full h-12 border border-slate-300 rounded-2xl pl-11 pr-4 outline-none focus:border-slate-500"
            />
          </div>
        </div>

        {/* ERROR */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-2xl px-4 py-3">
            {error}
          </div>
        )}

        {/* CONTENT */}
        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden">
          {loading ? (
            <div className="h-[400px] flex items-center justify-center">
              <Loader2 className="w-10 h-10 animate-spin text-slate-500" />
            </div>
          ) : filteredOutlets.length === 0 ? (
            <div className="h-[400px] flex flex-col items-center justify-center">
              <Store className="w-16 h-16 text-slate-300" />

              <h2 className="mt-4 text-lg font-semibold text-slate-700">
                Tidak ada outlet
              </h2>
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 p-5">
              {filteredOutlets.map((outlet) => (
                <div
                  key={outlet.id}
                  className="border border-slate-200 rounded-3xl overflow-hidden bg-white"
                >
                  <div className="relative h-48 bg-slate-100">
                    {outlet.qrisImage ? (
                      <Image
                        src={outlet.qrisImage}
                        alt={outlet.name}
                        fill
                        className="object-cover"
                        sizes="100vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Store className="w-14 h-14 text-slate-300" />
                      </div>
                    )}
                  </div>

                  <div className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="text-xl font-bold text-slate-800">
                          {outlet.name}
                        </h2>

                        <div className="mt-4 space-y-3 text-sm text-slate-500">
                          <div className="flex items-start gap-2">
                            <MapPin className="w-4 h-4 mt-0.5" />

                            <span>
                              {outlet.address || "-"}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4" />

                            <span>
                              {outlet.noTelp || "-"}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4" />

                            <span>
                              {outlet.users?.length || 0}{" "}
                              Admin
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            handleOpenEditModal(
                              outlet
                            )
                          }
                          className="w-11 h-11 rounded-2xl border border-slate-200 hover:bg-slate-100 flex items-center justify-center"
                        >
                          <Edit className="w-4 h-4 text-slate-600" />
                        </button>

                        <button
                          onClick={() =>
                            handleDeleteOutlet(
                              outlet.id,
                              outlet.name
                            )
                          }
                          className="w-11 h-11 rounded-2xl border border-red-200 hover:bg-red-50 flex items-center justify-center"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* CREATE MODAL */}
      {openCreate && (
        <Modal
          title="Tambah Outlet"
          onClose={() => {
            setOpenCreate(false);

            resetCreateForm();
          }}
        >
          <form
            onSubmit={handleCreateOutlet}
            className="space-y-4"
          >
            <Input
              placeholder="Nama outlet"
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value,
                })
              }
            />

            <textarea
              placeholder="Alamat"
              value={form.address}
              onChange={(e) =>
                setForm({
                  ...form,
                  address: e.target.value,
                })
              }
              className="w-full min-h-[120px] border border-slate-300 rounded-2xl px-4 py-3 outline-none"
            />

            <Input
              placeholder="No Telepon"
              value={form.noTelp}
              onChange={(e) =>
                setForm({
                  ...form,
                  noTelp: e.target.value,
                })
              }
            />

            <ImageUpload
              preview={imagePreview}
              onChange={(file) =>
                handleImageChange(
                  file,
                  "create"
                )
              }
            />

            <button
              type="submit"
              disabled={submitting}
              className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl"
            >
              {submitting
                ? "Menyimpan..."
                : "Simpan Outlet"}
            </button>
          </form>
        </Modal>
      )}

      {/* EDIT MODAL */}
      {openEdit && (
        <Modal
          title="Edit Outlet"
          onClose={() => {
            setOpenEdit(false);

            resetEditForm();
          }}
        >
          <form
            onSubmit={handleEditOutlet}
            className="space-y-4"
          >
            <Input
              placeholder="Nama outlet"
              value={editForm.name}
              onChange={(e) =>
                setEditForm({
                  ...editForm,
                  name: e.target.value,
                })
              }
            />

            <textarea
              placeholder="Alamat"
              value={editForm.address}
              onChange={(e) =>
                setEditForm({
                  ...editForm,
                  address: e.target.value,
                })
              }
              className="w-full min-h-[120px] border border-slate-300 rounded-2xl px-4 py-3 outline-none"
            />

            <Input
              placeholder="No Telepon"
              value={editForm.noTelp}
              onChange={(e) =>
                setEditForm({
                  ...editForm,
                  noTelp: e.target.value,
                })
              }
            />

            <ImageUpload
              preview={editImagePreview}
              onChange={(file) =>
                handleImageChange(file, "edit")
              }
            />

            <button
              type="submit"
              disabled={submitting}
              className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl"
            >
              {submitting
                ? "Menyimpan..."
                : "Update Outlet"}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-5 flex items-center justify-between">
      <div>
        <p className="text-sm text-slate-500">
          {title}
        </p>

        <h2 className="text-3xl font-bold text-slate-800 mt-2">
          {value}
        </h2>
      </div>

      <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center">
        {icon}
      </div>
    </div>
  );
}

function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 bg-black/40 overflow-y-auto p-4 flex items-center justify-center">
      <div className="w-full max-w-lg bg-white rounded-3xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold">
            {title}
          </h2>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl hover:bg-slate-100 flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}

function Input({
  placeholder,
  value,
  onChange,
}: {
  placeholder: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
}) {
  return (
    <input
      required
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full h-12 border border-slate-300 rounded-2xl px-4 outline-none focus:border-slate-500"
    />
  );
}

function ImageUpload({
  preview,
  onChange,
}: {
  preview: string;
  onChange: (file: File) => void;
}) {
  return (
    <label className="h-52 border-2 border-dashed border-slate-300 rounded-3xl overflow-hidden flex items-center justify-center cursor-pointer relative">
      {preview ? (
        <Image
          src={preview}
          alt="Preview"
          fill
          className="object-cover"
          sizes="100vw"
        />
      ) : (
        <div className="flex flex-col items-center">
          <ImagePlus className="w-10 h-10 text-slate-400" />

          <p className="text-sm text-slate-500 mt-3">
            Upload QRIS
          </p>
        </div>
      )}

      <input
        hidden
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];

          if (!file) return;

          onChange(file);
        }}
      />
    </label>
  );
}