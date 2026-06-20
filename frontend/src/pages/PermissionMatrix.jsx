import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlus, FiTrash2, FiSave, FiShield, FiUsers, FiKey } from "react-icons/fi";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import PageHeader from "../components/ui/PageHeader";

const EASE = [0.22, 1, 0.36, 1];

export default function PermissionMatrix() {
  const { can, reloadProfile } = useAuth();

  const [catalog, setCatalog] = useState({ actions: [], modules: [] });
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [draft, setDraft] = useState({}); // { moduleKey: [actions] }
  const [loadingPerms, setLoadingPerms] = useState(false);
  const [saving, setSaving] = useState(false);

  const [newRole, setNewRole] = useState({ name: "", description: "" });

  const canCreate = can("roles", "create");
  const canEdit = can("roles", "edit");
  const canDelete = can("roles", "delete");

  useEffect(() => {
    loadCatalog();
    loadRoles();
  }, []);

  const loadCatalog = async () => {
    try {
      const { data } = await api.get("/rbac-catalog/");
      setCatalog(data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadRoles = async () => {
    try {
      const { data } = await api.get("/roles/");
      setRoles(data);
    } catch (err) {
      console.error(err);
    }
  };

  const selectRole = async (role) => {
    setSelectedRole(role);
    setLoadingPerms(true);
    try {
      const { data } = await api.get(`/roles/${role.id}/permissions/`);
      setDraft(data.permissions || {});
    } catch (err) {
      console.error(err);
      setDraft({});
    } finally {
      setLoadingPerms(false);
    }
  };

  const toggle = (moduleKey, action) => {
    if (!canEdit) return;
    setDraft((prev) => {
      const current = new Set(prev[moduleKey] || []);
      if (current.has(action)) {
        current.delete(action);
        // Removing "view" hides the module entirely, so clear the rest too.
        if (action === "view") current.clear();
      } else {
        current.add(action);
        // Any write permission implies the module must be viewable.
        current.add("view");
      }
      return { ...prev, [moduleKey]: Array.from(current) };
    });
  };

  const savePermissions = async () => {
    if (!selectedRole) return;
    setSaving(true);
    try {
      const cleaned = {};
      Object.entries(draft).forEach(([m, actions]) => {
        if (actions && actions.length) cleaned[m] = actions;
      });
      await api.put(`/roles/${selectedRole.id}/permissions/`, {
        permissions: cleaned,
      });
      await loadRoles();
      await reloadProfile(); // my own sidebar may change
      alert("Permissions saved");
    } catch (err) {
      alert(err.response?.data?.error || "Failed to save permissions");
    } finally {
      setSaving(false);
    }
  };

  const createRole = async () => {
    if (!newRole.name.trim()) return alert("Role name is required");
    try {
      const { data } = await api.post("/roles/", newRole);
      setNewRole({ name: "", description: "" });
      await loadRoles();
      selectRole({ id: data.id, name: data.name, description: data.description });
    } catch (err) {
      alert(err.response?.data?.error || "Failed to create role");
    }
  };

  const deleteRole = async (role) => {
    if (!confirm(`Delete role "${role.name}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/roles/${role.id}/`);
      if (selectedRole?.id === role.id) {
        setSelectedRole(null);
        setDraft({});
      }
      await loadRoles();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to delete role");
    }
  };

  const has = (moduleKey, action) =>
    (draft[moduleKey] || []).includes(action);

  return (
    <div className="space-y-8 p-6">
      <PageHeader
        eyebrow="Access Control"
        title="Roles & Permissions"
        subtitle="Define roles and fine-tune what each one can see and do."
        icon={FiShield}
      />

      <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
        {/* ---- Roles column ---- */}
        <div className="space-y-5">
          {canCreate && (
            <Card delay={0.05} className="p-5">
              <h2
                className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide"
                style={{ color: "var(--text)" }}
              >
                <FiPlus className="accent-text" /> Create Role
              </h2>
              <div className="space-y-3">
                <input
                  className="input-field w-full"
                  placeholder="Role name"
                  value={newRole.name}
                  onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                />
                <input
                  className="input-field w-full"
                  placeholder="Description (optional)"
                  value={newRole.description}
                  onChange={(e) =>
                    setNewRole({ ...newRole, description: e.target.value })
                  }
                />
                <Button
                  onClick={createRole}
                  variant="primary"
                  size="md"
                  icon={FiPlus}
                  className="w-full"
                >
                  Add Role
                </Button>
              </div>
            </Card>
          )}

          <Card delay={0.12} className="overflow-hidden">
            <div
              className="flex items-center justify-between border-b px-5 py-4 hairline"
              style={{ borderColor: "var(--border)" }}
            >
              <h2
                className="flex items-center gap-2 text-sm font-semibold"
                style={{ color: "var(--text)" }}
              >
                <FiKey className="accent-text" /> Roles
              </h2>
              <span className="accent-soft rounded-full px-2.5 py-0.5 text-xs font-semibold">
                {roles.length}
              </span>
            </div>
            <ul>
              <AnimatePresence initial={false}>
                {roles.map((role, i) => {
                  const active = selectedRole?.id === role.id;
                  return (
                    <motion.li
                      key={role.id}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 12 }}
                      transition={{ delay: i * 0.03, duration: 0.35, ease: EASE }}
                      className={`flex items-center justify-between border-b px-4 py-3 transition-colors last:border-0 ${
                        active ? "accent-soft" : "hover:bg-[var(--surface-2)]"
                      }`}
                      style={{ borderColor: "var(--border)" }}
                    >
                      <button
                        onClick={() => selectRole(role)}
                        className="flex-1 text-left"
                      >
                        <p
                          className="font-medium"
                          style={{ color: "var(--text)" }}
                        >
                          {role.name}
                        </p>
                        <p className="faint mt-0.5 text-xs">
                          {role.permission_count} permissions · {role.user_count} users
                        </p>
                      </button>
                      {canDelete && (
                        <button
                          onClick={() => deleteRole(role)}
                          className="ml-2 rounded-lg p-2 text-red-400 transition-colors hover:bg-red-500/10"
                          title="Delete role"
                        >
                          <FiTrash2 />
                        </button>
                      )}
                    </motion.li>
                  );
                })}
              </AnimatePresence>
            </ul>
          </Card>
        </div>

        {/* ---- Permission matrix ---- */}
        <Card delay={0.18} className="p-6">
          {!selectedRole ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="accent-soft mb-4 grid h-16 w-16 place-items-center rounded-2xl">
                <FiShield size={28} className="accent-text" />
              </div>
              <p className="muted">
                Select a role to view and edit its permissions.
              </p>
            </div>
          ) : loadingPerms ? (
            <div className="flex items-center justify-center py-20">
              <p className="muted">Loading permissions…</p>
            </div>
          ) : (
            <>
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2
                    className="text-xl font-bold tracking-tight"
                    style={{ color: "var(--text)" }}
                  >
                    {selectedRole.name}
                  </h2>
                  {selectedRole.description && (
                    <p className="muted mt-1 text-sm">
                      {selectedRole.description}
                    </p>
                  )}
                </div>
                {canEdit && (
                  <Button
                    onClick={savePermissions}
                    disabled={saving}
                    variant="primary"
                    size="md"
                    icon={FiSave}
                  >
                    {saving ? "Saving…" : "Save Changes"}
                  </Button>
                )}
              </div>

              <div
                className="overflow-x-auto rounded-xl border hairline"
                style={{ borderColor: "var(--border)" }}
              >
                <table className="w-full text-sm">
                  <thead>
                    <tr
                      className="sticky top-0 z-10 text-left"
                      style={{ background: "var(--surface-2)" }}
                    >
                      <th
                        className="px-4 py-3 font-semibold"
                        style={{ color: "var(--text)" }}
                      >
                        Module
                      </th>
                      {catalog.actions.map((a) => (
                        <th
                          key={a}
                          className="px-3 py-3 text-center font-semibold capitalize"
                          style={{ color: "var(--text)" }}
                        >
                          {a}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {catalog.modules.map((m) => (
                      <tr
                        key={m.key}
                        className="border-t transition-colors hover:bg-[var(--surface-2)]"
                        style={{ borderColor: "var(--border)" }}
                      >
                        <td
                          className="px-4 py-3 font-medium"
                          style={{ color: "var(--text)" }}
                        >
                          {m.label}
                        </td>
                        {catalog.actions.map((a) => {
                          const supported = m.actions.includes(a);
                          return (
                            <td key={a} className="px-3 py-3 text-center">
                              {supported ? (
                                <input
                                  type="checkbox"
                                  className="h-4 w-4 cursor-pointer accent-[var(--accent)] disabled:cursor-not-allowed"
                                  checked={has(m.key, a)}
                                  disabled={!canEdit}
                                  onChange={() => toggle(m.key, a)}
                                />
                              ) : (
                                <span className="faint">—</span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="faint mt-4 text-xs">
                Tip: enabling any action automatically enables{" "}
                <b style={{ color: "var(--text)" }}>view</b>. Disabling{" "}
                <b style={{ color: "var(--text)" }}>view</b> hides the whole module.
              </p>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
