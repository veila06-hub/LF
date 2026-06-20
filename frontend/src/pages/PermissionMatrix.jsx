import { useEffect, useState } from "react";
import api from "../api/axios";

export default function PermissionMatrix() {

  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [matrix, setMatrix] = useState([]);

  const [selectedRole, setSelectedRole] = useState("");
  const [selectedPermission, setSelectedPermission] = useState("");

  useEffect(() => {
    loadRoles();
    loadPermissions();
    loadMatrix();
  }, []);

  const loadRoles = async () => {
    try {
      const res = await api.get("/roles/");
      setRoles(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const loadPermissions = async () => {
    try {
      const res = await api.get("/permissions/");
      setPermissions(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const loadMatrix = async () => {
    try {
      const res = await api.get("/role-permissions/");
      setMatrix(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const assignPermission = async () => {
    try {
      await api.post("/assign-permission/", {
        role_id: selectedRole,
        permission_id: selectedPermission,
      });

      alert("Permission Assigned Successfully");

      loadMatrix();

    } catch (err) {
      console.log(err);
      alert("Failed");
    }
  };

  return (
    <div className="p-6">

      <h1 className="text-3xl font-bold mb-6">
        Permission Matrix
      </h1>

      {/* Assign Permission Card */}

      <div className="border rounded-xl p-5 mb-8">

        <h2 className="font-semibold text-lg mb-4">
          Assign Permission To Role
        </h2>

        <div className="grid md:grid-cols-3 gap-4">

          <select
            className="border p-3 rounded-xl"
            value={selectedRole}
            onChange={(e) =>
              setSelectedRole(e.target.value)
            }
          >
            <option value="">
              Select Role
            </option>

            {roles.map((role) => (
              <option
                key={role.id}
                value={role.id}
              >
                {role.name}
              </option>
            ))}
          </select>

          <select
            className="border p-3 rounded-xl"
            value={selectedPermission}
            onChange={(e) =>
              setSelectedPermission(e.target.value)
            }
          >
            <option value="">
              Select Permission
            </option>

            {permissions.map((p) => (
              <option
                key={p.id}
                value={p.id}
              >
                {p.module}.{p.action}
              </option>
            ))}
          </select>

          <button
            onClick={assignPermission}
            className="bg-indigo-600 text-white rounded-xl px-4 py-3"
          >
            Assign Permission
          </button>

        </div>
      </div>

      {/* Permission Matrix */}

      <div className="space-y-6">

        {matrix.map((role) => (

          <div
            key={role.role}
            className="border rounded-xl p-5"
          >

            <h2 className="font-bold text-xl mb-4">
              {role.role}
            </h2>

            <div className="flex flex-wrap gap-2">

              {role.permissions.map((perm) => (
                <div
                  key={perm}
                  className="flex items-center gap-2 bg-indigo-100 text-indigo-700 px-3 py-1 rounded-lg"
                >
                  <span>{perm}</span>

                  <button
                    className="text-red-500 font-bold"
                  >
                    ×
                  </button>
                </div>
              ))}

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}