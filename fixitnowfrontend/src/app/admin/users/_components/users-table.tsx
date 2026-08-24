"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toggleUserStatusAction, deleteUserAction } from "@/app/admin/actions";
import { toast } from "react-toastify";
import { Search, ShieldAlert, ShieldCheck, Trash2, UserCheck, UserX } from "lucide-react";

type UserItem = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "customer" | "technician";
  status?: "active" | "banned" | null;
  image?: string | null;
  createdAt: Date;
};

type Props = {
  initialData: {
    users: UserItem[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  currentSearch: string;
  currentRole: string;
};

export default function UsersTable({ initialData, currentSearch, currentRole }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [search, setSearch] = useState(currentSearch);
  const [role, setRole] = useState(currentRole);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleFilterChange = (newSearch: string, newRole: string, newPage = 1) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newSearch.trim()) {
      params.set("search", newSearch.trim());
    } else {
      params.delete("search");
    }

    if (newRole && newRole !== "all") {
      params.set("role", newRole);
    } else {
      params.delete("role");
    }

    params.set("page", newPage.toString());

    startTransition(() => {
      router.push(`/admin/users?${params.toString()}`);
    });
  };

  const handleToggleStatus = async (user: UserItem) => {
    const nextStatus = user.status === "banned" ? "active" : "banned";
    const confirmMsg =
      nextStatus === "banned"
        ? `Are you sure you want to BAN user "${user.name}"? They will lose platform access.`
        : `Unban user "${user.name}"?`;

    if (!confirm(confirmMsg)) return;

    setLoadingId(user.id);
    const res = await toggleUserStatusAction(user.id, nextStatus);
    setLoadingId(null);

    if (res.success) {
      toast.success(res.message);
      router.refresh();
    } else {
      toast.error(res.error || "Failed to update status");
    }
  };

  const handleDeleteUser = async (user: UserItem) => {
    if (!confirm(`Are you sure you want to permanently delete user "${user.name}"? This cannot be undone.`)) {
      return;
    }

    setLoadingId(user.id);
    const res = await deleteUserAction(user.id);
    setLoadingId(null);

    if (res.success) {
      toast.success(res.message);
      router.refresh();
    } else {
      toast.error(res.error || "Failed to delete user");
    }
  };

  const getRoleBadge = (userRole: string) => {
    switch (userRole) {
      case "admin":
        return <span className="badge badge-primary badge-sm font-semibold uppercase">Admin</span>;
      case "technician":
        return <span className="badge badge-secondary badge-sm font-semibold uppercase">Technician</span>;
      case "customer":
      default:
        return <span className="badge badge-neutral badge-sm font-semibold uppercase">Customer</span>;
    }
  };

  const getStatusBadge = (status?: string | null) => {
    if (status === "banned") {
      return <span className="badge badge-error badge-outline badge-sm gap-1"><ShieldAlert size={12} /> Banned</span>;
    }
    return <span className="badge badge-success badge-outline badge-sm gap-1"><ShieldCheck size={12} /> Active</span>;
  };

  return (
    <div className="space-y-4">
      {/* Top Filter Bar */}
      <div className="card bg-base-100 shadow-md p-4">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleFilterChange(search, role, 1);
            }}
            className="flex flex-1 w-full md:w-auto gap-2"
          >
            <label className="input input-bordered flex items-center gap-2 flex-1">
              <Search size={16} className="opacity-60" />
              <input
                type="text"
                placeholder="Search user by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="grow"
              />
            </label>
            <button type="submit" className="btn btn-primary btn-outline" disabled={isPending}>
              Search
            </button>
          </form>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <span className="text-sm font-medium opacity-70">Role:</span>
            <select
              className="select select-bordered"
              value={role}
              onChange={(e) => {
                const newRole = e.target.value;
                setRole(newRole);
                handleFilterChange(search, newRole, 1);
              }}
              disabled={isPending}
            >
              <option value="all">All Roles</option>
              <option value="customer">Customer</option>
              <option value="technician">Technician</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Data Table */}
      <div className="card bg-base-100 shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr className="bg-base-200 text-base-content/80">
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {initialData.users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-base-content/60">
                    No users found matching your filters.
                  </td>
                </tr>
              ) : (
                initialData.users.map((u) => (
                  <tr key={u.id} className="hover:bg-base-200/50">
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar placeholder">
                          <div className="bg-neutral text-neutral-content rounded-full w-9 h-9">
                            <span className="text-sm font-bold">
                              {u.name?.slice(0, 2).toUpperCase() || "U"}
                            </span>
                          </div>
                        </div>
                        <div>
                          <div className="font-bold">{u.name}</div>
                          <div className="text-xs opacity-50 font-mono">{u.id.slice(0, 8)}...</div>
                        </div>
                      </div>
                    </td>
                    <td className="text-sm">{u.email}</td>
                    <td>{getRoleBadge(u.role)}</td>
                    <td>{getStatusBadge(u.status)}</td>
                    <td className="text-xs opacity-70">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="text-right">
                      <div className="flex justify-end gap-2">
                        {u.status === "banned" ? (
                          <button
                            onClick={() => handleToggleStatus(u)}
                            disabled={loadingId === u.id || isPending}
                            className="btn btn-xs btn-success btn-outline gap-1"
                            title="Unban User"
                          >
                            <UserCheck size={14} />
                            Unban
                          </button>
                        ) : (
                          <button
                            onClick={() => handleToggleStatus(u)}
                            disabled={loadingId === u.id || isPending}
                            className="btn btn-xs btn-warning btn-outline gap-1"
                            title="Ban User"
                          >
                            <UserX size={14} />
                            Ban
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteUser(u)}
                          disabled={loadingId === u.id || isPending}
                          className="btn btn-xs btn-error btn-ghost"
                          title="Delete User"
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

        {/* Pagination Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center p-4 border-t border-base-200 gap-3">
          <div className="text-sm opacity-70">
            Showing <span className="font-semibold">{initialData.users.length}</span> of{" "}
            <span className="font-semibold">{initialData.total}</span> users
          </div>
          <div className="join">
            <button
              className="join-item btn btn-sm"
              disabled={initialData.page <= 1 || isPending}
              onClick={() => handleFilterChange(search, role, initialData.page - 1)}
            >
              « Prev
            </button>
            <button className="join-item btn btn-sm btn-active">
              Page {initialData.page} of {initialData.totalPages}
            </button>
            <button
              className="join-item btn btn-sm"
              disabled={initialData.page >= initialData.totalPages || isPending}
              onClick={() => handleFilterChange(search, role, initialData.page + 1)}
            >
              Next »
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
