"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  MapPin,
  Star,
  User,
  CheckCircle2,
  XCircle,
  Briefcase,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";

export type TechnicianCardData = {
  id: string;
  userId: string;
  bio: string;
  city: string;
  ratingAvg: number;
  isAvailable: boolean;
  name: string;
  email: string;
  image: string | null;
  createdAt: Date;
  reviewCount: number;
  services: {
    serviceId: string;
    serviceName: string;
    price: number;
  }[];
};

type Props = {
  technicians: TechnicianCardData[];
};

export default function TechniciansList({ technicians }: Props) {
  const [search, setSearch] = useState("");
  const [cityFilter, setCityFilter] = useState("all");
  const [availabilityFilter, setAvailabilityFilter] = useState<
    "all" | "available"
  >("all");

  const cities = useMemo(() => {
    const set = new Set<string>();
    technicians.forEach((t) => {
      if (t.city) set.add(t.city);
    });
    return Array.from(set);
  }, [technicians]);

  const filteredTechnicians = useMemo(() => {
    return technicians.filter((tech) => {
      if (
        cityFilter !== "all" &&
        tech.city.toLowerCase() !== cityFilter.toLowerCase()
      ) {
        return false;
      }

      if (availabilityFilter === "available" && !tech.isAvailable) {
        return false;
      }

      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesName = tech.name.toLowerCase().includes(q);
        const matchesBio = (tech.bio || "").toLowerCase().includes(q);
        const matchesCity = (tech.city || "").toLowerCase().includes(q);
        const matchesService = tech.services.some((s) =>
          s.serviceName.toLowerCase().includes(q),
        );

        if (!matchesName && !matchesBio && !matchesCity && !matchesService) {
          return false;
        }
      }

      return true;
    });
  }, [technicians, search, cityFilter, availabilityFilter]);

  return (
    <div className="space-y-8">
      <div className="card bg-base-100 shadow-sm border border-base-200 p-4 lg:p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="form-control">
            <label className="input input-bordered flex items-center gap-2 w-full">
              <Search className="h-4 w-4 opacity-60" />
              <input
                type="text"
                className="grow text-sm"
                placeholder="Search technician name, skill, or bio..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="btn btn-ghost btn-xs btn-circle"
                >
                  ✕
                </button>
              )}
            </label>
          </div>

          <div className="form-control">
            <select
              className="select select-bordered w-full text-sm"
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
            >
              <option value="all">
                All Locations / Cities ({cities.length})
              </option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          <div className="form-control flex flex-row items-center gap-2">
            <button
              type="button"
              onClick={() => setAvailabilityFilter("all")}
              className={`btn btn-sm flex-1 ${
                availabilityFilter === "all" ? "btn-primary" : "btn-outline"
              }`}
            >
              All Technicians
            </button>
            <button
              type="button"
              onClick={() => setAvailabilityFilter("available")}
              className={`btn btn-sm flex-1 ${
                availabilityFilter === "available"
                  ? "btn-primary"
                  : "btn-outline"
              }`}
            >
              Available Now
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center px-1">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-primary" />
          Verified Professionals
          <span className="badge badge-neutral badge-sm ml-1">
            {filteredTechnicians.length}
          </span>
        </h2>
        {(cityFilter !== "all" || availabilityFilter !== "all" || search) && (
          <button
            onClick={() => {
              setSearch("");
              setCityFilter("all");
              setAvailabilityFilter("all");
            }}
            className="btn btn-ghost btn-xs text-error"
          >
            Reset Filters
          </button>
        )}
      </div>

      {filteredTechnicians.length === 0 ? (
        <div className="card bg-base-100 border border-base-200 p-12 text-center">
          <div className="text-4xl mb-3">👨‍🔧</div>
          <h3 className="text-lg font-bold">No technicians found</h3>
          <p className="text-sm opacity-70 mt-1 max-w-sm mx-auto">
            Try adjusting your search query or removing filters to see available
            professionals.
          </p>
          <button
            onClick={() => {
              setSearch("");
              setCityFilter("all");
              setAvailabilityFilter("all");
            }}
            className="btn btn-outline btn-sm mx-auto mt-4"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTechnicians.map((tech) => (
            <div
              key={tech.id}
              className="card bg-base-100 border border-base-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div className="card-body p-6">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/20 text-primary font-bold text-lg flex items-center justify-center border border-primary/30">
                      {tech.name.slice(0, 1).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="card-title text-base font-bold leading-tight">
                        {tech.name}
                      </h3>
                      <div className="flex items-center gap-2 text-xs opacity-75 mt-0.5">
                        <span className="flex items-center gap-0.5">
                          <MapPin size={12} className="text-primary" />{" "}
                          {tech.city}
                        </span>
                      </div>
                    </div>
                  </div>

                  <span
                    className={`badge badge-sm font-semibold ${
                      tech.isAvailable
                        ? "badge-success text-white"
                        : "badge-ghost opacity-60"
                    }`}
                  >
                    {tech.isAvailable ? "Available" : "Offline"}
                  </span>
                </div>

                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-base-200 text-xs">
                  <div className="flex items-center gap-1 text-warning font-bold">
                    <Star size={14} className="fill-warning" />
                    {tech.ratingAvg > 0 ? tech.ratingAvg.toFixed(1) : "New"}
                  </div>
                  <span className="opacity-50">•</span>
                  <span className="opacity-70">
                    {tech.reviewCount}{" "}
                    {tech.reviewCount === 1 ? "review" : "reviews"}
                  </span>
                </div>

                <p className="text-xs opacity-80 line-clamp-2 mt-2 leading-relaxed">
                  {tech.bio ||
                    "Dedicated professional providing quality home repairs and services."}
                </p>

                <div className="mt-4 pt-3 border-t border-base-200">
                  <span className="text-[11px] font-semibold opacity-60 uppercase block mb-1.5">
                    Offered Services ({tech.services.length})
                  </span>
                  {tech.services.length === 0 ? (
                    <span className="text-xs opacity-40 italic">
                      No specific services listed
                    </span>
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {tech.services.slice(0, 3).map((s) => (
                        <span
                          key={s.serviceId}
                          className="badge badge-sm badge-outline badge-primary text-[11px]"
                        >
                          {s.serviceName}
                        </span>
                      ))}
                      {tech.services.length > 3 && (
                        <span className="badge badge-sm badge-ghost text-[10px]">
                          +{tech.services.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="card-actions p-4 pt-0">
                <Link
                  href={`/public/profile/${tech.id}`}
                  className="btn btn-outline btn-primary btn-sm w-full gap-2"
                >
                  <User size={14} /> View Profile <ChevronRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
