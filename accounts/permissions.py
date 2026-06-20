from .models import Role, Permission


def has_permission(user, module, action):

    if not user.is_authenticated:
        return False

    roles = Role.objects.filter(
        userrole__user=user
    )

    return Permission.objects.filter(
        rolepermission__role__in=roles,
        module=module,
        action=action
    ).exists()