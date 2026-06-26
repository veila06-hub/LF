from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient

from .models import (
    LostItem,
    FoundItem,
    Notification,
    Role,
    Permission,
    RolePermission,
    UserRole,
)

from .rbac import has_permission


class UserModelTest(TestCase):

    def test_create_user(self):
        user = User.objects.create_user(
            username="testuser",
            password="test123"
        )

        self.assertEqual(user.username, "testuser")


class LostItemModelTest(TestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser",
            password="test123"
        )

    def test_create_lost_item(self):
        item = LostItem.objects.create(
            user=self.user,
            title="Wallet",
            description="Black wallet",
            location="Library",
            date_lost="2026-06-25"
        )

        self.assertEqual(item.title, "Wallet")
        self.assertEqual(item.status, "Lost")


class RegisterAPITest(TestCase):

    def setUp(self):
        self.client = APIClient()

    def test_register_user(self):
        response = self.client.post(
            "/api/register/",
            {
                "username": "newuser",
                "email": "newuser@gmail.com",
                "password": "Password123"
            },
            format="json"
        )

        self.assertEqual(response.status_code, 200)


class LoginAPITest(TestCase):

    def setUp(self):
        self.client = APIClient()

        User.objects.create_user(
            username="testuser",
            password="test123"
        )

    def test_login(self):
        response = self.client.post(
            "/api/login/",
            {
                "username": "testuser",
                "password": "test123"
            },
            format="json"
        )

        self.assertEqual(response.status_code, 200)
        self.assertIn("access", response.data)


class InvalidLoginTest(TestCase):

    def setUp(self):
        self.client = APIClient()

        User.objects.create_user(
            username="testuser",
            password="test123"
        )

    def test_invalid_login(self):
        response = self.client.post(
            "/api/login/",
            {
                "username": "testuser",
                "password": "wrongpassword"
            },
            format="json"
        )

        self.assertNotEqual(response.status_code, 200)


class DuplicateRegistrationTest(TestCase):

    def setUp(self):
        self.client = APIClient()

        User.objects.create_user(
            username="testuser",
            email="test@gmail.com",
            password="test123"
        )

    def test_duplicate_user(self):
        response = self.client.post(
            "/api/register/",
            {
                "username": "testuser",
                "email": "test@gmail.com",
                "password": "test123"
            },
            format="json"
        )

        self.assertNotEqual(response.status_code, 200)


class LostItemAPITest(TestCase):

    def setUp(self):
        self.client = APIClient()

        self.user = User.objects.create_user(
            username="testuser",
            password="test123"
        )

        login = self.client.post(
            "/api/login/",
            {
                "username": "testuser",
                "password": "test123"
            },
            format="json"
        )

        self.token = login.data["access"]

        self.client.credentials(
            HTTP_AUTHORIZATION=f"Bearer {self.token}"
        )

    def test_lost_item_endpoint_exists(self):
        response = self.client.post(
            "/api/lost-items/",
            {},
            format="json"
        )

        self.assertNotEqual(response.status_code, 404)


class UnauthorizedAccessTest(TestCase):

    def setUp(self):
        self.client = APIClient()

    def test_access_without_token(self):
        response = self.client.post(
            "/api/lost-items/",
            {},
            format="json"
        )

        self.assertIn(
            response.status_code,
            [401, 403]
        )


class CreateLostItemTest(TestCase):

    def setUp(self):
        self.client = APIClient()

        User.objects.create_user(
            username="testuser",
            password="test123"
        )

        login = self.client.post(
            "/api/login/",
            {
                "username": "testuser",
                "password": "test123"
            },
            format="json"
        )

        token = login.data["access"]

        self.client.credentials(
            HTTP_AUTHORIZATION=f"Bearer {token}"
        )

    def test_create_item(self):
        response = self.client.post(
            "/api/lost-items/",
            {
                "title": "Wallet",
                "description": "Black Wallet"
            },
            format="json"
        )

        print("Status:", response.status_code)
        print("Response:", response.data)

        self.assertNotEqual(response.status_code, 404)


class EmptyFieldValidationTest(TestCase):

    def setUp(self):
        self.client = APIClient()

        User.objects.create_user(
            username="testuser",
            password="test123"
        )

        login = self.client.post(
            "/api/login/",
            {
                "username": "testuser",
                "password": "test123"
            },
            format="json"
        )

        token = login.data["access"]

        self.client.credentials(
            HTTP_AUTHORIZATION=f"Bearer {token}"
        )

    def test_empty_title(self):
        response = self.client.post(
            "/api/lost-items/",
            {
                "title": "",
                "description": "Wallet"
            },
            format="json"
        )

        self.assertNotIn(
            response.status_code,
            [200, 201]
        )

class FoundItemModelTest(TestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            username="founduser",
            password="test123"
        )

    def test_create_found_item(self):

        item = FoundItem.objects.create(
            user=self.user,
            title="Phone",
            description="Samsung Phone",
            location="Library",
            date_found="2026-06-25"
        )

        self.assertEqual(item.status, "Found")
        self.assertFalse(item.is_claimed)


class NotificationModelTest(TestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            username="notifyuser",
            password="test123"
        )

    def test_notification_created(self):

        notification = Notification.objects.create(
            user=self.user,
            message="Match Found"
        )

        self.assertEqual(
            notification.message,
            "Match Found"
        )

        self.assertFalse(
            notification.is_read
        )


class SuperUserPermissionTest(TestCase):

    def test_superuser_permissions(self):

        admin = User.objects.create_superuser(
            username="admin",
            email="admin@test.com",
            password="admin123"
        )

        self.assertTrue(
            has_permission(
                admin,
                "users",
                "delete"
            )
        )

        self.assertTrue(
            has_permission(
                admin,
                "roles",
                "edit"
            )
        )


class UserWithoutRoleTest(TestCase):

    def test_user_without_role(self):

        user = User.objects.create_user(
            username="normaluser",
            password="test123"
        )

        self.assertFalse(
            has_permission(
                user,
                "lost_items",
                "view"
            )
        )


class RolePermissionTest(TestCase):

    def test_role_permission_assignment(self):

        user = User.objects.create_user(
            username="staff",
            password="test123"
        )

        role = Role.objects.create(
            name="Staff"
        )

        permission = Permission.objects.create(
            module="lost_items",
            action="view"
        )

        RolePermission.objects.create(
            role=role,
            permission=permission
        )

        UserRole.objects.create(
            user=user,
            role=role
        )

        self.assertTrue(
            has_permission(
                user,
                "lost_items",
                "view"
            )
        )


class LostItemRecoveryTest(TestCase):

    def setUp(self):

        self.user = User.objects.create_user(
            username="recoveruser",
            password="test123"
        )

    def test_recovered_item(self):

        item = LostItem.objects.create(
            user=self.user,
            title="Wallet",
            description="Black Wallet",
            location="Library",
            date_lost="2026-06-25",
            is_recovered=True
        )

        self.assertTrue(
            item.is_recovered
        )


class FoundItemClaimTest(TestCase):

    def setUp(self):

        self.user = User.objects.create_user(
            username="claimuser",
            password="test123"
        )

    def test_claimed_found_item(self):

        item = FoundItem.objects.create(
            user=self.user,
            title="Phone",
            description="Samsung",
            location="Library",
            date_found="2026-06-25",
            claim_id="CLM001",
            is_claimed=True
        )

        self.assertEqual(
            item.claim_id,
            "CLM001"
        )

        self.assertTrue(
            item.is_claimed
        )


class SmartMatchModelTest(TestCase):

    def setUp(self):

        self.user = User.objects.create_user(
            username="matchuser",
            password="test123"
        )

    def test_matching_items(self):

        lost = LostItem.objects.create(
            user=self.user,
            title="Samsung Phone",
            description="Black Samsung",
            location="Library",
            date_lost="2026-06-25"
        )

        found = FoundItem.objects.create(
            user=self.user,
            title="Samsung Phone",
            description="Black Samsung",
            location="Library",
            date_found="2026-06-25"
        )

        self.assertEqual(
            lost.title,
            found.title
        )