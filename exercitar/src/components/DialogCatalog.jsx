// components/DialogCatalog.jsx
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
  Checkbox,
  CircularProgress,
  Box,
  Divider,
} from "@mui/material";

import DialogConfig from "./DialogConfig";

const TOKEN = localStorage.getItem("token");

// FUNÇÃO PRINCIPAL: DialogCatalog
// Esta é a função principal do componente. Ela salva o nome do treino e cria uma nova rotina no backend (Django) para depois abrir o modal de configuração

export default function DialogCatalog({ open, onClose, onSuccess }) {
  const [openDialogconfig, setOpenDialogconfig] = React.useState(false);
  const [nomeTreino, setNomeTreino] = React.useState("");
  const [rotinaId, setRotinaId] = React.useState(null);

  // =========================================================================
  // FUNÇÃO: handleCancel
  // Limpa tudo e fecha o modal.
  // =========================================================================
  const handleCancel = () => {
    setNomeTreino("");
    setRotinaId(null);
    setOpenDialogconfig(false);
    onClose();
  };

  // =========================================================================
  // FUNÇÃO: handleContinuar
  // Pega o token fresquinho, cria a "casca" do treino no Django com o nome,
  // salva o ID gerado e só então abre a próxima janela.
  // =========================================================================
  const handleContinuar = async () => {
    // Trava de segurança: não deixa criar treino sem nome
    if (!nomeTreino.trim()) {
      alert("Por favor, digite um nome para o treino.");
      return;
    }

    try {
      // 1. Pega o token no exato momento do clique!
      const TOKEN = localStorage.getItem("token");

      // 2. Manda o pacote com o nome do treino pro Django
      const response = await fetch("http://localhost:8000/api/v1/rotinas/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${TOKEN}`,
        },
        body: JSON.stringify({ nome_rotina: nomeTreino }),
      });

      if (response.ok) {
        const data = await response.json();
        // 3. Guarda o ID gerado (Ex: 15) e abre o segundo modal
        setRotinaId(data.id);
        setOpenDialogconfig(true);
      } else {
        console.error("Erro ao gravar rotina na API");
      }
    } catch (error) {
      console.error("Erro de conexão com o Django:", error);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={handleCancel} maxWidth="sm" fullWidth>
        <DialogTitle>Crie seu treino</DialogTitle>

        <DialogContent dividers>
          <Typography sx={{ mb: 1 }}>Nome do treino</Typography>
          <TextField
            fullWidth
            placeholder="Ex: Treino de peito"
            sx={{ mb: 3 }}
            value={nomeTreino}
            onChange={(e) => setNomeTreino(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCancel}>Cancelar</Button>
          <Button variant="contained" onClick={handleContinuar}>
            Continuar
          </Button>
        </DialogActions>
      </Dialog>

      {openDialogconfig && (
        <DialogConfig
          open={openDialogconfig}
          onClose={() => {
            setOpenDialogconfig(false);
            handleCancel(); // Limpa e fecha as duas janelas quando terminar
          }}
          // Passamos o ID gerado para que o DialogConfig saiba onde jogar os exercícios!
          rotinaId={rotinaId}
          onSuccess={onSuccess}
        />
      )}
    </>
  );
}