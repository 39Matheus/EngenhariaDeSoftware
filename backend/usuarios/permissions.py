from rest_framework import permissions


class IsOwnerOrProfessor(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if obj.usuario == request.user:
            return True

        if getattr(request.user, "is_professor", False):
            return obj.usuario.professor == request.user

        return False
