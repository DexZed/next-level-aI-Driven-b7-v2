"use client";
import { useState } from "react";
import Modal from "./_component/modal";

type Props = {};

function CategoryPage({}: Props) {
  const mock = [
    {
      name: "AC Repair",
      category: "Appliances",
      description: "Repair and maintenance of air conditioning units",
      activeStatus: "Active",
    },
    {
      name: "Car Wash",
      category: "Automotive",
      description: "External and internal cleaning of vehicles",
      activeStatus: "Active",
    },
    {
      name: "Plumbing",
      category: "Home Services",
      description: "Repair and installation of plumbing systems",
      activeStatus: "Active",
    },
    {
      name: "Electrician",
      category: "Home Services",
      description: "Repair and installation of electrical systems",
      activeStatus: "Active",
    },
    {
      name: "Appliance Repair",
      category: "Home Services",
      description: "Repair and maintenance of home appliances",
      activeStatus: "Active",
    },
    {
      name: "Painting",
      category: "Home Services",
      description: "Interior and exterior painting services",
      activeStatus: "Active",
    },
    {
      name: "Moving",
      category: "Home Services",
      description: "Moving and relocation services",
      activeStatus: "Active",
    },
    {
      name: "Pest Control",
      category: "Home Services",
      description: "Pest control and extermination services",
      activeStatus: "Active",
    },
    {
      name: "Cleaning",
      category: "Home Services",
      description: "Home cleaning and maid services",
      activeStatus: "Active",
    },
    {
      name: "Gardening",
      category: "Home Services",
      description: "Gardening and lawn care services",
      activeStatus: "Active",
    },
    {
      name: "IT Support",
      category: "Technology",
      description: "Technical support and IT services",
      activeStatus: "Active",
    },
    {
      name: "Web Design",
      category: "Technology",
      description: "Website design and development services",
      activeStatus: "Active",
    },
    {
      name: "Digital Marketing",
      category: "Business Services",
      description: "Digital marketing and advertising services",
      activeStatus: "Active",
    },
    {
      name: "Tutoring",
      category: "Education",
      description: "Academic tutoring services",
      activeStatus: "Active",
    },
    {
      name: "Fitness Training",
      category: "Health & Wellness",
      description: "Personal fitness training services",
      activeStatus: "Active",
    },
  ];
  const [mockData, setMockData] = useState(mock);
  return (
    <div className="p-4">
      <div className="flex justify-end">
        <button
          className="btn btn-primary btn-outline btn-sm m-2"
          onClick={() =>
            (
              document.getElementById("my_modal_5") as HTMLDialogElement
            )?.showModal()
          }
        >
          Add Service
        </button>
      </div>
      <Modal />
      <div className="overflow-x-auto">
        <table className="table table-xs">
          <thead>
            <tr>
              <th></th>
              <th>Service Name</th>
              <th>Category</th>
              <th>Description</th>
              <th>Active Status</th>
            </tr>
          </thead>
          <tbody>
            {mockData.map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{item.name}</td>
                <td>{item.category}</td>
                <td>{item.description}</td>
                <td>{item.activeStatus}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CategoryPage;
