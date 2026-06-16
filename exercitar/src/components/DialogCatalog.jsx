// components/DialogCatalog.jsx
import * as React from 'react';
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
  Divider
} from "@mui/material";

export default function DialogCatalog({ open, onClose, onCreateWorkout }) {
  const [exercicios, setExercicios] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [selectedExercises, setSelectedExercises] = React.useState([]);
  const [search, setSearch] = React.useState("");
  const [nomeTreino, setNomeTreino] = React.useState("");
  const [openDialogconfig, setOpenDialogconfig] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      const fetchExercicios = async () => {
        setLoading(true);
        try {
          const token = localStorage.getItem("token");
          
          const response = await fetch('http://localhost:8000/api/v1/exercicios/', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Token ${token}`
            }
          });
          if (response.ok) {
            const data = await response.json();
            const listaExercicios = data.results ? data.results : data;
            setExercicios(listaExercicios);
          } else {
            console.error("Erro ao buscar exercícios da API");
          }
        } catch (error) {
          console.error("Erro de conexão com o Django:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchExercicios();
    }
  }, [open]);

  const handleCancel = () => {
    setSelectedExercises([]);
    setSearch("");
    setNomeTreino("");
    setOpenDialogconfig(false);
    onClose();
  };

  const handleToggleExercise = (exercise) => {
    const exists = selectedExercises.find((item) => item.id === exercise.id);
    if (exists) {
      setSelectedExercises(selectedExercises.filter((item) => item.id !== exercise.id));
    } else {
      setSelectedExercises([...selectedExercises, exercise]);
    }
  };

  const filteredExercises = Array.isArray(exercicios) 
    ? exercicios.filter((exercise) => exercise.nome.toLowerCase().includes(search.toLowerCase()))
    : [];

  return (
    <>
    <Dialog open={open} onClose={handleCancel} maxWidth="lg" fullWidth>
      <DialogTitle>Crie seu treino</DialogTitle>

      <DialogContent>
        <Typography sx={{ mb: 1 }}>Nome do treino</Typography>
        <TextField
          fullWidth
          placeholder="Ex: Treino de peito"
          sx={{ mb: 3 }}
          value={nomeTreino}
          onChange={(e) => setNomeTreino(e.target.value)}
        />  

        <Typography sx={{ mb: 1 }}>Pesquisar exercício</Typography>
        <TextField
          fullWidth
          placeholder="Pesquisar..."
          sx={{ mb: 3 }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.stopPropagation()}
        />

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : filteredExercises.length === 0 ? (
          <Typography sx={{ textAlign: 'center', color: 'text.secondary', p: 3 }}>
            Nenhum exercício encontrado.
          </Typography>
        ) : (
          <List sx={{ maxHeight: 400, overflow: "auto" }}>
            {filteredExercises.map((exercise) => {
              const checked = selectedExercises.some((item) => item.id === exercise.id);
              return (
                <ListItem key={exercise.id} disablePadding>
                  <ListItemButton onClick={() => handleToggleExercise(exercise)}>
                    <Checkbox checked={checked} />
                    <ListItemText primary={exercise.nome} />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleCancel}>Cancelar</Button>
        <Button 
          variant="contained" 
          onClick={() => setOpenDialogconfig(true)}
        >
          Continuar
        </Button>
      </DialogActions>
    </Dialog>

    <Dialog open={openDialogconfig} onClose={() => setOpenDialogconfig(false)} maxWidth="sm" fullWidth>
      <DialogTitle>Configurar Séries e Repetições</DialogTitle>
      
      <DialogContent dividers>
        {/* CORREÇÃO 1: Trocamos draftWorkout?.nome por nomeTreino */}
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
          Treino: {nomeTreino || 'Sem nome definido'} 
        </Typography>

        {/* CORREÇÃO 2: Trocamos exerciciosConfig.map por selectedExercises.map */}
        {selectedExercises.map((ex, index) => (
          <Box key={ex.id} sx={{ mb: 3 }}>
            <Typography variant="body1" sx={{ mb: 1, fontWeight: 'medium' }}>
              {ex.nome}
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Séries (Ex: 3)"
                size="small"
                type="number"
                fullWidth
                value={ex.series || ""}
                onChange={(e) => {
                  const novosExercicios = [...selectedExercises];
                  novosExercicios[index].series = e.target.value;
                  setSelectedExercises(novosExercicios);
                }}
              />
              <TextField
                label="Repetições (Ex: 12)"
                size="small"
                type="number"
                fullWidth
                value={ex.repeticoes || ""}
                onChange={(e) => {
                  const novosExercicios = [...selectedExercises];
                  novosExercicios[index].repeticoes = e.target.value;
                  setSelectedExercises(novosExercicios);
                }}
              />
            </Box>
            <Divider sx={{ mt: 2 }} />
          </Box>
        ))}
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={() => setOpenDialogconfig(false)}>Voltar</Button>
        {/* CORREÇÃO 3: Atualizamos a função do botão de salvar */}
        <Button 
          variant="contained" 
          color="success" 
          onClick={() => {
            onCreateWorkout({ nome: nomeTreino, exercicios: selectedExercises });
            handleCancel(); 
          }}
        >
          Salvar Treino
        </Button>
      </DialogActions>
    </Dialog> 
    </>
  );
}