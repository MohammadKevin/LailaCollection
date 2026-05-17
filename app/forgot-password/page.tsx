"use client";

import React, { useState } from "react";

import Link from "next/link";

import {
    Mail,
    ArrowRight,
    ArrowLeft,
    Loader2,
    CheckCircle2,
} from "lucide-react";

export default function ForgotPasswordPage() {
    const [email, setEmail] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const [success, setSuccess] =
        useState("");

    const [error, setError] =
        useState("");

    const handleForgotPassword =
        async (e: React.FormEvent) => {
            e.preventDefault();

            try {
                setLoading(true);

                setError("");

                setSuccess("");

                const response =
                    await fetch(
                        "https://laila-collections-production.up.railway.app/api/auth/forgot-password",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json",
                            },

                            body: JSON.stringify({
                                email,
                            }),
                        },
                    );

                const data =
                    await response.json();

                if (!response.ok) {
                    setError(
                        Array.isArray(
                            data.message,
                        )
                            ? data.message.join(
                                ", ",
                            )
                            : data.message ||
                            "Gagal mengirim email reset password",
                    );

                    return;
                }

                setSuccess(
                    "Link reset password berhasil dikirim ke email Anda",
                );

                setEmail("");
            } catch (error) {
                console.log(error);

                setError(
                    "Terjadi kesalahan sistem",
                );
            } finally {
                setLoading(false);
            }
        };

    return (
        <div className="min-h-screen bg-[#FFF5F7] flex items-center justify-center p-6 relative overflow-hidden">
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-pink-300/20 rounded-full blur-[100px]" />

            <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-rose-200/30 rounded-full blur-[100px]" />

            <div className="w-full max-w-[450px] relative z-10">
                <Link
                    href="/login"
                    className="inline-flex items-center gap-2 text-pink-600 hover:text-pink-800 transition-all mb-8 font-semibold"
                >
                    <ArrowLeft className="w-4 h-4" />

                    Kembali ke login
                </Link>

                <div className="bg-white/70 backdrop-blur-2xl border border-white rounded-[3rem] p-10 shadow-[0_20px_50px_rgba(244,114,182,0.1)]">
                    <div className="text-center mb-8">
                        <div className="w-20 h-20 rounded-[2rem] bg-pink-100 flex items-center justify-center mx-auto mb-5">
                            <Mail className="w-10 h-10 text-pink-600" />
                        </div>

                        <h1 className="text-3xl font-black text-pink-950 tracking-tight">
                            Forgot Password
                        </h1>

                        <p className="text-pink-900/50 text-sm mt-3 leading-relaxed">
                            Masukkan email akun Anda
                            untuk menerima link reset
                            password
                        </p>
                    </div>

                    <form
                        onSubmit={
                            handleForgotPassword
                        }
                        className="space-y-6"
                    >
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
                                    onChange={(e) =>
                                        setEmail(
                                            e.target.value,
                                        )
                                    }
                                    required
                                    className="w-full bg-white border border-pink-100 py-4 pl-14 pr-6 rounded-2xl focus:outline-none focus:ring-4 focus:ring-pink-100 focus:border-pink-300 transition-all text-sm font-medium placeholder:text-pink-200"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="bg-rose-100 border border-rose-200 text-rose-600 text-sm rounded-2xl px-5 py-4 font-semibold">
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="bg-emerald-100 border border-emerald-200 text-emerald-700 text-sm rounded-2xl px-5 py-4 font-semibold flex items-start gap-3">
                                <CheckCircle2 className="w-5 h-5 mt-0.5" />

                                <span>{success}</span>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-pink-600 disabled:opacity-70 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-pink-200 hover:bg-pink-700 hover:-translate-y-1 active:scale-95 transition-all flex items-center justify-center gap-3 group"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />

                                    Loading...
                                </>
                            ) : (
                                <>
                                    Kirim Link Reset

                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}