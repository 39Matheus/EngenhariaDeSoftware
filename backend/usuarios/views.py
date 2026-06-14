from django.shortcuts import get_object_or_404
from rest_framework import generics, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Exercicio, Rotina, RotinaExercicio, Usuario
from .permissions import IsOwnerOrProfessor
from .serializers import (
    ExercicioSerializer,
    RotinaExercicioSerializer,
    RotinaSerializer,
    UsuarioSerializer,
)


class UsuarioList(generics.ListCreateAPIView):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer

    permission_classes = [AllowAny]


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
    # queryset = Rotina.objects.all()  # type: ignore
    serializer_class = RotinaSerializer

    def get_queryset(self):
        user = self.request.user

        if getattr(user, "is_professor", False):
            return Rotina.objects.filter(usuario__professor=user)

        return Rotina.objects.filter(usuario=user)

    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)


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
        rotina_id = self.kwargs.get("rotina_id")  # type: ignore
        # Salva o novo registro forçando a rotina_id da URL
        serializer.save(rotina_id=rotina_id)


class VincularAlunoView(APIView):
    # Apenas usuários logados podem acessar, mas a validação de ser professor faremos na lógica

    def post(self, request, *args, **kwargs):
        # Verifica se quem está fazendo a requisição é realmente um professor
        if not getattr(request.user, "is_professor", False):
            return Response(
                {"erro": "Apenas professores podem realizar esta ação."},
                status=status.HTTP_403_FORBIDDEN,
            )

        # Pega o ID do aluno que veio no corpo da requisição (JSON)
        aluno_id = request.data.get("aluno_id")

        if not aluno_id:
            return Response(
                {"erro": "Você precisa enviar o campo 'aluno_id'."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Busca o aluno no banco de dados (retorna erro 404 automático se não existir)
        aluno = get_object_or_404(Usuario, id=aluno_id)

        # Evitar que um professor vincule outro professor como seu aluno
        if aluno.is_professor:
            return Response(
                {"erro": "Você não pode vincular outro professor como aluno."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Vincula o aluno ao professor logado e salva
        aluno.professor = request.user
        aluno.save()

        # Retorna sucesso
        return Response(
            {
                "mensagem": f"O aluno '{aluno.username}' foi vinculado a você com sucesso!"
            },
            status=status.HTTP_200_OK,
        )
