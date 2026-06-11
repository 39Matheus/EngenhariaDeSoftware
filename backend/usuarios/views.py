from rest_framework import generics

from .models import Exercicio, Rotina, RotinaExercicio, Usuario
from .serializers import (
    ExercicioSerializer,
    RotinaExercicioSerializer,
    RotinaSerializer,
    UsuarioSerializer,
)


class UsuarioList(generics.ListCreateAPIView):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer


class UsuarioDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer


class ExercicioList(generics.ListCreateAPIView):
    queryset = Exercicio.objects.all()
    serializer_class = ExercicioSerializer


class ExercicioDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Exercicio.objects.all()  # type: ignore
    serializer_class = ExercicioSerializer


class RotinaList(generics.ListCreateAPIView):
    queryset = Rotina.objects.all()  # type: ignore
    serializer_class = RotinaSerializer


class RotinaDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Rotina.objects.all()  # type: ignore
    serializer_class = RotinaSerializer


class RotinaExercicioDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = RotinaExercicio.objects.all()  # type: ignore
    serializer_class = RotinaExercicioSerializer


class RotinaExercicioList(generics.ListCreateAPIView):
    serializer_class = RotinaExercicioSerializer

    def get_queryset(self):
        # Pega o rotina_id que veio da URL
        rotina_id = self.kwargs["rotina_id"]
        # Filtra a tabela onde a chave estrangeira seja igual ao ID da URL
        return RotinaExercicio.objects.filter(rotina_id=rotina_id)  # type: ignore

    def perform_create(self, serializer):
        # Pega o ID da rotina diretamente da URL
        rotina_id = self.kwargs.get("rotina_id")
        # Salva o novo registro forçando a rotina_id da URL
        serializer.save(rotina_id=rotina_id)
