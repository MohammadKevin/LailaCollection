"use client";

import React, { ChangeEvent, useEffect, useState } from "react";
import {
  BadgeCheck,
  Edit2,
  Loader2,
  Lock,
  Mail,
  MapPin,
  Phone,
  Save,
  Shield,
  Sparkles,
  Store,
  User,
} from "lucide-react";
import api from "@/lib/api";

type UserProfile = {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  address?: string;
  role: string;
  outlet?: {
    id: string;
    name: string;
  };
};

type ProfileForm = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
};

const initialForm: ProfileForm = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
};

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [form, setForm] = useState<ProfileForm>(initialForm);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get("/auth/profile");
      const user = response.data?.user || response.data;

      setProfile(user);
      setForm({
        fullName: user.fullName || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
      });
    } catch (error: any) {
      console.error("[ProfilePage] Gagal fetchProfile:", error);
      alert(error.response?.data?.message || "Gagal mengambil profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    try {
      setSubmitting(true);
      const payload = {
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        address: form.address,
      };

      const response = await api.patch("/auth/profile", payload);
      const updatedUser = response.data?.user || response.data;

      setProfile(updatedUser);

      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }

      alert("Profile berhasil diupdate");
    } catch (error: any) {
      console.error("[ProfilePage] Gagal update profile:", error);
      alert(error.response?.data?.message || "Gagal update profile");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50/50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 animate-spin text-pink-600" />
          <p className="text-sm font-medium text-slate-500 animate-pulse">Memuat profil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100/50 p-4 md:p-8 text-slate-800连">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header Section */}
        <div className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-sm relative overflow-hidden">
          <div className="absolute right-0 top-0 -mt-4 -mr-4 w-32 h-32 bg-pink-500/5 rounded-full blur-2xl pointer-events-none" />
          <div className="inline-flex items-center gap-1.5 bg-pink-50 text-pink-600 px-3 py-1 rounded-full text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            User Profile
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
            Profile Settings
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Kelola informasi akun, detail kontak, dan pengaturan keamanan kamu
          </p>
        </div>

        <div className="grid lg:grid-cols-[340px_1fr] gap-6 items-start">
          
          {/* Left Panel: Info Summary Card (Tanpa Foto Profil) */}
          <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6 sticky top-6 space-y-6">
            <div className="text-center pb-5 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight line-clamp-2">
                {profile?.fullName}
              </h2>
              <p className="text-sm text-slate-400 mt-1 break-all">{profile?.email}</p>

              <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-semibold mt-4 border border-emerald-100/60">
                <BadgeCheck className="w-3.5 h-3.5" />
                {profile?.role || "User"}
              </div>
            </div>

            {/* Meta Info List */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 text-left transition-colors hover:bg-slate-100/50">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <div className="overflow-hidden">
                  <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400 leading-none">Email</p>
                  <p className="text-sm font-medium text-slate-600 mt-1.5 truncate">{profile?.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 text-left transition-colors hover:bg-slate-100/50">
                <Store className="w-4 h-4 text-slate-400 shrink-0" />
                <div className="overflow-hidden">
                  <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400 leading-none">Outlet Resmi</p>
                  <p className="text-sm font-medium text-slate-600 mt-1.5 truncate">{profile?.outlet?.name || "-"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 text-left transition-colors hover:bg-slate-100/50">
                <Shield className="w-4 h-4 text-slate-400 shrink-0" />
                <div className="overflow-hidden">
                  <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400 leading-none">Hak Akses Role</p>
                  <p className="text-sm font-medium text-slate-600 mt-1.5 truncate capitalize">{profile?.role}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel: Form Fields & Security */}
          <div className="space-y-6">
            
            {/* Form Edit Profile */}
            <div className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-sm">
              <div className="flex items-center gap-3.5 mb-6">
                <div className="w-10 h-10 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center border border-pink-100">
                  <Edit2 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 tracking-tight">Edit Profile</h2>
                  <p className="text-xs text-slate-400">Perbarui data diri dan nomor kontak aktif Anda</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">Nama Lengkap</label>
                  <div className="relative group">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-pink-500 transition-colors" />
                    <input
                      type="text"
                      name="fullName"
                      value={form.fullName}
                      onChange={handleChange}
                      className="w-full bg-slate-50/50 hover:bg-slate-50 rounded-xl py-3 pl-10 pr-4 border border-slate-200 outline-none text-sm focus:bg-white focus:border-pink-500 focus:ring-4 focus:ring-pink-500/10 transition-all placeholder:text-slate-400/80"
                      placeholder="Masukkan nama lengkap"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">Alamat Email</label>
                  <div className="relative group">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-pink-500 transition-colors" />
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      className="w-full bg-slate-50/50 hover:bg-slate-50 rounded-xl py-3 pl-10 pr-4 border border-slate-200 outline-none text-sm focus:bg-white focus:border-pink-500 focus:ring-4 focus:ring-pink-500/10 transition-all placeholder:text-slate-400/80"
                      placeholder="Masukkan email"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">Nomor Telepon</label>
                  <div className="relative group">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-pink-500 transition-colors" />
                    <input
                      type="text"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      className="w-full bg-slate-50/50 hover:bg-slate-50 rounded-xl py-3 pl-10 pr-4 border border-slate-200 outline-none text-sm focus:bg-white focus:border-pink-500 focus:ring-4 focus:ring-pink-500/10 transition-all placeholder:text-slate-400/80"
                      placeholder="Contoh: 08123456789"
                    />
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">Alamat Rumah</label>
                  <div className="relative group">
                    <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400 group-focus-within:text-pink-500 transition-colors" />
                    <textarea
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      rows={3}
                      className="w-full bg-slate-50/50 hover:bg-slate-50 rounded-xl py-3 pl-10 pr-4 border border-slate-200 outline-none text-sm focus:bg-white focus:border-pink-500 focus:ring-4 focus:ring-pink-500/10 transition-all placeholder:text-slate-400/80 resize-none"
                      placeholder="Masukkan alamat tinggal saat ini"
                    />
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <button
                onClick={handleSave}
                disabled={submitting}
                className="mt-6 w-full sm:w-auto sm:float-right bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none transition-all text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-pink-600/10"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Simpan Perubahan
                  </>
                )}
              </button>
              <div className="clear-both" />
            </div>

            {/* Security Section */}
            <div className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-sm">
              <div className="flex items-center gap-3.5 mb-5">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 tracking-tight">Kredensial & Keamanan</h2>
                  <p className="text-xs text-slate-400">Kelola dan amankan perlindungan otentikasi akun Anda</p>
                </div>
              </div>

              <div className="bg-slate-50/80 rounded-xl p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between border border-slate-100">
                <div>
                  <h3 className="font-bold text-sm text-slate-800">Kata Sandi (Password)</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Disarankan untuk mengganti password secara berkala demi keamanan berkas
                  </p>
                </div>
                <button className="whitespace-nowrap bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 active:scale-[0.98] transition-all px-4 py-2.5 rounded-xl font-semibold text-xs shadow-sm">
                  Ubah Kata Sandi
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}