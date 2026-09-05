"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import {
  updateTechnicianProfileAction,
  addTechnicianServiceAction,
  updateTechnicianServicePriceAction,
  removeTechnicianServiceAction,
} from "@/app/technician/actions";
import { toast } from "react-toastify";
import Input from "@/components/Input";
import { useRouter } from "next/navigation";
import {
  User,
  Wrench,
  Plus,
  Trash2,
  Edit2,
  Check,
  Star,
  MapPin,
  Power,
} from "lucide-react";

const profileSchema = z.object({
  bio: z.string().min(5, "Bio must be at least 5 characters"),
  city: z.string().min(2, "City is required"),
  isAvailable: z.boolean(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

type TechnicianData = {
  id: string;
  bio: string;
  city: string;
  isAvailable: boolean;
  ratingAvg: number;
  user: {
    name: string;
    email: string;
    image?: string | null;
    status?: "active" | "banned" | null;
  };
};

type OfferedService = {
  id: string;
  serviceId: string;
  price: number;
  serviceName: string;
  serviceDescription: string;
  categoryName: string | null;
};

type PlatformService = {
  id: string;
  name: string;
  description: string;
  categoryName: string | null;
  isActive: boolean;
};

type Props = {
  technician: TechnicianData;
  myServices: OfferedService[];
  allPlatformServices: PlatformService[];
};

export default function ProfileManager({
  technician,
  myServices,
  allPlatformServices,
}: Props) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"profile" | "services">("profile");

  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [newPrice, setNewPrice] = useState<number>(0);
  const [isPriceSubmitting, setIsPriceSubmitting] = useState(false);

  const [isAddServiceModalOpen, setIsAddServiceModalOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<string>("");
  const [servicePriceInput, setServicePriceInput] = useState<string>("50");
  const [isAddingService, setIsAddingService] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      bio: technician.bio || "",
      city: technician.city || "Dhaka",
      isAvailable: technician.isAvailable,
    },
  });

  const onProfileSubmit = async (data: ProfileFormData) => {
    const res = await updateTechnicianProfileAction(data);
    if (res.success) {
      toast.success(res.message);
      router.refresh();
    } else {
      toast.error(res.error || "Failed to update profile");
    }
  };

  const handleUpdatePrice = async (serviceId: string) => {
    if (newPrice < 0) {
      toast.error("Price must be positive");
      return;
    }
    setIsPriceSubmitting(true);
    const res = await updateTechnicianServicePriceAction(serviceId, newPrice);
    setIsPriceSubmitting(false);
    setEditingPriceId(null);

    if (res.success) {
      toast.success(res.message);
      router.refresh();
    } else {
      toast.error(res.error || "Failed to update price");
    }
  };

  const handleRemoveService = async (id: string, serviceName: string) => {
    if (!confirm(`Are you sure you want to stop offering "${serviceName}"?`))
      return;

    const res = await removeTechnicianServiceAction(id);
    if (res.success) {
      toast.success(res.message);
      router.refresh();
    } else {
      toast.error(res.error || "Failed to remove service");
    }
  };

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedServiceId) {
      toast.error("Please select a service");
      return;
    }
    const price = parseFloat(servicePriceInput);
    if (isNaN(price) || price < 0) {
      toast.error("Please enter a valid rate");
      return;
    }

    setIsAddingService(true);
    const res = await addTechnicianServiceAction(selectedServiceId, price);
    setIsAddingService(false);

    if (res.success) {
      toast.success(res.message);
      setIsAddServiceModalOpen(false);
      setSelectedServiceId("");
      router.refresh();
    } else {
      toast.error(res.error || "Failed to add service");
    }
  };

  const offeredServiceIds = new Set(myServices.map((s) => s.serviceId));
  const unofferedPlatformServices = allPlatformServices.filter(
    (s) => !offeredServiceIds.has(s.id),
  );

  return (
    <div className="space-y-6">
      <div className="tabs tabs-boxed bg-base-100 p-2 shadow-md w-fit">
        <button
          className={`tab gap-2 font-medium ${
            activeTab === "profile"
              ? "tab-active !bg-primary !text-primary-content"
              : ""
          }`}
          onClick={() => setActiveTab("profile")}
        >
          <User size={16} />
          Profile Details & Availability
        </button>
        <button
          className={`tab gap-2 font-medium ${
            activeTab === "services"
              ? "tab-active !bg-primary !text-primary-content"
              : ""
          }`}
          onClick={() => setActiveTab("services")}
        >
          <Wrench size={16} />
          My Services & Pricing ({myServices.length})
        </button>
      </div>

      {/* Tab 1: Profile & Availability */}
      {activeTab === "profile" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Summary Card */}
          <div className="card bg-base-100 shadow-md">
            <div className="card-body items-center text-center">
              <div className="avatar placeholder mb-2">
                <div className="bg-primary text-primary-content rounded-full w-20 h-20 text-2xl font-bold">
                  {technician.user.name?.slice(0, 2).toUpperCase() || "TN"}
                </div>
              </div>
              <h2 className="card-title">{technician.user.name}</h2>
              <p className="text-xs opacity-70">{technician.user.email}</p>

              <div className="divider my-2"></div>

              <div className="w-full space-y-2 text-left text-sm">
                <div className="flex justify-between items-center">
                  <span className="opacity-70 flex items-center gap-1">
                    <MapPin size={14} /> City:
                  </span>
                  <span className="font-semibold">{technician.city}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="opacity-70 flex items-center gap-1">
                    <Star size={14} className="text-warning fill-warning" />{" "}
                    Rating:
                  </span>
                  <span className="font-semibold">
                    {technician.ratingAvg.toFixed(1)} / 5.0
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="opacity-70 flex items-center gap-1">
                    <Power size={14} /> Availability:
                  </span>
                  {technician.isAvailable ? (
                    <span className="badge badge-success badge-sm">Online</span>
                  ) : (
                    <span className="badge badge-ghost badge-sm">Offline</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Edit Form */}
          <div className="card bg-base-100 shadow-md lg:col-span-2">
            <div className="card-body">
              <h3 className="text-lg font-bold mb-2">
                Update Professional Details
              </h3>

              <form
                onSubmit={handleSubmit(onProfileSubmit)}
                className="space-y-4"
              >
                <Input
                  name="Operating City"
                  type="text"
                  placeholder="e.g. Dhaka, Chittagong"
                  props={register("city")}
                  children={
                    errors.city && (
                      <span className="label text-red-500">
                        {errors.city.message}
                      </span>
                    )
                  }
                />

                <div>
                  <label className="label">
                    <span className="label-text font-semibold">
                      Professional Bio & Experience
                    </span>
                  </label>
                  <textarea
                    placeholder="Describe your background, specialties, and years of experience..."
                    className="textarea textarea-bordered textarea-info w-full"
                    rows={4}
                    {...register("bio")}
                  />
                  {errors.bio && (
                    <span className="label text-red-500">
                      {errors.bio.message}
                    </span>
                  )}
                </div>

                <div className="form-control bg-base-200/50 p-4 rounded-box">
                  <label className="label cursor-pointer justify-between">
                    <div>
                      <span className="label-text font-bold block">
                        Available for New Bookings
                      </span>
                      <span className="text-xs opacity-70 block">
                        When active, customers can find and book your services.
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      className="toggle toggle-primary"
                      {...register("isAvailable")}
                    />
                  </label>
                </div>

                <div className="card-actions justify-end pt-2">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Saving..." : "Save Profile"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: My Services & Pricing */}
      {activeTab === "services" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-base-100 p-4 rounded-box shadow-md">
            <div>
              <h3 className="font-bold text-base">
                Offered Services & Custom Rates
              </h3>
              <p className="text-xs opacity-70">
                Set and customize the pricing for each service you provide.
              </p>
            </div>
            <button
              onClick={() => {
                if (unofferedPlatformServices.length > 0) {
                  setSelectedServiceId(unofferedPlatformServices[0].id);
                }
                setIsAddServiceModalOpen(true);
              }}
              className="btn btn-primary btn-sm gap-1"
              disabled={unofferedPlatformServices.length === 0}
              title={
                unofferedPlatformServices.length === 0
                  ? "All platform services are already added"
                  : "Add Service"
              }
            >
              <Plus size={16} />
              Add Service to Profile
            </button>
          </div>

          <div className="card bg-base-100 shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr className="bg-base-200 text-base-content/80">
                    <th>Service</th>
                    <th>Category</th>
                    <th>Description</th>
                    <th>Your Custom Rate ($)</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {myServices.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="text-center py-10 text-base-content/60"
                      >
                        You haven&apos;t added any services yet. Click &quot;Add
                        Service to Profile&quot; to begin offering services.
                      </td>
                    </tr>
                  ) : (
                    myServices.map((svc) => (
                      <tr key={svc.id} className="hover:bg-base-200/50">
                        <td>
                          <div className="font-bold">{svc.serviceName}</div>
                        </td>
                        <td>
                          <span className="badge badge-outline badge-primary badge-sm">
                            {svc.categoryName || "General"}
                          </span>
                        </td>
                        <td className="max-w-xs text-xs opacity-80">
                          <p className="line-clamp-2">
                            {svc.serviceDescription}
                          </p>
                        </td>
                        <td>
                          {editingPriceId === svc.id ? (
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                min="0"
                                step="1"
                                className="input input-bordered input-sm input-primary w-24"
                                value={newPrice}
                                onChange={(e) =>
                                  setNewPrice(parseFloat(e.target.value) || 0)
                                }
                                autoFocus
                              />
                              <button
                                onClick={() => handleUpdatePrice(svc.id)}
                                disabled={isPriceSubmitting}
                                className="btn btn-xs btn-success btn-square"
                                title="Save Price"
                              >
                                <Check size={14} />
                              </button>
                              <button
                                onClick={() => setEditingPriceId(null)}
                                className="btn btn-xs btn-ghost btn-square"
                                title="Cancel"
                              >
                                ✕
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-primary">
                                ${svc.price.toFixed(2)}
                              </span>
                              <button
                                onClick={() => {
                                  setEditingPriceId(svc.id);
                                  setNewPrice(svc.price);
                                }}
                                className="btn btn-xs btn-ghost btn-square text-info"
                                title="Change Price"
                              >
                                <Edit2 size={12} />
                              </button>
                            </div>
                          )}
                        </td>
                        <td className="text-right">
                          <button
                            onClick={() =>
                              handleRemoveService(svc.id, svc.serviceName)
                            }
                            className="btn btn-xs btn-ghost text-error"
                            title="Remove Service"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Add Service Modal */}
      {isAddServiceModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box">
            <button
              onClick={() => setIsAddServiceModalOpen(false)}
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            >
              ✕
            </button>
            <h3 className="font-bold text-lg mb-4">
              Add Service to Your Offerings
            </h3>

            <form onSubmit={handleAddService} className="space-y-4">
              <div>
                <label className="label">
                  <span className="label-text font-semibold">
                    Select Platform Service
                  </span>
                </label>
                <select
                  className="select select-bordered select-info w-full"
                  value={selectedServiceId}
                  onChange={(e) => setSelectedServiceId(e.target.value)}
                  required
                >
                  <option value="" disabled>
                    Choose a service...
                  </option>
                  {unofferedPlatformServices.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.categoryName || "General"})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label">
                  <span className="label-text font-semibold">
                    Your Custom Rate ($)
                  </span>
                </label>
                <input
                  type="number"
                  min="1"
                  step="0.5"
                  className="input input-bordered input-info w-full"
                  value={servicePriceInput}
                  onChange={(e) => setServicePriceInput(e.target.value)}
                  placeholder="e.g. 50"
                  required
                />
              </div>

              <div className="modal-action">
                <button
                  type="button"
                  onClick={() => setIsAddServiceModalOpen(false)}
                  className="btn btn-ghost"
                  disabled={isAddingService}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isAddingService}
                >
                  {isAddingService ? "Adding..." : "Add Service"}
                </button>
              </div>
            </form>
          </div>
          <div
            className="modal-backdrop"
            onClick={() => setIsAddServiceModalOpen(false)}
          ></div>
        </div>
      )}
    </div>
  );
}
