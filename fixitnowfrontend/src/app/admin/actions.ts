"use server";

import { db } from "@/drizzle";
import { user } from "@/drizzle/schemas/auth-schema";
import { categories } from "@/drizzle/schemas/category-schema";
import { services } from "@/drizzle/schemas/service-schema";
import { getSession } from "@/app/data access layer/session";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const categorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  description: z.string().min(1, "Description is required"),
  isActive: z.boolean().default(true),
});

const serviceSchema = z.object({
  name: z.string().min(1, "Service name is required"),
  description: z.string().min(1, "Description is required"),
  categoryId: z.string().uuid("Please select a valid category"),
  isActive: z.boolean().default(true),
});

export async function toggleUserStatusAction(
  userId: string,
  targetStatus: "active" | "banned",
) {
  await getSession("admin");
  try {
    await db
      .update(user)
      .set({ status: targetStatus, updatedAt: new Date() })
      .where(eq(user.id, userId));

    revalidatePath("/admin/users");
    return { success: true, message: `User status changed to ${targetStatus}` };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to update user status",
    };
  }
}

export async function deleteUserAction(userId: string) {
  await getSession("admin");
  try {
    await db.delete(user).where(eq(user.id, userId));
    revalidatePath("/admin/users");
    return { success: true, message: "User deleted successfully" };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to delete user" };
  }
}

export async function createCategoryAction(data: {
  name: string;
  description: string;
  isActive?: boolean;
}) {
  await getSession("admin");
  const parsed = categorySchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || "Invalid input",
    };
  }

  try {
    const [newCat] = await db
      .insert(categories)
      .values({
        name: parsed.data.name,
        description: parsed.data.description,
        isActive: parsed.data.isActive ?? true,
      })
      .returning();

    revalidatePath("/admin/category");
    return { success: true, category: newCat };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to create category",
    };
  }
}

export async function updateCategoryAction(
  id: string,
  data: { name: string; description: string; isActive?: boolean },
) {
  await getSession("admin");
  const parsed = categorySchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || "Invalid input",
    };
  }

  try {
    const [updated] = await db
      .update(categories)
      .set({
        name: parsed.data.name,
        description: parsed.data.description,
        isActive: parsed.data.isActive,
      })
      .where(eq(categories.id, id))
      .returning();

    revalidatePath("/admin/category");
    return { success: true, category: updated };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to update category",
    };
  }
}

export async function toggleCategoryStatusAction(
  id: string,
  isActive: boolean,
) {
  await getSession("admin");
  try {
    await db.update(categories).set({ isActive }).where(eq(categories.id, id));

    revalidatePath("/admin/category");
    return {
      success: true,
      message: `Category ${isActive ? "activated" : "deactivated"}`,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to toggle category status",
    };
  }
}

export async function deleteCategoryAction(id: string) {
  await getSession("admin");
  try {
    await db.delete(categories).where(eq(categories.id, id));
    revalidatePath("/admin/category");
    return { success: true, message: "Category deleted successfully" };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to delete category",
    };
  }
}

export async function createServiceAction(data: {
  name: string;
  description: string;
  categoryId: string;
  isActive?: boolean;
}) {
  await getSession("admin");
  const parsed = serviceSchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || "Invalid input",
    };
  }

  try {
    const [newService] = await db
      .insert(services)
      .values({
        name: parsed.data.name,
        description: parsed.data.description,
        categoryId: parsed.data.categoryId,
        isActive: parsed.data.isActive ?? true,
      })
      .returning();

    revalidatePath("/admin/category");
    return { success: true, service: newService };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to create service",
    };
  }
}

export async function updateServiceAction(
  id: string,
  data: {
    name: string;
    description: string;
    categoryId: string;
    isActive?: boolean;
  },
) {
  await getSession("admin");
  const parsed = serviceSchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || "Invalid input",
    };
  }

  try {
    const [updated] = await db
      .update(services)
      .set({
        name: parsed.data.name,
        description: parsed.data.description,
        categoryId: parsed.data.categoryId,
        isActive: parsed.data.isActive,
      })
      .where(eq(services.id, id))
      .returning();

    revalidatePath("/admin/category");
    return { success: true, service: updated };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to update service",
    };
  }
}

export async function toggleServiceStatusAction(id: string, isActive: boolean) {
  await getSession("admin");
  try {
    await db.update(services).set({ isActive }).where(eq(services.id, id));

    revalidatePath("/admin/category");
    return {
      success: true,
      message: `Service ${isActive ? "activated" : "deactivated"}`,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to toggle service status",
    };
  }
}

export async function deleteServiceAction(id: string) {
  await getSession("admin");
  try {
    await db.delete(services).where(eq(services.id, id));
    revalidatePath("/admin/category");
    return { success: true, message: "Service deleted successfully" };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to delete service",
    };
  }
}
