// src/pages/Professor.jsx
import * as React from "react";
import { useNavigate } from "react-router-dom";
import { 
  Box, 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  Container, 
  Divider, 
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemButton, // 👈 Novo para deixar clicável
  ListItemText,
  CircularProgress,
  Grid,
  Collapse // 👈 Novo para o efeito sanfona
} from "@mui/material";

// Ícones
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import ExpandLess from "@mui/icons-material/ExpandLess"; // 👈 Seta pra cima
import ExpandMore from "@mui/icons-material/ExpandMore"; // 👈 Seta pra baixo

// Componentes
import AppBarComponent from "../components/AppBar";
import DialogVincularAluno from "../components/DialogVincularAluno";
import DialogCatalog from "../components/DialogCatalog";

export default function Professor() {
  const navigate = useNavigate();
  
  // Inicializa o estado JÁ PUXANDO do localStorage
  const [alunosVinculados, setAlunosVinculados] = React.useState(() => {
    const salvos = localStorage.getItem("alunos_vinculados");
    return salvos ? JSON.parse(salvos) : [];
  });

  // Sempre que a variável 'alunosVinculados' mudar, salva no navegador
  React.useEffect(() => {
    localStorage.setItem("alunos_vinculados", JSON.stringify(alunosVinculados));
  }, [alunosVinculados]);

  // Verifica se o professor tem token para estar na página
  React.useEffect(() => {
    const tokenAtualizado = localStorage.getItem("token");
    if (!tokenAtualizado) {
      navigate("/");
    }
  }, [navigate]);
  
  const [alunoSelecionado, setAlunoSelecionado] = React.useState(null);

  // Controles dos Modais
  const [openVincular, setOpenVincular] = React.useState(false);
  const [openCatalog, setOpenCatalog] = React.useState(false);
  const [openVisualizar, setOpenVisualizar] = React.useState(false);

  // Estados da busca e exibição de rotinas
  const [rotinasAluno, setRotinasAluno] = React.useState([]);
  const [loadingRotinas, setLoadingRotinas] = React.useState(false);
  const [expandedRotinaId, setExpandedRotinaId] = React.useState(null); // 👈 Controla qual sanfona está aberta

  // Adiciona o novo aluno à lista
  const handleVinculoSucesso = (novoAluno) => {
    setAlunosVinculados((prev) => {
      if (prev.some(aluno => aluno.id === novoAluno.id)) {
        alert("Este aluno já está na sua lista de gerenciamento!");
        return prev;
      }
      return [...prev, novoAluno];
    });
  };

  // Desvincular aluno
  const handleDesvincular = (alunoId) => {
    const confirmar = window.confirm("Tem certeza que deseja desvincular este aluno do seu painel?");
    if (confirmar) {
      setAlunosVinculados((prev) => prev.filter(aluno => aluno.id !== alunoId));
    }
  };

  const handleTreinoCriadoComSucesso = () => {
    setOpenCatalog(false);
    alert("Rotina montada com sucesso para o aluno! 💪");
  };

  // --- AÇÕES DOS BOTÕES DENTRO DO CARD ---
  const abrirModalMontarRotina = (aluno) => {
    setAlunoSelecionado(aluno);
    setOpenCatalog(true);
  };

  const abrirModalVisualizarRotinas = async (aluno) => {
    setAlunoSelecionado(aluno);
    setOpenVisualizar(true);
    setLoadingRotinas(true);
    setExpandedRotinaId(null); // Reseta a sanfona toda vez que abrir o modal
    
    const tokenSeguro = localStorage.getItem("token");

    try {
      const response = await fetch("http://localhost:8000/api/v1/rotinas/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${tokenSeguro}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const filtradas = data.filter(rotina => rotina.usuario === aluno.id);
        setRotinasAluno(filtradas);
      }
    } catch (error) {
      console.error("Erro ao buscar rotinas:", error);
    } finally {
      setLoadingRotinas(false);
    }
  };

  // Alterna o estado da sanfona (abre/fecha)
  const handleToggleExpand = (id) => {
    setExpandedRotinaId(expandedRotinaId === id ? null : id);
  };

  return (
    <>
      <Container maxWidth="lg" sx={{ mt: 5, mb: 10 }}>
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
            Área do Professor
          </Typography>
          <Typography color="text.secondary">
            Gerencie seus alunos vinculados e monte planilhas de treinos.
          </Typography>
        </Box>

        <Divider sx={{ my: 4 }} />

        {/* MURAL DE ALUNOS VINCULADOS */}
        {alunosVinculados.length > 0 ? (
          <Grid container spacing={3}>
            {alunosVinculados.map((aluno) => (
              <Grid item xs={12} sm={6} md={4} key={aluno.id}>
                
                <Card elevation={4} sx={{ borderRadius: 3, p: 1, height: "100%", display: "flex", flexDirection: "column" }}>
                  <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
                    
                    <Typography variant="subtitle1" color="primary" sx={{ fontWeight: "bold", mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
                      <FitnessCenterIcon /> Aluno Ativo
                    </Typography>
                    
                    <Typography variant="body1" sx={{ mb: 0.5 }}>
                      <strong>Nome:</strong> {aluno.first_name || aluno.username}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                      <strong>E-mail:</strong> {aluno.email}
                    </Typography>

                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, mt: "auto" }}>
                      <Button
                        variant="outlined"
                        color="secondary"
                        fullWidth
                        startIcon={<AddIcon />}
                        onClick={() => abrirModalMontarRotina(aluno)}
                        sx={{ textTransform: "none", fontWeight: "bold" }}
                      >
                        Montar Nova Rotina
                      </Button>

                      <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        startIcon={<VisibilityIcon />}
                        onClick={() => abrirModalVisualizarRotinas(aluno)}
                        sx={{ textTransform: "none", fontWeight: "bold" }}
                      >
                        Visualizar Rotinas
                      </Button>

                      <Button
                        variant="text"
                        color="error"
                        fullWidth
                        startIcon={<PersonRemoveIcon />}
                        onClick={() => handleDesvincular(aluno.id)}
                        sx={{ textTransform: "none", fontWeight: "bold", mt: 1 }}
                      >
                        Desvincular Aluno
                      </Button>
                    </Box>

                  </CardContent>
                </Card>

              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography variant="h6" color="text.secondary" align="center" sx={{ mt: 4, fontStyle: "italic" }}>
            Você ainda não possui alunos vinculados. Clique no botão azul no canto inferior direito para adicionar.
          </Typography>
        )}
      </Container>

      {/* BOTÃO FLUTUANTE */}
      <Fab
        color="primary"
        aria-label="vincular-aluno"
        onClick={() => setOpenVincular(true)}
        sx={{ position: "fixed", bottom: 24, right: 24, boxShadow: 4 }}
      >
        <PersonAddIcon />
      </Fab>

      {/* MODAL 1: VINCULAR */}
      <DialogVincularAluno
        open={openVincular}
        onClose={() => setOpenVincular(false)}
        onSuccess={handleVinculoSucesso}
      />

      {/* MODAL 2: MONTAR ROTINA */}
      {openCatalog && alunoSelecionado && (
        <DialogCatalog
          open={openCatalog}
          onClose={() => {
            setOpenCatalog(false);
            setAlunoSelecionado(null);
          }}
          onSuccess={handleTreinoCriadoComSucesso}
          alunoId={alunoSelecionado.id} 
        />
      )}

      {/* 👁️ MODAL 3: VISUALIZAR ROTINAS (AGORA COM OS EXERCÍCIOS) 👁️ */}
      <Dialog open={openVisualizar} onClose={() => { setOpenVisualizar(false); setAlunoSelecionado(null); }} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: "bold" }}>
          Rotinas de {alunoSelecionado?.first_name || alunoSelecionado?.username}
        </DialogTitle>
        
        <DialogContent dividers sx={{ p: 0 }}> {/* Removi o padding pra lista colar nas bordas */}
          {loadingRotinas ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
              <CircularProgress />
            </Box>
          ) : rotinasAluno.length === 0 ? (
            <Typography sx={{ textAlign: "center", color: "text.secondary", p: 3 }}>
              Este aluno ainda não possui nenhuma rotina criada.
            </Typography>
          ) : (
            <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
              {rotinasAluno.map((rotina) => (
                <React.Fragment key={rotina.id}>
                  
                  {/* Linha Principal da Rotina (Clicável) */}
                  <ListItemButton onClick={() => handleToggleExpand(rotina.id)} divider>
                    <ListItemText
                      primary={
                        <Typography sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                          {rotina.nome_rotina}
                        </Typography>
                      }
                      secondary={`Quantidade de exercícios: ${rotina.exercicios_da_rotina?.length || 0}`}
                    />
                    {/* Muda o ícone se estiver aberto ou fechado */}
                    {expandedRotinaId === rotina.id ? <ExpandLess /> : <ExpandMore />}
                  </ListItemButton>

                  {/* Conteúdo Expansível (Os Exercícios) */}
                  <Collapse in={expandedRotinaId === rotina.id} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding sx={{ bgcolor: '#f9f9f9' }}>
                      {rotina.exercicios_da_rotina?.length > 0 ? (
                        rotina.exercicios_da_rotina.map((ex, index) => (
                          <ListItem key={ex.id} divider sx={{ pl: 4 }}>
                            <ListItemText
                              primary={`${index + 1}. ${ex.exercicio_detalhe?.nome || "Exercício Desconhecido"}`}
                              secondary={`${ex.serie} séries x ${ex.repeticoes} repetições`}
                            />
                          </ListItem>
                        ))
                      ) : (
                        <ListItem sx={{ pl: 4 }}>
                          <ListItemText secondary="Nenhum exercício cadastrado nesta rotina." />
                        </ListItem>
                      )}
                    </List>
                  </Collapse>
                  
                </React.Fragment>
              ))}
            </List>
          )}
        </DialogContent>
        
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenVisualizar(false)} color="primary" variant="contained">
            Fechar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}