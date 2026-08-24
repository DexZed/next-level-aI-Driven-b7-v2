import PendingJobsComponent from "@/app/technician/dashboard/_components/pending";
import TechStats from "@/app/technician/dashboard/_components/techStats";
import UpcomingJobsComponent from "@/app/technician/dashboard/_components/upcoming";
import { SkeletonHero, SkeletonCards } from "@/components/skeletons";
import React, { Suspense } from "react";
import ServicesTable from "./_components/servicesTable";

type Props = {};

function ServicePage({}: Props) {
  return (
    <div>
      <div className="hero bg-base-200">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl">Services Available</h1>
            <p className="mt-6 text-xl">Browse all our available services</p>
          </div>
        </div>
      </div>
      <div className="my-5">
        <h2 className="text-center text-2xl font-bold">
          Features Not Added yet
        </h2>
      </div>
      <div className="flex justify-center items-center gap-5 bg-base-300">
        <div className="m-5">
          <label className="input">
            <svg
              className="h-[1em] opacity-50"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <g
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="2.5"
                fill="none"
                stroke="currentColor"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.3-4.3"></path>
              </g>
            </svg>
            <input type="search" required placeholder="Search for a Service" />
          </label>
        </div>
        <div className="m-5">
          <label className="input">
            <svg
              className="h-[1em] opacity-50"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <g
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="2.5"
                fill="none"
                stroke="currentColor"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.3-4.3"></path>
              </g>
            </svg>
            <input type="search" required placeholder="Filter By Technician" />
          </label>
        </div>
        <div className="m-5">
          <label className="input">
            <svg
              className="h-[1em] opacity-50"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <g
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="2.5"
                fill="none"
                stroke="currentColor"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.3-4.3"></path>
              </g>
            </svg>
            <input type="search" required placeholder="Search By Category" />
          </label>
        </div>
      </div>
      <div className="max-w-8xl mx-auto m-5">
        <Suspense fallback={SkeletonCards(4)}>
          <ServicesTable />
        </Suspense>
      </div>
    </div>
  );
}

export default ServicePage;
