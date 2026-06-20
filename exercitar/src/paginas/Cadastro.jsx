import { TextField, Button, Box, Typography, FormControlLabel, Checkbox, Card  } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import Forms from "../components/forms";
import { useState } from "react";

export default function Cadastro() {
  // Criando os estados para capturar os dados do formulário
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [isProfessor, setIsProfessor] = useState(false);

  const [loading, setLoading] = useState(false);

  // Hook do react-router-dom para redirecionar após o cadastro
  const navigate = useNavigate();

  const handleCadastro = async (e) => {
    e.preventDefault(); // Evita o recarregamento da página

    // Validação básica: verificar se as senhas coincidem
    if (senha !== confirmarSenha) {
      alert("As senhas não coincidem!");
      return;
    }

    setLoading(true);

    try {
      // Rota correspondente a UsuarioList (path("", UsuarioList.as_view())) + prefixo "api/"
      const response = await fetch("http://localhost:8000/api/v1/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          first_name: nome, // Mapeia para o campo de primeiro nome do Django
          username: email, // O Django usa username como identificador único por padrão
          email: email, // Guarda também no campo de email tradicional
          password: senha, // O serializer/model vai cuidar do hash desta senha
          is_professor: isProfessor, // Envia o tipo de conta selecionado (professor ou aluno)
        }),
      });

      if (response.ok) {
        alert("Conta criada com sucesso! Faça o seu login.");
        // Redireciona o usuário para a tela de login (rota raiz ou "/login" conforme seu router)
        navigate("/");
      } else {
        const errorData = await response.json();
        // Exibe o erro retornado pelo Django (ex: se o usuário já existir)
        console.error("Erro do servidor:", errorData);
        alert("Erro ao cadastrar. Verifique se este e-mail já está em uso.");
      }
    } catch (error) {
      console.error("Erro ao conectar com o servidor:", error);
      alert("Não foi possível conectar ao servidor backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          width: "100vw",
          backgroundColor: "background.default",
        }}
      >
        <Forms title="Criar Nova Conta">
          {/* Vinculando a função de envio ao formulário */}

          <Box
            component="form"
            onSubmit={handleCadastro}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              width: "80%",
              alignItems: "center",
              margin: "0 auto",
            }}
          >
            <TextField
              label="Nome Completo"
              variant="outlined"
              fullWidth
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
            <TextField
              label="E-mail"
              variant="outlined"
              fullWidth
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <TextField
              label="Senha"
              variant="outlined"
              fullWidth
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
            <TextField
              label="Confirmar Senha"
              variant="outlined"
              fullWidth
              type="password"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              required
            />

            {/* O CHECKBOX CORRIGIDO COM MATERIAL-UI */}
            <Box
              onClick={() => {
                const novoEstado = !isProfessor;
                setIsProfessor(novoEstado);
                console.log("isProfessor:", novoEstado);
              }}
              sx={{
                width: "100%",
                p: 1.5,
                mt: 1,
                border: "2px solid",
                borderColor: isProfessor ? "primary.main" : "grey.300",
                borderRadius: 2,
                bgcolor: isProfessor ? "primary.50" : "transparent",
                cursor: "pointer",
                transition: "all 0.3s ease",
                "&:hover": {
                  borderColor: isProfessor ? "primary.main" : "grey.400",
                },
                // Força o alinhamento central dos itens dentro da caixa
                display: "flex",
                alignItems: "center",
              }}
            >
              <FormControlLabel
                sx={{ m: 0, width: "100%", pointerEvents: "none" }}
                control={
                  <Checkbox
                    checked={isProfessor}
                    onChange={() => {}} // Vazio pois o onClick da Box controla o estado
                    color="primary"
                  />
                }
                label={
                  <Typography sx={{ fontWeight: 500, color: "text.secondary" }}>
                    Sou um professor / treinador
                  </Typography>
                }
              />
            </Box>

            {/* Adicionado o type="submit" e o travamento por loading */}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              disabled={loading}
              sx={{ mt: 1 }}
            >
              {loading ? "Cadastrando..." : "Cadastrar"}
            </Button>

            <Typography variant="body2" align="center" sx={{ mt: 1 }}>
              Já tem uma conta? <Link to="/">Faça Login</Link>
            </Typography>
          </Box>
        </Forms>
      </Box>
    </>
  );
}
