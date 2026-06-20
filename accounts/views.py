from rest_framework.response import Response
from .permissions import has_permission
from django.contrib.auth.models import User
from django.core.mail import send_mail
from .qr_utils import generate_qr
from .models import FoundItem
from .found_serializers import FoundItemSerializer
from .lost_serializers import LostItemSerializer
from .models import LostItem
from django.contrib.auth import authenticate
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .models import LostItem, FoundItem, Notification ,  Role, Permission,  UserRole, RolePermission

from .serializers import RegisterSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from django.conf import settings
import os


@api_view(['GET'])
def test_api(request):
    return Response({
        "message": "Backend Working"
    })


@api_view(['POST'])
def register(request):

    serializer = RegisterSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()

        return Response({
            "message": "User Registered Successfully"
        })

    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST
    )


@api_view(['POST'])
def login(request):

    username = request.data.get('username')
    password = request.data.get('password')

    user = authenticate(
        username=username,
        password=password
    )

    if user:

        refresh = RefreshToken.for_user(user)

        return Response({
            "message": "Login Successful",
            "refresh": str(refresh),
            "access": str(refresh.access_token)
        })

    return Response({
        "message": "Invalid Credentials"
    }, status=400)
   
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_lost_item(request):

    serializer = LostItemSerializer(data=request.data)

    if serializer.is_valid():

        serializer.save(
            user=request.user
        )

        return Response({
            "message": "Lost Item Added Successfully"
        })

    return Response(
        serializer.errors,
        status=400
    )

@api_view(['GET'])
def get_lost_items(request):

    items = LostItem.objects.all()

    serializer = LostItemSerializer(
        items,
        many=True
    )

    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_found_item(request):

    serializer = FoundItemSerializer(data=request.data)

    if serializer.is_valid():

        found_item = serializer.save(
            user=request.user
        )

        matched_items = LostItem.objects.filter(
            title__icontains=found_item.title,
            location__icontains=found_item.location
        )

        if matched_items.exists():
            for lost in matched_items:
                Notification.objects.create(
                    user=lost.user,
                    message=f"Match found for {lost.title}"
                )

            claim_id = f"CLAIM{found_item.id}"
            # persist claim id on the found item
            found_item.claim_id = claim_id
            found_item.save()
            send_mail(
                'Match Found',
                f'A matching item has been found for {found_item.title}',
                'admin@lostfound.com',
                [request.user.email],
                fail_silently=False,
            )

            qr_path = generate_qr(claim_id)
            # build a URL for the QR code image so frontend can load it
            filename = os.path.basename(qr_path)
            qr_url = request.build_absolute_uri(settings.MEDIA_URL + f"qrcodes/{filename}")

            return Response({
                "message": "Found Item Added Successfully",
                "match_found": True,
                "matches": matched_items.count(),
                "claim_id": claim_id,
                "qr_code": qr_url
            })

        return Response({
            "message": "Found Item Added Successfully",
            "match_found": False
        })

    return Response(serializer.errors, status=400)

@api_view(['GET'])
def get_found_items(request):

    items = FoundItem.objects.all()

    serializer = FoundItemSerializer(
        items,
        many=True
    )

    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_lost_items(request):

    items = LostItem.objects.filter(
        user=request.user
    )

    serializer = LostItemSerializer(
        items,
        many=True
    )

    return Response(serializer.data)

@api_view(['GET'])
def lost_item_detail(request, pk):

    try:
        item = LostItem.objects.get(id=pk)

    except LostItem.DoesNotExist:
        return Response(
            {"error": "Item not found"},
            status=404
        )

    serializer = LostItemSerializer(item)

    return Response(serializer.data)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_lost_item(request, pk):

    try:
        item = LostItem.objects.get(id=pk)

    except LostItem.DoesNotExist:
        return Response(
            {"error": "Item not found"},
            status=404
        )

    if item.user != request.user:
        return Response(
            {"error": "You can only delete your own items"},
            status=403
        )

    item.delete()

    return Response({
        "message": "Item Deleted Successfully"
    })

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_lost_item(request, pk):

    try:
        item = LostItem.objects.get(id=pk)

    except LostItem.DoesNotExist:
        return Response(
            {"error": "Item not found"},
            status=404
        )

    if item.user != request.user:
        return Response(
            {"error": "You can only update your own items"},
            status=403
        )

    serializer = LostItemSerializer(
        item,
        data=request.data,
        partial=True
    )

    if serializer.is_valid():
        serializer.save()

        return Response({
            "message": "Item Updated Successfully"
        })

    return Response(serializer.errors, status=400)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def mark_as_recovered(request, pk):

    try:
        item = LostItem.objects.get(id=pk)

    except LostItem.DoesNotExist:
        return Response(
            {"error": "Item not found"},
            status=404
        )

    if item.user != request.user:
        return Response(
            {"error": "You can only update your own item"},
            status=403
        )

    item.is_recovered = True
    item.status = "Recovered"
    item.save()

    return Response({
        "message": "Item marked as recovered"
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def claim_history(request):

    items = LostItem.objects.filter(
        user=request.user,
        is_recovered=True
    )

    serializer = LostItemSerializer(
        items,
        many=True
    )

    return Response(serializer.data)

@api_view(['GET'])
def admin_stats(request):

    total_users = User.objects.count()

    total_lost = LostItem.objects.count()

    total_found = FoundItem.objects.count()

    total_recovered = LostItem.objects.filter(
        is_recovered=True
    ).count()

    return Response({
        "total_users": total_users,
        "total_lost_items": total_lost,
        "total_found_items": total_found,
        "total_recovered_items": total_recovered
    })

@api_view(['GET'])
def dashboard_stats(request):
    return Response({
        "stats": [
            {"title": "Lost Items", "value": LostItem.objects.count()},
            {"title": "Found Items", "value": FoundItem.objects.count()},
            {"title": "Recovered", "value": LostItem.objects.filter(is_recovered=True).count()},
            {"title": "Notifications", "value": 12},
        ]

@api_view(["GET"])
def dashboard_stats(request):
    return Response({
        "stats": [
            {"title": "Lost Items", "value": LostItem.objects.count()},
            {"title": "Found Items", "value": FoundItem.objects.count()},
            {"title": "Recovered", "value": LostItem.objects.filter(is_recovered=True).count()},
            {"title": "Notifications", "value": 12},
        ]
    })


@api_view(['GET'])
def verify_claim(request, claim_id):
    """Return found item and candidate lost items for a claim id."""
    try:
        found = FoundItem.objects.get(claim_id=claim_id)
    except FoundItem.DoesNotExist:
        return Response({"error": "Claim not found"}, status=404)

    # find possible matching lost items
    matched_items = LostItem.objects.filter(
        title__icontains=found.title,
        location__icontains=found.location
    )

    found_data = FoundItemSerializer(found).data
    lost_data = LostItemSerializer(matched_items, many=True).data

    # compute public qr url if file exists
    qr_url = None
    if found.claim_id:
        possible_path = os.path.join(settings.MEDIA_ROOT, 'qrcodes', f"{found.claim_id}.png")
        if os.path.exists(possible_path):
            qr_url = request.build_absolute_uri(settings.MEDIA_URL + f"qrcodes/{found.claim_id}.png")

    return Response({
        "found_item": found_data,
        "matches": lost_data,
        "qr_code": qr_url,
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def confirm_claim(request, claim_id):
    """Mark a found item as claimed by the verifier (authenticated user)."""
    try:
        found = FoundItem.objects.get(claim_id=claim_id)
    except FoundItem.DoesNotExist:
        return Response({"error": "Claim not found"}, status=404)

    found.is_claimed = True
    found.save()

    return Response({"message": "Claim verified"})

@api_view(['GET'])
def notifications(request):

    data = Notification.objects.order_by(
        '-created_at'
    )[:20]

    result = []

    for n in data:

        result.append({
            "id": n.id,
            "message": n.message
        })

    return Response(result)

@api_view(['GET'])
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
                    "matchType": "Title Match"
                })

    return Response(matches)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_users(request):

    if not has_permission(
        request.user,
        "Users",
        "Manage"
    ):
        return Response(
            {"error": "Access Denied"},
            status=403
        )

    users = User.objects.all()

    data = []

    for user in users:

        role = UserRole.objects.filter(
            user=user
        ).first()

        data.append({
            "id": user.id,
            "username": user.username,
            "role": role.role.name if role else "No Role"
        })

    return Response(data)

@api_view(["GET"])
def get_roles(request):

    roles = Role.objects.all()

    data = []

    for role in roles:
        data.append({
            "id": role.id,
            "name": role.name
        })

    return Response(data)

@api_view(["POST"])
def assign_role(request):

    user_id = request.data.get("user_id")
    role_id = request.data.get("role_id")

    user = User.objects.get(id=user_id)
    role = Role.objects.get(id=role_id)

    UserRole.objects.filter(user=user).delete()

    UserRole.objects.create(
        user=user,
        role=role
    )

    return Response({
        "message": "Role assigned successfully"
    })

from rest_framework.response import Response

@api_view(["GET"])
def role_permissions(request):

    data = []

    roles = Role.objects.all()

    for role in roles:

        permissions = RolePermission.objects.filter(role=role)

        data.append({
            "role": role.name,
            "permissions": [
                f"{rp.permission.module}.{rp.permission.action}"
                for rp in permissions
            ]
        })

    return Response(data)

@api_view(["POST"])
def assign_permission_to_role(request):

    role_id = request.data.get("role_id")
    permission_id = request.data.get("permission_id")

    role = Role.objects.get(id=role_id)
    permission = Permission.objects.get(id=permission_id)

    RolePermission.objects.get_or_create(
        role=role,
        permission=permission
    )

    return Response({
        "message": "Permission assigned"
    })

@api_view(["GET"])
def get_permissions(request):

    permissions = Permission.objects.all()

    data = []

    for p in permissions:
        data.append({
            "id": p.id,
            "module": p.module,
            "action": p.action
        })

    return Response(data)

@api_view(["POST"])
def remove_permission_from_role(request):

    role_id = request.data.get("role_id")
    permission_id = request.data.get("permission_id")

    RolePermission.objects.filter(
        role_id=role_id,
        permission_id=permission_id
    ).delete()

    return Response({
        "message": "Permission removed"
    })