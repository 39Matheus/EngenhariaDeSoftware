from django.urls import path

from .views import UsuarioDetail, UsuarioList, ExercicioList, ExercicioDetail, RotinaList, RotinaDetail, RotinaExercicioDetail

urlpatterns = [
    path("<int:pk>/", UsuarioDetail.as_view(), name="usuarios_detail"),
    path("", UsuarioList.as_view(), name="usuarios_list"),
    path("rotinas/", RotinaList.as_view(), name="rotinas_list"),
    path("rotinas/<int:pk>/", RotinaDetail.as_view(), name="rotinas_details"),
    path("exercicios/", ExercicioList.as_view(), name="exercicios_list"),
    path("exercicios/<int:pk>/", ExercicioDetail.as_view(), name="exercicios_detail"),
    path("rotinasexercicios/", RotinaExercicioList.as_view(), name="rotinasexercicios_list"),
    path("rotinasexercicios/<str:fk>/", RotinaExercicioDetail.as_view(), name="rotinasexercicios_detail")
]
