"use client";

import React, { useEffect, useMemo, useState } from "react";

import Image from "next/image";

import {
  Loader2,
  Package,
  Plus,
  Search,
  Pencil,
  Trash2,
  Boxes,
  ImageIcon,
  BadgeDollarSign,
  Archive,
  Tag,
} from "lucide-react";

import api from "@/lib/api";

type Category = {
  id: string;
  name: string;
};

type Product = {
  id: string;
  name: string;
  sellingPrice: number;
  stock: number;
  imageUrl?: string;

  category?: {
    id: string;
    name: string;
  };
};

type ProductForm = {
  name: string;
  sellingPrice: string;
  stock: string;
  categoryId: string;
};

const initialForm: ProductForm = {
  name: "",
  sellingPrice: "",
  stock: "",
  categoryId: "",
};

export default function AdminProductsPage() {
  const [loading, setLoading] = useState(true);

  const [submitting, setSubmitting] = useState(false);

  const [products, setProducts] = useState<Product[]>([]);

  const [categories, setCategories] = useState<Category[]>([]);

  const [search, setSearch] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [previewImage, setPreviewImage] = useState("");

  const [form, setForm] = useState<ProductForm>(initialForm);

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const [productResponse, categoryResponse] = await Promise.all([
        api.get("/products"),

        api.get("/categories"),
      ]);

      const data = Array.isArray(productResponse.data)
        ? productResponse.data
        : productResponse.data?.data || [];

      setProducts(data);

      setCategories(categoryResponse.data || []);
    } catch (error) {
      console.error(error);

      alert("Gagal mengambil data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) =>
      product.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [products, search]);

  const resetForm = () => {
    setForm(initialForm);

    setEditingId(null);

    setSelectedFile(null);

    setPreviewImage("");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setSelectedFile(file);

    setPreviewImage(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!form.name || !form.sellingPrice || !form.stock) {
      alert("Lengkapi form product");

      return;
    }

    try {
      setSubmitting(true);

      const formData = new FormData();

      formData.append("name", form.name);

      formData.append("sellingPrice", form.sellingPrice);

      formData.append("stock", form.stock);

      if (form.categoryId) {
        formData.append("categoryId", form.categoryId);
      }

      if (selectedFile) {
        formData.append("image", selectedFile);
      }

      if (editingId) {
        await api.patch(`/products/${editingId}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        alert("Product berhasil diupdate");
      } else {
        await api.post("/products", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        alert("Product berhasil ditambahkan");
      }

      resetForm();

      fetchProducts();
    } catch (error: any) {
      console.error(error?.response?.data || error);

      alert(error?.response?.data?.message || "Gagal menyimpan product");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);

    setForm({
      name: product.name,

      sellingPrice: String(product.sellingPrice),

      stock: String(product.stock),

      categoryId: product.category?.id || "",
    });

    setPreviewImage(product.imageUrl || "");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm("Hapus product ini?");

    if (!confirmDelete) return;

    try {
      await api.delete(`/products/${id}`);

      alert("Product berhasil dihapus");

      fetchProducts();
    } catch (error: any) {
      console.error(error?.response?.data || error);

      alert("Gagal menghapus product");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-6">
          <div className="inline-flex items-center gap-2 bg-slate-100 text-slate-700 px-3 py-1.5 rounded-full text-xs font-semibold mb-3">
            <Boxes className="w-4 h-4" />
            Product Management
          </div>

          <h1 className="text-3xl font-bold text-slate-900">Admin Product</h1>

          <p className="text-sm text-slate-400 mt-2">
            Kelola semua product toko
          </p>
        </div>

        <div className="grid lg:grid-cols-[380px_1fr] gap-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 h-fit">
            <h2 className="text-xl font-bold text-slate-900 mb-6">
              {editingId ? "Edit Product" : "Tambah Product"}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-slate-700">
                  Nama Product
                </label>

                <div className="relative mt-2">
                  <Package className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Masukkan nama product"
                    className="w-full border border-slate-200 rounded-2xl pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700">
                  Harga
                </label>

                <div className="relative mt-2">
                  <BadgeDollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

                  <input
                    type="number"
                    name="sellingPrice"
                    value={form.sellingPrice}
                    onChange={handleChange}
                    placeholder="Harga jual"
                    className="w-full border border-slate-200 rounded-2xl pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700">
                  Stock
                </label>

                <div className="relative mt-2">
                  <Archive className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

                  <input
                    type="number"
                    name="stock"
                    value={form.stock}
                    onChange={handleChange}
                    placeholder="Jumlah stock"
                    className="w-full border border-slate-200 rounded-2xl pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700">
                  Category
                </label>

                <div className="relative mt-2">
                  <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10" />

                  <select
                    name="categoryId"
                    value={form.categoryId}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        categoryId: e.target.value,
                      })
                    }
                    className="w-full border border-slate-200 rounded-2xl pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-slate-300 bg-white"
                  >
                    <option value="">Pilih category</option>

                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700">
                  Upload Foto
                </label>

                <div className="relative mt-2">
                  <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10" />

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full border border-slate-200 rounded-2xl pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-slate-300 file:border-0 file:bg-slate-100 file:text-slate-700 file:px-3 file:py-1 file:rounded-lg file:mr-3"
                  />
                </div>

                {selectedFile && (
                  <p className="text-xs text-slate-500 mt-2">
                    {selectedFile.name}
                  </p>
                )}

                {previewImage && (
                  <div className="relative w-full h-52 mt-4 rounded-2xl overflow-hidden border border-slate-200">
                    <Image
                      src={previewImage}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
              </div>

              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full bg-slate-900 hover:bg-slate-800 disabled:opacity-50 transition text-white py-3 rounded-2xl font-semibold flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />

                    {editingId ? "Update Product" : "Tambah Product"}
                  </>
                )}
              </button>

              {editingId && (
                <button
                  onClick={resetForm}
                  className="w-full border border-slate-200 py-3 rounded-2xl font-semibold text-slate-600"
                >
                  Batal Edit
                </button>
              )}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Daftar Product
                </h2>

                <p className="text-sm text-slate-400 mt-1">
                  {filteredProducts.length} product ditemukan
                </p>
              </div>

              <div className="relative w-full md:w-[320px]">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

                <input
                  type="text"
                  placeholder="Cari product..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full border border-slate-200 rounded-2xl pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-slate-300"
                />
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-10 h-10 animate-spin text-slate-700" />
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden"
                  >
                    <div className="relative w-full h-52 bg-slate-100">
                      {product.imageUrl ? (
                        <Image
                          src={product.imageUrl}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-12 h-12 text-slate-300" />
                        </div>
                      )}
                    </div>

                    <div className="p-5">
                      <h3 className="font-bold text-lg text-slate-900">
                        {product.name}
                      </h3>

                      <p className="text-xs text-slate-400 font-medium mt-2">
                        Category: {product.category?.name || "-"}
                      </p>

                      <div className="flex items-center justify-between mt-5">
                        <div>
                          <h4 className="text-2xl font-bold text-slate-900">
                            Rp {product.sellingPrice.toLocaleString("id-ID")}
                          </h4>

                          <p className="text-xs text-slate-500 font-medium mt-1">
                            Stock: {product.stock}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 mt-5">
                        <button
                          onClick={() => handleEdit(product)}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 transition"
                        >
                          <Pencil className="w-4 h-4" />
                          Edit
                        </button>

                        <button
                          onClick={() => handleDelete(product.id)}
                          className="bg-red-50 hover:bg-red-100 text-red-600 py-3 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                          Hapus
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
