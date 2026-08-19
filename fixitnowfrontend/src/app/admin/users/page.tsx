"use client";
import { useState } from "react";

type Props = {};

function UsersPage({}: Props) {
  const mockUsers = [
    {
      id: 1,
      name: "John Doe",
      email: "[EMAIL_ADDRESS]",
      role: "admin",
      status: "active",
    },
    {
      id: 2,
      name: "Jane Doe",
      email: "[EMAIL_ADDRESS]",
      role: "user",
      status: "inactive",
    },
    {
      id: 3,
      name: "Bob Smith",
      email: "[EMAIL_ADDRESS]",
      role: "user",
      status: "active",
    },
  ];
  const [mockUserState, setMockUserState] = useState<any>(mockUsers);
  function handleUserAction(
    id: number,
    action: "activate" | "deactivate" | "delete",
  ) {
    switch (action) {
      case "activate":
        setMockUserState((prev: any) =>
          prev.map((user: any) =>
            user.id === id ? { ...user, status: "active" } : user,
          ),
        );
        break;
      case "deactivate":
        setMockUserState((prev: any) =>
          prev.map((user: any) =>
            user.id === id ? { ...user, status: "inactive" } : user,
          ),
        );
        break;
      case "delete":
        setMockUserState((prev: any) =>
          prev.filter((user: any) => user.id !== id),
        );
        break;
    }
  }

  return (
    <div>
      <div className="">
        <table className="table">
          {/* head */}
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {mockUserState.map((u: any, i: number) => (
              <tr key={i} className="hover:bg-base-300">
                <th>{i + 1}</th>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>

                <td>
                  <div className="dropdown dropdown-hover">
                    <div tabIndex={0} role="button" className="btn m-1">
                      Actions
                    </div>
                    <ul
                      tabIndex={-1}
                      className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
                    >
                      <li>
                        {u.status === "active" ? (
                          <button
                            onClick={() => handleUserAction(u.id, "deactivate")}
                          >
                            Deactivate
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUserAction(u.id, "activate")}
                          >
                            Activate
                          </button>
                        )}
                      </li>
                      <li>
                        <button
                          onClick={() => handleUserAction(u.id, "delete")}
                        >
                          Delete
                        </button>
                      </li>
                    </ul>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UsersPage;
