//home.jsx
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
import DialogCatalog from '../components/DialogCatalog';


export default function Home() {
  const navigate = useNavigate();

  const [openCatalog, setOpenCatalog] = React.useState(false);

  const [meusCards, setMeusCards] = React.useState([]);

 React.useEffect(() => {
    const buscarMeusTreinos = async () => {
      const token = localStorage.getItem("token");

      // +++ NOVA TRAVA FRONT-END +++
      // Se não tiver token no navegador, chuta pro login IMEDIATAMENTE
      if (!token) {
        console.warn("Nenhum token encontrado. Redirecionando para o login...");
        navigate("/");
        return;
      }

      try {
        const response = await fetch('http://127.0.0.1:8000/api/v1/rotinas/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}` 
          }
        });

        if (response.status === 401 || response.status === 403) {
          console.warn("Sem permissão! Voltando pro login...");
          localStorage.removeItem("token"); 
          localStorage.removeItem("usuario_id");
          navigate("/"); 
          return;
        }

        if (response.ok) {
          const data = await response.json();
          const cardsFormatados = data.map(rotina => ({
             id: rotina.id,
             titulo: rotina.nome_rotina,
             descricao: "" 
          }));
          setMeusCards(cardsFormatados);
        }

      } catch (error) {
        console.error("Erro ao buscar treinos:", error);
      }
    };

    buscarMeusTreinos();
  }, [navigate]);

  const handleCreateWorkout = async (workoutData) => {
    try {
      const usuarioId = localStorage.getItem("usuario_id");

      const token = localStorage.getItem("token");
      console.log("TESTE 1 - ID puro do navegador:", usuarioId);
      console.log("TESTE 2 - ID convertido para o Django:", parseInt(usuarioId, 10));
      // 1. Criar a "casca" da Rotina
      const rotinaResponse = await fetch('http://127.0.0.1:8000/api/v1/rotinas/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`
        },
        body: JSON.stringify({ 
          nome_rotina: workoutData.nome,
          usuario: parseInt(usuarioId, 10) 
        }) 
      });

      if (!rotinaResponse.ok) {
        const erroDoDjango = await rotinaResponse.json();
        console.error("O Django rejeitou a criação! Motivo:", erroDoDjango);
        return; 
      }

      const rotinaCriada = await rotinaResponse.json();
      const rotinaId = rotinaCriada.id; 

      // 2. Adicionar os Exercícios usando o ID gerado
      const exerciciosPromises = workoutData.exercicios.map(async (ex) => {
        const dadosExercicio = {
          exercicio: ex.id, 
          series: parseInt(ex.serie, 10) || 0, 
          repeticoes: parseInt(ex.repeticoes, 10) || 0
        };

        const exResponse = await fetch(`http://127.0.0.1:8000/api/v1/rotinas/${rotinaId}/exercicios/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`
          },
          body: JSON.stringify(dadosExercicio)
        });
        if (!exResponse.ok) {
          const erroExercicio = await exResponse.json(); // Pega o motivo do erro
          console.error(`O Django rejeitou o exercício ${ex.nome}! Motivo:`, erroExercicio);
        }
        
        return exResponse;
      });

      await Promise.all(exerciciosPromises);

      // 3. Atualizar o estado visual (os Cards na tela)
      const novoCard = {
        id: rotinaId,
        titulo: rotinaCriada.nome_rotina, 
        descricao: workoutData.exercicios.map((ex) => ex.nome).join(", ")
      };
      setMeusCards((prev) => [...prev, novoCard]);
      
      // 4. Fechar o Modal
      setOpenCatalog(false);
      alert("oiii");
      alert("Treino e exercícios criados com sucesso!", novoCard);

    } catch (error) {
      console.error("Erro de conexão ao tentar criar a rotina e os exercícios:", error);
    }
  };


  const handleDeletar = async (id) => {
  console.log("Deletar o card:", id);
  
  try {
    // Coloque o seu caminho do Django aqui embaixo:
    const response = await fetch(`http://127.0.0.1:8000/api/v1/rotinas/${id}/`, {
      method: 'DELETE',
      headers: {
        // 'Authorization': 'Bearer SEU_TOKEN_AQUI', // Descomente se a sua API exigir autenticação
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`
      }
    });

    if (response.ok) {
      console.log("Card deletado com sucesso!");
      setMeusCards((prevCards) => prevCards.filter((card) => card.id !== id));
    } else {
      console.error("Erro ao deletar o card no servidor. Status:", response.status);
    }
  } catch (error) {
    console.error("Erro de conexão ao tentar deletar:", error);
  }
};
  // Adicionei o parâmetro "dadosAtualizados", que seria o objeto com os novos valores do form/modal
const handleEditar = async (id, dadosAtualizados) => {
  console.log("Salvando edição do card:", id);

  try {
    // Coloque o seu caminho do Django aqui embaixo:
    const response = await fetch(`http://127.0.0.1:8000/api/v1/rotinas/${id}/`, {
      method: 'PUT', // Mude para 'PATCH' se for enviar apenas alguns campos e não o objeto inteiro
      headers: {
        // 'Authorization': 'Bearer SEU_TOKEN_AQUI', // Descomente se a sua API exigir autenticação
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`
      },
      body: JSON.stringify(dadosAtualizados) // Transforma o objeto JS em JSON para o Django ler
    });

    if (response.ok) {
      const data = await response.json();
      console.log("Card editado com sucesso!", data);
      
      // DICA: Aqui você fecha o modal e atualiza a lista (ou o card específico) na tela.
      // Exemplo: setModalAberto(false);
      //          buscarCardsNovamente();
    } else {
      console.error("Erro ao editar o card no servidor. Status:", response.status);
    }
  } catch (error) {
    console.error("Erro de conexão ao tentar editar:", error);
  }
};


  const handleAdicionar = () => {
  setOpenCatalog(true);
  };
  const handleCloseCatalog = () => {
  setOpenCatalog(false);
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
        <Grid container spacing={3} sx={{ justifyContent: 'center' }}
>
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

        {/* BOTÃO FLUTUANTE DE ADICIONAR NA LATERAL DIREITA*/} 
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
      <DialogCatalog open={openCatalog} onClose={handleCloseCatalog}  onCreateWorkout={handleCreateWorkout} />
    </>
  );
}