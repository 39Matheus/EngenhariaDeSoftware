from django.urls import path

from .views import UsuarioDetail, UsuarioList

urlpatterns = [
    path("<int:pk>/", UsuarioDetail.as_view(), name="usuarios_detail"),
    path("", UsuarioList.as_view(), name="usuarios_list"),
]
