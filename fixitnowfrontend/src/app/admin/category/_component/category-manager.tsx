"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  toggleCategoryStatusAction,
  deleteCategoryAction,
  toggleServiceStatusAction,
  deleteServiceAction,
} from "@/app/admin/actions";
import { toast } from "react-toastify";
import {
  Plus,
  Edit2,
  Trash2,
  Power,
  CheckCircle,
  XCircle,
  Search,
  Layers,
  Wrench,
} from "lucide-react";
import CategoryModal from "./category-modal";
import ServiceModal from "./service-modal";

type CategoryItem = {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
};

type ServiceItem = {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  isActive: boolean;
  categoryName: string | null;
};

type Props = {
  categories: CategoryItem[];
  services: ServiceItem[];
};

export default function CategoryManager({ categories, services }: Props) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"categories" | "services">(
    "categories",
  );
  const [searchTerm, setSearchTerm] = useState("");

  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<CategoryItem | null>(null);

  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceItem | null>(
    null,
  );

  const [loadingId, setLoadingId] = useState<string | null>(null);

  const filteredCategories = categories.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const filteredServices = services.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.categoryName &&
        s.categoryName.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  const handleToggleCatStatus = async (cat: CategoryItem) => {
    setLoadingId(cat.id);
    const res = await toggleCategoryStatusAction(cat.id, !cat.isActive);
    setLoadingId(null);
    if (res.success) {
      toast.success(res.message);
      router.refresh();
    } else {
      toast.error(res.error || "Failed to update category");
    }
  };

  const handleDeleteCat = async (cat: CategoryItem) => {
    if (
      !confirm(
        `Are you sure you want to delete category "${cat.name}"? Linked services may also be removed.`,
      )
    ) {
      return;
    }
    setLoadingId(cat.id);
    const res = await deleteCategoryAction(cat.id);
    setLoadingId(null);
    if (res.success) {
      toast.success(res.message);
      router.refresh();
    } else {
      toast.error(res.error || "Failed to delete category");
    }
  };

  const handleToggleServiceStatus = async (svc: ServiceItem) => {
    setLoadingId(svc.id);
    const res = await toggleServiceStatusAction(svc.id, !svc.isActive);
    setLoadingId(null);
    if (res.success) {
      toast.success(res.message);
      router.refresh();
    } else {
      toast.error(res.error || "Failed to update service");
    }
  };

  const handleDeleteService = async (svc: ServiceItem) => {
    if (!confirm(`Are you sure you want to delete service "${svc.name}"?`)) {
      return;
    }
    setLoadingId(svc.id);
    const res = await deleteServiceAction(svc.id);
    setLoadingId(null);
    if (res.success) {
      toast.success(res.message);
      router.refresh();
    } else {
      toast.error(res.error || "Failed to delete service");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-base-100 p-4 rounded-box shadow-md">
        <div className="tabs tabs-boxed bg-base-200">
          <button
            className={`tab gap-2 font-medium ${activeTab === "categories" ? "tab-active !bg-primary !text-primary-content" : ""}`}
            onClick={() => {
              setActiveTab("categories");
              setSearchTerm("");
            }}
          >
            <Layers size={16} />
            Categories ({categories.length})
          </button>
          <button
            className={`tab gap-2 font-medium ${activeTab === "services" ? "tab-active !bg-primary !text-primary-content" : ""}`}
            onClick={() => {
              setActiveTab("services");
              setSearchTerm("");
            }}
          >
            <Wrench size={16} />
            Platform Services ({services.length})
          </button>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <label className="input input-bordered input-sm flex items-center gap-2 flex-1 sm:w-64">
            <Search size={14} className="opacity-60" />
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="grow"
            />
          </label>

          {activeTab === "categories" ? (
            <button
              onClick={() => {
                setEditingCat(null);
                setIsCatModalOpen(true);
              }}
              className="btn btn-primary btn-sm gap-1"
            >
              <Plus size={16} />
              Add Category
            </button>
          ) : (
            <button
              onClick={() => {
                setEditingService(null);
                setIsServiceModalOpen(true);
              }}
              className="btn btn-primary btn-sm gap-1"
              disabled={categories.length === 0}
              title={
                categories.length === 0
                  ? "Create a category first"
                  : "Add Service"
              }
            >
              <Plus size={16} />
              Add Service
            </button>
          )}
        </div>
      </div>

      {/* Categories View */}
      {activeTab === "categories" && (
        <div className="card bg-base-100 shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr className="bg-base-200 text-base-content/80">
                  <th>Name</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCategories.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="text-center py-10 text-base-content/60"
                    >
                      No categories found. Click &quot;Add Category&quot; to
                      create one.
                    </td>
                  </tr>
                ) : (
                  filteredCategories.map((c) => (
                    <tr key={c.id} className="hover:bg-base-200/50">
                      <td>
                        <div className="font-bold text-base">{c.name}</div>
                        <div className="text-xs opacity-50 font-mono">
                          {c.id.slice(0, 8)}...
                        </div>
                      </td>
                      <td className="max-w-md">
                        <p className="text-sm line-clamp-2">{c.description}</p>
                      </td>
                      <td>
                        {c.isActive ? (
                          <span className="badge badge-success badge-outline badge-sm gap-1">
                            <CheckCircle size={12} /> Active
                          </span>
                        ) : (
                          <span className="badge badge-ghost badge-sm gap-1 opacity-70">
                            <XCircle size={12} /> Inactive
                          </span>
                        )}
                      </td>
                      <td className="text-right">
                        <div className="flex justify-end gap-1">
                          <button
                            onClick={() => handleToggleCatStatus(c)}
                            disabled={loadingId === c.id}
                            className={`btn btn-xs btn-ghost ${c.isActive ? "text-warning" : "text-success"}`}
                            title={
                              c.isActive
                                ? "Deactivate Category"
                                : "Activate Category"
                            }
                          >
                            <Power size={14} />
                          </button>
                          <button
                            onClick={() => {
                              setEditingCat(c);
                              setIsCatModalOpen(true);
                            }}
                            className="btn btn-xs btn-ghost text-info"
                            title="Edit Category"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteCat(c)}
                            disabled={loadingId === c.id}
                            className="btn btn-xs btn-ghost text-error"
                            title="Delete Category"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Services View */}
      {activeTab === "services" && (
        <div className="card bg-base-100 shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr className="bg-base-200 text-base-content/80">
                  <th>Service Title</th>
                  <th>Category</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredServices.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="text-center py-10 text-base-content/60"
                    >
                      No platform services found. Click &quot;Add Service&quot;
                      to register a service under a category.
                    </td>
                  </tr>
                ) : (
                  filteredServices.map((s) => (
                    <tr key={s.id} className="hover:bg-base-200/50">
                      <td>
                        <div className="font-bold text-base">{s.name}</div>
                        <div className="text-xs opacity-50 font-mono">
                          {s.id.slice(0, 8)}...
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-outline badge-primary badge-sm">
                          {s.categoryName || "Uncategorized"}
                        </span>
                      </td>
                      <td className="max-w-md">
                        <p className="text-sm line-clamp-2">{s.description}</p>
                      </td>
                      <td>
                        {s.isActive ? (
                          <span className="badge badge-success badge-outline badge-sm gap-1">
                            <CheckCircle size={12} /> Active
                          </span>
                        ) : (
                          <span className="badge badge-ghost badge-sm gap-1 opacity-70">
                            <XCircle size={12} /> Inactive
                          </span>
                        )}
                      </td>
                      <td className="text-right">
                        <div className="flex justify-end gap-1">
                          <button
                            onClick={() => handleToggleServiceStatus(s)}
                            disabled={loadingId === s.id}
                            className={`btn btn-xs btn-ghost ${s.isActive ? "text-warning" : "text-success"}`}
                            title={
                              s.isActive
                                ? "Deactivate Service"
                                : "Activate Service"
                            }
                          >
                            <Power size={14} />
                          </button>
                          <button
                            onClick={() => {
                              setEditingService(s);
                              setIsServiceModalOpen(true);
                            }}
                            className="btn btn-xs btn-ghost text-info"
                            title="Edit Service"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteService(s)}
                            disabled={loadingId === s.id}
                            className="btn btn-xs btn-ghost text-error"
                            title="Delete Service"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modals */}
      <CategoryModal
        isOpen={isCatModalOpen}
        onClose={() => {
          setIsCatModalOpen(false);
          setEditingCat(null);
        }}
        initialData={editingCat}
      />

      <ServiceModal
        isOpen={isServiceModalOpen}
        onClose={() => {
          setIsServiceModalOpen(false);
          setEditingService(null);
        }}
        categories={categories}
        initialData={editingService}
      />
    </div>
  );
}
