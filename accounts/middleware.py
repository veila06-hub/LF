"""
RBAC middleware for permission checking, auditing, and request enrichment.

Responsibilities:
  - Attach user roles & permissions to each request (for easy access in views).
  - Log permission checks for audit trails.
  - Optionally enforce permissions at middleware level (if configured).
"""

import logging
from django.http import JsonResponse
from django.utils.deprecation import MiddlewareMixin

from .rbac import get_user_permissions, get_user_modules, has_permission

logger = logging.getLogger('accounts.rbac')


class RBACEnrichmentMiddleware(MiddlewareMixin):
    """
    Enriches each request with user roles, permissions, and modules.
    Makes RBAC data available throughout the request lifecycle.
    """

    def process_request(self, request):
        """Attach RBAC data to request object."""
        user = getattr(request, 'user', None)

        if user and user.is_authenticated:
            # Attach permissions and modules to the request for easy access in views.
            request.user_permissions = get_user_permissions(user)
            request.user_modules = get_user_modules(user)
            
            # Log the access
            logger.info(
                f"User {user.username} (id={user.id}) accessed {request.method} {request.path}"
            )
        else:
            request.user_permissions = {}
            request.user_modules = []

        return None  # Continue to next middleware


class RBACPermissionCheckMiddleware(MiddlewareMixin):
    """
    Optionally enforce permissions at the middleware level.
    
    Routes can be configured with required (module, action) tuples.
    If access is denied, returns a 403 JSON response.
    
    Usage: Configure RBAC_PROTECTED_ROUTES in Django settings.
    Example:
        RBAC_PROTECTED_ROUTES = {
            r'^/api/admin-stats/$': ('dashboard', 'view'),
        }
    """

    def __init__(self, get_response):
        self.get_response = get_response
        from django.conf import settings
        
        # Get protected routes from settings (default: empty dict).
        self.protected_routes = getattr(settings, 'RBAC_PROTECTED_ROUTES', {})
        self.route_patterns = []
        
        # Compile regex patterns for faster matching.
        import re
        for pattern, perm in self.protected_routes.items():
            self.route_patterns.append((re.compile(pattern), perm))

    def process_request(self, request):
        """Check if user has permission to access the route."""
        user = getattr(request, 'user', None)

        # Check if this path is protected.
        for pattern, (module, action) in self.route_patterns:
            if pattern.match(request.path):
                # Route is protected; check permission.
                if not user or not user.is_authenticated:
                    logger.warning(
                        f"Unauthorized access attempt to {request.method} {request.path}"
                    )
                    return JsonResponse(
                        {"detail": "Authentication credentials were not provided."},
                        status=401
                    )

                if not has_permission(user, module, action):
                    logger.warning(
                        f"Permission denied for {user.username}: {module}.{action} "
                        f"on {request.method} {request.path}"
                    )
                    return JsonResponse(
                        {"detail": f"Permission denied: requires {module}.{action}."},
                        status=403
                    )

                # Permission granted; log and continue.
                logger.info(
                    f"Permission granted: {user.username} accessed {module}.{action} "
                    f"on {request.method} {request.path}"
                )

        return None  # Continue to next middleware


class RBACAuditLoggingMiddleware(MiddlewareMixin):
    """
    Log all POST, PUT, DELETE requests for audit trails.
    Useful for compliance and debugging.
    """

    def process_request(self, request):
        """Log write operations."""
        user = getattr(request, 'user', None)
        
        if request.method in ['POST', 'PUT', 'DELETE', 'PATCH']:
            username = user.username if user and user.is_authenticated else 'anonymous'
            logger.info(
                f"AUDIT: {request.method} {request.path} by {username} "
                f"from {request.META.get('REMOTE_ADDR', '?')}"
            )

        return None

    def process_response(self, request, response):
        """Log response status for write operations."""
        user = getattr(request, 'user', None)
        
        if request.method in ['POST', 'PUT', 'DELETE', 'PATCH']:
            username = user.username if user and user.is_authenticated else 'anonymous'
            status = response.status_code
            
            if status >= 400:
                logger.warning(
                    f"AUDIT: {request.method} {request.path} by {username} "
                    f"returned {status}"
                )
            else:
                logger.info(
                    f"AUDIT: {request.method} {request.path} by {username} "
                    f"returned {status}"
                )

        return response
