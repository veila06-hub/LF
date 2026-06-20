import os

from django.conf import settings
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.core.mail import send_mail
from django.db import IntegrityError

from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from .found_serializers import FoundItemSerializer
from .lost_serializers import LostItemSerializer
from .models import (
    FoundItem,
    LostItem,
    Notification,
    Permission,
    Role,
    RolePermission,
    UserRole,
)
from .qr_utils import generate_qr
from .rbac import (
    ACTIONS,
    MODULE_BY_KEY,
    MODULE_KEYS,
    catalog,
    get_user_modules,
    get_user_permissions,
    has_permission,
    require_permission,
)
from .serializers import RegisterSerializer

# Role auto-assigned to users who self-register.
DEFAULT_SELF_REGISTER_ROLE = "Student"


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def user_payload(user):
    """Everything the frontend needs to drive routing + the sidebar."""
    roles = list(
        Role.objects.filter(userrole__user=user).values_list("name", flat=True)
    )
    return {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "is_superuser": user.is_superuser,
        "roles": roles,
        "permissions": get_user_permissions(user),
        "modules": get_user_modules(user),
    }


def is_admin(user):
    """A user who can manage other users counts as staff/admin and may act on
    records they don't personally own."""
    return user.is_superuser or has_permission(user, "users", "view")


# ---------------------------------------------------------------------------
# Public endpoints
# ---------------------------------------------------------------------------

@api_view(['GET'])
def test_api(request):
    return Response({"message": "Backend Working"})


@api_view(['POST'])
def register(request):
    serializer = RegisterSerializer(data=request.data)

    if serializer.is_valid():
        user = serializer.save()

        # Give new self-registered users the default low-privilege role.
        default_role = Role.objects.filter(name=DEFAULT_SELF_REGISTER_ROLE).first()
        if default_role:
            UserRole.objects.get_or_create(user=user, role=default_role)

        return Response({"message": "User Registered Successfully"})

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def login(request):
    username = request.data.get('username')
    password = request.data.get('password')

    user = authenticate(username=username, password=password)

    if user:
        refresh = RefreshToken.for_user(user)
        return Response({
            "message": "Login Successful",
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "user": user_payload(user),
        })

    return Response({"message": "Invalid Credentials"}, status=400)


# ---------------------------------------------------------------------------
# Current user
# ---------------------------------------------------------------------------

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def me(request):
    """Return the logged-in user's profile, permissions and visible modules."""
    return Response(user_payload(request.user))


# ---------------------------------------------------------------------------
# Lost items
# ---------------------------------------------------------------------------

@api_view(['POST'])
@require_permission('lost_items', 'create')
def create_lost_item(request):
    serializer = LostItemSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(user=request.user)
        return Response({"message": "Lost Item Added Successfully"})
    return Response(serializer.errors, status=400)


@api_view(['GET'])
@require_permission('lost_items', 'view')
def get_lost_items(request):
    items = LostItem.objects.all()
    serializer = LostItemSerializer(items, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@require_permission('lost_items', 'view')
def my_lost_items(request):
    items = LostItem.objects.filter(user=request.user)
    serializer = LostItemSerializer(items, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@require_permission('lost_items', 'view')
def lost_item_detail(request, pk):
    try:
        item = LostItem.objects.get(id=pk)
    except LostItem.DoesNotExist:
        return Response({"error": "Item not found"}, status=404)
    return Response(LostItemSerializer(item).data)


@api_view(['DELETE'])
@require_permission('lost_items', 'delete')
def delete_lost_item(request, pk):
    try:
        item = LostItem.objects.get(id=pk)
    except LostItem.DoesNotExist:
        return Response({"error": "Item not found"}, status=404)

    if item.user != request.user and not is_admin(request.user):
        return Response({"error": "You can only delete your own items"}, status=403)

    item.delete()
    return Response({"message": "Item Deleted Successfully"})


@api_view(['PUT'])
@require_permission('lost_items', 'edit')
def update_lost_item(request, pk):
    try:
        item = LostItem.objects.get(id=pk)
    except LostItem.DoesNotExist:
        return Response({"error": "Item not found"}, status=404)

    if item.user != request.user and not is_admin(request.user):
        return Response({"error": "You can only update your own items"}, status=403)

    serializer = LostItemSerializer(item, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Item Updated Successfully"})
    return Response(serializer.errors, status=400)


@api_view(['PUT'])
@require_permission('lost_items', 'edit')
def mark_as_recovered(request, pk):
    try:
        item = LostItem.objects.get(id=pk)
    except LostItem.DoesNotExist:
        return Response({"error": "Item not found"}, status=404)

    if item.user != request.user and not is_admin(request.user):
        return Response({"error": "You can only update your own item"}, status=403)

    item.is_recovered = True
    item.status = "Recovered"
    item.save()
    return Response({"message": "Item marked as recovered"})


@api_view(['GET'])
@require_permission('lost_items', 'view')
def claim_history(request):
    items = LostItem.objects.filter(user=request.user, is_recovered=True)
    serializer = LostItemSerializer(items, many=True)
    return Response(serializer.data)


# ---------------------------------------------------------------------------
# Found items
# ---------------------------------------------------------------------------

@api_view(['POST'])
@require_permission('found_items', 'create')
def create_found_item(request):
    serializer = FoundItemSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=400)

    found_item = serializer.save(user=request.user)

    matched_items = LostItem.objects.filter(
        title__icontains=found_item.title,
        location__icontains=found_item.location,
    )

    if matched_items.exists():
        for lost in matched_items:
            Notification.objects.create(
                user=lost.user,
                message=f"Match found for {lost.title}",
            )

        claim_id = f"CLAIM{found_item.id}"
        found_item.claim_id = claim_id
        found_item.save()
        send_mail(
            'Match Found',
            f'A matching item has been found for {found_item.title}',
            'admin@lostfound.com',
            [request.user.email],
            fail_silently=True,
        )

        qr_path = generate_qr(claim_id)
        filename = os.path.basename(qr_path)
        qr_url = request.build_absolute_uri(settings.MEDIA_URL + f"qrcodes/{filename}")

        return Response({
            "message": "Found Item Added Successfully",
            "match_found": True,
            "matches": matched_items.count(),
            "claim_id": claim_id,
            "qr_code": qr_url,
        })

    return Response({"message": "Found Item Added Successfully", "match_found": False})


@api_view(['GET'])
@require_permission('found_items', 'view')
def get_found_items(request):
    items = FoundItem.objects.all()
    serializer = FoundItemSerializer(items, many=True)
    return Response(serializer.data)


# ---------------------------------------------------------------------------
# Claims / verification
# ---------------------------------------------------------------------------

@api_view(['GET'])
@require_permission('verify', 'view')
def verify_claim(request, claim_id):
    """Return found item and candidate lost items for a claim id."""
    try:
        found = FoundItem.objects.get(claim_id=claim_id)
    except FoundItem.DoesNotExist:
        return Response({"error": "Claim not found"}, status=404)

    matched_items = LostItem.objects.filter(
        title__icontains=found.title,
        location__icontains=found.location,
    )

    found_data = FoundItemSerializer(found).data
    lost_data = LostItemSerializer(matched_items, many=True).data

    qr_url = None
    if found.claim_id:
        possible_path = os.path.join(settings.MEDIA_ROOT, 'qrcodes', f"{found.claim_id}.png")
        if os.path.exists(possible_path):
            qr_url = request.build_absolute_uri(settings.MEDIA_URL + f"qrcodes/{found.claim_id}.png")

    return Response({"found_item": found_data, "matches": lost_data, "qr_code": qr_url})


@api_view(['POST'])
@require_permission('verify', 'edit')
def confirm_claim(request, claim_id):
    """Mark a found item as claimed by the verifier."""
    try:
        found = FoundItem.objects.get(claim_id=claim_id)
    except FoundItem.DoesNotExist:
        return Response({"error": "Claim not found"}, status=404)

    found.is_claimed = True
    found.save()
    return Response({"message": "Claim verified"})


# ---------------------------------------------------------------------------
# Misc dashboards
# ---------------------------------------------------------------------------

@api_view(['GET'])
@require_permission('notifications', 'view')
def notifications(request):
    data = Notification.objects.order_by('-created_at')[:20]
    result = [{"id": n.id, "message": n.message} for n in data]
    return Response(result)


@api_view(['GET'])
@require_permission('matches', 'view')
def smart_matches(request):
    matches = []
    lost_items = LostItem.objects.all()
    found_items = FoundItem.objects.all()

    for lost in lost_items:
        for found in found_items:
            if (
                lost.title.lower() in found.title.lower()
                or found.title.lower() in lost.title.lower()
            ):
                matches.append({
                    "id": f"{lost.id}-{found.id}",
                    "lostItem": lost.title,
                    "lostDescription": lost.description,
                    "foundItem": found.title,
                    "foundDescription": found.description,
                    "location": found.location,
                    "score": 90,
                    "matchType": "Title Match",
                })

    return Response(matches)


@api_view(["GET"])
@require_permission('dashboard', 'view')
def dashboard_stats(request):
    return Response({
        "stats": [
            {"title": "Lost Items", "value": LostItem.objects.count()},
            {"title": "Found Items", "value": FoundItem.objects.count()},
            {"title": "Recovered", "value": LostItem.objects.filter(is_recovered=True).count()},
            {"title": "Notifications", "value": Notification.objects.count()},
        ]
    })


@api_view(['GET'])
@require_permission('analytics', 'view')
def admin_stats(request):
    return Response({
        "total_users": User.objects.count(),
        "total_lost_items": LostItem.objects.count(),
        "total_found_items": FoundItem.objects.count(),
        "total_recovered_items": LostItem.objects.filter(is_recovered=True).count(),
    })


# ===========================================================================
# RBAC administration
# ===========================================================================

@api_view(["GET"])
@require_permission('roles', 'view')
def rbac_catalog(request):
    """Full module/action catalog for rendering the permission matrix."""
    return Response(catalog())


@api_view(["GET"])
@require_permission('roles', 'view')
def get_permissions(request):
    """Flat list of permission rows (compat helper)."""
    data = [
        {"id": p.id, "module": p.module, "action": p.action}
        for p in Permission.objects.all()
    ]
    return Response(data)


# ---- Roles -----------------------------------------------------------------

@api_view(["GET", "POST"])
def roles_collection(request):
    if request.method == "GET":
        if not has_permission(request.user, "roles", "view"):
            return Response({"detail": "Permission denied: requires roles.view."}, status=403)
        data = []
        for role in Role.objects.all():
            data.append({
                "id": role.id,
                "name": role.name,
                "description": role.description,
                "user_count": UserRole.objects.filter(role=role).count(),
                "permission_count": RolePermission.objects.filter(role=role).count(),
            })
        return Response(data)

    # POST -> create
    if not has_permission(request.user, "roles", "create"):
        return Response({"detail": "Permission denied: requires roles.create."}, status=403)

    name = (request.data.get("name") or "").strip()
    if not name:
        return Response({"error": "Role name is required"}, status=400)

    if Role.objects.filter(name__iexact=name).exists():
        return Response({"error": "A role with that name already exists"}, status=400)

    role = Role.objects.create(
        name=name,
        description=(request.data.get("description") or "").strip(),
    )
    return Response(
        {"id": role.id, "name": role.name, "description": role.description},
        status=201,
    )


@api_view(["PUT", "DELETE"])
def role_detail(request, role_id):
    try:
        role = Role.objects.get(id=role_id)
    except Role.DoesNotExist:
        return Response({"error": "Role not found"}, status=404)

    if request.method == "PUT":
        if not has_permission(request.user, "roles", "edit"):
            return Response({"detail": "Permission denied: requires roles.edit."}, status=403)
        name = (request.data.get("name") or role.name).strip()
        if Role.objects.filter(name__iexact=name).exclude(id=role.id).exists():
            return Response({"error": "A role with that name already exists"}, status=400)
        role.name = name
        if "description" in request.data:
            role.description = (request.data.get("description") or "").strip()
        role.save()
        return Response({"id": role.id, "name": role.name, "description": role.description})

    # DELETE
    if not has_permission(request.user, "roles", "delete"):
        return Response({"detail": "Permission denied: requires roles.delete."}, status=403)
    role.delete()
    return Response({"message": "Role deleted"})


@api_view(["GET", "PUT"])
def role_permissions_detail(request, role_id):
    """GET returns ``{module: [actions]}`` for a role; PUT replaces it wholesale."""
    try:
        role = Role.objects.get(id=role_id)
    except Role.DoesNotExist:
        return Response({"error": "Role not found"}, status=404)

    if request.method == "GET":
        if not has_permission(request.user, "roles", "view"):
            return Response({"detail": "Permission denied: requires roles.view."}, status=403)
        granted = {}
        rows = RolePermission.objects.filter(role=role).values_list(
            "permission__module", "permission__action"
        )
        for module, action in rows:
            granted.setdefault(module, []).append(action)
        return Response({"role": role.name, "permissions": granted})

    # PUT -> replace the role's permissions with the submitted matrix.
    if not has_permission(request.user, "roles", "edit"):
        return Response({"detail": "Permission denied: requires roles.edit."}, status=403)

    submitted = request.data.get("permissions", {})
    if not isinstance(submitted, dict):
        return Response({"error": "permissions must be an object of module -> [actions]"}, status=400)

    # Validate and normalise against the canonical catalog.
    wanted = set()
    for module, actions in submitted.items():
        if module not in MODULE_KEYS:
            return Response({"error": f"Unknown module: {module}"}, status=400)
        allowed = MODULE_BY_KEY[module]["actions"]
        for action in (actions or []):
            if action not in ACTIONS:
                return Response({"error": f"Unknown action: {action}"}, status=400)
            if action not in allowed:
                return Response(
                    {"error": f"Module '{module}' does not support action '{action}'"},
                    status=400,
                )
            wanted.add((module, action))

    # Ensure the permission rows exist, then sync the role's grants.
    RolePermission.objects.filter(role=role).delete()
    for module, action in wanted:
        perm, _ = Permission.objects.get_or_create(module=module, action=action)
        RolePermission.objects.get_or_create(role=role, permission=perm)

    return Response({"message": "Permissions updated", "count": len(wanted)})


# ---- Users -----------------------------------------------------------------

@api_view(["GET", "POST"])
def users_collection(request):
    if request.method == "GET":
        if not has_permission(request.user, "users", "view"):
            return Response({"detail": "Permission denied: requires users.view."}, status=403)
        data = []
        for user in User.objects.all().order_by("id"):
            ur = UserRole.objects.filter(user=user).select_related("role").first()
            data.append({
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "is_superuser": user.is_superuser,
                "role": ur.role.name if ur else None,
                "role_id": ur.role.id if ur else None,
            })
        return Response(data)

    # POST -> create user (admin)
    if not has_permission(request.user, "users", "create"):
        return Response({"detail": "Permission denied: requires users.create."}, status=403)

    username = (request.data.get("username") or "").strip()
    password = request.data.get("password")
    if not username or not password:
        return Response({"error": "username and password are required"}, status=400)
    if User.objects.filter(username=username).exists():
        return Response({"error": "Username already taken"}, status=400)

    user = User.objects.create_user(
        username=username,
        email=(request.data.get("email") or "").strip(),
        password=password,
    )

    role_id = request.data.get("role_id")
    if role_id:
        role = Role.objects.filter(id=role_id).first()
        if role:
            UserRole.objects.get_or_create(user=user, role=role)

    return Response({"id": user.id, "username": user.username}, status=201)


@api_view(["DELETE"])
@require_permission('users', 'delete')
def user_detail(request, user_id):
    try:
        target = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=404)

    if target == request.user:
        return Response({"error": "You cannot delete your own account"}, status=400)

    target.delete()
    return Response({"message": "User deleted"})


@api_view(["POST"])
@require_permission('users', 'edit')
def assign_role(request):
    user_id = request.data.get("user_id")
    role_id = request.data.get("role_id")

    user = User.objects.filter(id=user_id).first()
    if not user:
        return Response({"error": "User not found"}, status=404)

    # Empty role_id clears the user's role.
    UserRole.objects.filter(user=user).delete()

    if role_id:
        role = Role.objects.filter(id=role_id).first()
        if not role:
            return Response({"error": "Role not found"}, status=404)
        try:
            UserRole.objects.create(user=user, role=role)
        except IntegrityError:
            pass

    return Response({"message": "Role assigned successfully"})


# ---- Compat: simple role list used by dropdowns ---------------------------

@api_view(["GET"])
@require_permission('users', 'view')
def get_roles(request):
    data = [{"id": r.id, "name": r.name} for r in Role.objects.all()]
    return Response(data)
