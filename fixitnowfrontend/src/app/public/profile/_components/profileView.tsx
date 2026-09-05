"use client";

import { useState } from "react";
import BookSlotModal from "./bookSlotModal";
import {
  Star,
  MapPin,
  Calendar,
  MessageSquare,
  ShieldCheck,
  Mail,
} from "lucide-react";

type Technician = {
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
};

type ServiceOffering = {
  id: string;
  serviceId: string;
  name: string;
  description: string | null;
  categoryName: string | null;
  price: number;
};

type Review = {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: Date;
  customerName: string;
};

type Props = {
  technician: Technician;
  services: ServiceOffering[];
  reviews: Review[];
};

export default function TechnicianProfileView({
  technician,
  services,
  reviews,
}: Props) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedServiceId, setSelectedServiceId] = useState<
    string | undefined
  >(undefined);

  const handleOpenBooking = (serviceId?: string) => {
    setSelectedServiceId(serviceId);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-8">
      {/* Header Profile Card */}
      <div className="card bg-base-100 border border-base-200 shadow-sm overflow-hidden">
        <div className="bg-primary/10 h-28 w-full"></div>
        <div className="card-body p-6 sm:p-8 -mt-14">
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-end justify-between">
            <div className="flex gap-4 items-center">
              <div className="w-24 h-24 rounded-full border-4 border-base-100 bg-primary text-primary-content flex items-center justify-center font-bold text-3xl shadow-md">
                {technician.name.slice(0, 1).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold">
                    {technician.name}
                  </h1>
                  <span
                    className={`badge badge-sm font-semibold ${
                      technician.isAvailable
                        ? "badge-success text-white"
                        : "badge-ghost"
                    }`}
                  >
                    {technician.isAvailable ? "Available" : "Offline"}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm opacity-75 mt-1">
                  <span className="flex items-center gap-1">
                    <MapPin size={14} className="text-primary" />{" "}
                    {technician.city}
                  </span>
                  <span className="flex items-center gap-1 text-warning font-semibold">
                    <Star size={14} className="fill-warning" />
                    {technician.ratingAvg > 0
                      ? technician.ratingAvg.toFixed(1)
                      : "New Pro"}{" "}
                    ({reviews.length} reviews)
                  </span>
                  <span className="flex items-center gap-1">
                    <Mail size={14} /> {technician.email}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick action */}
            <button
              onClick={() => handleOpenBooking()}
              disabled={!technician.isAvailable}
              className="btn btn-primary btn-md w-full sm:w-auto shadow-md gap-2"
            >
              <Calendar size={18} /> Book Appointment
            </button>
          </div>

          {/* Bio section */}
          <div className="mt-6 pt-6 border-t border-base-200">
            <h3 className="text-sm font-bold uppercase tracking-wider opacity-60 mb-2">
              About the Technician
            </h3>
            <p className="text-sm leading-relaxed opacity-90 max-w-3xl">
              {technician.bio ||
                "Experienced service technician dedicated to top-notch craft, punctuality, and customer satisfaction."}
            </p>
          </div>
        </div>
      </div>

      {/* Grid: Services Offered & Reviews */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Services List */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" /> Offered Services &
            Pricing
          </h2>

          {services.length === 0 ? (
            <div className="card bg-base-100 border border-base-200 p-8 text-center">
              <p className="text-sm opacity-60">
                This technician has not configured specific service offerings
                yet.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="card bg-base-100 border border-base-200 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-primary/40 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-base">{service.name}</h4>
                      <span className="badge badge-sm badge-outline badge-primary">
                        {service.categoryName || "General"}
                      </span>
                    </div>
                    <p className="text-xs opacity-75 max-w-lg">
                      {service.description ||
                        "Standard service including diagnostic and repair."}
                    </p>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 min-w-[150px]">
                    <div className="text-left sm:text-right">
                      <span className="text-[10px] opacity-60 block uppercase">
                        Price
                      </span>
                      <span className="text-xl font-extrabold text-primary">
                        ${service.price}
                      </span>
                    </div>
                    <button
                      onClick={() => handleOpenBooking(service.serviceId)}
                      disabled={!technician.isAvailable}
                      className="btn btn-primary btn-sm"
                    >
                      Book Slot
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right 1 Col: Customer Reviews */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-warning" /> Customer Reviews
            ({reviews.length})
          </h2>

          <div className="card bg-base-100 border border-base-200 p-4 space-y-4">
            {/* Rating Summary */}
            <div className="flex items-center gap-4 p-3 bg-base-200/50 rounded-box">
              <div className="text-center">
                <span className="text-3xl font-extrabold text-warning">
                  {technician.ratingAvg > 0
                    ? technician.ratingAvg.toFixed(1)
                    : "—"}
                </span>
                <span className="text-[10px] block opacity-60">out of 5</span>
              </div>
              <div className="text-xs opacity-80 border-l border-base-300 pl-4">
                <p className="font-semibold">Verified Feedback</p>
                <p className="opacity-60 mt-0.5">
                  Reviews submitted by verified customers upon job completion.
                </p>
              </div>
            </div>

            {reviews.length === 0 ? (
              <p className="text-xs opacity-60 text-center py-6">
                No reviews yet. Be the first to book and rate this technician!
              </p>
            ) : (
              <div className="space-y-3 divide-y divide-base-200">
                {reviews.map((rev) => (
                  <div key={rev.id} className="pt-3 first:pt-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold">
                        {rev.customerName}
                      </span>
                      <div className="flex items-center gap-0.5 text-warning">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} size={12} className="fill-warning" />
                        ))}
                      </div>
                    </div>
                    {rev.comment && (
                      <p className="text-xs opacity-80 mt-1 leading-relaxed">
                        &quot;{rev.comment}&quot;
                      </p>
                    )}
                    <span className="text-[10px] opacity-40 mt-1 block">
                      {new Date(rev.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <BookSlotModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        technicianId={technician.id}
        technicianName={technician.name}
        isAvailable={technician.isAvailable}
        services={services}
        initialServiceId={selectedServiceId}
      />
    </div>
  );
}
