// src/components/DialogVincularAluno.jsx
import * as React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  TextField,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Radio,
  CircularProgress,
  Box,
} from "@mui/material";

export default function DialogVincularAluno({ open, onClose, onSuccess }) {
  const [usuarios, setUsuarios] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [selectedAluno, setSelectedAluno] = React.useState(null);

  // --- BUSCAR TODOS OS USUÁRIOS (GET /api/v1/) ---
  React.useEffect(() => {
    if (open) {
      const fetchUsuarios = async () => {
        setLoading(true);
        try {
          const TOKEN = localStorage.getItem("token");
          const response = await fetch("http://localhost:8000/api/v1/", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${TOKEN}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            // Filtra para remover outros professores da listagem (caso use a flag is_professor)
            const apenasAlunos = data.filter(user => !user.is_professor);
            setUsuarios(apenasAlunos);
          }
        } catch (error) {
          console.error("Erro ao buscar usuários:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchUsuarios();
    }
  }, [open]);

  // --- EFETUAR O VÍNCULO (POST /api/v1/professor/vincular-aluno) ---
  const handleConfirmarVinculo = async () => {
    if (!selectedAluno) return;

    try {
      const TOKEN = localStorage.getItem("token");
      const response = await fetch("http://localhost:8000/api/v1/professor/vincular-aluno", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${TOKEN}`,
        },
        body: JSON.stringify({ 
          aluno_id: selectedAluno.id // Ou a chave que o seu serializer em 'VincularAlunoView' espera
        }),
      });

      if (response.ok) {
        alert("Aluno vinculado com sucesso! 🤝");
        onSuccess(selectedAluno); // Passa o objeto do aluno de volta para o componente pai
        onClose();
      } else {
        alert("Erro ao salvar vínculo no servidor.");
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      alert("Não foi possível conectar ao servidor.");
    }
  };

  const filteredUsuarios = usuarios.filter((user) =>
    (user.first_name || user.username || "").toLowerCase().includes(search.toLowerCase()) ||
    (user.email || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: "bold" }}>Vincular Aluno ao seu Perfil</DialogTitle>

      <DialogContent dividers>
        <TextField
          fullWidth
          size="small"
          placeholder="Pesquisar por nome ou email..."
          sx={{ mb: 2 }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
            <CircularProgress />
          </Box>
        ) : filteredUsuarios.length === 0 ? (
          <Typography sx={{ textAlign: "center", color: "text.secondary", p: 3 }}>
            Nenhum usuário encontrado.
          </Typography>
        ) : (
          <List sx={{ maxHeight: 300, overflow: "auto" }}>
            {filteredUsuarios.map((user) => {
              const isSelected = selectedAluno?.id === user.id;

              return (
                <ListItem key={user.id} disablePadding divider>
                  <ListItemButton onClick={() => setSelectedAluno(user)}>
                    <Radio checked={isSelected} />
                    <ListItemText
                      primary={user.first_name || user.username}
                      secondary={user.email}
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} color="inherit">Cancelar</Button>
        <Button variant="contained" color="primary" onClick={handleConfirmarVinculo} disabled={!selectedAluno}>
          Vincular Aluno
        </Button>
      </DialogActions>
    </Dialog>
  );
}