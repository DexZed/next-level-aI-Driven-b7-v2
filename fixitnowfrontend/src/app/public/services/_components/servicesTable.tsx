import React from "react";

type Props = {};

function ServicesTable({}: Props) {
  const data = [
    {
      id: "1",
      name: "Repair",
      category: "Ac Repair",
      description: "All kinds ac repair",
      status: "available",
    },
  ];
  return (
    <div className="ml-10">
      <table className="table table-lg">
        <thead>
          <tr>
            <th></th>
            <th>Name</th>
            <th>Category</th>
            <th>Description</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d: any) => (
            <tr key={d.id}>
              <td>{d.id}</td>
              <td>{d.name}</td>
              <td>{d.category}</td>
              <td>{d.description}</td>
              <td>{d.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ServicesTable;
