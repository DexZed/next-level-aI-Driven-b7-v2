"use client";

import { useState } from "react";
import { createBookingAction } from "@/app/customer/actions";
import { toast } from "react-toastify";
import { Calendar, Clock, DollarSign, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

type ServiceOffering = {
  id: string;
  serviceId: string;
  name: string;
  description: string | null;
  categoryName: string | null;
  price: number;
};

type Props = {
  technicianId: string;
  technicianName: string;
  isAvailable: boolean;
  services: ServiceOffering[];
  initialServiceId?: string;
  isOpen: boolean;
  onClose: () => void;
};

export default function BookSlotModal({
  technicianId,
  technicianName,
  isAvailable,
  services,
  initialServiceId,
  isOpen,
  onClose,
}: Props) {
  const router = useRouter();
  const [selectedServiceId, setSelectedServiceId] = useState<string>(
    initialServiceId || (services[0]?.serviceId ?? ""),
  );
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDateStr = tomorrow.toISOString().split("T")[0];

  const [date, setDate] = useState<string>(defaultDateStr);
  const [time, setTime] = useState<string>("10:00");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen) return null;

  const selectedService =
    services.find((s) => s.serviceId === selectedServiceId) || services[0];

  const timeSlots = [
    "09:00",
    "10:00",
    "11:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
  ];

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAvailable) {
      toast.error("This technician is currently not taking new bookings.");
      return;
    }

    if (!selectedServiceId) {
      toast.error("Please choose a service to book.");
      return;
    }

    if (!date || !time) {
      toast.error("Please pick both a date and a time slot.");
      return;
    }

    const scheduledDateTime = new Date(`${date}T${time}:00`);
    if (scheduledDateTime < new Date()) {
      toast.error("Please select a future appointment date and time.");
      return;
    }

    setIsSubmitting(true);
    const res = await createBookingAction({
      technicianId,
      serviceId: selectedServiceId,
      scheduledAt: scheduledDateTime.toISOString(),
    });
    setIsSubmitting(false);

    if (res.success) {
      toast.success(res.message);
      onClose();
      router.push("/customer/dashboard");
    } else {
      toast.error(res.error || "Failed to book slot");
    }
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-lg">
        <button
          type="button"
          onClick={onClose}
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
        >
          ✕
        </button>

        <h3 className="font-bold text-xl mb-1 flex items-center gap-2">
          <Calendar className="text-primary h-5 w-5" />
          Book Appointment
        </h3>
        <p className="text-xs opacity-70 mb-4">
          Booking with <span className="font-semibold">{technicianName}</span>
        </p>

        <form onSubmit={handleBooking} className="space-y-4">
          {/* Service Selection */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Select Service</span>
            </label>
            <select
              className="select select-bordered w-full"
              value={selectedServiceId}
              onChange={(e) => setSelectedServiceId(e.target.value)}
              required
            >
              {services.map((s) => (
                <option key={s.serviceId} value={s.serviceId}>
                  {s.name} — ${s.price} ({s.categoryName || "General"})
                </option>
              ))}
            </select>
          </div>

          {/* Date Picker */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold flex items-center gap-1">
                <Calendar size={14} /> Service Date
              </span>
            </label>
            <input
              type="date"
              className="input input-bordered w-full"
              min={new Date().toISOString().split("T")[0]}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          {/* Time Slot Picker */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold flex items-center gap-1">
                <Clock size={14} /> Available Time Slots
              </span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {timeSlots.map((slot) => {
                const isSelected = time === slot;
                return (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setTime(slot)}
                    className={`btn btn-sm ${
                      isSelected ? "btn-primary font-bold" : "btn-outline"
                    }`}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Pricing & Summary Card */}
          {selectedService && (
            <div className="card bg-base-200 p-4 rounded-box">
              <div className="flex justify-between items-center text-sm">
                <div>
                  <p className="font-bold">{selectedService.name}</p>
                  <p className="text-xs opacity-70">
                    {date} at {time}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs opacity-70">Estimated Cost</span>
                  <p className="text-lg font-bold text-primary">
                    ${selectedService.price}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
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
              disabled={isSubmitting || !isAvailable}
            >
              {isSubmitting ? "Submitting..." : "Confirm & Send Request"}
            </button>
          </div>
        </form>
      </div>
      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  );
}
