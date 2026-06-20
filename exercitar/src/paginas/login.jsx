//Login.jsx
import {
  TextField,
  Button,
  Box,
  Typography,
  CssBaseline,
  Paper,
  Card,
} from "@mui/material";

import Forms from "../components/forms";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Login() {
  const navigate = useNavigate();

  // Estados
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  // Função de login
  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:8000/api/v1/login/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            username: email,
            password: senha,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();

        if (data.token) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("is_professor", data.is_professor);
          localStorage.setItem("user_id", data.user_id);
        }  
        
        // ====== AQUI ESTÁ A MÁGICA ======
        // Verificamos se a API devolveu o tipo de conta como professor
        if (data.is_professor) {
          alert("👨‍🏫 Bem-vindo, Professor! Acesso liberado à gestão de treinos.");
        } else {
          alert("Bem-vindo, Aluno!");
        }

        console.log("Resposta do Login:", data);

        navigate("/home");
      }else {
        const erro = await response.json();
        console.error("Erro no login:", erro);
        alert("E-mail ou senha incorretos.");
      }
    } catch (error) {
      console.error(error);
      alert("Erro ao conectar com o backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <CssBaseline />

      <Box
        sx={{
          display: "flex",
          height: "100vh",
          width: "100%",
        }}
      >
        {/* LADO DO LOGIN */}
        <Box
          sx={{
            width: {
              xs: "100%",
              md: "50%",
            },

            display: "flex",
            justifyContent: "center",
            alignItems: "center",

            bgcolor: "#121212",

            p: 3,
          }}
        >
          <Paper
            elevation={8}
            sx={{
              width: "100%",
              maxWidth: 450,

              p: 5,

              borderRadius: 4,
            }}
          >
            <Typography
              variant="h4"
              align="center"
              fontWeight="bold"
              mb={4}
            >
              Entrar
            </Typography>

            <Box
              component="form"
              onSubmit={handleLogin}
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <TextField
                label="E-mail"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                required
              />

              <TextField
                label="Senha"
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                fullWidth
                required
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
                sx={{
                  mt: 2,
                  py: 1.5,
                  fontWeight: "bold",
                }}
              >
                {loading ? "Entrando..." : "Entrar"}
              </Button>

              <Typography
                variant="body2"
                align="center"
                sx={{ mt: 2 }}
              >
                Não tem uma conta?{" "}
                <Link to="/cadastro">
                  Cadastre-se
                </Link>
              </Typography>

              <Typography
                variant="body2"
                align="center"
              >
              </Typography>
            </Box>
          </Paper>
        </Box>
        {/* LADO DA IMAGEM */}
        <Box
          sx={{
            width: "50%",
            backgroundImage: `
              linear-gradient(
                rgba(0,0,0,0.5),
                rgba(0,0,0,0.5)
              ),
              url('https://blog.nextfit.com.br/wp-content/uploads/2021/07/x-passos-essenciais-na-hora-de-montar-uma-academia-4-20210630151949.jpg.jpg')
            `,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",

            display: {
              xs: "none",
              md: "block",
            },
          }}
        />
      </Box>
    </>
  );
}