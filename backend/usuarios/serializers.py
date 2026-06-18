from django.contrib.auth import get_user_model
from rest_framework import serializers

from .models import Exercicio, Rotina, RotinaExercicio

# Boa prática: Usar get_user_model() em vez de importar o model Usuario diretamente
Usuario = get_user_model()


class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ["id", "username", "email", "first_name", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        # Em vez de salvar direto, usamos o set_password para gerar o hash
        usuario = Usuario(
            username=validated_data["username"],
            email=validated_data.get("email", ""),
            first_name=validated_data.get("first_name", ""),
        )
        usuario.set_password(validated_data["password"])
        usuario.save()
        return usuario


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
        read_only_fields = [
            "rotina",
        ]


class RotinaSerializer(serializers.ModelSerializer):
    # Relacionamento reverso: traz a lista de exercícios de forma aninhada usando o related_name
    exercicios_da_rotina = RotinaExercicioSerializer(many=True,read_only=True)

    class Meta:
        model = Rotina
        fields = ["id", "usuario", "nome_rotina", "criado_em", "exercicios_da_rotina"]
        read_only_fields = ["criado_em", "usuario"]
    
