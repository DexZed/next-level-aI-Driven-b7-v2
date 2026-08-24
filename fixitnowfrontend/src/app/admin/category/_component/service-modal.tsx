"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { createServiceAction, updateServiceAction } from "@/app/admin/actions";
import { toast } from "react-toastify";
import Input from "@/components/Input";
import { useRouter } from "next/navigation";

const serviceSchema = z.object({
  name: z.string().min(1, "Service name is required"),
  description: z.string().min(1, "Description is required"),
  categoryId: z.string().min(1, "Please select a valid category"),
  isActive: z.boolean(),
});

type ServiceFormData = z.infer<typeof serviceSchema>;

type Props = {
  isOpen: boolean;
  onClose: () => void;
  categories: Array<{ id: string; name: string }>;
  initialData?: {
    id: string;
    name: string;
    description: string;
    categoryId: string;
    isActive: boolean;
  } | null;
};

export default function ServiceModal({ isOpen, onClose, categories, initialData }: Props) {
  const router = useRouter();
  const isEditing = !!initialData;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: "",
      description: "",
      categoryId: categories[0]?.id || "",
      isActive: true,
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
        description: initialData.description,
        categoryId: initialData.categoryId,
        isActive: initialData.isActive,
      });
    } else {
      reset({
        name: "",
        description: "",
        categoryId: categories[0]?.id || "",
        isActive: true,
      });
    }
  }, [initialData, categories, reset]);

  if (!isOpen) return null;

  const onSubmit = async (data: ServiceFormData) => {
    try {
      if (isEditing && initialData) {
        const res = await updateServiceAction(initialData.id, data);
        if (res.success) {
          toast.success("Service updated successfully");
          router.refresh();
          onClose();
        } else {
          toast.error(res.error || "Failed to update service");
        }
      } else {
        const res = await createServiceAction(data);
        if (res.success) {
          toast.success("Service created successfully");
          router.refresh();
          onClose();
        } else {
          toast.error(res.error || "Failed to create service");
        }
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred");
    }
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <button
          onClick={onClose}
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
        >
          ✕
        </button>
        <h3 className="font-bold text-lg mb-4">
          {isEditing ? "Edit Service" : "Add New Platform Service"}
        </h3>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            name="Service Title"
            placeholder="e.g. AC Gas Refill, Pipe Replacement"
            type="text"
            props={register("name")}
            children={
              errors.name && (
                <span className="label text-red-500">
                  {errors.name.message}
                </span>
              )
            }
          />

          <div>
            <label className="label">
              <span className="label-text font-semibold">Service Category</span>
            </label>
            <select
              className="select select-bordered select-info w-full"
              {...register("categoryId")}
            >
              <option value="" disabled>
                Select a category
              </option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <span className="label text-red-500">
                {errors.categoryId.message}
              </span>
            )}
          </div>

          <div>
            <label className="label">
              <span className="label-text font-semibold">Description</span>
            </label>
            <textarea
              placeholder="Detailed description of what this service covers..."
              className="textarea textarea-bordered textarea-info w-full"
              rows={3}
              {...register("description")}
            />
            {errors.description && (
              <span className="label text-red-500">
                {errors.description.message}
              </span>
            )}
          </div>

          <div className="form-control">
            <label className="label cursor-pointer justify-start gap-3">
              <input
                type="checkbox"
                className="checkbox checkbox-primary"
                {...register("isActive")}
              />
              <span className="label-text font-medium">Active (Visible in catalog)</span>
            </label>
          </div>

          <div className="modal-action">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-ghost"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Saving..."
                : isEditing
                ? "Update Service"
                : "Create Service"}
            </button>
          </div>
        </form>
      </div>
      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  );
}
