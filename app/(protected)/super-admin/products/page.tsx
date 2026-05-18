"use client";

import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import Image from "next/image";

import {
  Package,
  Plus,
  Search,
  Loader2,
  Tag,
  Trash2,
  Store,
  Boxes,
  Wallet,
  FolderPlus,
  X,
  ImagePlus,
} from "lucide-react";

import api from "@/lib/api";

type Category = {
  id: string;
  name: string;
};

type Outlet = {
  id: string;
  name: string;
};

type Product = {
  id: string;
  name: string;
  sku?: string;
  barcode?: string;
  stock: number;
  minStock: number;
  costPrice: number;
  sellingPrice: number;
  imageUrl?: string;

  category?: {
    id: string;
    name: string;
  };

  outlet?: {
    id: string;
    name: string;
  };
};

export default function ProductPage() {
  const [loading, setLoading] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [error, setError] =
    useState("");

  const [products, setProducts] =
    useState<Product[]>([]);

  const [categories, setCategories] =
    useState<Category[]>([]);

  const [outlets, setOutlets] =
    useState<Outlet[]>([]);

  const [selectedCategory, setSelectedCategory] =
    useState("");

  const [openCategoryModal, setOpenCategoryModal] =
    useState(false);

  const [openProductModal, setOpenProductModal] =
    useState(false);

  const [newCategory, setNewCategory] =
    useState("");

  const [imagePreview, setImagePreview] =
    useState("");

  const [productImage, setProductImage] =
    useState<File | null>(null);

  const [productForm, setProductForm] =
    useState({
      name: "",
      sku: "",
      barcode: "",
      stock: "",
      minStock: "",
      costPrice: "",
      sellingPrice: "",
      categoryId: "",
      outletId: "",
    });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      const [
        productsResponse,
        categoriesResponse,
        outletsResponse,
      ] = await Promise.all([
        api.get("/products"),
        api.get("/categories"),
        api.get("/outlets"),
      ]);

      setProducts(
        productsResponse.data || []
      );

      setCategories(
        categoriesResponse.data || []
      );

      setOutlets(
        outletsResponse.data || []
      );
    } catch (error: any) {
      console.error(error);

      setError(
        error?.response?.data?.message ||
          "Gagal mengambil data"
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchSearch =
        product.name
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        product.sku
          ?.toLowerCase()
          .includes(search.toLowerCase());

      const matchCategory =
        !selectedCategory ||
        product.category?.id ===
          selectedCategory;

      return (
        matchSearch && matchCategory
      );
    });
  }, [
    products,
    search,
    selectedCategory,
  ]);

  const totalStock = products.reduce(
    (acc, product) =>
      acc + product.stock,
    0
  );

  const totalValue = products.reduce(
    (acc, product) =>
      acc +
      product.stock *
        product.sellingPrice,
    0
  );

  const handleCreateCategory = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      setSubmitting(true);

      await api.post("/categories", {
        name: newCategory,
      });

      setNewCategory("");

      setOpenCategoryModal(false);

      fetchData();
    } catch (error: any) {
      console.error(error);

      alert(
        error?.response?.data?.message ||
          "Gagal membuat kategori"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setProductImage(file);

    setImagePreview(
      URL.createObjectURL(file)
    );
  };

  const handleCreateProduct = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      setSubmitting(true);

      const formData = new FormData();

      formData.append(
        "name",
        productForm.name
      );

      formData.append(
        "sku",
        productForm.sku
      );

      formData.append(
        "barcode",
        productForm.barcode
      );

      formData.append(
        "stock",
        productForm.stock
      );

      formData.append(
        "minStock",
        productForm.minStock
      );

      formData.append(
        "costPrice",
        productForm.costPrice
      );

      formData.append(
        "sellingPrice",
        productForm.sellingPrice
      );

      formData.append(
        "categoryId",
        productForm.categoryId
      );

      formData.append(
        "outletId",
        productForm.outletId
      );

      if (productImage) {
        formData.append(
          "image",
          productImage
        );
      }

      await api.post(
        "/products",
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      setOpenProductModal(false);

      setProductForm({
        name: "",
        sku: "",
        barcode: "",
        stock: "",
        minStock: "",
        costPrice: "",
        sellingPrice: "",
        categoryId: "",
        outletId: "",
      });

      setProductImage(null);

      setImagePreview("");

      fetchData();
    } catch (error: any) {
      console.error(error);

      alert(
        error?.response?.data?.message ||
          "Gagal tambah produk"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCategory = async (
    id: string,
    name: string
  ) => {
    const confirmed = confirm(
      `Hapus kategori ${name}?`
    );

    if (!confirmed) return;

    try {
      await api.delete(
        `/categories/${id}`
      );

      fetchData();
    } catch (error: any) {
      console.error(error);

      alert(
        error?.response?.data?.message ||
          "Gagal hapus kategori"
      );
    }
  };

  const handleDeleteProduct = async (
    id: string,
    name: string
  ) => {
    const confirmed = confirm(
      `Hapus produk ${name}?`
    );

    if (!confirmed) return;

    try {
      await api.delete(`/products/${id}`);

      fetchData();
    } catch (error: any) {
      console.error(error);

      alert(
        error?.response?.data?.message ||
          "Gagal hapus produk"
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">
      <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">
            Produk & Kategori
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            Kelola produk dan kategori
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() =>
              setOpenCategoryModal(true)
            }
            className="h-11 px-4 border border-slate-300 rounded-xl flex items-center gap-2 text-sm font-medium hover:bg-slate-100"
          >
            <FolderPlus className="w-4 h-4" />
            Kategori
          </button>

          <button
            onClick={() =>
              setOpenProductModal(true)
            }
            className="h-11 px-5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl flex items-center gap-2 text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Produk
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5">
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <p className="text-sm text-slate-500">
            Produk
          </p>

          <h2 className="text-2xl font-bold mt-2">
            {products.length}
          </h2>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <p className="text-sm text-slate-500">
            Kategori
          </p>

          <h2 className="text-2xl font-bold mt-2">
            {categories.length}
          </h2>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <p className="text-sm text-slate-500">
            Stock
          </p>

          <h2 className="text-2xl font-bold mt-2">
            {totalStock}
          </h2>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <p className="text-sm text-slate-500">
            Nilai
          </p>

          <h2 className="text-xl font-bold mt-2">
            Rp
            {totalValue.toLocaleString(
              "id-ID"
            )}
          </h2>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-4 mt-5">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />

          <input
            type="text"
            placeholder="Cari produk..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-full h-11 border border-slate-300 rounded-xl pl-10 pr-4"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-5 mt-5">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 h-fit">
          <h2 className="font-semibold mb-4">
            Kategori
          </h2>

          <div className="space-y-2">
            <button
              onClick={() =>
                setSelectedCategory("")
              }
              className={`w-full text-left px-4 py-3 rounded-xl ${
                selectedCategory === ""
                  ? "bg-slate-900 text-white"
                  : "hover:bg-slate-100"
              }`}
            >
              Semua Produk
            </button>

            {categories.map((category) => (
              <div
                key={category.id}
                className={`flex items-center justify-between rounded-xl ${
                  selectedCategory ===
                  category.id
                    ? "bg-pink-600 text-white"
                    : "hover:bg-slate-100"
                }`}
              >
                <button
                  onClick={() =>
                    setSelectedCategory(
                      category.id
                    )
                  }
                  className="flex-1 text-left px-4 py-3"
                >
                  {category.name}
                </button>

                <button
                  onClick={() =>
                    handleDeleteCategory(
                      category.id,
                      category.name
                    )
                  }
                  className="px-3"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          {loading ? (
            <div className="h-[400px] bg-white rounded-2xl border border-slate-200 flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {filteredProducts.map(
                (product) => (
                  <div
                    key={product.id}
                    className="bg-white border border-slate-200 rounded-2xl overflow-hidden"
                  >
                    <div className="relative h-52 bg-slate-100">
                      {product.imageUrl ? (
                        <Image
                          src={
                            product.imageUrl
                          }
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-14 h-14 text-slate-300" />
                        </div>
                      )}
                    </div>

                    <div className="p-5">
                      <h2 className="font-semibold">
                        {product.name}
                      </h2>

                      <p className="text-xs text-slate-400 mt-1">
                        SKU:{" "}
                        {product.sku || "-"}
                      </p>

                      <div className="mt-4 space-y-2 text-sm text-slate-500">
                        <div className="flex items-center gap-2">
                          <Tag className="w-4 h-4" />
                          {
                            product.category
                              ?.name
                          }
                        </div>

                        <div className="flex items-center gap-2">
                          <Store className="w-4 h-4" />
                          {
                            product.outlet
                              ?.name
                          }
                        </div>
                      </div>

                      <div className="mt-5 pt-4 border-t flex items-center justify-between">
                        <div>
                          <p className="text-xs text-slate-400">
                            Harga
                          </p>

                          <h3 className="text-lg font-bold text-pink-600">
                            Rp
                            {product.sellingPrice.toLocaleString(
                              "id-ID"
                            )}
                          </h3>
                        </div>

                        <button
                          onClick={() =>
                            handleDeleteProduct(
                              product.id,
                              product.name
                            )
                          }
                          className="w-10 h-10 rounded-xl border border-red-200 hover:bg-red-50 flex items-center justify-center"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </div>

      {openCategoryModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-md bg-white rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-semibold">
                Tambah Kategori
              </h2>

              <button
                onClick={() =>
                  setOpenCategoryModal(false)
                }
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={
                handleCreateCategory
              }
              className="space-y-4"
            >
              <input
                type="text"
                required
                placeholder="Nama kategori"
                value={newCategory}
                onChange={(e) =>
                  setNewCategory(
                    e.target.value
                  )
                }
                className="w-full h-11 border border-slate-300 rounded-xl px-4"
              />

              <button
                type="submit"
                className="w-full h-11 bg-slate-900 text-white rounded-xl"
              >
                Simpan
              </button>
            </form>
          </div>
        </div>
      )}

      {openProductModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="w-full max-w-2xl bg-white rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">
                Tambah Produk
              </h2>

              <button
                onClick={() =>
                  setOpenProductModal(false)
                }
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={handleCreateProduct}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div className="md:col-span-2">
                <label className="text-sm text-slate-600">
                  Foto Produk
                </label>

                <label className="mt-2 border-2 border-dashed border-slate-300 rounded-2xl h-56 flex flex-col items-center justify-center cursor-pointer overflow-hidden">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <>
                      <ImagePlus className="w-10 h-10 text-slate-400" />

                      <p className="text-sm text-slate-500 mt-3">
                        Upload gambar
                      </p>
                    </>
                  )}

                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={
                      handleImageChange
                    }
                  />
                </label>
              </div>

              <input
                type="text"
                required
                placeholder="Nama produk"
                value={productForm.name}
                onChange={(e) =>
                  setProductForm({
                    ...productForm,
                    name: e.target.value,
                  })
                }
                className="h-11 border border-slate-300 rounded-xl px-4"
              />

              <input
                type="text"
                placeholder="SKU"
                value={productForm.sku}
                onChange={(e) =>
                  setProductForm({
                    ...productForm,
                    sku: e.target.value,
                  })
                }
                className="h-11 border border-slate-300 rounded-xl px-4"
              />

              <input
                type="text"
                placeholder="Barcode"
                value={productForm.barcode}
                onChange={(e) =>
                  setProductForm({
                    ...productForm,
                    barcode:
                      e.target.value,
                  })
                }
                className="h-11 border border-slate-300 rounded-xl px-4"
              />

              <input
                type="number"
                required
                placeholder="Stock"
                value={productForm.stock}
                onChange={(e) =>
                  setProductForm({
                    ...productForm,
                    stock:
                      e.target.value,
                  })
                }
                className="h-11 border border-slate-300 rounded-xl px-4"
              />

              <input
                type="number"
                required
                placeholder="Min stock"
                value={
                  productForm.minStock
                }
                onChange={(e) =>
                  setProductForm({
                    ...productForm,
                    minStock:
                      e.target.value,
                  })
                }
                className="h-11 border border-slate-300 rounded-xl px-4"
              />

              <input
                type="number"
                required
                placeholder="Harga modal"
                value={
                  productForm.costPrice
                }
                onChange={(e) =>
                  setProductForm({
                    ...productForm,
                    costPrice:
                      e.target.value,
                  })
                }
                className="h-11 border border-slate-300 rounded-xl px-4"
              />

              <input
                type="number"
                required
                placeholder="Harga jual"
                value={
                  productForm.sellingPrice
                }
                onChange={(e) =>
                  setProductForm({
                    ...productForm,
                    sellingPrice:
                      e.target.value,
                  })
                }
                className="h-11 border border-slate-300 rounded-xl px-4"
              />

              <select
                required
                value={
                  productForm.categoryId
                }
                onChange={(e) =>
                  setProductForm({
                    ...productForm,
                    categoryId:
                      e.target.value,
                  })
                }
                className="h-11 border border-slate-300 rounded-xl px-4"
              >
                <option value="">
                  Pilih kategori
                </option>

                {categories.map(
                  (category) => (
                    <option
                      key={category.id}
                      value={category.id}
                    >
                      {category.name}
                    </option>
                  )
                )}
              </select>

              <div className="md:col-span-2">
                <select
                  required
                  value={
                    productForm.outletId
                  }
                  onChange={(e) =>
                    setProductForm({
                      ...productForm,
                      outletId:
                        e.target.value,
                    })
                  }
                  className="w-full h-11 border border-slate-300 rounded-xl px-4"
                >
                  <option value="">
                    Pilih outlet
                  </option>

                  {outlets.map((outlet) => (
                    <option
                      key={outlet.id}
                      value={outlet.id}
                    >
                      {outlet.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full h-11 bg-slate-900 text-white rounded-xl"
                >
                  {submitting
                    ? "Menyimpan..."
                    : "Simpan Produk"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}