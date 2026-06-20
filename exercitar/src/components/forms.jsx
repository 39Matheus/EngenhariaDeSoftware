import * as React from 'react';
import { Box, Typography, Paper, Card, CardContent} from '@mui/material';

export default function Forms({ title, children }) {
  return (
    <Box sx={{ 
        width: '100%', maxWidth: 400, height: 'auto', padding: 4,borderRadius: 3, display: 'flex',flexDirection: 'column', gap: 3, backgroundColor: 'white'
      }}>
      {/* O "Card" branco centralizado */}
      <Card sx={{ 
          width: '80%', 
          maxWidth: 400, // Largura máxima do formulário
          height: 'auto',
          padding: 4,
          borderRadius: 3,
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
          backgroundColor: 'white' // Cor de fundo do formulário
          }}>
             {/* Título dinâmico: vai mudar entre "Login" e "Cadastro" */}
              <Typography variant="h5" component="h1"    align="center" fontWeight="bold">
                {title}
              </Typography>
              {/*formulário  */}
              {children}
      </Card>
    </Box>
  );
}