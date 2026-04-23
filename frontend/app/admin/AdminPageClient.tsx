"use client";

import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { useAuth } from "@/app/AuthContext";
import { useCart } from "@/app/CartContext";
import { Container } from "@/components/layout/Container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useComplements } from "@/hooks/useComplements";
import { useMaterialsData } from "@/hooks/useMaterialsData";
import { useSupplements } from "@/hooks/useSupplements";
import { api } from "@/lib/api";
import { createMaterialId, MaterialItem } from "@/lib/materials";
import { formatPrice } from "@/lib/productPricing";
import type { Complement, Supplement } from "@/types";

interface ProductFormState {
  type: "supplement" | "complement" | "material";
  name: string;
  category: string;
  description: string;
  image: string;
  purpose: string;
  level: "Essential" | "Power" | "Recovery";
  icon: "grip" | "belt" | "salts" | "chalk" | "sleeves";
  dosage: string;
  timing: string;
  duration: string;
  biologicalRole: string;
  dailyMen: string;
  dailyWomen: string;
  dailyPregnant: string;
  dailyAthletes: string;
}

interface EditProductState {
  id: string;
  type: "supplement" | "complement" | "material";
  name: string;
  category: string;
  description: string;
  image: string;
  purpose: string;
  level: "Essential" | "Power" | "Recovery";
  icon: "grip" | "belt" | "salts" | "chalk" | "sleeves";
  dosage: string;
  timing: string;
  duration: string;
  biologicalRole: string;
  dailyMen: string;
  dailyWomen: string;
  dailyPregnant: string;
  dailyAthletes: string;
}

const supplementCategories = [
  "proteins",
  "creatine",
  "bcaa",
  "pre-workout",
  "recovery",
] as const;

const complementCategories = [
  "vitamin",
  "mineral",
  "antioxidant",
  "omega",
  "adaptogen",
] as const;

const materialCategories = [
  "Grip Support",
  "Core Stability",
  "PR Focus",
  "Grip Control",
  "Joint Support",
] as const;

const normalizeSupplementDescription = (description: string, name: string) => {
  const trimmed = description.trim();

  if (trimmed.length >= 50) {
    return trimmed;
  }

  return `${trimmed || name} is designed to support training performance, practical daily use, and consistent results for active users.`;
};

const extractApiErrorMessage = (error: unknown, fallback: string): string => {
  if (error instanceof AxiosError) {
    const apiMessage =
      (error.response?.data as { error?: string; message?: string } | undefined)
        ?.error ??
      (error.response?.data as { error?: string; message?: string } | undefined)
        ?.message;

    if (apiMessage) {
      return apiMessage;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
};

/**
 * WHY: Give admins basic create/delete controls plus customer/client visibility.
 */
export const AdminPageClient = () => {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const { orderHistory } = useCart();
  const { materials, setMaterials } = useMaterialsData();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [editing, setEditing] = useState<EditProductState | null>(null);
  const [form, setForm] = useState<ProductFormState>({
    type: "supplement",
    name: "",
    category: "proteins",
    description: "",
    image: "",
    purpose: "",
    level: "Essential",
    icon: "grip",
    dosage: "",
    timing: "",
    duration: "",
    biologicalRole: "",
    dailyMen: "",
    dailyWomen: "",
    dailyPregnant: "",
    dailyAthletes: "",
  });

  const supplementsQuery = useSupplements({
    page: 1,
    limit: 100,
    sort: "-createdAt",
  });
  const complementsQuery = useComplements({
    page: 1,
    limit: 100,
    sort: "-createdAt",
  });

  const customers = useMemo(() => {
    const seen = new Set<string>();
    return orderHistory.filter((order) => {
      const key = `${order.customerName}|${order.deliveryAddress}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }, [orderHistory]);

  const clientsByCity = useMemo(() => {
    const cityMap = new Map<string, number>();
    orderHistory.forEach((order) => {
      cityMap.set(order.city, (cityMap.get(order.city) ?? 0) + 1);
    });

    return Array.from(cityMap.entries())
      .map(([city, count]) => ({ city, count }))
      .sort((a, b) => b.count - a.count);
  }, [orderHistory]);

  const isAdminUser =
    user?.role === "admin" || user?.name?.toLowerCase().includes("admin");

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login?redirect=/admin");
    }
  }, [isLoading, router, user]);

  const allSupplements = supplementsQuery.data?.data ?? [];
  const allComplements = complementsQuery.data?.data ?? [];

  const resetForm = () => {
    setForm((current) => ({
      ...current,
      name: "",
      description: "",
      image: "",
      purpose: "",
      level: "Essential",
      icon: "grip",
      dosage: "",
      timing: "",
      duration: "",
      biologicalRole: "",
      dailyMen: "",
      dailyWomen: "",
      dailyPregnant: "",
      dailyAthletes: "",
    }));
  };

  const handleCreateProduct = async () => {
    if (!form.name || !form.description) {
      setNotice("Name and description are required.");
      return;
    }

    setIsSubmitting(true);
    setNotice(null);

    try {
      if (form.type === "supplement") {
        const payload = {
          name: form.name,
          category: form.category,
          description: normalizeSupplementDescription(
            form.description,
            form.name,
          ),
          dosage: form.dosage || "1 serving",
          timing: form.timing || "Pre workout",
          duration: form.duration || "Daily",
          benefits: ["Performance support"],
          ingredients: ["Proprietary blend"],
          contraindications: [],
          images: form.image ? [form.image] : [],
          goals: ["mass"],
          popularity: 50,
        };

        await api.post("/supplements", payload);
        await supplementsQuery.refetch();
      } else if (form.type === "complement") {
        const payload = {
          name: form.name,
          category: form.category,
          description: form.description,
          biologicalRole: form.biologicalRole || "General wellness support",
          deficiencySymptoms: [],
          foodSources: [],
          dailyIntake: {
            men: form.dailyMen || "As directed",
            women: form.dailyWomen || "As directed",
            pregnant: form.dailyPregnant || "Consult physician",
            athletes: form.dailyAthletes || "As directed",
          },
          supplementForms: [],
          interactions: [],
          contraindications: [],
          images: form.image ? [form.image] : [],
        };

        await api.post("/complements", payload);
        await complementsQuery.refetch();
      } else {
        const priceAsNumber = Number(form.dailyAthletes || "0");
        const nextMaterial: MaterialItem = {
          id: createMaterialId(form.name, materials),
          name: form.name,
          category: form.category,
          purpose: form.purpose || "General training support.",
          description: form.description,
          price: Number.isFinite(priceAsNumber) ? priceAsNumber : 0,
          image: form.image,
          icon: form.icon,
          level: form.level,
        };

        setMaterials((current) => [...current, nextMaterial]);
      }

      setNotice("Product created successfully.");
      resetForm();
    } catch (error) {
      setNotice(extractApiErrorMessage(error, "Failed to create product."));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = async (
    type: "supplement" | "complement" | "material",
    id: string,
  ) => {
    const confirmed = window.confirm(
      "Delete this product permanently? This action cannot be undone.",
    );
    if (!confirmed) {
      return;
    }

    try {
      if (type === "material") {
        setMaterials((current) =>
          current.filter((material) => material.id !== id),
        );
      } else {
        await api.delete(
          `/${type === "supplement" ? "supplements" : "complements"}/${id}`,
        );
      }

      if (type === "supplement") {
        await supplementsQuery.refetch();
      } else if (type === "complement") {
        await complementsQuery.refetch();
      }
      setNotice("Product deleted successfully.");
    } catch (error) {
      setNotice(extractApiErrorMessage(error, "Failed to delete product."));
    }
  };

  const startEditSupplement = (supplement: Supplement) => {
    setEditing({
      id: supplement._id,
      type: "supplement",
      name: supplement.name,
      category: supplement.category,
      description: supplement.description,
      image: supplement.images?.[0] ?? "",
      purpose: "",
      level: "Essential",
      icon: "grip",
      dosage: supplement.dosage,
      timing: supplement.timing,
      duration: supplement.duration,
      biologicalRole: "",
      dailyMen: "",
      dailyWomen: "",
      dailyPregnant: "",
      dailyAthletes: "",
    });
    setNotice(null);
  };

  const startEditComplement = (complement: Complement) => {
    setEditing({
      id: complement._id,
      type: "complement",
      name: complement.name,
      category: complement.category,
      description: complement.description,
      image: complement.images?.[0] ?? "",
      purpose: "",
      level: "Essential",
      icon: "grip",
      dosage: "",
      timing: "",
      duration: "",
      biologicalRole: complement.biologicalRole,
      dailyMen: complement.dailyIntake?.men ?? "",
      dailyWomen: complement.dailyIntake?.women ?? "",
      dailyPregnant: complement.dailyIntake?.pregnant ?? "",
      dailyAthletes: complement.dailyIntake?.athletes ?? "",
    });
    setNotice(null);
  };

  const startEditMaterial = (material: MaterialItem) => {
    setEditing({
      id: material.id,
      type: "material",
      name: material.name,
      category: material.category,
      description: material.description,
      image: material.image,
      purpose: material.purpose,
      level: material.level,
      icon: material.icon,
      dosage: "",
      timing: "",
      duration: "",
      biologicalRole: "",
      dailyMen: "",
      dailyWomen: "",
      dailyPregnant: "",
      dailyAthletes: String(material.price),
    });
    setNotice(null);
  };

  const handleUpdateProduct = async () => {
    if (!editing) {
      return;
    }

    setIsUpdating(true);
    setNotice(null);

    try {
      if (editing.type === "supplement") {
        const payload = {
          name: editing.name,
          category: editing.category,
          description: normalizeSupplementDescription(
            editing.description,
            editing.name,
          ),
          dosage: editing.dosage,
          timing: editing.timing,
          duration: editing.duration,
          images: editing.image ? [editing.image] : [],
        };

        await api.put(`/supplements/${editing.id}`, payload);
        await supplementsQuery.refetch();
      } else if (editing.type === "complement") {
        const payload = {
          name: editing.name,
          category: editing.category,
          description: editing.description,
          biologicalRole: editing.biologicalRole,
          dailyIntake: {
            men: editing.dailyMen || "As directed",
            women: editing.dailyWomen || "As directed",
            pregnant: editing.dailyPregnant || "Consult physician",
            athletes: editing.dailyAthletes || "As directed",
          },
          images: editing.image ? [editing.image] : [],
        };

        await api.put(`/complements/${editing.id}`, payload);
        await complementsQuery.refetch();
      } else {
        const parsedPrice = Number(editing.dailyAthletes || "0");
        setMaterials((current) =>
          current.map((material) =>
            material.id === editing.id
              ? {
                  ...material,
                  name: editing.name,
                  category: editing.category,
                  description: editing.description,
                  image: editing.image,
                  purpose: editing.purpose,
                  level: editing.level,
                  icon: editing.icon,
                  price: Number.isFinite(parsedPrice) ? parsedPrice : 0,
                }
              : material,
          ),
        );
      }

      setNotice("Product updated successfully.");
      setEditing(null);
    } catch (error) {
      setNotice(extractApiErrorMessage(error, "Failed to update product."));
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 py-10">
        <Container>
          <Card className="border-dashed">
            <CardContent className="py-16 text-center">
              <h1 className="text-2xl font-bold text-slate-900">
                Loading Admin Access
              </h1>
              <p className="mt-2 text-slate-600">
                Checking your account and redirecting to login if needed.
              </p>
            </CardContent>
          </Card>
        </Container>
      </div>
    );
  }

  if (!isAdminUser) {
    return (
      <div className="min-h-screen bg-gray-50 py-10">
        <Container>
          <Card className="border-dashed">
            <CardContent className="py-16 text-center">
              <h1 className="text-2xl font-bold text-slate-900">
                Admin Access Required
              </h1>
              <p className="mt-2 text-slate-600">
                This page is available for admin users only.
              </p>
            </CardContent>
          </Card>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Container>
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900">Admin Dashboard</h1>
          <p className="mt-2 text-slate-600">
            Add or delete products, and monitor customer/client activity.
          </p>
          {notice && (
            <p className="mt-3 rounded-lg bg-cyan-50 px-3 py-2 text-sm text-cyan-800">
              {notice}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <Card className="xl:col-span-1">
            <CardHeader>
              <CardTitle>Add Product</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <select
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                value={form.type}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    type: event.target.value as
                      | "supplement"
                      | "complement"
                      | "material",
                    category:
                      event.target.value === "supplement"
                        ? "proteins"
                        : event.target.value === "complement"
                          ? "vitamin"
                          : "Grip Support",
                  }))
                }
              >
                <option value="supplement">Supplement</option>
                <option value="complement">Complement</option>
                <option value="material">Material</option>
              </select>

              <input
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                placeholder="Product name"
                value={form.name}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    name: event.target.value,
                  }))
                }
              />

              <select
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                value={form.category}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    category: event.target.value,
                  }))
                }
              >
                {(form.type === "supplement"
                  ? supplementCategories
                  : form.type === "complement"
                    ? complementCategories
                    : materialCategories
                ).map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              <textarea
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                rows={3}
                placeholder="Description"
                value={form.description}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    description: event.target.value,
                  }))
                }
              />

              <input
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                placeholder="Image URL"
                value={form.image}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    image: event.target.value,
                  }))
                }
              />

              {form.type === "supplement" ? (
                <>
                  <input
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                    placeholder="Dosage"
                    value={form.dosage}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        dosage: event.target.value,
                      }))
                    }
                  />
                  <input
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                    placeholder="Timing"
                    value={form.timing}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        timing: event.target.value,
                      }))
                    }
                  />
                  <input
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                    placeholder="Duration"
                    value={form.duration}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        duration: event.target.value,
                      }))
                    }
                  />
                </>
              ) : form.type === "complement" ? (
                <>
                  <input
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                    placeholder="Biological role"
                    value={form.biologicalRole}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        biologicalRole: event.target.value,
                      }))
                    }
                  />
                  <input
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                    placeholder="Daily intake men"
                    value={form.dailyMen}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        dailyMen: event.target.value,
                      }))
                    }
                  />
                  <input
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                    placeholder="Daily intake women"
                    value={form.dailyWomen}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        dailyWomen: event.target.value,
                      }))
                    }
                  />
                </>
              ) : (
                <>
                  <input
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                    placeholder="Purpose"
                    value={form.purpose}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        purpose: event.target.value,
                      }))
                    }
                  />
                  <select
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                    value={form.level}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        level: event.target.value as
                          | "Essential"
                          | "Power"
                          | "Recovery",
                      }))
                    }
                  >
                    <option value="Essential">Essential</option>
                    <option value="Power">Power</option>
                    <option value="Recovery">Recovery</option>
                  </select>
                  <select
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                    value={form.icon}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        icon: event.target.value as
                          | "grip"
                          | "belt"
                          | "salts"
                          | "chalk"
                          | "sleeves",
                      }))
                    }
                  >
                    <option value="grip">Grip</option>
                    <option value="belt">Belt</option>
                    <option value="salts">Salts</option>
                    <option value="chalk">Chalk</option>
                    <option value="sleeves">Sleeves</option>
                  </select>
                  <input
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                    placeholder="Price"
                    value={form.dailyAthletes}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        dailyAthletes: event.target.value,
                      }))
                    }
                  />
                </>
              )}

              <Button
                className="w-full"
                onClick={handleCreateProduct}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Add Product"}
              </Button>
              {notice && (
                <p className="rounded-lg bg-cyan-50 px-3 py-2 text-sm text-cyan-800">
                  {notice}
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="xl:col-span-2">
            <CardHeader>
              <CardTitle>Manage Products</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {editing && (
                <div className="rounded-xl border border-cyan-200 bg-cyan-50/60 p-4">
                  <h3 className="mb-3 text-lg font-semibold text-cyan-900">
                    Edit{" "}
                    {editing.type === "supplement"
                      ? "Supplement"
                      : editing.type === "complement"
                        ? "Complement"
                        : "Material"}
                  </h3>
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <input
                      className="rounded-md border border-slate-300 px-3 py-2 text-sm"
                      value={editing.name}
                      onChange={(event) =>
                        setEditing((current) =>
                          current
                            ? { ...current, name: event.target.value }
                            : current,
                        )
                      }
                      placeholder="Name"
                    />
                    <input
                      className="rounded-md border border-slate-300 px-3 py-2 text-sm"
                      value={editing.image}
                      onChange={(event) =>
                        setEditing((current) =>
                          current
                            ? { ...current, image: event.target.value }
                            : current,
                        )
                      }
                      placeholder="Image URL"
                    />
                    <textarea
                      className="rounded-md border border-slate-300 px-3 py-2 text-sm md:col-span-2"
                      rows={3}
                      value={editing.description}
                      onChange={(event) =>
                        setEditing((current) =>
                          current
                            ? { ...current, description: event.target.value }
                            : current,
                        )
                      }
                      placeholder="Description"
                    />

                    {editing.type === "supplement" ? (
                      <>
                        <input
                          className="rounded-md border border-slate-300 px-3 py-2 text-sm"
                          value={editing.dosage}
                          onChange={(event) =>
                            setEditing((current) =>
                              current
                                ? { ...current, dosage: event.target.value }
                                : current,
                            )
                          }
                          placeholder="Dosage"
                        />
                        <input
                          className="rounded-md border border-slate-300 px-3 py-2 text-sm"
                          value={editing.timing}
                          onChange={(event) =>
                            setEditing((current) =>
                              current
                                ? { ...current, timing: event.target.value }
                                : current,
                            )
                          }
                          placeholder="Timing"
                        />
                        <input
                          className="rounded-md border border-slate-300 px-3 py-2 text-sm"
                          value={editing.duration}
                          onChange={(event) =>
                            setEditing((current) =>
                              current
                                ? { ...current, duration: event.target.value }
                                : current,
                            )
                          }
                          placeholder="Duration"
                        />
                      </>
                    ) : editing.type === "complement" ? (
                      <>
                        <input
                          className="rounded-md border border-slate-300 px-3 py-2 text-sm md:col-span-2"
                          value={editing.biologicalRole}
                          onChange={(event) =>
                            setEditing((current) =>
                              current
                                ? {
                                    ...current,
                                    biologicalRole: event.target.value,
                                  }
                                : current,
                            )
                          }
                          placeholder="Biological role"
                        />
                        <input
                          className="rounded-md border border-slate-300 px-3 py-2 text-sm"
                          value={editing.dailyMen}
                          onChange={(event) =>
                            setEditing((current) =>
                              current
                                ? { ...current, dailyMen: event.target.value }
                                : current,
                            )
                          }
                          placeholder="Daily intake men"
                        />
                        <input
                          className="rounded-md border border-slate-300 px-3 py-2 text-sm"
                          value={editing.dailyWomen}
                          onChange={(event) =>
                            setEditing((current) =>
                              current
                                ? { ...current, dailyWomen: event.target.value }
                                : current,
                            )
                          }
                          placeholder="Daily intake women"
                        />
                      </>
                    ) : (
                      <>
                        <input
                          className="rounded-md border border-slate-300 px-3 py-2 text-sm"
                          value={editing.purpose}
                          onChange={(event) =>
                            setEditing((current) =>
                              current
                                ? { ...current, purpose: event.target.value }
                                : current,
                            )
                          }
                          placeholder="Purpose"
                        />
                        <input
                          className="rounded-md border border-slate-300 px-3 py-2 text-sm"
                          value={editing.dailyAthletes}
                          onChange={(event) =>
                            setEditing((current) =>
                              current
                                ? {
                                    ...current,
                                    dailyAthletes: event.target.value,
                                  }
                                : current,
                            )
                          }
                          placeholder="Price"
                        />
                        <select
                          className="rounded-md border border-slate-300 px-3 py-2 text-sm"
                          value={editing.level}
                          onChange={(event) =>
                            setEditing((current) =>
                              current
                                ? {
                                    ...current,
                                    level: event.target.value as
                                      | "Essential"
                                      | "Power"
                                      | "Recovery",
                                  }
                                : current,
                            )
                          }
                        >
                          <option value="Essential">Essential</option>
                          <option value="Power">Power</option>
                          <option value="Recovery">Recovery</option>
                        </select>
                        <select
                          className="rounded-md border border-slate-300 px-3 py-2 text-sm"
                          value={editing.icon}
                          onChange={(event) =>
                            setEditing((current) =>
                              current
                                ? {
                                    ...current,
                                    icon: event.target.value as
                                      | "grip"
                                      | "belt"
                                      | "salts"
                                      | "chalk"
                                      | "sleeves",
                                  }
                                : current,
                            )
                          }
                        >
                          <option value="grip">Grip</option>
                          <option value="belt">Belt</option>
                          <option value="salts">Salts</option>
                          <option value="chalk">Chalk</option>
                          <option value="sleeves">Sleeves</option>
                        </select>
                      </>
                    )}
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button onClick={handleUpdateProduct} disabled={isUpdating}>
                      {isUpdating ? "Updating..." : "Save changes"}
                    </Button>
                    <Button variant="outline" onClick={() => setEditing(null)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              <div>
                <h3 className="mb-2 text-lg font-semibold text-slate-900">
                  Supplements
                </h3>
                <div className="max-h-96 space-y-2 overflow-y-auto pr-1">
                  {allSupplements.map((supplement) => (
                    <div
                      key={supplement._id}
                      className="flex items-center justify-between rounded-lg border border-slate-200 p-3"
                    >
                      <div>
                        <p className="font-semibold text-slate-900">
                          {supplement.name}
                        </p>
                        <p className="text-xs uppercase text-slate-500">
                          {supplement.category}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => startEditSupplement(supplement)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() =>
                            handleDeleteProduct("supplement", supplement._id)
                          }
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="mb-2 text-lg font-semibold text-slate-900">
                  Complements
                </h3>
                <div className="max-h-96 space-y-2 overflow-y-auto pr-1">
                  {allComplements.map((complement) => (
                    <div
                      key={complement._id}
                      className="flex items-center justify-between rounded-lg border border-slate-200 p-3"
                    >
                      <div>
                        <p className="font-semibold text-slate-900">
                          {complement.name}
                        </p>
                        <p className="text-xs uppercase text-slate-500">
                          {complement.category}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => startEditComplement(complement)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() =>
                            handleDeleteProduct("complement", complement._id)
                          }
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="mb-2 text-lg font-semibold text-slate-900">
                  Materials
                </h3>
                <div className="max-h-96 space-y-2 overflow-y-auto pr-1">
                  {materials.map((material) => (
                    <div
                      key={material.id}
                      className="flex items-center justify-between rounded-lg border border-slate-200 p-3"
                    >
                      <div>
                        <p className="font-semibold text-slate-900">
                          {material.name}
                        </p>
                        <p className="text-xs uppercase text-slate-500">
                          {material.category} • {formatPrice(material.price)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => startEditMaterial(material)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() =>
                            handleDeleteProduct("material", material.id)
                          }
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Customers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {customers.length === 0 ? (
                <p className="text-sm text-slate-500">
                  No customer orders yet.
                </p>
              ) : (
                customers.map((order) => (
                  <div
                    key={order.orderNumber}
                    className="rounded-lg border border-slate-200 p-3"
                  >
                    <p className="font-semibold text-slate-900">
                      {order.customerName}
                    </p>
                    <p className="text-sm text-slate-600">
                      {order.deliveryAddress}
                    </p>
                    <p className="text-xs text-slate-500">{order.city}</p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Clients</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {clientsByCity.length === 0 ? (
                <p className="text-sm text-slate-500">
                  No client activity yet.
                </p>
              ) : (
                clientsByCity.map((client) => (
                  <div
                    key={client.city}
                    className="flex items-center justify-between rounded-lg border border-slate-200 p-3"
                  >
                    <p className="font-medium text-slate-900">{client.city}</p>
                    <Badge variant="secondary">{client.count} orders</Badge>
                  </div>
                ))
              )}

              <div className="rounded-lg bg-slate-50 p-3 text-sm text-slate-600">
                Lifetime sales:{" "}
                {formatPrice(
                  orderHistory.reduce((sum, order) => sum + order.total, 0),
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </Container>
    </div>
  );
};
