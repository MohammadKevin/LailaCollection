"use client";

import React, { useState } from "react";

import Link from "next/link";

import {
  LayoutDashboard,
  Store,
  ShoppingBag,
  Wallet,
  FileText,
  Users,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  Tag,
} from "lucide-react";

import { usePathname } from "next/navigation";

const menus = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/super-admin",
  },
  {
    label: "Outlets",
    icon: Store,
    href: "/super-admin/outlets",
  },
  {
    label: "Karyawan",
    icon: Users,
    href: "/super-admin/karyawan",
  },
  {
    label: "Products",
    icon: ShoppingBag,
    href: "/super-admin/products",
  },
  {
    label: "Operasional",
    icon: Wallet,
    href: "/super-admin/expenses",
  },
  {
    label: "Reports",
    icon: FileText,
    href: "/super-admin/reports",
  },
];

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-[#f5f6fa] flex">
      {/* SIDEBAR */}
      <aside
        className={`fixed left-0 top-0 h-screen bg-white border-r border-slate-200 transition-all duration-300 z-50 flex flex-col ${
          collapsed ? "w-20" : "w-64"
        }`}
      >
        {/* HEADER */}
        <div className="h-20 border-b border-slate-200 flex items-center justify-between px-5">
          {!collapsed && (
            <div className="flex items-center gap-3">
              <img
                src="/laila.jpg"
                alt="Logo"
                className="w-10 h-10 rounded-xl object-cover"
              />

              <div>
                <h1 className="text-sm font-semibold text-slate-800">
                  Laila Collection
                </h1>

                <p className="text-xs text-slate-400">
                  Super Admin
                </p>
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

        {/* MENU */}
        <div className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
          {menus.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link key={item.label} href={item.href}>
                <button
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm ${
                    collapsed
                      ? "justify-center"
                      : "justify-start"
                  } ${
                    isActive
                      ? "bg-slate-900 text-white"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />

                  {!collapsed && (
                    <span className="font-medium">
                      {item.label}
                    </span>
                  )}
                </button>
              </Link>
            );
          })}
        </div>

        {/* FOOTER */}
        <div className="p-3 border-t border-slate-200">
          <Link href="/login">
            <button
              className={`w-full flex items-center rounded-xl px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 transition-all ${
                collapsed
                  ? "justify-center"
                  : "justify-start gap-3"
              }`}
            >
              <LogOut className="w-5 h-5" />

              {!collapsed && <span>Logout</span>}
            </button>
          </Link>
        </div>
      </aside>

      {/* CONTENT */}
      <main
        className={`flex-1 transition-all duration-300 ${
          collapsed ? "ml-20" : "ml-64"
        }`}
      >
        {/* TOPBAR */}
        <div className="h-20 bg-white border-b border-slate-200 px-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-800">
              Dashboard
            </h2>

            <p className="text-sm text-slate-500">
              Welcome back 👋
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex flex-col items-end">
              <h4 className="text-sm font-medium text-slate-700">
                Super Admin
              </h4>

              <p className="text-xs text-slate-400">
                Active Session
              </p>
            </div>

            <div className="w-11 h-11 rounded-full bg-slate-200" />
          </div>
        </div>

        {/* PAGE */}
        <div className="p-4 md:p-6">
          {children}
        </div>
      </main>
    </div>
  );
}