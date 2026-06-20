from django.contrib import admin
from .models import (
    LostItem,
    FoundItem,
    Role,
    Permission,
    RolePermission,
    UserRole
)

admin.site.register(LostItem)
admin.site.register(FoundItem)

admin.site.register(Role)
admin.site.register(Permission)
admin.site.register(RolePermission)
admin.site.register(UserRole)