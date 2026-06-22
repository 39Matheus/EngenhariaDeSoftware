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
  Dialog,         
  DialogTitle,    
  DialogContent,  
  DialogActions,  
  TextField,      
  Divider,
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
import DialogConfig from "../components/DialogConfig"; // 👈 IMPORTADO O SEU COMPONENTE DE CONFIGURAÇÃO

export default function Home() {
  const navigate = useNavigate();

  // --- ESTADOS ---
  const [openCatalog, setOpenCatalog] = React.useState(false);
  const [meusCards, setMeusCards] = React.useState([]);

  // ESTADOS DA EDIÇÃO RESIDENCIAL
  const [modalAberto, setModalAberto] = React.useState(false);
  const [dadosEdicao, setDadosEdicao] = React.useState({ id: "", titulo: "", exercicios: [] });
  const [exerciciosParaDeletar, setExerciciosParaDeletar] = React.useState([]);

  // 👇 NOVO ESTADO: Controla a abertura do seu DialogConfig 👇
  const [openConfig, setOpenConfig] = React.useState(false);

  // --- FUNÇÃO: BUSCAR TREINOS DO ALUNO (GET) ---
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
                  nome: item.exercicio_detalhe?.nome || "Exercício Desconhecido",
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

  // --- EFEITO: CARREGAR DADOS AO ABRIR A PÁGINA ---
  React.useEffect(() => {
    buscarMeusTreinos();
  }, [navigate]);

  // --- FUNÇÃO: DELETAR ROTINA INTEIRA ---
  const handleDeletar = async (id) => {
    try {
      const tokenAtualizado = localStorage.getItem("token");
      const response = await fetch(
        `http://127.0.0.1:8000/api/v1/rotinas/${id}/`,
        {
          method: "DELETE",
          headers: { Authorization: `Token ${tokenAtualizado}` },
        },
      );

      if (response.ok) {
        setMeusCards((prev) => prev.filter((card) => card.id !== id));
      }
    } catch (error) {
      console.error("Erro ao deletar:", error);
    }
  };

  // --- FUNÇÃO: ABRIR MODAL DE EDIÇÃO ---
  const handleEditar = (id) => {
    const treinoSelecionado = meusCards.find((card) => card.id === id);

    if (treinoSelecionado) {
      setDadosEdicao({
        id: treinoSelecionado.id,
        titulo: treinoSelecionado.titulo,
        exercicios: treinoSelecionado.exercicios.map(ex => ({ ...ex })) || [], 
      });

      setExerciciosParaDeletar([]); 
      setModalAberto(true);
    } else {
      console.error("Treino não encontrado na lista local.");
    }
  };

  // --- FUNÇÃO: CONTROLAR DIGITAÇÃO DE SÉRIES/REPETIÇÕES NO MODAL ---
  const handleAlterarExercicio = (index, campo, valor) => {
    setDadosEdicao((prev) => {
      const novosExercicios = [...prev.exercicios];
      novosExercicios[index] = { 
        ...novosExercicios[index], 
        [campo]: valor === "" ? "" : Number(valor) 
      };
      return { ...prev, exercicios: novosExercicios };
    });
  };

  // --- FUNÇÃO: REMOVER EXERCÍCIO DA LISTA DO MODAL ---
  const handleRemoverExercicioDaLista = (index, id_relacao) => {
    setDadosEdicao((prev) => ({
      ...prev,
      exercicios: prev.exercicios.filter((_, i) => i !== index),
    }));

    if (id_relacao) {
      setExerciciosParaDeletar((prev) => [...prev, id_relacao]);
    }
  };

  // --- FUNÇÃO: SALVAR EDIÇÃO DO NOME E DELETES ---
  const handleSalvarEdicao = async () => {
    try {
      const tokenAtualizado = localStorage.getItem("token");

      // 1️⃣ ATUALIZA O TÍTULO DA ROTINA (PATCH)
      const responseRotina = await fetch(
        `http://127.0.0.1:8000/api/v1/rotinas/${dadosEdicao.id}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${tokenAtualizado}`,
          },
          body: JSON.stringify({ nome_rotina: dadosEdicao.titulo }),
        }
      );

      if (!responseRotina.ok) {
        alert("Erro ao atualizar o título do treino.");
        return;
      }

      // 2️⃣ EXCLUI OS EXERCÍCIOS REMOVIDOS (DELETE)
      if (exerciciosParaDeletar.length > 0) {
        const promessasDeletar = exerciciosParaDeletar.map((id_relacao) =>
          fetch(`http://127.0.0.1:8000/api/v1/rotinaexercicios/${id_relacao}/`, {
            method: "DELETE",
            headers: { Authorization: `Token ${tokenAtualizado}` },
          })
        );
        await Promise.all(promessasDeletar);
      }

      // 3️⃣ ATUALIZA OS EXERCÍCIOS QUE JÁ EXISTIAM E FORAM ALTERADOS (PATCH)
      const promessasEditar = dadosEdicao.exercicios.map((ex) =>
        fetch(`http://127.0.0.1:8000/api/v1/rotinaexercicios/${ex.id_relacao}/`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${tokenAtualizado}`,
          },
          body: JSON.stringify({
            serie: ex.serie,
            repeticoes: ex.repeticoes,
          }),
        })
      );
      await Promise.all(promessasEditar);

      // 4️⃣ REFRESH COMPLETO NA TELA
      await buscarMeusTreinos();

      setModalAberto(false);
      alert("Treino atualizado com sucesso! 📝💪");

    } catch (error) {
      console.error("Erro ao salvar a edição:", error);
      alert("Erro de conexão ao salvar as alterações.");
    }
  };

  // --- FUNÇÃO: AVISO DE TREINO CRIADO DO ZERO ---
  const handleTreinoCriadoComSucesso = () => {
    setOpenCatalog(false);
    buscarMeusTreinos();
  };

  // 👇 NOVA FUNÇÃO: RODA QUANDO O SEU DIALOGCONFIG ADICIONAR OS EXERCÍCIOS COM SUCESSO 👇
  const handleMultiplosExerciciosAdicionados = async () => {
    setOpenConfig(false); // Fecha o seu catálogo de checkboxes
    setModalAberto(false); // Fecha o modal de edição traseiro para forçar o refresh limpo do card
    await buscarMeusTreinos(); // Puxa do banco a lista atualizada com os novos exercícios inclusos
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
        <Typography variant="h4" sx={{ textAlign: "center", mb: "30px", fontWeight: "bold" }}>
          Meus Treinos e Hábitos
        </Typography>

        <Grid container spacing={3} sx={{ justifyContent: "center" }}>
          {meusCards.map((card) => (
            <Grid xs={12} sm={6} md={4} key={card.id}>
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
                  <Typography variant="h6" sx={{ fontWeight: "bold", mb: "10px" }}>
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
                              <strong>{ex.nome}</strong> — {ex.serie} séries de {ex.repeticoes}
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
                  <IconButton color="error" onClick={() => handleDeletar(card.id)}>
                    <DeleteIcon />
                  </IconButton>
                  <IconButton color="primary" onClick={() => handleEditar(card.id)}>
                    <EditIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* BOTÃO SAIR DO SISTEMA */}
        <Box sx={{ textAlign: "center", marginTop: "40px", marginBottom: "80px" }}>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<ArrowBackIcon />}
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("usuario_id");
              navigate("/");
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

      {/* MODAL DE CADASTRO DE UMA NOVA ROTINA DO ZERO */}
      <DialogCatalog
        open={openCatalog}
        onClose={() => setOpenCatalog(false)}
        onSuccess={handleTreinoCriadoComSucesso}
      />

      {/* MODAL DE EDIÇÃO COMPLETA */}
      <Dialog open={modalAberto} onClose={() => setModalAberto(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: "bold" }}>Editar Treino Completo</DialogTitle>
        <DialogContent dividers>
          
          <TextField
            margin="dense"
            label="Nome da Rotina"
            type="text"
            fullWidth
            variant="outlined"
            value={dadosEdicao.titulo}
            onChange={(e) => setDadosEdicao({ ...dadosEdicao, titulo: e.target.value })}
            sx={{ mb: 3 }}
          />

          <Divider sx={{ mb: 2 }} />
          
          {/* 👇 AQUI ESTÁ A MUDANÇA: ADICIONADO O BOTÃO QUE ABRE O SEU COMPONENTE DIALOGCONFIG 👇 */}
          <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }} color="primary">
            Gerenciar Exercícios
          </Typography>
          
          <Button
            variant="contained"
            color="secondary"
            fullWidth
            startIcon={<AddIcon />}
            onClick={() => setOpenConfig(true)} // 👈 Abre o seu modal de checkboxes
            sx={{ mb: 3, py: 1, fontWeight: "bold", textTransform: "none" }}
          >
            Adicionar Exercícios do Catálogo Geral
          </Button>

          <Divider sx={{ mb: 2 }} />
          <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }} color="primary">
            Exercícios Atuais do Treino (Clique na lixeira para remover)
          </Typography>

          {dadosEdicao.exercicios.length > 0 ? (
            dadosEdicao.exercicios.map((ex, index) => (
              <Box 
                key={ex.id_relacao} 
                sx={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: 1.5, 
                  mb: 2,
                  bgcolor: "#f9f9f9",
                  p: 1.5,
                  borderRadius: "6px"
                }}
              >
                <IconButton 
                  color="error" 
                  size="small"
                  onClick={() => handleRemoverExercicioDaLista(index, ex.id_relacao)}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>

                <Typography variant="body1" sx={{ flexGrow: 1, fontWeight: "500" }}>
                  {ex.nome}
                </Typography>
                
                <TextField
                  label="Séries"
                  type="number"
                  size="small"
                  sx={{ width: "80px" }}
                  value={ex.serie}
                  onChange={(e) => handleAlterarExercicio(index, "serie", e.target.value)}
                />

                <TextField
                  label="Reps"
                  type="number"
                  size="small"
                  sx={{ width: "80px" }}
                  value={ex.repeticoes}
                  onChange={(e) => handleAlterarExercicio(index, "repeticoes", e.target.value)}
                />
              </Box>
            ))
          ) : (
            <Typography variant="body2" color="text.secondary">
              Esta rotina não possui exercícios ativos.
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setModalAberto(false)} color="inherit">
            Cancelar
          </Button>
          <Button onClick={handleSalvarEdicao} variant="contained" color="primary">
            Salvar Alterações
          </Button>
        </DialogActions>
      </Dialog>

      {/* 👇 CHAMADA DO SEU COMPONENTE DIALOGCONFIG CONECTADO COM OS DADOS DA HOME 👇 */}
      <DialogConfig
        open={openConfig}
        onClose={() => setOpenConfig(false)}
        rotinaId={dadosEdicao.id} // 👈 Passa o ID da rotina atual que está sendo editada
        onSuccess={handleMultiplosExerciciosAdicionados} // 👈 Dispara o refresh quando salvar tudo no Django
      />
    </>
  );
}