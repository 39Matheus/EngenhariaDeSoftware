// src/components/DialogConfig.jsx
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  TextField,
  Box,
  Divider
} from "@mui/material";

export default function DialogConfig({ open, onClose, draftWorkout, onSave }) {
  // Estado local para gerenciar as séries e repetições
  const [exerciciosConfig, setExerciciosConfig] = useState([]);

  // Quando o draftWorkout chega do Home, inicializa o estado com propriedades vazias
  useEffect(() => {
    if (draftWorkout && draftWorkout.exercicios) {
      const inicializado = draftWorkout.exercicios.map(ex => ({
        ...ex,
        series: '',
        repeticoes: ''
      }));
      setExerciciosConfig(inicializado);
    }
  }, [draftWorkout]);

  // Atualiza o valor de série ou repetição de um exercício específico
  const handleChange = (id, field, value) => {
    setExerciciosConfig((prev) =>
      prev.map((ex) => (ex.id === id ? { ...ex, [field]: value } : ex))
    );
  };

  const handleSalvar = () => {
    // Monta o objeto final para enviar ao Home
    const treinoFinalizado = {
      nome: draftWorkout.nome,
      exercicios: exerciciosConfig
    };
    onSave(treinoFinalizado);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Configurar Séries e Repetições</DialogTitle>
      
      <DialogContent dividers>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
          Treino: {draftWorkout?.nome || 'Sem nome definido'}
        </Typography>

        {exerciciosConfig.map((ex) => (
        <Box key={ex.id} sx={{ mb: 3 }}>
          {/* Aqui aparece o nome do exercício selecionado */}
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
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose}>Voltar</Button>
        <Button variant="contained" color="success" onClick={handleSalvar}>
          Salvar Treino
        </Button>
      </DialogActions>
    </Dialog>
  );
}