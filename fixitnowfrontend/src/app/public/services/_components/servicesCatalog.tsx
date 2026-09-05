"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  MapPin,
  Star,
  User,
  DollarSign,
  Tag,
  CheckCircle2,
  ChevronRight,
  Briefcase,
} from "lucide-react";

type Category = {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
};

type Service = {
  id: string;
  name: string;
  description: string | null;
  categoryId: string;
  categoryName: string | null;
};

type TechOffering = {
  serviceId: string;
  technicianId: string;
  technicianName: string;
  technicianCity: string;
  ratingAvg: number;
  isAvailable: boolean;
  price: number;
};

type Props = {
  categories: Category[];
  services: Service[];
  techOfferings: TechOffering[];
};

export default function ServicesCatalog({
  categories,
  services,
  techOfferings,
}: Props) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [cityFilter, setCityFilter] = useState<string>("all");

  const cities = useMemo(() => {
    const set = new Set<string>();
    techOfferings.forEach((t) => {
      if (t.technicianCity) set.add(t.technicianCity);
    });
    return Array.from(set);
  }, [techOfferings]);

  const techMap = useMemo(() => {
    const map = new Map<string, TechOffering[]>();
    techOfferings.forEach((tech) => {
      const list = map.get(tech.serviceId) || [];
      list.push(tech);
      map.set(tech.serviceId, list);
    });
    return map;
  }, [techOfferings]);

  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      if (
        selectedCategory !== "all" &&
        service.categoryId !== selectedCategory
      ) {
        return false;
      }

      if (cityFilter !== "all") {
        const techs = techMap.get(service.id) || [];
        const hasCityTech = techs.some(
          (t) => t.technicianCity.toLowerCase() === cityFilter.toLowerCase(),
        );
        if (!hasCityTech) return false;
      }

      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesName = service.name.toLowerCase().includes(q);
        const matchesDesc = (service.description || "")
          .toLowerCase()
          .includes(q);
        const matchesCat = (service.categoryName || "")
          .toLowerCase()
          .includes(q);
        const techs = techMap.get(service.id) || [];
        const matchesTech = techs.some((t) =>
          t.technicianName.toLowerCase().includes(q),
        );

        if (!matchesName && !matchesDesc && !matchesCat && !matchesTech) {
          return false;
        }
      }

      return true;
    });
  }, [services, selectedCategory, cityFilter, search, techMap]);

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
                placeholder="Search services, keywords, or technicians..."
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
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">All Categories ({categories.length})</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-control">
            <select
              className="select select-bordered w-full text-sm"
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
            >
              <option value="all">All Locations / Cities</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-base-200 items-center">
          <span className="text-xs font-semibold opacity-70 flex items-center gap-1 mr-1">
            <Tag size={13} /> Categories:
          </span>
          <button
            onClick={() => setSelectedCategory("all")}
            className={`btn btn-xs rounded-full ${
              selectedCategory === "all"
                ? "btn-primary"
                : "btn-ghost bg-base-200"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`btn btn-xs rounded-full ${
                selectedCategory === cat.id
                  ? "btn-primary"
                  : "btn-ghost bg-base-200"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center px-1">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-primary" />
          Available Services
          <span className="badge badge-neutral badge-sm ml-1">
            {filteredServices.length}
          </span>
        </h2>
        {(selectedCategory !== "all" || cityFilter !== "all" || search) && (
          <button
            onClick={() => {
              setSearch("");
              setSelectedCategory("all");
              setCityFilter("all");
            }}
            className="btn btn-ghost btn-xs text-error"
          >
            Reset Filters
          </button>
        )}
      </div>

      {filteredServices.length === 0 ? (
        <div className="card bg-base-100 border border-base-200 p-12 text-center">
          <div className="text-4xl mb-3">🔍</div>
          <h3 className="text-lg font-bold">No services found</h3>
          <p className="text-sm opacity-70 mt-1 max-w-sm mx-auto">
            Try adjusting your search terms or filters to find what you need.
          </p>
          <button
            onClick={() => {
              setSearch("");
              setSelectedCategory("all");
              setCityFilter("all");
            }}
            className="btn btn-outline btn-sm mx-auto mt-4"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => {
            const techs = techMap.get(service.id) || [];
            const lowestPrice =
              techs.length > 0 ? Math.min(...techs.map((t) => t.price)) : null;

            return (
              <div
                key={service.id}
                className="card bg-base-100 border border-base-200 hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div className="card-body p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="badge badge-primary badge-outline text-xs">
                      {service.categoryName || "General"}
                    </span>
                    {lowestPrice !== null && (
                      <span className="text-xs font-semibold text-success flex items-center">
                        From{" "}
                        <strong className="text-base ml-1">
                          ${lowestPrice}
                        </strong>
                      </span>
                    )}
                  </div>

                  <h3 className="card-title text-lg font-bold">
                    {service.name}
                  </h3>
                  <p className="text-sm opacity-75 line-clamp-2 mt-1">
                    {service.description ||
                      "Professional service provided by verified technicians."}
                  </p>

                  <div className="mt-4 pt-4 border-t border-base-200">
                    <div className="text-xs font-semibold opacity-70 mb-2 flex items-center justify-between">
                      <span>Available Technicians ({techs.length})</span>
                      {techs.length > 0 && (
                        <span className="text-success flex items-center gap-1">
                          <CheckCircle2 size={12} /> Ready to Book
                        </span>
                      )}
                    </div>

                    {techs.length === 0 ? (
                      <p className="text-xs opacity-50 italic py-2">
                        No technician is currently active for this service.
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {techs.slice(0, 3).map((tech) => (
                          <Link
                            key={tech.technicianId}
                            href={`/public/profile/${tech.technicianId}`}
                            className="flex items-center justify-between p-2 rounded-lg bg-base-200/60 hover:bg-base-200 transition-colors text-xs group"
                          >
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-[10px]">
                                {tech.technicianName.slice(0, 1).toUpperCase()}
                              </div>
                              <div>
                                <span className="font-semibold group-hover:text-primary transition-colors">
                                  {tech.technicianName}
                                </span>
                                <div className="flex items-center gap-2 text-[10px] opacity-70">
                                  <span className="flex items-center gap-0.5">
                                    <MapPin size={10} /> {tech.technicianCity}
                                  </span>
                                  <span className="flex items-center gap-0.5 text-warning font-semibold">
                                    <Star size={10} className="fill-warning" />
                                    {tech.ratingAvg > 0
                                      ? tech.ratingAvg.toFixed(1)
                                      : "New"}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="font-bold text-sm text-primary">
                                ${tech.price}
                              </span>
                              <ChevronRight
                                size={14}
                                className="opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all inline ml-1"
                              />
                            </div>
                          </Link>
                        ))}

                        {techs.length > 3 && (
                          <div className="text-center pt-1">
                            <span className="text-[11px] opacity-60">
                              +{techs.length - 3} more technicians available
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="card-actions p-4 pt-0">
                  {techs.length > 0 ? (
                    <Link
                      href={`/public/profile/${techs[0].technicianId}`}
                      className="btn btn-primary btn-sm w-full gap-2"
                    >
                      <User size={14} /> Book with {techs[0].technicianName} ($
                      {techs[0].price})
                    </Link>
                  ) : (
                    <button disabled className="btn btn-ghost btn-sm w-full">
                      Unavailable
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
