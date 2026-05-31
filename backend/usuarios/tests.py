from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

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


class RotinaAPITest(APITestCase):
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

    def test_acessar_rotinas_sem_token_retorna_401(self):
        url = reverse("rotinas_list")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_acessar_rotinas_com_token_retorna_200(self):
        url = reverse("rotinas_list")
        # Autentica o cliente de teste com o usuário criado no setUpTestData
        self.client.force_authenticate(user=self.user)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_criar_rotina_com_dados_validos(self):
        self.client.force_authenticate(user=self.user)
        url = reverse("rotinas_list")

        data = {"usuario": self.user.id, "nome_rotina": "treino teste 2"}
        response = self.client.post(url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        self.assertEqual(Rotina.objects.count(), 2)

    def test_criar_rotina_sem_nome_retorna_erro(self):
        self.client.force_authenticate(user=self.user)
        url = reverse("rotinas_list")
        data = {"usuario": self.user.id, "nome_rotina": ""}  # Nome em branco
        response = self.client.post(url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_detalhe_rotina_com_sucesso(self):
        self.client.force_authenticate(user=self.user)

        url = reverse("rotinas_details", kwargs={"pk": self.rotina.pk})
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["id"], self.rotina.id)
        self.assertEqual(response.data["nome_rotina"], self.rotina.nome_rotina)

    def test_detalhe_rotina_nao_encontrada(self):
        self.client.force_authenticate(user=self.user)

        url = reverse("rotinas_details", kwargs={"pk": 999})
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
