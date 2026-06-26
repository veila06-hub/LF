import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiUserPlus, FiTrash2, FiUsers } from "react-icons/fi";
import { toast } from "react-toastify";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import PageHeader from "../components/ui/PageHeader";

const EASE = [0.22, 1, 0.36, 1];

export default function UserManagement() {
  const { can, profile } = useAuth();

  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    password: "",
    role_id: "",
  });

  const canCreate = can("users", "create");
  const canEdit = can("users", "edit");
  const canDelete = can("users", "delete");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [usersRes, rolesRes] = await Promise.all([
        api.get("/users/"),
        api.get("/roles/"),
      ]);
      setUsers(usersRes.data);
      setRoles(rolesRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const assignRole = async (userId, roleId) => {
    try {
      await api.post("/assign-role/", { user_id: userId, role_id: roleId });
      await loadData();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to assign role");
    }
  };

  const createUser = async () => {
    if (!newUser.username.trim() || !newUser.password) {
      toast.error("Username and password are required");
      return;
    }
    try {
      await api.post("/users/", newUser);
      setNewUser({ username: "", email: "", password: "", role_id: "" });
      await loadData();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to create user");
    }
  };

  const deleteUser = async (user) => {
    if (!confirm(`Delete user "${user.username}"?`)) return;
    try {
      await api.delete(`/users/${user.id}/`);
      await loadData();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to delete user");
    }
  };

  return (
    <div className="space-y-8 p-6">
      <PageHeader
        eyebrow="Team"
        title="User Management"
        subtitle="Invite teammates, assign roles and manage access."
        icon={FiUsers}
      />

      {/* Add user */}
      {canCreate && (
        <Card delay={0.05} className="p-6">
          <h2
            className="mb-5 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide"
            style={{ color: "var(--text)" }}
          >
            <FiUserPlus className="accent-text" /> Add User
          </h2>
          <div className="grid gap-3 md:grid-cols-5">
            <input
              className="input-field"
              placeholder="Username"
              value={newUser.username}
              onChange={(e) =>
                setNewUser({ ...newUser, username: e.target.value })
              }
            />
            <input
              className="input-field"
              placeholder="Email"
              value={newUser.email}
              onChange={(e) =>
                setNewUser({ ...newUser, email: e.target.value })
              }
            />
            <input
              type="password"
              className="input-field"
              placeholder="Password"
              value={newUser.password}
              onChange={(e) =>
                setNewUser({ ...newUser, password: e.target.value })
              }
            />
            <select
              className="input-field"
              value={newUser.role_id}
              onChange={(e) =>
                setNewUser({ ...newUser, role_id: e.target.value })
              }
            >
              <option value="">No role</option>
              {roles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
            <Button onClick={createUser} variant="primary" size="md">
              Create
            </Button>
          </div>
        </Card>
      )}

      {/* User list */}
      <div className="space-y-3">
        <AnimatePresence initial={false}>
          {users.map((user, i) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ delay: i * 0.04, duration: 0.4, ease: EASE }}
            >
              <Card hover className="flex flex-wrap items-center justify-between gap-3 p-4">
                <div className="flex items-center gap-3">
                  <div
                    className="accent-grad grid h-11 w-11 shrink-0 place-items-center rounded-xl text-sm font-semibold text-white shadow"
                  >
                    {(user.username || "?").slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p
                      className="flex items-center gap-2 font-semibold"
                      style={{ color: "var(--text)" }}
                    >
                      {user.username}
                      {user.is_superuser && (
                        <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-xs font-medium text-amber-500">
                          superuser
                        </span>
                      )}
                    </p>
                    <p className="muted mt-0.5 text-sm">
                      {user.email || "no email"} · Current role:{" "}
                      <b style={{ color: "var(--text)" }}>
                        {user.role || "No Role"}
                      </b>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    className="input-field disabled:opacity-60"
                    value={user.role_id || ""}
                    disabled={!canEdit}
                    onChange={(e) => assignRole(user.id, e.target.value)}
                  >
                    <option value="">No Role</option>
                    {roles.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.name}
                      </option>
                    ))}
                  </select>

                  {canDelete && user.id !== profile?.id && (
                    <button
                      onClick={() => deleteUser(user)}
                      className="rounded-lg p-2.5 text-red-400 transition-colors hover:bg-red-500/10"
                      title="Delete user"
                    >
                      <FiTrash2 />
                    </button>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
