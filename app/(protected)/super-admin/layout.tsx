"use client";

import React, { useState } from "react";

import Link from "next/link";

import {
  LayoutDashboard,
  Store,
  ShoppingBag,
  Receipt,
  Wallet,
  FileText,
  Users,
  Settings,
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
    label: "Admins",
    icon: Users,
    href: "/super-admin/admins",
  },
  {
    label: "Categories",
    icon: Tag,
    href: "/super-admin/categories",
  },
  {
    label: "Products",
    icon: ShoppingBag,
    href: "/super-admin/products",
  },
  {
    label: "Expenses",
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

  const [collapsed, setCollapsed] =
    useState(false);

  return (
    <div className="min-h-screen bg-[#FFF5F7] flex text-[#4A1D24]">
      <aside
        className={`fixed left-0 top-0 h-screen bg-white border-r border-pink-100 z-50 transition-all duration-300 flex flex-col justify-between ${
          collapsed
            ? "w-24 p-4"
            : "w-72 p-6"
        }`}
      >
        <div>
          <div
            className={`flex items-center ${
              collapsed
                ? "justify-center"
                : "justify-between"
            } mb-10`}
          >
            {!collapsed && (
              <div className="flex items-center gap-3">
                <img
                  src="/laila.jpg"
                  alt="Logo"
                  className="w-11 h-11 rounded-2xl object-cover shadow-sm border border-pink-100 flex-shrink-0"
                />

                <div>
                  <h1 className="font-black text-lg leading-none text-pink-950">
                    Laila Collection
                  </h1>

                  <p className="text-xs text-pink-400 uppercase tracking-widest mt-1 font-bold">
                    Super Admin
                  </p>
                </div>
              </div>
            )}

            <button
              onClick={() =>
                setCollapsed(!collapsed)
              }
              className="w-11 h-11 rounded-2xl bg-pink-50 hover:bg-pink-100 flex items-center justify-center transition-all text-pink-500"
            >
              {collapsed ? (
                <PanelLeftOpen className="w-5 h-5" />
              ) : (
                <PanelLeftClose className="w-5 h-5" />
              )}
            </button>
          </div>

          <nav className="space-y-2">
            {menus.map((item) => {
              const isActive =
                pathname === item.href;

              return (
                <Link
                  key={item.label}
                  href={item.href}
                >
                  <button
                    className={`w-full flex items-center ${
                      collapsed
                        ? "justify-center"
                        : "justify-start"
                    } gap-4 px-5 py-4 rounded-2xl text-sm font-bold transition-all ${
                      isActive
                        ? "bg-pink-600 text-white shadow-lg shadow-pink-200"
                        : "hover:bg-pink-50 hover:text-pink-600 text-[#4A1D24]/70"
                    }`}
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />

                    {!collapsed && (
                      <span>{item.label}</span>
                    )}
                  </button>
                </Link>
              );
            })}
          </nav>
        </div>

        <Link href="/login">
          <button
            className={`w-full rounded-2xl py-4 flex items-center ${
              collapsed
                ? "justify-center"
                : "justify-center gap-3"
            } font-bold transition-all bg-pink-50 hover:bg-pink-100 text-pink-600`}
          >
            <LogOut className="w-5 h-5" />

            {!collapsed && (
              <span>Logout</span>
            )}
          </button>
        </Link>
      </aside>

      <main
        className={`flex-1 transition-all duration-300 ${
          collapsed
            ? "ml-24"
            : "ml-72"
        }`}
      >
        {children}
      </main>
    </div>
  );
}