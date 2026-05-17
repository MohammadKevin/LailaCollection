"use client";

import React, {
  useEffect,
  useState,
} from "react";

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

  email:
    "lailacollection.batu@gmail.com",

  role: "ADMIN",

  outlet: {
    id: "outlet-batu",

    name: "Laila Collection Batu",

    noTelp: "081234567890",

    address:
      "Jl. Diponegoro No. 45, Kota Batu, Jawa Timur",

    qrisImage: "",
  },
};

export default function ProfilePage() {
  const [loading, setLoading] =
    useState(true);

  const [
    resettingPassword,
    setResettingPassword,
  ] = useState(false);

  const [profile, setProfile] =
    useState<UserProfile>(
      dummyProfile,
    );

  const fetchProfile =
    async () => {
      try {
        setLoading(true);

        const response =
          await api.get(
            "/auth/profile",
          );

        const user =
          response.data;

        if (user) {
          setProfile(user);
        }
      } catch (error) {
        console.log(
          "[ProfilePage] fallback dummy profile",
        );

        setProfile(
          dummyProfile,
        );
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleResetPassword =
    async () => {
      if (!profile.email) {
        alert(
          "Email tidak ditemukan",
        );

        return;
      }

      const confirmReset =
        window.confirm(
          `Kirim link reset password ke ${profile.email}?`,
        );

      if (!confirmReset)
        return;

      try {
        setResettingPassword(
          true,
        );

        await api.post(
          "/auth/forgot-password",
          {
            email:
              profile.email,
          },
        );

        alert(
          "Link reset password berhasil dikirim",
        );
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
            "Gagal reset password",
        );
      } finally {
        setResettingPassword(
          false,
        );
      }
    };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF5F7] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-pink-600" />

          <p className="text-xs font-black uppercase tracking-[0.3em] text-pink-400">
            Memuat Profile...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF5F7] to-white p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* HEADER */}
        <div className="bg-white rounded-3xl border border-pink-100 p-6 md:p-8 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-52 h-52 bg-pink-500/5 rounded-full blur-3xl" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            <div>
              <div className="inline-flex items-center gap-2 bg-pink-50 text-pink-600 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-3">
                <Sparkles className="w-3 h-3" />
                Laila Collection
              </div>

              <h1 className="text-3xl md:text-4xl font-black text-pink-950">
                Profile Outlet
              </h1>

              <p className="text-sm text-pink-400 mt-2">
                Informasi akun
                outlet &
                keamanan login
              </p>
            </div>

            <div className="bg-gradient-to-r from-pink-600 to-rose-500 text-white rounded-2xl p-5 flex items-center gap-4 shadow-lg shadow-pink-200">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                <Store className="w-6 h-6" />
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-widest font-bold text-pink-100">
                  Outlet
                </p>

                <h2 className="font-black text-lg mt-1">
                  {
                    profile
                      .outlet
                      ?.name
                  }
                </h2>
              </div>
            </div>
          </div>
        </div>

        {/* PROFILE */}
        <div className="bg-white rounded-3xl border border-pink-100 p-6 md:p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-7">
            <div className="w-11 h-11 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center">
              <Store className="w-5 h-5" />
            </div>

            <div>
              <h2 className="text-sm font-black uppercase tracking-widest text-pink-950">
                Data Outlet
              </h2>

              <p className="text-xs text-pink-400 mt-1">
                Informasi resmi
                outlet yang
                terdaftar
              </p>
            </div>
          </div>

          <div className="space-y-5">
            {/* EMAIL */}
            <div>
              <label className="text-xs font-black uppercase tracking-widest text-pink-800">
                Email
              </label>

              <div className="relative mt-2">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-pink-300" />

                <input
                  type="text"
                  disabled
                  value={
                    profile.email
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-11 pr-4 text-sm font-bold text-slate-600"
                />
              </div>
            </div>

            {/* PHONE */}
            <div>
              <label className="text-xs font-black uppercase tracking-widest text-pink-800">
                Nomor Telepon
              </label>

              <div className="relative mt-2">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-pink-300" />

                <input
                  type="text"
                  disabled
                  value={
                    profile
                      .outlet
                      ?.noTelp ||
                    "-"
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-11 pr-4 text-sm font-bold text-slate-600"
                />
              </div>
            </div>

            {/* ADDRESS */}
            <div>
              <label className="text-xs font-black uppercase tracking-widest text-pink-800">
                Alamat Outlet
              </label>

              <div className="relative mt-2">
                <MapPin className="absolute left-4 top-4 w-4 h-4 text-pink-300" />

                <textarea
                  disabled
                  rows={4}
                  value={
                    profile
                      .outlet
                      ?.address ||
                    "-"
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-11 pr-4 text-sm font-bold text-slate-600 resize-none"
                />
              </div>
            </div>
          </div>

          {/* RESET PASSWORD */}
          <div className="mt-8 pt-8 border-t border-pink-100">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>

              <div>
                <h2 className="text-sm font-black uppercase tracking-widest text-pink-950">
                  Keamanan Akun
                </h2>

                <p className="text-xs text-pink-400 mt-1">
                  Reset password
                  akun outlet
                </p>
              </div>
            </div>

            <div className="bg-pink-50/50 border border-pink-100 rounded-2xl p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
              <p className="text-xs font-bold text-pink-900/80 leading-relaxed max-w-lg">
                Sistem akan
                mengirim link
                reset password ke
                email resmi
                outlet.
              </p>

              <button
                onClick={
                  handleResetPassword
                }
                disabled={
                  resettingPassword
                }
                className="bg-gradient-to-r from-pink-600 to-rose-500 hover:opacity-90 active:scale-[0.98] transition-all text-white px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-50"
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