"""
Central RBAC definitions and helpers.

This is the single source of truth for:
  - the list of modules in the app,
  - the actions (CRUD) each module supports,
  - the permission-checking helpers used by the views,
  - the ``require_permission`` decorator that guards endpoints.

Permissions are stored as (module, action) string pairs on the Permission
model. Both module keys and actions are lowercase and stable so the frontend
can rely on them.
"""

from functools import wraps

from rest_framework.response import Response
from rest_framework import status


# ---------------------------------------------------------------------------
# Canonical catalog
# ---------------------------------------------------------------------------

# The four CRUD actions. ``view`` controls whether the module is visible /
# openable at all (it drives the sidebar), the rest gate write operations.
ACTIONS = ["view", "create", "edit", "delete"]

# Every module in the product. ``path`` matches the frontend route so the
# sidebar can be rendered directly from a user's granted modules.
MODULES = [
    {"key": "dashboard",     "label": "Dashboard",            "path": "/dashboard",          "actions": ["view"]},
    {"key": "lost_items",    "label": "Lost Items",           "path": "/lost-items",         "actions": ["view", "create", "edit", "delete"]},
    {"key": "found_items",   "label": "Found Items",          "path": "/found-items",        "actions": ["view", "create", "edit", "delete"]},
    {"key": "matches",       "label": "Smart Matches",        "path": "/matches",            "actions": ["view"]},
    {"key": "verify",        "label": "Verify Claim",         "path": "/verify",             "actions": ["view", "edit"]},
    {"key": "notifications", "label": "Notifications",        "path": "/notifications",      "actions": ["view"]},
    {"key": "analytics",     "label": "Analytics",            "path": "/analytics",          "actions": ["view"]},
    {"key": "users",         "label": "User Management",      "path": "/user-management",    "actions": ["view", "create", "edit", "delete"]},
    {"key": "roles",         "label": "Roles & Permissions",  "path": "/permission-matrix",  "actions": ["view", "create", "edit", "delete"]},
]

MODULE_KEYS = {m["key"] for m in MODULES}
MODULE_BY_KEY = {m["key"]: m for m in MODULES}


def catalog():
    """Full module/action catalog, used to render the permission matrix."""
    return {"actions": ACTIONS, "modules": MODULES}


# ---------------------------------------------------------------------------
# Permission checks
# ---------------------------------------------------------------------------

def has_permission(user, module, action):
    """True if ``user`` may perform ``action`` on ``module``.

    Superusers always pass (so the system can never be fully locked out).
    """
    if not user or not user.is_authenticated:
        return False

    if user.is_superuser:
        return True

    # Imported lazily to avoid a circular import at module load time.
    from .models import Role, Permission

    roles = Role.objects.filter(userrole__user=user)

    return Permission.objects.filter(
        rolepermission__role__in=roles,
        module=module,
        action=action,
    ).exists()


def get_user_permissions(user):
    """Return ``{module_key: [actions]}`` of everything the user can do.

    Superusers get the full canonical catalog.
    """
    if not user or not user.is_authenticated:
        return {}

    if user.is_superuser:
        return {m["key"]: list(m["actions"]) for m in MODULES}

    from .models import Role, Permission

    roles = Role.objects.filter(userrole__user=user)
    perms = Permission.objects.filter(
        rolepermission__role__in=roles
    ).distinct().values_list("module", "action")

    result = {}
    for module, action in perms:
        result.setdefault(module, [])
        if action not in result[module]:
            result[module].append(action)
    return result


def get_user_modules(user):
    """Modules the user can ``view``, in catalog order, with granted actions.

    This is exactly what the sidebar needs.
    """
    perms = get_user_permissions(user)
    modules = []
    for m in MODULES:
        granted = perms.get(m["key"], [])
        if "view" in granted:
            modules.append({
                "key": m["key"],
                "label": m["label"],
                "path": m["path"],
                "actions": [a for a in m["actions"] if a in granted],
            })
    return modules


# ---------------------------------------------------------------------------
# Decorator
# ---------------------------------------------------------------------------

def require_permission(module, action):
    """Guard a DRF function view with a single (module, action) requirement.

    Place it *below* ``@api_view`` so it receives the DRF request whose
    ``user`` has already been resolved by JWT authentication::

        @api_view(["GET"])
        @require_permission("lost_items", "view")
        def get_lost_items(request):
            ...
    """
    def decorator(view_func):
        @wraps(view_func)
        def wrapper(request, *args, **kwargs):
            user = getattr(request, "user", None)

            if not user or not user.is_authenticated:
                return Response(
                    {"detail": "Authentication credentials were not provided."},
                    status=status.HTTP_401_UNAUTHORIZED,
                )

            if not has_permission(user, module, action):
                return Response(
                    {"detail": f"Permission denied: requires {module}.{action}."},
                    status=status.HTTP_403_FORBIDDEN,
                )

            return view_func(request, *args, **kwargs)

        return wrapper

    return decorator
