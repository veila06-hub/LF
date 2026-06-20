import { useEffect, useState } from "react";
import api from "../api/axios";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const usersRes = await api.get("/users/");
      const rolesRes = await api.get("/roles/");

      setUsers(usersRes.data);
      setRoles(rolesRes.data);
    } catch (err) {
      console.log(err);
    }
  };

  const assignRole = async (userId, roleId) => {
    try {
      await api.post("/assign-role/", {
        user_id: userId,
        role_id: roleId,
      });

      alert("Role Assigned Successfully");
    } catch (err) {
      console.log(err);
      alert("Failed to assign role");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">
        User Management
      </h1>

      <div className="space-y-4">
        {users.map((user) => (
          <div
            key={user.id}
            className="border p-4 rounded-xl flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">
                {user.username}
                <p className="text-sm text-gray-500">
        Current Role: {user.role || "No Role"}
            </p>
              </p>
            </div>

            <select
              className="border rounded-lg px-3 py-2"
              onChange={(e) =>
                assignRole(user.id, e.target.value)
              }
            >
              <option>Select Role</option>

              {roles.map((role) => (
                <option
                  key={role.id}
                  value={role.id}
                >
                  {role.name}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}