"use client";

import React from "react";

type Props = { data: any };

function TnBookingTable({ data }: Props) {
  return (
    <table className="table table-xs">
      <thead>
        <tr>
          <th></th>
          <th>Customer</th>
          <th>Service</th>
          <th>Description</th>
          <th>Status</th>
          <th>Date</th>
          <th>Payment</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {data.map((d: any) => (
          <tr key={d.id}>
            <td>{d.id}</td>
            <td>{d.customer}</td>
            <td>{d.service}</td>
            <td>{d.description}</td>
            <td>{d.status}</td>
            <td>{d.date}</td>
            <td>{d.payment}</td>
            <td className="">
              <div className="dropdown dropdown-hover -translate-xs-2">
                <div tabIndex={0} role="button" className="btn m-1">
                  Actions
                </div>
                <ul
                  tabIndex={-1}
                  className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
                >
                  <li>
                    <a>Accept</a>
                  </li>
                  <li>
                    <a>Reject</a>
                  </li>
                </ul>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default TnBookingTable;
