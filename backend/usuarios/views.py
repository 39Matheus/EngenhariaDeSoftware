from rest_framework import generics

from .models import Exercicio, Rotina, RotinaExercicio, Usuario
from .serializers import (
    ExercicioSerializer,
    RotinaExercicioSerializer,
    RotinaSerializer,
    UsuarioSerializer,
)


# get -> retona todos os usuários
# post -> cria um usuário
class UsuarioList(generics.ListCreateAPIView):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer


# get -> retorna um usuário baseado no id
# patch -> atualiza um campo do usuário
# delete -> deleta um usuário
class UsuarioDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer


# get -> retona todos os exercícios
# post -> cria um exercício
class ExercicioList(generics.ListCreateAPIView):
    queryset = Exercicio.objects.all()
    serializer_class = ExercicioSerializer


# get -> retorna um usuário baseado no id
# patch -> atualiza um campo do usuário
# delete -> deleta um usuário
class ExercicioDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Exercicio.objects.all()  # type: ignore
    serializer_class = ExercicioSerializer


class RotinaList(generics.ListCreateAPIView):
    queryset = Rotina.objects.all()  # type: ignore
    serializer_class = RotinaSerializer


class RotinaDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Rotina.objects.all()  # type: ignore
    serializer_class = RotinaSerializer


class RotinaExercicioList(generics.ListCreateAPIView):
    queryset = RotinaExercicio.objects.all()  # type: ignore
    serializer_class = RotinaExercicioSerializer


class RotinaExercicioDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = RotinaExercicio.objects.all()  # type: ignore
    serializer_class = RotinaExercicioSerializer
