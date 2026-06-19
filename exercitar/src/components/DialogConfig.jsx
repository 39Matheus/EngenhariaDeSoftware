// src/components/DialogConfig.jsx
import * as React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  TextField,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Checkbox,
  CircularProgress,
  Box,
  Divider,
} from "@mui/material";

export default function DialogConfig({ open, onClose, rotinaId, onSuccess }) {
  // --- ESTADOS DO CATÁLOGO GERAL ---
  const [exercicios, setExercicios] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [search, setSearch] = React.useState("");
  
  // Aqui guardamos todos os exercícios que você marcou no checkbox
  const [selectedExercises, setSelectedExercises] = React.useState([]);

  // --- ESTADOS DA TELA DE CONFIGURAÇÃO ---
  const [openConfigModal, setOpenConfigModal] = React.useState(false);
  const [exerciciosConfig, setExerciciosConfig] = React.useState([]);

  // =========================================================================
  // EFEITO: Buscar exercícios quando o modal abrir
  // =========================================================================
  React.useEffect(() => {
    if (open) {
      const fetchExercicios = async () => {
        setLoading(true);
        try {
          const TOKEN = localStorage.getItem("token");
          const response = await fetch("http://localhost:8000/api/v1/exercicios/", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${TOKEN}`,
            },
          });
          
          if (response.ok) {
            const data = await response.json();
            setExercicios(data.results ? data.results : data);
          }
        } catch (error) {
          console.error("Erro ao buscar a lista de exercícios:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchExercicios();
    }
  }, [open]);

  // =========================================================================
  // FUNÇÃO: Marcar/Desmarcar o Checkbox
  // =========================================================================
  const handleToggleExercise = (exercise) => {
    const isAlreadySelected = selectedExercises.find((item) => item.id === exercise.id);
    
    if (isAlreadySelected) {
      // Se já estava marcado, tira da lista
      setSelectedExercises(selectedExercises.filter((item) => item.id !== exercise.id));
    } else {
      // Se não estava, adiciona na lista
      setSelectedExercises([...selectedExercises, exercise]);
    }
  };

  // =========================================================================
  // FUNÇÃO: Abrir a tela de configurar os selecionados
  // =========================================================================
  const handleAbrirConfiguracao = () => {
    if (selectedExercises.length === 0) {
      alert("Selecione pelo menos um exercício para continuar!");
      return;
    }

    // Prepara as caixinhas de séries e repetições vazias para cada um que você marcou
    const inicializado = selectedExercises.map((ex, index) => ({
      id: ex.id,
      nome: ex.nome,
      serie: "",
      repeticoes: "",
      ordem: index + 1, // Já calcula a ordem automaticamente!
    }));

    setExerciciosConfig(inicializado);
    setOpenConfigModal(true);
  };

  // =========================================================================
  // FUNÇÃO: Salvar TODOS os exercícios no Django de uma vez
  // =========================================================================
  const handleSalvarTudoNoDjango = async () => {
    try {
      const TOKEN = localStorage.getItem("token");

      // Cria um laço de repetição que dispara o POST para cada exercício configurado
      const promessasDeSalvamento = exerciciosConfig.map(async (ex) => {
        const dadosExercicio = {
          exercicio: ex.id,
          serie: parseInt(ex.serie, 10) || 0,
          repeticoes: ex.repeticoes || "0",
          ordem: ex.ordem,
        };

        return fetch(`http://127.0.0.1:8000/api/v1/rotinas/${rotinaId}/exercicios/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${TOKEN}`,
          },
          body: JSON.stringify(dadosExercicio),
        });
      });

      // Espera o React salvar todos eles no banco
      await Promise.all(promessasDeSalvamento);

      alert("Todos os exercícios foram adicionados ao treino!");
      
      // Limpa os estados e fecha todas as janelas
      setSelectedExercises([]);
      setExerciciosConfig([]);
      setOpenConfigModal(false);
      onClose(); 
      
      // 4. AGORA SIM, avisa a Home para puxar os cards novos do banco!
      if (onSuccess) {
        onSuccess();
      }

    } catch (error) {
      console.error("Erro ao salvar o pacote de exercícios:", error);
    }
  };

  // Filtro de pesquisa
  const filteredExercises = Array.isArray(exercicios)
    ? exercicios.filter((ex) =>
        ex.nome.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  return (
    <>
      {/* ===================================================================
          JANELA 1: O CATÁLOGO COM CHECKBOXES
          =================================================================== */}
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>Selecione os Exercícios</DialogTitle>

        <DialogContent dividers>
          <TextField
            fullWidth
            size="small"
            placeholder="Pesquisar exercício..."
            sx={{ mb: 2 }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
              <CircularProgress />
            </Box>
          ) : filteredExercises.length === 0 ? (
            <Typography sx={{ textAlign: "center", color: "text.secondary", p: 3 }}>
              Nenhum exercício encontrado.
            </Typography>
          ) : (
            <List sx={{ maxHeight: 400, overflow: "auto" }}>
              {filteredExercises.map((ex) => {
                // Verifica se esse exercício específico está dentro do array de selecionados
                const isChecked = selectedExercises.some((item) => item.id === ex.id);

                return (
                  <ListItem key={ex.id} disablePadding divider>
                    <ListItemButton onClick={() => handleToggleExercise(ex)}>
                      <Checkbox checked={isChecked} />
                      <ListItemText primary={ex.nome} />
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2, justifyContent: "space-between" }}>
          <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
            {selectedExercises.length} selecionado(s)
          </Typography>
          <Box>
            <Button onClick={onClose} sx={{ mr: 1 }}>Cancelar</Button>
            <Button variant="contained" color="primary" onClick={handleAbrirConfiguracao}>
              Configurar Séries
            </Button>
          </Box>
        </DialogActions>
      </Dialog>

      {/* ===================================================================
          JANELA 2: CONFIGURAÇÃO DE SÉRIES E REPETIÇÕES DOS SELECIONADOS
          =================================================================== */}
      <Dialog open={openConfigModal} onClose={() => setOpenConfigModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Configurar Séries e Repetições</DialogTitle>
        
        <DialogContent dividers>
          {exerciciosConfig.map((ex, index) => (
            <Box key={ex.id} sx={{ mb: 3 }}>
              <Typography variant="body1" sx={{ mb: 1, fontWeight: "bold", color: "primary.main" }}>
                {index + 1}. {ex.nome}
              </Typography>
              
              <Box sx={{ display: "flex", gap: 2 }}>
                <TextField
                  label="Séries (Ex: 3)"
                  size="small"
                  type="number"
                  fullWidth
                  value={ex.serie}
                  onChange={(e) => {
                    const novos = [...exerciciosConfig];
                    novos[index].serie = e.target.value;
                    setExerciciosConfig(novos);
                  }}
                />
                <TextField
                  label="Repetições (Ex: 12)"
                  size="small"
                  type="text"
                  fullWidth
                  value={ex.repeticoes}
                  onChange={(e) => {
                    const novos = [...exerciciosConfig];
                    novos[index].repeticoes = e.target.value;
                    setExerciciosConfig(novos);
                  }}
                />
              </Box>
              <Divider sx={{ mt: 2 }} />
            </Box>
          ))}
        </DialogContent>
        
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenConfigModal(false)}>Voltar aos Checkboxes</Button>
          <Button variant="contained" color="success" onClick={handleSalvarTudoNoDjango}>
            Salvar Treino Completo
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}