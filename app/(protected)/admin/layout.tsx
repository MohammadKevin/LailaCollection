"use client";

import React, { useState } from "react";

import Link from "next/link";

import { usePathname } from "next/navigation";

import {
  BarChart3,
  LayoutDashboard,
  LogOut,
  Package,
  PanelLeftClose,
  PanelLeftOpen,
  ShoppingCart,
  User,
  Wallet,
} from "lucide-react";

const menus = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },

  {
    label: "Cashier",
    href: "/admin/cashier",
    icon: ShoppingCart,
  },

  {
    label: "Products",
    href: "/admin/products",
    icon: Package,
  },

  {
    label: "Operasional",
    href: "/admin/operasional",
    icon: Wallet,
  },

  {
    label: "Laporan",
    href: "/admin/laporan",
    icon: BarChart3,
  },

  {
    label: "Profile",
    href: "/admin/profile",
    icon: User,
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside
        className={`fixed top-0 left-0 h-screen bg-white border-r border-slate-200 flex flex-col z-50 transition-all duration-300 ${
          collapsed ? "w-20" : "w-64"
        }`}
      >
        <div className="h-20 border-b border-slate-200 px-5 flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center gap-3">
              <img
                src="/laila.jpg"
                alt="Logo"
                className="w-11 h-11 rounded-2xl object-cover"
              />

              <div>
                <h1 className="text-sm font-semibold text-slate-800">
                  Laila Collection
                </h1>

                <p className="text-xs text-slate-400">Admin Panel</p>
              </div>
            </div>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-10 h-10 rounded-xl hover:bg-slate-100 flex items-center justify-center transition"
          >
            {collapsed ? (
              <PanelLeftOpen className="w-5 h-5 text-slate-600" />
            ) : (
              <PanelLeftClose className="w-5 h-5 text-slate-600" />
            )}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-5">
          <div className="space-y-1">
            {menus.map((item) => {
              const active = pathname === item.href;

              return (
                <Link key={item.label} href={item.href}>
                  <div
                    className={`w-full flex items-center px-4 py-3 rounded-2xl text-sm transition cursor-pointer ${
                      collapsed ? "justify-center" : "gap-3"
                    } ${
                      active
                        ? "bg-slate-900 text-white"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />

                    {!collapsed && (
                      <span className="font-medium">{item.label}</span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="p-3 border-t border-slate-200">
          <Link href="/Login">
            <button
              className={`w-full flex items-center px-4 py-3 rounded-2xl text-sm font-medium text-red-500 hover:bg-red-50 transition ${
                collapsed ? "justify-center" : "gap-3"
              }`}
            >
              <LogOut className="w-5 h-5" />

              {!collapsed && <span>Logout</span>}
            </button>
          </Link>
        </div>
      </aside>

      <main
        className={`flex-1 transition-all duration-300 ${
          collapsed ? "ml-20" : "ml-64"
        }`}
      >
        <div className="h-20 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-40">
          <div>
            <h2 className="text-lg font-semibold text-slate-800">Dashboard</h2>

            <p className="text-sm text-slate-500">Welcome back 👋</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex flex-col items-end">
              <h4 className="text-sm font-medium text-slate-700">Admin</h4>

              <p className="text-xs text-slate-400">Active Session</p>
            </div>

            <img
              src="/laila.jpg"
              alt="Profile"
              className="w-11 h-11 rounded-full object-cover"
            />
          </div>
        </div>

        <div className="p-4 md:p-6">{children}</div>
      </main>
    </div>
  );
}
