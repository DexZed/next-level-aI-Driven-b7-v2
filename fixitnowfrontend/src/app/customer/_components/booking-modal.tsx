"use client";
import { useEffect, useState } from "react";
import { getAvalilableServices, getAvailableTechnicians } from "../actions";

function BookingModal() {
  return (
    <>
      <dialog id="my_modal_3" className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">Book a Technician</h3>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Select Technician</span>
            </div>
            {/* <select className="select select-bordered w-full">
              {technicians.map((technician) => (
                <option key={technician.id}>{technician.name}</option>
              ))}
            </select> */}
          </label>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Select Service</span>
            </div>
            {/* <select className="select select-bordered w-full">
              {services.map((service) => (
                <option key={service.id}>{service.name}</option>
              ))}
            </select> */}
          </label>
        </div>
      </dialog>
    </>
  );
}

export default BookingModal;
export function BookingComponent() {
  return (
    <>
      <div className="flex flex-col lg:flex-row gap-6">
        <button
          className="btn btn-primary btn-outline"
          onClick={() =>
            (
              document.getElementById("my_modal_3") as HTMLDialogElement
            ).showModal()
          }
        >
          Book A Technician
        </button>
      </div>
      <BookingModal />
    </>
  );
}
