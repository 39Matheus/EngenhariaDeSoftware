import * as React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Fab,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import Grid from "@mui/material/Grid";

// Ícones
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

// Componentes
import AppBarComponent from "../components/AppBar";
import DialogCatalog from "../components/DialogCatalog";

export default function Home() {
  const navigate = useNavigate();

  // --- ESTADOS ---
  const [openCatalog, setOpenCatalog] = React.useState(false);
  const [meusCards, setMeusCards] = React.useState([]);

  // --- FUNÇÃO: BUSCAR TREINOS (GET) ---
  const buscarMeusTreinos = async () => {
    const tokenAtualizado = localStorage.getItem("token");
    if (!tokenAtualizado) {
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

      if (response.ok) {
        const data = await response.json();
        const cardsFormatados = data.map((rotina) => {
          const listaExercicios =
            rotina.exercicios_da_rotina?.length > 0
              ? rotina.exercicios_da_rotina.map((item) => ({
                  id_relacao: item.id,
                  nome:
                    item.exercicio_detalhe?.nome || "Exercício Desconhecido",
                  serie: item.serie,
                  repeticoes: item.repeticoes,
                }))
              : [];

          return {
            id: rotina.id,
            titulo: rotina.nome_rotina,
            exercicios: listaExercicios,
          };
        });
        setMeusCards(cardsFormatados);
      }
    } catch (error) {
      console.error("Erro ao buscar treinos:", error);
    }
  };

  // --- EFEITO: CARREGAR AO ABRIR A PÁGINA ---
  React.useEffect(() => {
    buscarMeusTreinos();
  }, [navigate]);

  // --- FUNÇÃO: DELETAR ---
  const handleDeletar = async (id) => {
    try {
      const tokenAtualizado = localStorage.getItem("token");
      const response = await fetch(
        `http://127.0.0.1:8000/api/v1/rotinas/${id}/`,
        {
          method: "DELETE",
          headers: { Authorization: `Token ${tokenAtualizado}` },
        }
      );

      if (response.ok) {
        setMeusCards((prev) => prev.filter((card) => card.id !== id));
      }
    } catch (error) {
      console.error("Erro ao deletar:", error);
    }
  };

  // --- FUNÇÃO: AVISO DE TREINO CRIADO ---
  const handleTreinoCriadoComSucesso = () => {
    setOpenCatalog(false);
    buscarMeusTreinos(); 
  };

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
          sx={{ textAlign: "center", mb: "30px", fontWeight: "bold" }}
        >
          Meus Treinos e Hábitos
        </Typography>

        <Grid container spacing={3} sx={{ justifyContent: "center" }}>
          {meusCards.map((card) => (
            <Grid item xs={12} sm={6} md={4} key={card.id}>
              <Card
                elevation={3}
                sx={{
                  borderRadius: "10px",
                  minHeight: "200px", 
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <CardContent>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: "bold", mb: "10px" }}
                  >
                    {card.titulo}
                  </Typography>
                  {card.exercicios.length > 0 ? (
                    <FormGroup>
                      {card.exercicios.map((ex) => (
                        <FormControlLabel
                          key={ex.id_relacao}
                          control={<Checkbox size="small" />}
                          label={
                            <Typography variant="body2" color="text.secondary">
                              {/* Substituímos os ** por <strong> para o negrito funcionar no React */}
                              <strong>{ex.nome}</strong> — {ex.serie} séries de{" "}
                              {ex.repeticoes}
                            </Typography>
                          }
                          sx={{ mb: -1 }} 
                        />
                      ))}
                    </FormGroup>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Nenhum exercício adicionado.
                    </Typography>
                  )}
                </CardContent>

                <CardActions sx={{ justifyContent: "flex-end" }}>
                  <IconButton
                    color="error"
                    onClick={() => handleDeletar(card.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* =========================================
            BOTÃO SAIR DO SISTEMA (Restaurado!)
            ========================================= */}
        <Box sx={{ textAlign: "center", marginTop: "40px", marginBottom: "80px" }}>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<ArrowBackIcon />}
            onClick={() => {
              // Limpa o token e volta pro login
              localStorage.removeItem("token");
              localStorage.removeItem("usuario_id");
              navigate(-1); // Ou navigate("/") se preferir ir direto pra raiz
            }}
            sx={{ textTransform: "none" }}
          >
            Sair do Sistema
          </Button>
        </Box>

        <Fab
          color="primary"
          onClick={() => setOpenCatalog(true)}
          sx={{ position: "fixed", bottom: "40px", right: "40px" }}
        >
          <AddIcon />
        </Fab>
      </Box>

      {/* MODAL */}
      <DialogCatalog
        open={openCatalog}
        onClose={() => setOpenCatalog(false)}
        onSuccess={handleTreinoCriadoComSucesso}
      />
    </>
  );
}