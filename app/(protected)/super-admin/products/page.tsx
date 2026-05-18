"use client";

import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import Image from "next/image";

import {
  FolderPlus,
  ImagePlus,
  Loader2,
  Package,
  Pencil,
  Plus,
  Search,
  Store,
  Tag,
  Trash2,
  X,
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

const initialForm = {
  name: "",
  stock: "",
  minStock: "",
  costPrice: "",
  sellingPrice: "",
  categoryId: "",
  outletId: "",
};

export default function ProductPage() {
  const [loading, setLoading] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [products, setProducts] =
    useState<Product[]>([]);

  const [categories, setCategories] =
    useState<Category[]>([]);

  const [outlets, setOutlets] =
    useState<Outlet[]>([]);

  const [
    selectedCategory,
    setSelectedCategory,
  ] = useState("");

  const [
    openCategoryModal,
    setOpenCategoryModal,
  ] = useState(false);

  const [
    openProductModal,
    setOpenProductModal,
  ] = useState(false);

  const [
    editingProduct,
    setEditingProduct,
  ] = useState<Product | null>(
    null
  );

  const [newCategory, setNewCategory] =
    useState("");

  const [imagePreview, setImagePreview] =
    useState("");

  const [productImage, setProductImage] =
    useState<File | null>(null);

  const [productForm, setProductForm] =
    useState(initialForm);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    return () => {
      if (
        imagePreview &&
        imagePreview.startsWith(
          "blob:"
        )
      ) {
        URL.revokeObjectURL(
          imagePreview
        );
      }
    };
  }, [imagePreview]);

  const fetchData = async () => {
    try {
      setLoading(true);

      const [
        productsRes,
        categoriesRes,
        outletsRes,
      ] = await Promise.all([
        api.get("/products"),
        api.get("/categories"),
        api.get("/outlets"),
      ]);

      setProducts(
        productsRes.data || []
      );

      setCategories(
        categoriesRes.data || []
      );

      setOutlets(
        outletsRes.data || []
      );
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Gagal mengambil data"
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const keyword =
        search.toLowerCase();

      const matchSearch =
        product.name
          .toLowerCase()
          .includes(keyword) ||
        product.sku
          ?.toLowerCase()
          .includes(keyword);

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
    (acc, item) => acc + item.stock,
    0
  );

  const totalValue = products.reduce(
    (acc, item) =>
      acc +
      item.stock *
        item.sellingPrice,
    0
  );

  const resetProductForm = () => {
    setEditingProduct(null);

    setProductForm(initialForm);

    setProductImage(null);

    setImagePreview("");
  };

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setProductImage(file);

    if (
      imagePreview &&
      imagePreview.startsWith(
        "blob:"
      )
    ) {
      URL.revokeObjectURL(
        imagePreview
      );
    }

    setImagePreview(
      URL.createObjectURL(file)
    );
  };

  const handleCreateCategory =
    async (
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
      } catch (err: any) {
        alert(
          err?.response?.data
            ?.message ||
            "Gagal tambah kategori"
        );
      } finally {
        setSubmitting(false);
      }
    };

  const submitProduct = async (
    method: "post" | "patch"
  ) => {
    const formData =
      new FormData();

    Object.entries(
      productForm
    ).forEach(([key, value]) => {
      if (value) {
        formData.append(key, value);
      }
    });

    if (productImage) {
      formData.append(
        "image",
        productImage
      );
    }

    if (method === "post") {
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
    } else {
      await api.patch(
        `/products/${editingProduct?.id}`,
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );
    }
  };

  const handleSubmitProduct =
    async (
      e: React.FormEvent
    ) => {
      e.preventDefault();

      try {
        setSubmitting(true);

        await submitProduct(
          editingProduct
            ? "patch"
            : "post"
        );

        resetProductForm();

        setOpenProductModal(false);

        fetchData();
      } catch (err: any) {
        alert(
          err?.response?.data
            ?.message ||
            "Gagal simpan produk"
        );
      } finally {
        setSubmitting(false);
      }
    };

  const handleEditClick = (
    product: Product
  ) => {
    setEditingProduct(product);

    setProductForm({
      name: product.name || "",
      stock: String(
        product.stock || ""
      ),
      minStock: String(
        product.minStock || ""
      ),
      costPrice: String(
        product.costPrice || ""
      ),
      sellingPrice: String(
        product.sellingPrice || ""
      ),
      categoryId:
        product.category?.id || "",
      outletId:
        product.outlet?.id || "",
    });

    setImagePreview(
      product.imageUrl || ""
    );

    setOpenProductModal(true);
  };

  const handleDeleteCategory =
    async (
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
      } catch (err: any) {
        alert(
          err?.response?.data
            ?.message ||
            "Gagal hapus kategori"
        );
      }
    };

  const handleDeleteProduct =
    async (
      id: string,
      name: string
    ) => {
      const confirmed = confirm(
        `Hapus produk ${name}?`
      );

      if (!confirmed) return;

      try {
        await api.delete(
          `/products/${id}`
        );

        fetchData();
      } catch (err: any) {
        alert(
          err?.response?.data
            ?.message ||
            "Gagal hapus produk"
        );
      }
    };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 animate-spin text-slate-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">
      <div className="bg-white border border-slate-200 rounded-3xl p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Produk &
            Kategori
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            Kelola data produk
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() =>
              setOpenCategoryModal(
                true
              )
            }
            className="h-11 px-4 border border-slate-300 rounded-2xl flex items-center gap-2 hover:bg-slate-100 transition"
          >
            <FolderPlus className="w-4 h-4" />
            Kategori
          </button>

          <button
            onClick={() => {
              resetProductForm();

              setOpenProductModal(
                true
              );
            }}
            className="h-11 px-5 bg-slate-900 text-white rounded-2xl flex items-center gap-2 hover:bg-slate-800 transition"
          >
            <Plus className="w-4 h-4" />
            Produk
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-5 bg-red-50 border border-red-200 text-red-600 rounded-2xl px-4 py-3 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5">
        <Card
          title="Produk"
          value={products.length}
        />

        <Card
          title="Kategori"
          value={categories.length}
        />

        <Card
          title="Stock"
          value={totalStock}
        />

        <Card
          title="Nilai"
          value={`Rp ${totalValue.toLocaleString(
            "id-ID"
          )}`}
        />
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl p-4 mt-5">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />

            <input
              type="text"
              placeholder="Cari produk..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              className="w-full h-11 border border-slate-300 rounded-2xl pl-10 pr-4 outline-none"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) =>
              setSelectedCategory(
                e.target.value
              )
            }
            className="h-11 border border-slate-300 rounded-2xl px-4 outline-none"
          >
            <option value="">
              Semua kategori
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
        </div>
      </div>

      {filteredProducts.length ===
      0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-10 mt-5 text-center">
          <Package className="w-14 h-14 text-slate-300 mx-auto" />

          <h2 className="mt-4 font-semibold text-lg">
            Produk tidak ditemukan
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Tambahkan produk baru
            atau ubah pencarian
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mt-5">
          {filteredProducts.map(
            (
              product,
              index
            ) => (
              <div
                key={product.id}
                className="bg-white border border-slate-200 rounded-3xl overflow-hidden"
              >
                <div className="relative h-56 bg-slate-100">
                  <div className="absolute top-3 right-3 z-10 bg-slate-900 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    Stock{" "}
                    {product.stock}
                  </div>

                  {product.imageUrl ? (
                    <Image
                      src={
                        product.imageUrl
                      }
                      alt={
                        product.name
                      }
                      fill
                      priority={
                        index === 0
                      }
                      loading={
                        index === 0
                          ? "eager"
                          : "lazy"
                      }
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-16 h-16 text-slate-300" />
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <h2 className="font-semibold text-lg line-clamp-1">
                    {product.name}
                  </h2>

                  <p className="text-xs text-slate-400 mt-1">
                    SKU:{" "}
                    {product.sku ||
                      "-"}
                  </p>

                  <p className="text-xs text-slate-400">
                    Barcode:{" "}
                    {product.barcode ||
                      "-"}
                  </p>

                  <div className="mt-4 space-y-2 text-sm text-slate-500">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4" />
                      <span>
                        {product
                          .category
                          ?.name ||
                          "-"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Store className="w-4 h-4" />
                      <span>
                        {product
                          .outlet
                          ?.name ||
                          "-"}
                      </span>
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-400">
                        Harga
                      </p>

                      <h3 className="text-xl font-bold text-pink-600">
                        Rp
                        {product.sellingPrice.toLocaleString(
                          "id-ID"
                        )}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          handleEditClick(
                            product
                          )
                        }
                        className="w-11 h-11 rounded-2xl border border-blue-200 flex items-center justify-center hover:bg-blue-50 transition"
                      >
                        <Pencil className="w-4 h-4 text-blue-500" />
                      </button>

                      <button
                        onClick={() =>
                          handleDeleteProduct(
                            product.id,
                            product.name
                          )
                        }
                        className="w-11 h-11 rounded-2xl border border-red-200 flex items-center justify-center hover:bg-red-50 transition"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      )}

      {openCategoryModal && (
        <Modal>
          <form
            onSubmit={
              handleCreateCategory
            }
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">
                Tambah Kategori
              </h2>

              <button
                type="button"
                onClick={() =>
                  setOpenCategoryModal(
                    false
                  )
                }
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <Input
              placeholder="Nama kategori"
              value={newCategory}
              onChange={(e) =>
                setNewCategory(
                  e.target.value
                )
              }
            />

            <button
              type="submit"
              disabled={submitting}
              className="w-full h-11 bg-slate-900 text-white rounded-2xl"
            >
              {submitting
                ? "Menyimpan..."
                : "Simpan"}
            </button>
          </form>
        </Modal>
      )}

      {openProductModal && (
        <Modal maxWidth="max-w-2xl">
          <form
            onSubmit={
              handleSubmitProduct
            }
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">
                {editingProduct
                  ? "Edit Produk"
                  : "Tambah Produk"}
              </h2>

              <button
                type="button"
                onClick={() => {
                  setOpenProductModal(
                    false
                  );

                  resetProductForm();
                }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <label className="h-56 border-2 border-dashed border-slate-300 rounded-3xl overflow-hidden flex items-center justify-center cursor-pointer relative">
              {imagePreview ? (
                <Image
                  src={imagePreview}
                  alt="Preview"
                  fill
                  loading="lazy"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              ) : (
                <div className="flex flex-col items-center">
                  <ImagePlus className="w-10 h-10 text-slate-400" />

                  <p className="text-sm text-slate-500 mt-3">
                    Upload gambar
                  </p>
                </div>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="Nama produk"
                value={
                  productForm.name
                }
                onChange={(e) =>
                  setProductForm({
                    ...productForm,
                    name:
                      e.target.value,
                  })
                }
              />

              <Input
                type="number"
                placeholder="Stock"
                value={
                  productForm.stock
                }
                onChange={(e) =>
                  setProductForm({
                    ...productForm,
                    stock:
                      e.target.value,
                  })
                }
              />

              <Input
                type="number"
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
              />

              <Input
                type="number"
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
              />

              <Input
                type="number"
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
                className="h-11 border border-slate-300 rounded-2xl px-4 outline-none"
              >
                <option value="">
                  Pilih kategori
                </option>

                {categories.map(
                  (category) => (
                    <option
                      key={
                        category.id
                      }
                      value={
                        category.id
                      }
                    >
                      {
                        category.name
                      }
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
                  className="w-full h-11 border border-slate-300 rounded-2xl px-4 outline-none"
                >
                  <option value="">
                    Pilih outlet
                  </option>

                  {outlets.map(
                    (outlet) => (
                      <option
                        key={
                          outlet.id
                        }
                        value={
                          outlet.id
                        }
                      >
                        {
                          outlet.name
                        }
                      </option>
                    )
                  )}
                </select>
              </div>

              <div className="md:col-span-2">
                <div className="bg-slate-100 border border-slate-200 rounded-2xl px-4 py-3">
                  <p className="text-sm text-slate-500">
                    SKU dan Barcode
                    otomatis dibuat
                    sistem
                  </p>
                </div>
              </div>

              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={
                    submitting
                  }
                  className="w-full h-11 bg-slate-900 text-white rounded-2xl"
                >
                  {submitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Menyimpan...
                    </span>
                  ) : editingProduct ? (
                    "Update Produk"
                  ) : (
                    "Simpan Produk"
                  )}
                </button>
              </div>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

function Card({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-5">
      <p className="text-sm text-slate-500">
        {title}
      </p>

      <h2 className="text-2xl font-bold mt-2">
        {value}
      </h2>
    </div>
  );
}

function Modal({
  children,
  maxWidth = "max-w-md",
}: {
  children: React.ReactNode;
  maxWidth?: string;
}) {
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div
        className={`w-full ${maxWidth} bg-white rounded-3xl p-6`}
      >
        {children}
      </div>
    </div>
  );
}

function Input({
  type = "text",
  placeholder,
  value,
  onChange,
}: {
  type?: string;
  placeholder: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
}) {
  return (
    <input
      required
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full h-11 border border-slate-300 rounded-2xl px-4 outline-none"
    />
  );
}