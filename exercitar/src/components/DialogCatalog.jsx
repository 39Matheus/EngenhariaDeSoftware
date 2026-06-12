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
  Box
} from "@mui/material";

export default function DialogCatalog({ open, onClose, onCreateWorkout }) {
  const [exercicios, setExercicios] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [selectedExercises, setSelectedExercises] = React.useState([]);
  const [search, setSearch] = React.useState("");
  const [nomeTreino, setNomeTreino] = React.useState("");

  React.useEffect(() => {
    if (open) {
      const fetchExercicios = async () => {
        setLoading(true);
        try {
          // Lembre-se de ajustar a URL para a rota correta da sua API
          const response = await fetch('http://localhost:8000/api/v1/exercicios/'); 
          if (response.ok) {
            const data = await response.json();
            setExercicios(data);
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

  const filteredExercises = exercicios.filter((exercise) =>
    exercise.nome.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
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
          onClick={() => {
            onCreateWorkout({ nome: nomeTreino, exercicios: selectedExercises });
            handleCancel(); // Limpa os estados e fecha o modal
          }}
        >
          Continuar
        </Button>
      </DialogActions>
    </Dialog>
  );
}