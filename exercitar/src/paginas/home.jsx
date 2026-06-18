// src/pages/home.jsx
import * as React from "react";
import { useNavigate } from "react-router-dom";

// Componentes Visuais do Material UI
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Fab,
} from "@mui/material";
import Grid from "@mui/material/Grid";

// Ícones do Material UI
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

// Seus Componentes
import AppBarComponent from "../components/AppBar";
import DialogCatalog from "../components/DialogCatalog";

export default function Home() {
  const navigate = useNavigate();

  // --- ESTADOS DA TELA ---
  const [openCatalog, setOpenCatalog] = React.useState(false);
  const [meusCards, setMeusCards] = React.useState([]);

  // --- EFEITO: CARREGAR TREINOS AO ABRIR A PÁGINA ---
  React.useEffect(() => {
    const buscarMeusTreinos = async () => {
      const tokenAtualizado = localStorage.getItem("token");

      if (!tokenAtualizado) {
        console.warn("Nenhum token encontrado. Redirecionando para o login...");
        navigate("/");
        return;
      }

      try {
        const response = await fetch("http://127.0.0.1:8000/api/v1/rotinas/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${tokenAtualizado}`,
          },
        });

        if (response.status === 401 || response.status === 403) {
          console.warn("Sem permissão! Voltando pro login...");
          localStorage.removeItem("token");
          localStorage.removeItem("usuario_id");
          navigate("/");
          return;
        }

        if (response.ok) {
          const data = await response.json();
          const cardsFormatados = data.map((rotina) => {
            // Puxa o nome dos exercícios para exibir no Card
            const nomesDosExercicios = rotina.exercicios_da_rotina && rotina.exercicios_da_rotina.length > 0
              ? rotina.exercicios_da_rotina.map((item) => item.exercicio_detalhe?.nome).join(", ")
              : "Nenhum exercício adicionado";

            return {
              id: rotina.id,
              titulo: rotina.nome_rotina,
              descricao: nomesDosExercicios, 
            };
          });
          setMeusCards(cardsFormatados);
        }
      } catch (error) {
        console.error("Erro ao buscar treinos:", error);
      }
    };

    buscarMeusTreinos();
  }, [navigate]);

  // --- FUNÇÃO: SALVAR O TREINO NOVO (FLUXO 2 PASSOS) ---
  const handleCreateWorkout = async (workoutData) => {
    try {
      const tokenAtualizado = localStorage.getItem("token");
      
      // Como o DialogCatalog já manda "nome_rotina" e "exercicios_da_rotina" formatados,
      // nós usamos esses nomes de variáveis aqui.

      // ==========================================
      // PASSO 1: Criar a "casca" do treino
      // ==========================================
      const rotinaResponse = await fetch("http://127.0.0.1:8000/api/v1/rotinas/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Token ${tokenAtualizado}`,
        },
        body: JSON.stringify({
          nome_rotina: workoutData.nome_rotina,
        }),
      });

      if (!rotinaResponse.ok) {
        const erroDoDjango = await rotinaResponse.json();
        console.error("Erro no Passo 1 (Criar Rotina):", erroDoDjango);
        return;
      }

      const rotinaCriada = await rotinaResponse.json();
      const rotinaId = rotinaCriada.id; // Pegamos o ID devolvido pelo back-end

      // ==========================================
      // PASSO 2: Adicionar os Exercícios usando o ID
      // ==========================================
      const exerciciosPromises = workoutData.exercicios_da_rotina.map(async (ex,index) => {
        // O corpo exato que a sua API pede na documentação
        const dadosExercicio = {
          exercicio: ex.exercicio,
          serie: parseInt(ex.serie, 10) || 0,
          repeticoes: ex.repeticoes || "0",
          ordem: ex.ordem || index + 1, 
        };

        const exResponse = await fetch(`http://127.0.0.1:8000/api/v1/rotinas/${rotinaId}/exercicios/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${tokenAtualizado}`,
          },
          body: JSON.stringify(dadosExercicio),
        });

        if (!exResponse.ok) {
          const erroEx = await exResponse.json();
          console.error(`Erro ao adicionar o exercício ID ${ex.exercicio}:`, erroEx);
        }
        return exResponse;
      });

      // Espera todos os exercícios serem salvos
      await Promise.all(exerciciosPromises);

      // ==========================================
      // ATUALIZAÇÃO VISUAL (Frontend)
      // ==========================================
      
      // Vamos buscar o treino criado novamente para pegar a lista completa e os nomes corretos dos exercícios
      const treinoAtualizadoResp = await fetch(`http://127.0.0.1:8000/api/v1/rotinas/${rotinaId}/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${tokenAtualizado}`,
        },
      });

      if (treinoAtualizadoResp.ok) {
        const treinoCompleto = await treinoAtualizadoResp.json();
        const nomesDosExercicios = treinoCompleto.exercicios_da_rotina && treinoCompleto.exercicios_da_rotina.length > 0
              ? treinoCompleto.exercicios_da_rotina.map((item) => item.exercicio_detalhe?.nome).join(", ")
              : "Nenhum exercício adicionado";

        const novoCard = {
          id: treinoCompleto.id,
          titulo: treinoCompleto.nome_rotina,
          descricao: nomesDosExercicios,
        };
        
        setMeusCards((prev) => [...prev, novoCard]);
      }

      setOpenCatalog(false);
      alert("Treino criado com sucesso!");

    } catch (error) {
      console.error("Erro de conexão ao tentar criar a rotina e os exercícios:", error);
    }
  };

  // --- FUNÇÃO: DELETAR TREINO ---
  const handleDeletar = async (id) => {
    console.log("Deletar o card:", id);
    try {
      const tokenAtualizado = localStorage.getItem("token");

      const response = await fetch(`http://127.0.0.1:8000/api/v1/rotinas/${id}/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${tokenAtualizado}`,
        },
      });

      if (response.ok) {
        console.log("Card deletado com sucesso!");
        setMeusCards((prevCards) => prevCards.filter((card) => card.id !== id));
      } else {
        console.error("Erro ao deletar o card no servidor. Status:", response.status);
      }
    } catch (error) {
      console.error("Erro de conexão ao tentar deletar:", error);
    }
  };

  // --- FUNÇÃO: EDITAR TREINO ---
  const handleEditar = async (id, dadosAtualizados) => {
    console.log("Salvando edição do card:", id);
    try {
      const tokenAtualizado = localStorage.getItem("token");

      const response = await fetch(`http://127.0.0.1:8000/api/v1/rotinas/${id}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${tokenAtualizado}`,
        },
        body: JSON.stringify(dadosAtualizados),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Card editado com sucesso!", data);
      } else {
        console.error("Erro ao editar o card no servidor. Status:", response.status);
      }
    } catch (error) {
      console.error("Erro de conexão ao tentar editar:", error);
    }
  };

  // --- CONTROLES DO MODAL ---
  const handleAdicionar = () => setOpenCatalog(true);
  const handleCloseCatalog = () => setOpenCatalog(false);

  // --- VISUAL DA PÁGINA ---
  return (
    <>
      <AppBarComponent />
      <Box
        sx={{
          padding: { xs: "2px", md: "4px" },
          position: "relative",
          minHeight: "80vh",
        }}
      >
        <Typography
          variant="h4"
          sx={{ textAlign: "center", marginBottom: "30px", fontWeight: "bold" }}
        >
          Meus Treinos e Hábitos
        </Typography>

        <Grid container spacing={3} sx={{ justifyContent: "center" }}>
          {meusCards.map((card) => (
            <Grid size={{ xs: 6, sm: 6, md: 3 }} key={card.id}>
              <Card
                elevation={3}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  borderRadius: "10px",
                  transition: "transform 0.2s",
                  "&:hover": { transform: "scale(1.02)" },
                }}
              >
                <CardContent>
                  <Typography
                    variant="h6"
                    component="div"
                    sx={{ fontWeight: "bold", marginBottom: "10px" }}
                  >
                    {card.titulo}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {card.descricao}
                  </Typography>
                </CardContent>

                <CardActions sx={{ justifyContent: "flex-end", padding: "8px 16px" }}>
                  <IconButton color="primary" onClick={() => handleEditar(card.id)} aria-label="editar">
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDeletar(card.id)} aria-label="deletar">
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ textAlign: "center", marginTop: "40px" }}>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
            sx={{ textTransform: "none" }}
          >
            Sair do Sistema
          </Button>
        </Box>

        <Fab
          color="primary"
          aria-label="add"
          onClick={handleAdicionar}
          sx={{ position: "fixed", bottom: "40px", right: "40px", boxShadow: 4 }}
        >
          <AddIcon />
        </Fab>
      </Box>

      <DialogCatalog
        open={openCatalog}
        onClose={handleCloseCatalog}
        onCreateWorkout={handleCreateWorkout}
      />
    </>
  );
}