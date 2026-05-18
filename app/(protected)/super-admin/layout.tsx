"use client";

import React, { useState } from "react";

import Link from "next/link";

import { usePathname } from "next/navigation";

import {
  Boxes,
  ChevronDown,
  ChevronRight,
  FileText,
  LayoutDashboard,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  ShoppingBag,
  Store,
  Users,
} from "lucide-react";

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
    label: "Inventori",
    icon: Boxes,

    children: [
      {
        label: "Stock Masuk",
        href:
          "/super-admin/inventory/in",
      },

      {
        label: "Stock Keluar",
        href:
          "/super-admin/inventory/out",
      },
    ],
  },

  {
    label: "Laporan",
    icon: FileText,

    children: [
      {
        label: "Laporan Penjualan",
        href:
          "/super-admin/reports/sales",
      },

      {
        label: "Laporan Inventori",
        href:
          "/super-admin/reports/inventory",
      },
    ],
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

  const [openMenus, setOpenMenus] =
    useState<string[]>([
      "Inventori",
      "Laporan",
    ]);

  const toggleSubmenu = (
    label: string
  ) => {
    setOpenMenus((prev) =>
      prev.includes(label)
        ? prev.filter(
            (item) =>
              item !== label
          )
        : [...prev, label]
    );
  };

  const isChildActive = (
    children: {
      href: string;
    }[]
  ) => {
    return children.some(
      (child) =>
        pathname === child.href
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside
        className={`fixed top-0 left-0 h-screen bg-white border-r border-slate-200 flex flex-col z-50 transition-all duration-300 ${
          collapsed
            ? "w-20"
            : "w-64"
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

                <p className="text-xs text-slate-400">
                  Super Admin
                </p>
              </div>
            </div>
          )}

          <button
            onClick={() =>
              setCollapsed(
                !collapsed
              )
            }
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
              if (item.children) {
                const isOpen =
                  openMenus.includes(
                    item.label
                  );

                const active =
                  isChildActive(
                    item.children
                  );

                return (
                  <div
                    key={item.label}
                  >
                    <button
                      onClick={() =>
                        toggleSubmenu(
                          item.label
                        )
                      }
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition ${
                        active
                          ? "bg-slate-900 text-white"
                          : "text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className="w-5 h-5 flex-shrink-0" />

                        {!collapsed && (
                          <span className="text-sm font-medium">
                            {
                              item.label
                            }
                          </span>
                        )}
                      </div>

                      {!collapsed &&
                        (isOpen ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        ))}
                    </button>

                    {!collapsed &&
                      isOpen && (
                        <div className="ml-5 mt-2 pl-4 border-l border-slate-200 space-y-1">
                          {item.children.map(
                            (
                              child
                            ) => {
                              const activeChild =
                                pathname ===
                                child.href;

                              return (
                                <Link
                                  key={
                                    child.label
                                  }
                                  href={
                                    child.href
                                  }
                                >
                                  <div
                                    className={`px-3 py-2 rounded-xl text-sm transition cursor-pointer ${
                                      activeChild
                                        ? "bg-slate-900 text-white"
                                        : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                                    }`}
                                  >
                                    {
                                      child.label
                                    }
                                  </div>
                                </Link>
                              );
                            }
                          )}
                        </div>
                      )}
                  </div>
                );
              }

              const active =
                pathname === item.href;

              return (
                <Link
                  key={item.label}
                  href={
                    item.href || "#"
                  }
                >
                  <div
                    className={`w-full flex items-center px-4 py-3 rounded-2xl text-sm transition cursor-pointer ${
                      collapsed
                        ? "justify-center"
                        : "gap-3"
                    } ${
                      active
                        ? "bg-slate-900 text-white"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />

                    {!collapsed && (
                      <span className="font-medium">
                        {
                          item.label
                        }
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="p-3 border-t border-slate-200">
          <Link href="/login">
            <button
              className={`w-full flex items-center px-4 py-3 rounded-2xl text-sm font-medium text-red-500 hover:bg-red-50 transition ${
                collapsed
                  ? "justify-center"
                  : "gap-3"
              }`}
            >
              <LogOut className="w-5 h-5" />

              {!collapsed && (
                <span>
                  Logout
                </span>
              )}
            </button>
          </Link>
        </div>
      </aside>

      <main
        className={`flex-1 transition-all duration-300 ${
          collapsed
            ? "ml-20"
            : "ml-64"
        }`}
      >
        <div className="h-20 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-40">
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

            <img
              src="/laila.jpg"
              alt="Profile"
              className="w-11 h-11 rounded-full object-cover"
            />
          </div>
        </div>

        <div className="p-4 md:p-6">
          {children}
        </div>
      </main>
    </div>
  );
}