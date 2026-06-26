# Backwards-compatible shim. The real implementation now lives in rbac.py.
from .rbac import has_permission, require_permission, get_user_permissions  # noqa: F401

