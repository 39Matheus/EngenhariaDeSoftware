import { TextField, Button, Box, Typography } from '@mui/material';
import Forms from '../components/forms';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';


export default function Login() {
  const navigate = useNavigate();
  //capturar dados do formulário
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const [loading, setLoading] = useState(false);


  const handleLogin = async (e) => {
    e.preventDefault(); // Impede a página de recarregar
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8000/api/v1/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Enviando os dados que você capturou nos inputs
        body: JSON.stringify({ 
          username: email, // O Django por padrão usa 'username', se seu backend aceitar email mude aqui
          password: senha 
        }),
      });

      if (response.ok) {
        const data = await response.json();
        
        // Salvamos os dados para usar nas telas de treinos depois
        localStorage.setItem("token", data.token);
        localStorage.setItem("usuario_id", data.user_id);

        // Se deu tudo certo, joga o usuário para a Home!
        navigate("/home");
      } else {
        alert("E-mail ou senha incorretos.");
      }
    } catch (error) {
      console.error("Erro ao conectar com o servidor:", error);
      alert("Não foi possível conectar ao servidor backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Forms title="Entrar na sua Conta">
      {/*formulario que ira como children no formd.jsx */}
      <Box component="form" onSubmit={handleLogin} sx={{ display: 'flex', flexDirection: 'column', gap: 2,width: '80%',alignItems: 'center', margin: '0 auto' }}>
        <TextField 
          label="E-mail" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          fullWidth
          required
        />
        <TextField 
          label="Senha" 
          value={senha} 
          onChange={(e) => setSenha(e.target.value)} 
          variant="outlined" 
          fullWidth
          type="password" 
          required
        />
        
        <Button type= "submit" variant="contained" color="primary" fullWidth size="large" disabled={loading} sx={{ mt: 1 }}>
          {loading ? "Entrando..." : "Entrar"}
        </Button>

        <Typography variant="body2" align="center" sx={{ mt: 1 }}>
          Não tem uma conta? <Link to="/cadastro">Cadastre-se</Link>
        </Typography>
        <Typography variant="contained" align="center" sx={{ mt: 1 }}>
          Não tem uma conta? <Link to="/home">Voltar para a página inicial</Link>
        </Typography>
      </Box>
    </Forms>
  );
}