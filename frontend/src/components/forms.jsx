import * as React from 'react';
import { Box, Typography, Paper, Card, CardContent } from '@mui/material';

export default function Forms({ title, children }) {
  return (
        <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        width: '100vw',
        backgroundColor: '#f5f5f5', // Cor de fundo da tela inteira
      }}
    >
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
            <Typography variant="h5" component="h1" align="center" fontWeight="bold">
                {title}
            </Typography>
                  {/*formulário  */}
                {children}
        
        </Card>
    </Box>
  );
}

{/*<Box sx={{ 
        backgroundColor: 'black',
        width: '100%', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', // Garante que o título e o conteúdo fiquem no meio 
        }}>
     Título do formulário centralizado 
      <Typography variant="h5" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
        {title}
      </Typography>
      <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2, backgroundColor: 'red', p: 3, borderRadius: 2 }}>
        {children}
      </Box>
    </Box>
*/}