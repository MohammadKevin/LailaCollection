"use client";

import React, { useEffect, useMemo, useState } from "react";

import {
  Users,
  Plus,
  Search,
  Mail,
  Store,
  Loader2,
  Edit,
  Trash2,
  X,
  Eye,
  EyeOff,
  Lock,
} from "lucide-react";

import api from "@/lib/api";

type Outlet = {
  id: string;
  name: string;
};

type Admin = {
  id: string;
  name: string;
  email: string;
  role: string;
  outlet?: {
    id: string;
    name: string;
  };
};

export default function AdminsPage() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const [admins, setAdmins] = useState<Admin[]>([]);
  const [outlets, setOutlets] = useState<Outlet[]>([]);

  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  const [selectedAdminId, setSelectedAdminId] =
    useState<string | null>(null);

  const [showCreatePassword, setShowCreatePassword] =
    useState(false);

  const [showEditPassword, setShowEditPassword] =
    useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    outletId: "",
  });

  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    password: "",
    outletId: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const [adminsResponse, outletsResponse] =
        await Promise.all([
          api.get("/users/karyawan"),
          api.get("/outlets"),
        ]);

      setAdmins(adminsResponse.data || []);
      setOutlets(outletsResponse.data || []);
    } catch (error: any) {
      console.error(error);

      setError(
        error?.response?.data?.message ||
          "Gagal mengambil data"
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredAdmins = useMemo(() => {
    return admins.filter((admin) => {
      const keyword = search.toLowerCase();

      return (
        admin.name.toLowerCase().includes(keyword) ||
        admin.email.toLowerCase().includes(keyword)
      );
    });
  }, [admins, search]);

  const resetCreateForm = () => {
    setForm({
      name: "",
      email: "",
      password: "",
      outletId: "",
    });
  };

  const handleCreateAdmin = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      setSubmitting(true);

      await api.post("/auth/create-admin", form);

      setOpenCreate(false);

      resetCreateForm();

      fetchData();
    } catch (error: any) {
      console.error(error);

      alert(
        error?.response?.data?.message ||
          "Gagal menambah admin"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenEditModal = (admin: Admin) => {
    setSelectedAdminId(admin.id);

    setEditForm({
      name: admin.name,
      email: admin.email,
      password: "",
      outletId: admin.outlet?.id || "",
    });

    setOpenEdit(true);
  };

  const handleEditAdmin = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!selectedAdminId) return;

    try {
      setSubmitting(true);

      const payload: any = {
        name: editForm.name,
        email: editForm.email,
        outletId: editForm.outletId,
      };

      if (editForm.password.trim()) {
        payload.password = editForm.password;
      }

      await api.patch(
        `/users/${selectedAdminId}`,
        payload
      );

      setOpenEdit(false);

      fetchData();
    } catch (error: any) {
      console.error(error);

      alert(
        error?.response?.data?.message ||
          "Gagal update admin"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteAdmin = async (
    id: string,
    name: string
  ) => {
    const confirmed = confirm(
      `Hapus admin ${name}?`
    );

    if (!confirmed) return;

    try {
      await api.delete(`/users/${id}`);

      fetchData();
    } catch (error: any) {
      console.error(error);

      alert(
        error?.response?.data?.message ||
          "Gagal menghapus admin"
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f6fa] p-4 md:p-6">
      {/* HEADER */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">
            Karyawan
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            Kelola akun admin dan kasir
          </p>
        </div>

        <button
          onClick={() => setOpenCreate(true)}
          className="h-10 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-lg flex items-center gap-2 text-sm font-medium transition"
        >
          <Plus className="w-4 h-4" />
          Tambah Admin
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Total Admin
              </p>

              <h2 className="text-2xl font-semibold text-slate-800 mt-1">
                {admins.length}
              </h2>
            </div>

            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
              <Users className="w-5 h-5 text-slate-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Total Outlet
              </p>

              <h2 className="text-2xl font-semibold text-slate-800 mt-1">
                {outlets.length}
              </h2>
            </div>

            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
              <Store className="w-5 h-5 text-slate-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Admin Aktif
              </p>

              <h2 className="text-2xl font-semibold text-slate-800 mt-1">
                {admins.length}
              </h2>
            </div>

            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <Users className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* SEARCH */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 mt-5">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />

          <input
            type="text"
            placeholder="Cari nama atau email..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-full h-11 bg-white border border-slate-300 rounded-lg pl-10 pr-4 text-sm outline-none focus:border-slate-400"
          />
        </div>
      </div>

      {/* ERROR */}
      {error && (
        <div className="mt-5 bg-red-50 border border-red-200 text-red-600 rounded-lg p-4 text-sm">
          {error}
        </div>
      )}

      {/* TABLE */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden mt-5">
        {loading ? (
          <div className="h-[300px] flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-slate-500" />
          </div>
        ) : filteredAdmins.length === 0 ? (
          <div className="h-[300px] flex items-center justify-center text-sm text-slate-500">
            Tidak ada admin
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-5 py-4 text-sm font-medium text-slate-600">
                    Nama
                  </th>

                  <th className="text-left px-5 py-4 text-sm font-medium text-slate-600">
                    Email
                  </th>

                  <th className="text-left px-5 py-4 text-sm font-medium text-slate-600">
                    Role
                  </th>

                  <th className="text-left px-5 py-4 text-sm font-medium text-slate-600">
                    Outlet
                  </th>

                  <th className="text-right px-5 py-4 text-sm font-medium text-slate-600">
                    Aksi
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredAdmins.map((admin) => (
                  <tr
                    key={admin.id}
                    className="border-b border-slate-100 hover:bg-slate-50"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                          <Users className="w-5 h-5 text-slate-600" />
                        </div>

                        <h3 className="text-sm font-medium text-slate-800">
                          {admin.name}
                        </h3>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-500">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />

                        <span>{admin.email}</span>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span className="px-2 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-medium">
                        {admin.role}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-500">
                      {admin.outlet?.name || "-"}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() =>
                            handleOpenEditModal(admin)
                          }
                          className="w-9 h-9 rounded-lg border border-slate-200 hover:bg-slate-100 flex items-center justify-center"
                        >
                          <Edit className="w-4 h-4 text-slate-600" />
                        </button>

                        <button
                          onClick={() =>
                            handleDeleteAdmin(
                              admin.id,
                              admin.name
                            )
                          }
                          className="w-9 h-9 rounded-lg border border-slate-200 hover:bg-red-50 flex items-center justify-center"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CREATE MODAL */}
      {openCreate && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-lg bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-slate-800">
                  Tambah Admin
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Tambahkan akun admin baru
                </p>
              </div>

              <button
                onClick={() => setOpenCreate(false)}
                className="w-9 h-9 rounded-lg hover:bg-slate-100 flex items-center justify-center"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <form
              onSubmit={handleCreateAdmin}
              className="space-y-4"
            >
              <div>
                <label className="text-sm text-slate-600">
                  Nama
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
                  className="w-full h-11 border border-slate-300 rounded-lg px-4 mt-1 outline-none focus:border-slate-400"
                />
              </div>

              <div>
                <label className="text-sm text-slate-600">
                  Email
                </label>

                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      email: e.target.value,
                    })
                  }
                  className="w-full h-11 border border-slate-300 rounded-lg px-4 mt-1 outline-none focus:border-slate-400"
                />
              </div>

              <div>
                <label className="text-sm text-slate-600">
                  Password
                </label>

                <div className="relative mt-1">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />

                  <input
                    type={
                      showCreatePassword
                        ? "text"
                        : "password"
                    }
                    required
                    value={form.password}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        password: e.target.value,
                      })
                    }
                    className="w-full h-11 border border-slate-300 rounded-lg pl-10 pr-10 outline-none focus:border-slate-400"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowCreatePassword(
                        !showCreatePassword
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {showCreatePassword ? (
                      <EyeOff className="w-4 h-4 text-slate-500" />
                    ) : (
                      <Eye className="w-4 h-4 text-slate-500" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-sm text-slate-600">
                  Outlet
                </label>

                <select
                  required
                  value={form.outletId}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      outletId: e.target.value,
                    })
                  }
                  className="w-full h-11 border border-slate-300 rounded-lg px-4 mt-1 outline-none focus:border-slate-400"
                >
                  <option value="">
                    Pilih Outlet
                  </option>

                  {outlets.map((outlet) => (
                    <option
                      key={outlet.id}
                      value={outlet.id}
                    >
                      {outlet.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-medium transition"
              >
                {submitting
                  ? "Menyimpan..."
                  : "Simpan Admin"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {openEdit && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-lg bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-slate-800">
                  Edit Admin
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Ubah data admin
                </p>
              </div>

              <button
                onClick={() => setOpenEdit(false)}
                className="w-9 h-9 rounded-lg hover:bg-slate-100 flex items-center justify-center"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <form
              onSubmit={handleEditAdmin}
              className="space-y-4"
            >
              <div>
                <label className="text-sm text-slate-600">
                  Nama
                </label>

                <input
                  type="text"
                  required
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      name: e.target.value,
                    })
                  }
                  className="w-full h-11 border border-slate-300 rounded-lg px-4 mt-1 outline-none focus:border-slate-400"
                />
              </div>

              <div>
                <label className="text-sm text-slate-600">
                  Email
                </label>

                <input
                  type="email"
                  required
                  value={editForm.email}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      email: e.target.value,
                    })
                  }
                  className="w-full h-11 border border-slate-300 rounded-lg px-4 mt-1 outline-none focus:border-slate-400"
                />
              </div>

              <div>
                <label className="text-sm text-slate-600">
                  Password Baru
                </label>

                <div className="relative mt-1">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />

                  <input
                    type={
                      showEditPassword
                        ? "text"
                        : "password"
                    }
                    value={editForm.password}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        password: e.target.value,
                      })
                    }
                    className="w-full h-11 border border-slate-300 rounded-lg pl-10 pr-10 outline-none focus:border-slate-400"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowEditPassword(
                        !showEditPassword
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {showEditPassword ? (
                      <EyeOff className="w-4 h-4 text-slate-500" />
                    ) : (
                      <Eye className="w-4 h-4 text-slate-500" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-sm text-slate-600">
                  Outlet
                </label>

                <select
                  required
                  value={editForm.outletId}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      outletId: e.target.value,
                    })
                  }
                  className="w-full h-11 border border-slate-300 rounded-lg px-4 mt-1 outline-none focus:border-slate-400"
                >
                  <option value="">
                    Pilih Outlet
                  </option>

                  {outlets.map((outlet) => (
                    <option
                      key={outlet.id}
                      value={outlet.id}
                    >
                      {outlet.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-medium transition"
              >
                {submitting
                  ? "Menyimpan..."
                  : "Update Admin"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}