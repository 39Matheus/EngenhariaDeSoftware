from django.urls import path
from rest_framework.authtoken.views import obtain_auth_token

from .views import (
    ExercicioDetail,
    ExercicioList,
    RotinaDetail,
    RotinaExercicioDetail,
    RotinaExercicioList,
    RotinaList,
    UsuarioDetail,
    UsuarioList,
)

urlpatterns = [
    path("<int:pk>/", UsuarioDetail.as_view(), name="usuarios_detail"),
    path("", UsuarioList.as_view(), name="usuarios_list"),
    path("rotinas/", RotinaList.as_view(), name="rotinas_list"),
    path("rotinas/<int:pk>/", RotinaDetail.as_view(), name="rotinas_details"),
    path(
        "rotinas/<int:rotina_id>/exercicios/",
        RotinaExercicioList.as_view(),
        name="rotinasexercicio_list",
    ),
    path("exercicios/", ExercicioList.as_view(), name="exercicios_list"),
    path("exercicios/<int:pk>/", ExercicioDetail.as_view(), name="exercicios_detail"),
    path(
        "rotinaexercicios/<int:pk>/",
        RotinaExercicioDetail.as_view(),
        name="rotinaexercicio_detail",
    ),
    path("login/", obtain_auth_token, name="api_token_auth"),
]
