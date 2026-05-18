import { TextField, Button, Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import Forms from '../components/forms';

export default function Cadastro() {
  return (
    <Forms title="Criar Nova Conta">
      {/* Campos específicos de cadastro */}
      <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField label="Nome Completo" variant="outlined" fullWidth />
        <TextField label="E-mail" variant="outlined" fullWidth type="email" />
        <TextField label="Senha" variant="outlined" fullWidth type="password" />
        <TextField label="Confirmar Senha" variant="outlined" fullWidth type="password" />
        
        <Button variant="contained" color="primary" fullWidth size="large" sx={{ mt: 1 }}>
          Cadastrar
        </Button>

        <Typography variant="body2" align="center" sx={{ mt: 1 }}>
          Já tem uma conta? <Link to="/">Faça Login</Link>
        </Typography>
      </Box>
    </Forms>
  );
}