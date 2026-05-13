from django.contrib.auth import get_user_model
from django.test import TestCase

from .models import Exercicio, Rotina, RotinaExercicio


class UsuarioTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.user = get_user_model().objects.create_user(
            username="testuser",
            email="test@gmail.com",
            password="secret",
        )

        cls.exercicio = Exercicio.objects.create(nome="supino")
        cls.rotina = Rotina.objects.create(usuario=cls.user, nome_rotina="treino teste")
        cls.rotina_exercicio = RotinaExercicio.objects.create(
            rotina=cls.rotina,
            exercicio=cls.exercicio,
            serie=3,
            repeticoes="teste",
            ordem=1,
        )

    def test_exercicio_model(self):
        self.assertEqual(self.exercicio.nome, "supino")

    def test_rotina_model(self):
        self.assertEqual(self.rotina.usuario.username, "testuser")
        self.assertEqual(self.rotina.nome_rotina, "treino teste")

    def test_rotina_exercicio_model(self):
        self.assertEqual(self.rotina_exercicio.rotina.nome_rotina, "treino teste")
        self.assertEqual(self.rotina_exercicio.exercicio.nome, "supino")
        self.assertEqual(self.rotina_exercicio.serie, 3)
        self.assertEqual(self.rotina_exercicio.repeticoes, "teste")
        self.assertEqual(self.rotina_exercicio.ordem, 1)
