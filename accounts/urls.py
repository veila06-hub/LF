from django.urls import path

from .views import (
    # public / auth
    test_api, register, login, me,
    # lost items
    create_lost_item, get_lost_items, my_lost_items, lost_item_detail,
    delete_lost_item, update_lost_item, mark_as_recovered, claim_history,
    # found items
    create_found_item, get_found_items,
    # claims
    verify_claim, confirm_claim,
    # misc
    notifications, smart_matches, dashboard_stats, admin_stats,
    # rbac
    rbac_catalog, get_permissions, roles_collection, role_detail,
    role_permissions_detail, users_collection, user_detail, assign_role,
    get_roles,
)

urlpatterns = [
    # public / auth
    path('test/', test_api),
    path('register/', register),
    path('login/', login),
    path('me/', me),

    # lost items
    path('lost-items/', create_lost_item),
    path('view-lost-items/', get_lost_items),
    path('my-lost-items/', my_lost_items),
    path('lost-item/<int:pk>/', lost_item_detail),
    path('delete-lost-item/<int:pk>/', delete_lost_item),
    path('update-lost-item/<int:pk>/', update_lost_item),
    path('lost-items/<int:pk>/recover/', mark_as_recovered),
    path('claim-history/', claim_history),

    # found items
    path('found-items/', create_found_item),
    path('view-found-items/', get_found_items),

    # claims
    path('verify-claim/<str:claim_id>/', verify_claim),
    path('confirm-claim/<str:claim_id>/', confirm_claim),

    # misc dashboards
    path('notifications/', notifications),
    path('smart-matches/', smart_matches),
    path('dashboard/', dashboard_stats),
    path('admin-stats/', admin_stats),

    # ---- RBAC administration ----
    path('rbac-catalog/', rbac_catalog),
    path('permissions/', get_permissions),

    path('roles/', roles_collection),                                # GET list, POST create
    path('roles/<int:role_id>/', role_detail),                       # PUT edit, DELETE
    path('roles/<int:role_id>/permissions/', role_permissions_detail),  # GET, PUT replace

    path('users/', users_collection),                                # GET list, POST create
    path('users/<int:user_id>/', user_detail),                       # DELETE
    path('assign-role/', assign_role),
    path('role-list/', get_roles),                                   # simple dropdown list
]
