import * as React from 'react';
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button, Card, CardContent, CardActions, IconButton, Fab } from '@mui/material';
import Grid from '@mui/material/Grid'; // Importando o Grid mais moderno do MUI

// Ícones que vamos usar
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

import AppBarComponent from '../components/AppBar';

export default function Home() {
  const navigate = useNavigate();

  // Exemplo de dados que vão vir do seu banco do Django no futuro
  const meusCards = [
    { id: 1, titulo: "Treino de Quadríceps", descricao: "Agachamento, Leg Press, Extensora e Afundo." },
    { id: 2, titulo: "Cardio do Dia", descricao: "30 minutos de corrida leve na esteira." },
    { id: 3, titulo: "Beber Água", descricao: "Meta diária de 3L batida com sucesso." },
  ];

  const handleEditar = (id) => {
    console.log("Editar o card:", id);
    // Aqui depois você abre um modal ou muda de página
  };

  const handleDeletar = (id) => {
    console.log("Deletar o card:", id);
    // Aqui depois você faz o fetch com DELETE para o Django
  };

  const handleAdicionar = () => {
    console.log("Clicou em adicionar!");
    // Aqui você abre o formulário de criação
  };

  return (
    <>
      <AppBarComponent />

      {/* Container principal com espaçamento seguro */}
      <Box sx={{ padding: { xs: '2px', md: '4px' }, position: 'relative', minHeight: '80vh' }}>
        
        <Typography variant="h4" sx={{ textAlign: 'center', marginBottom: '30px', fontWeight: 'bold' }}>
          Meus Treinos e Hábitos
        </Typography>

        {/* Grid responsivo para os Cards Quadrados */}
        <Grid container spacing={3} justifyContent="center">
          {meusCards.map((card) => (
            <Grid size={{ xs: 6, sm: 6, md: 3 }} key={card.id}>
              <Card 
                elevation={3} 
                sx={{ 
                  //aspectRatio: '2/3', //Força o card a ser perfeitamente quadrado!
                  display: 'flex', 
                  flexDirection: 'column', 
                  justifyContent: 'space-between',
                  borderRadius: '10px',
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'scale(1.02)' } // Efeito sutil ao passar o mouse
                }}
              >
                {/* Conteúdo de Texto */}
                <CardContent>
                  <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', marginBottom: '10px' }}>
                    {card.titulo}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {card.descricao}
                  </Typography>
                </CardContent>

                {/* Botões de Ação no Rodapé do Card */}
                <CardActions sx={{ justifyContent: 'flex-end', padding: '8px 16px' }}>
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

        {/* Botão de Voltar para o login discreto embaixo */}
        <Box sx={{ textAlign: 'center', marginTop: '40px' }}>
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

        {/* BOTÃO FLUTUANTE DE ADICIONAR NA LATERAL DIREITA */}
        <Fab 
          color="primary" 
          aria-label="add" 
          onClick={handleAdicionar}
          sx={{
            position: 'fixed',
            bottom: '40px',
            right: '40px',
            boxShadow: 4
          }}
        >
          <AddIcon />
        </Fab>

      </Box>
    </>
  );
}