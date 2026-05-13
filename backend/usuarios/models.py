from django.contrib.auth.models import AbstractUser
from django.db import models


class Usuario(AbstractUser):
    # Já faz nome, email e senha
    pass


class Exercicio(models.Model):
    objects = models.Manager
    nome = models.CharField(max_length=100)
    # grupo_muscular = models.CharField(max_length=150)

    def __str__(self):  # type: ignore
        return self.nome


class Rotina(models.Model):
    usuario = models.ForeignKey(
        Usuario, on_delete=models.CASCADE, related_name="rotinas"
    )
    nome_rotina = models.CharField(max_length=100)  # Tipo "Treino A"
    criado_em = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.nome_rotina} - {self.usuario.username}"


class RotinaExercicio(models.Model):
    rotina = models.ForeignKey(
        Rotina, on_delete=models.CASCADE, related_name="exercicios_da_rotina"
    )
    exercicio = models.ForeignKey(Exercicio, on_delete=models.PROTECT)
    serie = models.PositiveIntegerField(default=3)
    repeticoes = models.CharField(
        max_length=20
    )  # Aqui não é integer para aceitar a opção "até a falha"
    ordem = models.PositiveIntegerField()

    class Meta:
        ordering = ["ordem"]
