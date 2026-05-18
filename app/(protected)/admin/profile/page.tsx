"use client";

import React, { useEffect, useState } from "react";

import { Loader2, Lock, Mail, MapPin, Phone, Store } from "lucide-react";

import api from "@/lib/api";

type UserProfile = {
  id: string;
  name?: string;
  email: string;
  role?: string;

  outlet?: {
    id: string;
    name: string;
    noTelp?: string;
    address?: string;
    qrisImage?: string;
  };
};

const dummyProfile: UserProfile = {
  id: "admin-batu-01",

  name: "Admin Batu",

  email: "lailacollection.batu@gmail.com",

  role: "ADMIN",

  outlet: {
    id: "outlet-batu",

    name: "Laila Collection Batu",

    noTelp: "081234567890",

    address: "Jl. Diponegoro No. 45, Kota Batu, Jawa Timur",

    qrisImage: "",
  },
};

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);

  const [resettingPassword, setResettingPassword] = useState(false);

  const [profile, setProfile] = useState<UserProfile>(dummyProfile);

  const fetchProfile = async () => {
    try {
      setLoading(true);

      const response = await api.get("/auth/profile");

      const user = response.data;

      if (user) {
        setProfile(user);
      }
    } catch (error) {
      console.log("[ProfilePage] fallback dummy profile");

      setProfile(dummyProfile);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProfile();
  }, []);

  const handleResetPassword = async () => {
    if (!profile.email) {
      alert("Email tidak ditemukan");

      return;
    }

    const confirmReset = window.confirm(
      `Kirim link reset password ke ${profile.email}?`,
    );

    if (!confirmReset) return;

    try {
      setResettingPassword(true);

      await api.post("/auth/forgot-password", {
        email: profile.email,
      });

      alert("Link reset password berhasil dikirim");
    } catch (error: any) {
      console.error(error);

      alert(error?.response?.data?.message || "Gagal reset password");
    } finally {
      setResettingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-slate-700" />

          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
            Memuat Profile...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            <div>
              <div className="inline-flex items-center gap-2 bg-slate-100 text-slate-700 px-3 py-1.5 rounded-full text-xs font-semibold mb-3">
                <Store className="w-4 h-4" />
                Laila Collection
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
                Profile Outlet
              </h1>

              <p className="text-sm text-slate-400 mt-2">
                Informasi akun outlet & keamanan login
              </p>
            </div>

            <div className="bg-slate-900 text-white rounded-2xl p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                <Store className="w-6 h-6" />
              </div>

              <div>
                <p className="text-xs uppercase tracking-widest font-semibold text-slate-300">
                  Outlet
                </p>

                <h2 className="font-bold text-lg mt-1">
                  {profile.outlet?.name}
                </h2>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8">
          <div className="flex items-center gap-3 mb-7">
            <div className="w-11 h-11 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center">
              <Store className="w-5 h-5" />
            </div>

            <div>
              <h2 className="text-sm font-bold uppercase tracking-widest text-slate-900">
                Data Outlet
              </h2>

              <p className="text-xs text-slate-400 mt-1">
                Informasi resmi outlet
              </p>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <label className="text-xs font-semibold uppercase tracking-widest text-slate-700">
                Email
              </label>

              <div className="relative mt-2">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

                <input
                  type="text"
                  disabled
                  value={profile.email}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-11 pr-4 text-sm font-medium text-slate-600"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-widest text-slate-700">
                Nomor Telepon
              </label>

              <div className="relative mt-2">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

                <input
                  type="text"
                  disabled
                  value={profile.outlet?.noTelp || "-"}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-11 pr-4 text-sm font-medium text-slate-600"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-widest text-slate-700">
                Alamat Outlet
              </label>

              <div className="relative mt-2">
                <MapPin className="absolute left-4 top-4 w-4 h-4 text-slate-400" />

                <textarea
                  disabled
                  rows={4}
                  value={profile.outlet?.address || "-"}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-11 pr-4 text-sm font-medium text-slate-600 resize-none"
                />
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-slate-200">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>

              <div>
                <h2 className="text-sm font-bold uppercase tracking-widest text-slate-900">
                  Keamanan Akun
                </h2>

                <p className="text-xs text-slate-400 mt-1">
                  Reset password akun outlet
                </p>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
              <p className="text-sm font-medium text-slate-600 leading-relaxed max-w-lg">
                Sistem akan mengirim link reset password ke email resmi outlet.
              </p>

              <button
                onClick={handleResetPassword}
                disabled={resettingPassword}
                className="bg-slate-900 hover:bg-slate-800 transition-all text-white px-5 py-3 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {resettingPassword ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
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
