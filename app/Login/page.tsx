"use client";

import React, { useState } from "react";

import Link from "next/link";

import {
  Mail,
  Lock,
  ArrowRight,
  Sparkles,
  Loader2,
  ArrowLeft,
} from "lucide-react";

export default function LailaPinkLogin() {
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      setError("");

      const response = await fetch(
        "https://laila-collections-production.up.railway.app/api/auth/login",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email,
            password,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          Array.isArray(data.message)
            ? data.message.join(", ")
            : data.message || "Login gagal",
        );

        return;
      }

      // FIX TOKEN
      localStorage.setItem("token", data.accessToken);

      localStorage.setItem("user", JSON.stringify(data.user));

      document.cookie = `token=${data.accessToken}; path=/; max-age=86400; SameSite=Lax`;

      document.cookie = `user=${encodeURIComponent(
        JSON.stringify(data.user),
      )}; path=/; max-age=86400; SameSite=Lax`;

      if (data.user.role === "SUPER_ADMIN") {
        window.location.replace("/super-admin");
      } else {
        window.location.replace("/admin");
      }
    } catch (error) {
      console.log(error);

      setError("Terjadi kesalahan sistem");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF5F7] text-[#4A1D24] font-sans flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-pink-300/20 rounded-full blur-[100px] -z-0" />

      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-rose-200/30 rounded-full blur-[100px] -z-0" />

      <div className="absolute top-8 left-8 z-20">
        <Link
          href="/"
          className="bg-white/80 backdrop-blur-xl border border-pink-100 hover:bg-pink-50 text-pink-600 w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg shadow-pink-100 transition-all hover:-translate-y-1 active:scale-95"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
      </div>

      <div className="w-full max-w-[450px] relative z-10 animate-in fade-in zoom-in duration-700">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-[2rem] overflow-hidden shadow-2xl shadow-pink-200 mb-6 border-2 border-pink-100">
            <img
              src="/laila.jpg"
              alt="Laila Logo"
              className="w-full h-full object-cover"
            />
          </div>

          <h1 className="text-3xl font-black tracking-tighter text-pink-950 uppercase italic">
            Laila{" "}
            <span className="text-pink-500 font-serif normal-case">
              Collection
            </span>
          </h1>

          <p className="text-pink-900/40 text-sm font-medium mt-2 tracking-wide">
            Silahkan masuk ke sistem butik Anda
          </p>
        </div>

        <div className="bg-white/70 backdrop-blur-2xl border border-white rounded-[3.5rem] p-10 shadow-[0_20px_50px_rgba(244,114,182,0.1)]">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-pink-900/40 ml-4">
                Email Address
              </label>

              <div className="relative">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-pink-300">
                  <Mail className="w-5 h-5" />
                </div>

                <input
                  type="email"
                  placeholder="jhondoe@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-white border border-pink-100 py-4 pl-14 pr-6 rounded-2xl focus:outline-none focus:ring-4 focus:ring-pink-100 focus:border-pink-300 transition-all text-sm font-medium placeholder:text-pink-200"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-4">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-pink-900/40">
                  Password
                </label>
              </div>

              <div className="relative">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-pink-300">
                  <Lock className="w-5 h-5" />
                </div>

                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-white border border-pink-100 py-4 pl-14 pr-6 rounded-2xl focus:outline-none focus:ring-4 focus:ring-pink-100 focus:border-pink-300 transition-all text-sm font-medium placeholder:text-pink-200"
                />
              </div>

              <div className="flex justify-end px-2">
                <Link
                  href="/forgot-password"
                  className="text-xs font-semibold text-pink-600 hover:text-pink-800 transition-all"
                >
                  Lupa Password?
                </Link>
              </div>
            </div>

            {error && (
              <div className="bg-rose-100 border border-rose-200 text-rose-600 text-sm rounded-2xl px-5 py-4 font-semibold">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-pink-600 disabled:opacity-70 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-pink-200 hover:bg-pink-700 hover:-translate-y-1 active:scale-95 transition-all flex items-center justify-center gap-3 group mt-8"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  Masuk Sekarang
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      <div className="absolute bottom-10 right-10 flex items-center gap-2 opacity-20">
        <Sparkles className="w-4 h-4 text-pink-600" />

        <span className="text-[10px] font-black uppercase tracking-[0.4em]">
          Laila Systems v1.0
        </span>
      </div>
    </div>
  );
}
