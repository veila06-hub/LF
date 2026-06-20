"""
Seed / rebuild the RBAC catalog into the canonical format.

Idempotent: running it repeatedly converges to the same state.

  - Rebuilds the Permission catalog to exactly the canonical (module, action)
    pairs defined in ``accounts.rbac`` (removing legacy/ad-hoc rows).
  - Ensures the default roles exist and grants each its default permissions.
  - Maps every Django superuser to the "Super Admin" role.

Existing user -> role assignments are preserved because the default role
names match the roles already in the database.

    python manage.py seed_rbac
"""

from django.core.management.base import BaseCommand
from django.contrib.auth.models import User

from accounts.models import Role, Permission, RolePermission, UserRole
from accounts.rbac import MODULES, MODULE_BY_KEY


SUPERADMIN_ROLE = "Super Admin"

# Default role -> {module: [actions]}. Use "ALL" to grant the full catalog.
DEFAULT_ROLE_GRANTS = {
    "Super Admin": "ALL",
    "Campus Admin": {
        "dashboard": ["view"],
        "lost_items": ["view", "create", "edit", "delete"],
        "found_items": ["view", "create", "edit", "delete"],
        "matches": ["view"],
        "verify": ["view", "edit"],
        "notifications": ["view"],
        "analytics": ["view"],
        "users": ["view", "create", "edit", "delete"],
        "roles": ["view"],
    },
    "Security Officer": {
        "dashboard": ["view"],
        "lost_items": ["view"],
        "found_items": ["view", "create", "edit"],
        "matches": ["view"],
        "verify": ["view", "edit"],
        "notifications": ["view"],
    },
    "Student": {
        "dashboard": ["view"],
        "lost_items": ["view", "create", "edit", "delete"],
        "found_items": ["view", "create"],
        "matches": ["view"],
        "notifications": ["view"],
    },
}


class Command(BaseCommand):
    help = "Rebuild the canonical RBAC catalog and seed default role permissions."

    def handle(self, *args, **options):
        self._rebuild_permission_catalog()
        self._seed_roles()
        self._map_superusers()
        self.stdout.write(self.style.SUCCESS("RBAC seed complete."))

    # -- 1. canonical permission catalog ------------------------------------
    def _rebuild_permission_catalog(self):
        canonical = set()
        for m in MODULES:
            for action in m["actions"]:
                canonical.add((m["key"], action))

        # Drop any permission rows that aren't in the canonical catalog
        # (this removes the old "Lost Items"/"View"/"Manage" style rows).
        removed = 0
        for perm in Permission.objects.all():
            if (perm.module, perm.action) not in canonical:
                perm.delete()
                removed += 1

        # Ensure all canonical rows exist.
        for module, action in canonical:
            Permission.objects.get_or_create(module=module, action=action)

        self.stdout.write(
            f"Permission catalog: {len(canonical)} canonical rows "
            f"({removed} legacy rows removed)."
        )

    # -- 2. default roles + grants ------------------------------------------
    def _seed_roles(self):
        for role_name, grants in DEFAULT_ROLE_GRANTS.items():
            role, created = Role.objects.get_or_create(name=role_name)
            verb = "created" if created else "exists"

            if grants == "ALL":
                grant_map = {m["key"]: m["actions"] for m in MODULES}
            else:
                grant_map = grants

            RolePermission.objects.filter(role=role).delete()
            count = 0
            for module, actions in grant_map.items():
                allowed = MODULE_BY_KEY[module]["actions"]
                for action in actions:
                    if action not in allowed:
                        continue
                    perm = Permission.objects.get(module=module, action=action)
                    RolePermission.objects.get_or_create(role=role, permission=perm)
                    count += 1

            self.stdout.write(f"  Role '{role_name}' ({verb}): {count} permissions granted.")

    # -- 3. superusers -> Super Admin ---------------------------------------
    def _map_superusers(self):
        admin_role = Role.objects.filter(name=SUPERADMIN_ROLE).first()
        if not admin_role:
            return
        mapped = 0
        for user in User.objects.filter(is_superuser=True):
            _, created = UserRole.objects.get_or_create(user=user, role=admin_role)
            if created:
                mapped += 1
        self.stdout.write(f"Superusers mapped to '{SUPERADMIN_ROLE}': {mapped} new.")
