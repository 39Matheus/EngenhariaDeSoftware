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
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Checkbox
} from "@mui/material";

export default function DialogCatalog({ open, onClose, onCreateWorkout }) {

const exercicios = [
    { id: 1, nome: "Supino reto" },
    { id: 2, nome: "Agachamento" },
    { id: 3, nome: "Remada curvada" },
    { id: 4, nome: "Puxada frontal" },
    { id: 5, nome: "Leg Press" },
    { id: 6, nome: "Rosca direta" },
    { id: 7, nome: "Tríceps pulley" },
    { id: 8, nome: "Elevação lateral" }
];

const [selectedExercises, setSelectedExercises] = React.useState([]);

const [search, setSearch] = React.useState("");

const handleCancel = () => {

  setSelectedExercises([]);

  setSearch("");

  onClose();
};

const [nomeTreino, setNomeTreino] = React.useState("");

const handleToggleExercise = (exercise) => {

  const exists = selectedExercises.find(
    (item) => item.id === exercise.id
  );

  if (exists) {
    setSelectedExercises(
      selectedExercises.filter(
        (item) => item.id !== exercise.id
      )
    );
  } else {
    setSelectedExercises([
      ...selectedExercises,
      exercise
    ]);
  }
};

const filteredExercises = exercicios.filter((exercise) =>
  exercise.nome
    .toLowerCase()
    .includes(search.toLowerCase())
);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
    >
      <DialogTitle>
        Crie seu treino 
      </DialogTitle>

        <DialogContent>
            <Typography sx={{ mb: 1 }}>
                Nome do treino
            </Typography>

            <TextField
                fullWidth
                placeholder="Ex: Treino de peito"
                sx={{ mb: 3 }}
                value={nomeTreino}
                onChange={(e) => setNomeTreino(e.target.value)}
            />  

            <Typography sx={{ mb: 1 }}>
                Pesquisar exercício
            </Typography>
            <TextField
                fullWidth
                placeholder="Pesquisar..."
                sx={{ mb: 3 }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.stopPropagation()}
            />

            <List sx={{ maxHeight: 400, overflow: "auto" }}>
                {filteredExercises.map((exercise) => {

                    const checked = selectedExercises.some(
                    (item) => item.id === exercise.id
                    );

                    return (
                    <ListItem
                        key={exercise.id}
                        disablePadding
                    >

                        <ListItemButton
                        onClick={() => handleToggleExercise(exercise)}
                        >

                        <Checkbox checked={checked} />

                        <ListItemText
                            primary={exercise.nome}
                        />

                        </ListItemButton>

                    </ListItem>
                    );
                })}

            </List>
        </DialogContent>

        <DialogActions>
            <Button onClick={handleCancel}>
                Cancelar
            </Button>
            <Button variant="contained" onClick={() => {
                onCreateWorkout({ nome: nomeTreino, exercicios: selectedExercises });
                handleCancel();
                setSelectedExercises([]);
                setSearch("");
                setNomeTreino("");
            }}>
                Continuar
            </Button>
        </DialogActions>
    </Dialog>
  );
}