"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { createCategoryAction, updateCategoryAction } from "@/app/admin/actions";
import { toast } from "react-toastify";
import Input from "@/components/Input";
import { useRouter } from "next/navigation";

const categorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  description: z.string().min(1, "Description is required"),
  isActive: z.boolean(),
});

type CategoryFormData = z.infer<typeof categorySchema>;

type Props = {
  isOpen: boolean;
  onClose: () => void;
  initialData?: {
    id: string;
    name: string;
    description: string;
    isActive: boolean;
  } | null;
};

export default function CategoryModal({ isOpen, onClose, initialData }: Props) {
  const router = useRouter();
  const isEditing = !!initialData;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      description: "",
      isActive: true,
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
        description: initialData.description,
        isActive: initialData.isActive,
      });
    } else {
      reset({
        name: "",
        description: "",
        isActive: true,
      });
    }
  }, [initialData, reset]);

  if (!isOpen) return null;

  const onSubmit = async (data: CategoryFormData) => {
    try {
      if (isEditing && initialData) {
        const res = await updateCategoryAction(initialData.id, data);
        if (res.success) {
          toast.success("Category updated successfully");
          router.refresh();
          onClose();
        } else {
          toast.error(res.error || "Failed to update category");
        }
      } else {
        const res = await createCategoryAction(data);
        if (res.success) {
          toast.success("Category created successfully");
          router.refresh();
          onClose();
        } else {
          toast.error(res.error || "Failed to create category");
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
          {isEditing ? "Edit Category" : "Add New Category"}
        </h3>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            name="Category Name"
            placeholder="e.g. Plumbing, AC Repair"
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
              <span className="label-text font-semibold">Description</span>
            </label>
            <textarea
              placeholder="Describe the category services..."
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
              <span className="label-text font-medium">Active (Visible to users)</span>
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
                ? "Update Category"
                : "Create Category"}
            </button>
          </div>
        </form>
      </div>
      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  );
}
