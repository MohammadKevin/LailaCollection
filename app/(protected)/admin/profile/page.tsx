"use client";

import React, { useEffect, useState } from "react";
import {
  Loader2,
  Lock,
  Mail,
  MapPin,
  Phone,
  Sparkles,
  Store,
} from "lucide-react";
import api from "@/lib/api";

type UserProfile = {
  id: string;
  email: string;
  phone?: string;
  address?: string;
  outlet?: {
    id: string;
    name: string;
  };
};

// Data Dummy Default sesuai inputan Super Admin
const dummyProfile: UserProfile = {
  id: "admin-batu-01",
  email: "lailacollection.batu@gmail.com",
  phone: "081234567890",
  address: "Jl. Diponegoro No. 45, Kota Batu, Jawa Timur",
  outlet: {
    id: "outlet-batu",
    name: "Laila Collection Batu",
  },
};

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [resettingPassword, setResettingPassword] = useState(false);
  // Menggunakan data dummy sebagai initial state awal
  const [profile, setProfile] = useState<UserProfile>(dummyProfile);

  // Ambil data profil riil dari backend (Jika API sudah aktif)
  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get("/auth/profile");
      const user = response.data?.user || response.data;
      if (user) {
        setProfile(user);
      }
    } catch (error: any) {
      console.log("[ProfilePage] Menggunakan data dummy cabang (Backend belum terhubung)");
      // Tetap menggunakan dummyProfile jika API error/belum siap
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProfile();
  }, []);

  // Fitur Utama: Reset Password Mandiri via Email
  const handleResetPassword = async () => {
    if (!profile.email) {
      alert("Alamat email tidak ditemukan!");
      return;
    }

    const konfirmasi = window.confirm(
      `Sistem akan mengirimkan instruksi pemulihan kata sandi ke email resmi: ${profile.email}. Lanjutkan?`
    );

    if (!konfirmasi) return;

    try {
      setResettingPassword(true);
      await api.post("/auth/forgot-password", { email: profile.email });
      alert(`Sukses! Tautan reset password telah dikirim ke email: ${profile.email}`);
    } catch (error: any) {
      console.error("[ProfilePage] Gagal reset password:", error);
      alert(error.response?.data?.message || "Gagal memproses permintaan reset password");
    } finally {
      setResettingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF5F7] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 animate-spin text-pink-600" />
          <p className="text-xs font-black text-pink-400 uppercase tracking-widest animate-pulse">Memuat data admin...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF5F7] to-white p-4 md:p-8 text-pink-950 font-sans antialiased">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* HEADER BRAND BANNER */}
        <div className="bg-white rounded-3xl border border-pink-100 p-6 shadow-sm relative overflow-hidden flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="absolute right-0 top-0 -mt-4 -mr-4 w-32 h-32 bg-pink-500/5 rounded-full blur-2xl pointer-events-none" />
          <div>
            <div className="inline-flex items-center gap-1.5 bg-pink-50 text-pink-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-2">
              <Sparkles className="w-3 h-3" />
              Laila Collection Admin
            </div>
            <h1 className="text-2xl font-black tracking-tight text-pink-950">
              Informasi Akun Outlet
            </h1>
          </div>
          
          {/* Nama Outlet (Read Only) */}
          <div className="bg-gradient-to-r from-pink-600 to-rose-500 text-white p-4 rounded-2xl flex items-center gap-3 shadow-md">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-pink-100 uppercase tracking-wider leading-none">Outlet Resmi</p>
              <p className="text-sm font-black mt-1">{profile.outlet?.name}</p>
            </div>
          </div>
        </div>

        {/* CORE DATA (READ-ONLY) & RESET PASSWORD */}
        <div className="bg-white rounded-3xl border border-pink-100 p-6 md:p-8 shadow-sm space-y-8">
          
          {/* Section Master Data dari Super Admin */}
          <div className="space-y-6">
            <div className="flex items-center gap-3.5 border-b border-pink-50 pb-4">
              <div className="w-9 h-9 rounded-xl bg-slate-50 text-slate-500 flex items-center justify-center border border-slate-200">
                <Store className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-black uppercase tracking-wider text-pink-950">Data Registrasi Outlet</h2>
                <p className="text-xs text-pink-400">Informasi di bawah ini dikunci dan hanya dapat diubah oleh Super Admin</p>
              </div>
            </div>

            <div className="grid gap-5 opacity-75">
              {/* Email (Disabled) */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-pink-800 uppercase tracking-wider">Alamat Email Resmi</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-pink-300" />
                  <input
                    type="email"
                    readOnly
                    disabled
                    value={profile.email}
                    className="w-full bg-slate-50/80 rounded-xl py-3 pl-11 pr-4 border border-slate-200 outline-none text-xs font-bold text-slate-500 cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Phone (Disabled) */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-pink-800 uppercase tracking-wider">Nomor Telepon / WhatsApp</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-pink-300" />
                  <input
                    type="text"
                    readOnly
                    disabled
                    value={profile.phone}
                    className="w-full bg-slate-50/80 rounded-xl py-3 pl-11 pr-4 border border-slate-200 outline-none text-xs font-bold text-slate-500 cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Address (Disabled) */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-pink-800 uppercase tracking-wider">Alamat Lengkap Cabang</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-3.5 w-4 h-4 text-pink-300" />
                  <textarea
                    readOnly
                    disabled
                    value={profile.address}
                    rows={3}
                    className="w-full bg-slate-50/80 rounded-xl py-3 pl-11 pr-4 border border-slate-200 outline-none text-xs font-bold text-slate-500 cursor-not-allowed resize-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* FITUR RESET PASSWORD */}
          <div className="pt-2 border-t border-pink-100">
            <div className="flex items-center gap-3.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-black uppercase tracking-wider text-pink-950">Keamanan & Autentikasi</h2>
                <p className="text-xs text-pink-400">Perbarui kata sandi enkripsi masuk untuk akun kasir ini</p>
              </div>
            </div>

            <div className="bg-pink-50/40 rounded-2xl p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between border border-pink-100/50">
              <p className="text-xs font-bold text-pink-900/80 max-w-md">
                Demi keamanan berkas database, lakukan peremajaan kata sandi berkala. Sistem akan otomatis mengirimkan tautan verifikasi baru ke email resmi di atas.
              </p>
              <button 
                type="button" 
                onClick={handleResetPassword}
                disabled={resettingPassword}
                className="w-full sm:w-auto whitespace-nowrap bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-500 hover:to-rose-400 text-white active:scale-[0.98] disabled:opacity-50 transition-all px-5 py-3 rounded-xl font-black text-xs uppercase tracking-wider shadow-md shadow-pink-600/10 flex items-center justify-center gap-2"
              >
                {resettingPassword ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    Reset Password
                  </>
                )}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}