from django.contrib.auth import get_user_model
from rest_framework import serializers

from .models import Exercicio, Rotina, RotinaExercicio

# Boa prática: Usar get_user_model() em vez de importar o model Usuario diretamente
Usuario = get_user_model()


class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ["id", "username", "email", "first_name", "last_name"]
        extra_kwargs = {"password": {"write_only": True}}


class ExercicioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exercicio
        fields = ["id", "nome"]


class RotinaExercicioSerializer(serializers.ModelSerializer):
    # Campo opcional: Retorna o objeto completo do exercício na leitura para facilitar o front-end
    exercicio_detalhe = ExercicioSerializer(source="exercicio", read_only=True)

    class Meta:
        model = RotinaExercicio
        fields = [
            "id",
            "exercicio",
            "exercicio_detalhe",
            "serie",
            "repeticoes",
            "ordem",
        ]
        read_only_fields = ["rotina",]


class RotinaSerializer(serializers.ModelSerializer):
    # Relacionamento reverso: traz a lista de exercícios de forma aninhada usando o related_name
    exercicios_da_rotina = RotinaExercicioSerializer(many=True, read_only=True)

    class Meta:
        model = Rotina
        fields = ["id", "usuario", "nome_rotina", "criado_em", "exercicios_da_rotina"]
        read_only_fields = ["criado_em"]
