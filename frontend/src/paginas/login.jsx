import { TextField, Button, Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import Forms from '../components/forms';

import { useState } from 'react';

export default function Login() {
  //capturar dados do formulário
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  return (
    <Forms title="Entrar na sua Conta">
      {/*formulario que ira como children no formd.jsx */}
      <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2,width: '80%',alignItems: 'center', margin: '0 auto' }}>
        <TextField 
          label="E-mail" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          fullWidth
        />
        <TextField 
          label="Senha" 
          value={senha} 
          onChange={(e) => setSenha(e.target.value)} 
          variant="outlined" 
          fullWidth
          type="password" 
        />
        
        <Button variant="contained" color="primary" fullWidth size="large" sx={{ mt: 1 }}>
          Entrar
        </Button>

        <Typography variant="body2" align="center" sx={{ mt: 1 }}>
          Não tem uma conta? <Link to="/cadastro">Cadastre-se</Link>
        </Typography>
      </Box>
    </Forms>
  );
}