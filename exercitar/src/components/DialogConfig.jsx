// src/components/DialogConfig.jsx
/* React.useEffect(() => {
    if (open) {
      // =========================================================================
      // FUNÇÃO: fetchExercicios
      // Responsável por ir até o Django (via API) buscar a lista completa de
      // exercícios cadastrados no banco de dados para listar na tela.
      // =========================================================================
      const fetchExercicios = async () => {
        setLoading(true);
        try {
          const response = await fetch(
            "http://localhost:8000/api/v1/exercicios/",
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Token ${TOKEN}`,
              },
            },
          );
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
  
  
  
    // =========================================================================
    // FUNÇÃO: handleToggleExercise
    // Acionada toda vez que o usuário clica em um exercício da lista.
    // Se o exercício já estiver marcado, ela desmarca (tira da lista).
    // Se não estiver, ela marca (adiciona na lista).
    // =========================================================================
      const handleToggleExercise = (exercise) => {
      const exists = selectedExercises.find((item) => item.id === exercise.id);
      if (exists) {
        setSelectedExercises(
          selectedExercises.filter((item) => item.id !== exercise.id),
        );
      } else {
        setSelectedExercises([...selectedExercises, exercise]);
      }
    };
  
    // Derivação de estado para a barra de pesquisa
    const filteredExercises = Array.isArray(exercicios)
      ? exercicios.filter((exercise) =>
          exercise.nome.toLowerCase().includes(search.toLowerCase()),
        )
      : [];
      
      */

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  TextField,
  Box,
  Divider,
} from "@mui/material";

export default function DialogConfig({ open, onClose, draftWorkout, onSave }) {
  // Estado local para gerenciar as séries e repetições
  const [exerciciosConfig, setExerciciosConfig] = useState([]);
  const [selectedExercises, setSelectedExercises] = React.useState([]);
  const [exercicios, setExercicios] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [search, setSearch] = React.useState("");

  // Quando o draftWorkout chega do Home, inicializa o estado com propriedades vazias
  useEffect(() => {
    if (draftWorkout && draftWorkout.exercicios) {
      const inicializado = draftWorkout.exercicios.map((ex) => ({
        ...ex,
        series: "",
        repeticoes: "",
      }));
      setExerciciosConfig(inicializado);
    }
  }, [draftWorkout]);

  // Atualiza o valor de série ou repetição de um exercício específico
  const handleChange = (id, field, value) => {
    setExerciciosConfig((prev) =>
      prev.map((ex) => (ex.id === id ? { ...ex, [field]: value } : ex)),
    );
  };

  const handleSalvar = () => {
    // Monta o objeto final para enviar ao Home
    const treinoFinalizado = {
      nome: draftWorkout.nome,
      exercicios: exerciciosConfig,
    };
    onSave(treinoFinalizado);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Configurar As informações do treino</DialogTitle>

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
        <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
          <CircularProgress />
        </Box>
      ) : filteredExercises.length === 0 ? (
        <Typography sx={{ textAlign: "center", color: "text.secondary", p: 3 }}>
          Nenhum exercício encontrado.
        </Typography>
      ) : (
        <List sx={{ maxHeight: 400, overflow: "auto" }}>
          {filteredExercises.map((exercise) => {
            const checked = selectedExercises.some(
              (item) => item.id === exercise.id,
            );
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

      {/*<DialogContent dividers>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
          Treino: {draftWorkout?.nome || 'Sem nome definido'}
        </Typography>

        {exerciciosConfig.map((ex) => (
        <Box key={ex.id} sx={{ mb: 3 }}>
          {/* Aqui aparece o nome do exercício selecionado 
          <Typography variant="body1" sx={{ mb: 1, fontWeight: 'medium' }}>
            {ex.nome}
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="Séries (Ex: 3)"
              size="small"
              fullWidth
              value={ex.series}
              onChange={(e) => handleChange(ex.id, 'series', e.target.value)}
            />
            <TextField
              label="Repetições (Ex: 12)"
              size="small"
              fullWidth
              value={ex.repeticoes}
              onChange={(e) => handleChange(ex.id, 'repeticoes', e.target.value)}
            />
          </Box>
          <Divider sx={{ mt: 2 }} />
        </Box>
      ))}
      </DialogContent> */}

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose}>Voltar</Button>
        <Button variant="contained" color="success" onClick={handleSalvar}>
          Salvar Treino
        </Button>
      </DialogActions>
    </Dialog>
  );
}
