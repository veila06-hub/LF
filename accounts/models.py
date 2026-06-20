from django.db import models
from django.contrib.auth.models import User


class LostItem(models.Model):

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE
    )

    title = models.CharField(max_length=200)

    description = models.TextField()

    location = models.CharField(max_length=200)

    date_lost = models.DateField()

    status = models.CharField(
    max_length=20,
    default='Lost'
)

    is_recovered = models.BooleanField(
    default=False
)

    image = models.ImageField(
        upload_to='lost_items/',
        null=True,
        blank=True
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class FoundItem(models.Model):

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE
    )

    title = models.CharField(max_length=200)

    description = models.TextField()

    location = models.CharField(max_length=200)

    date_found = models.DateField()

    status = models.CharField(
        max_length=20,
        default='Found'
    )

    image = models.ImageField(
        upload_to='found_items/',
        null=True,
        blank=True
    )

    # Claim fields for QR-based verification
    claim_id = models.CharField(max_length=100, null=True, blank=True)
    is_claimed = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class ImageUpload(models.Model):
    title = models.CharField(max_length=100)
    image = models.ImageField(upload_to='images/')
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class Notification(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE
    )

    message = models.CharField(
        max_length=255
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    is_read = models.BooleanField(
        default=False
    )

    def __str__(self):
        return self.message

        
class Role(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class Permission(models.Model):
    module = models.CharField(max_length=100)
    action = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.module} - {self.action}"


class RolePermission(models.Model):
    role = models.ForeignKey(
        Role,
        on_delete=models.CASCADE
    )

    permission = models.ForeignKey(
        Permission,
        on_delete=models.CASCADE
    )


class UserRole(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE
    )

    role = models.ForeignKey(
        Role,
        on_delete=models.CASCADE
    )