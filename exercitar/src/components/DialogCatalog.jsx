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

//import DialogConfig from "./DialogConfig";

const TOKEN = localStorage.getItem("token");

// FUNÇÃO PRINCIPAL: DialogCatalog
// Esta é a função principal do componente. Ela controla as janelas (modais)
// onde o usuário escolhe os exercícios, dá um nome ao treino e configura
// as séries e repetições.

export default function DialogCatalog({ open, onClose, onCreateWorkout }) {
  const [openDialogconfig, setOpenDialogconfig] = React.useState(false);
  const [nomeTreino, setNomeTreino] = React.useState("");
  const [rotinaId, setRotinaId] = React.useState(null);

  React.useEffect(() => {
    if (open) {
      // FUNÇÃO: fetchRotina
      // Esta função é responsável por criar uma nova rotina no backend (Django) e
      // obter o ID dessa rotina recém-criada para depois adicionar os exercícios.
      const fetchRotina = async () => {
        try {
          const response = await fetch(
            "http://localhost:8000/api/v1/rotinas/",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Token ${TOKEN}`,
              },
            },
          );
          if (response.ok) {
            const data = await response.json();
            const rotina_id = data.id;
            const rotina_nome = data.nome;
            setRotinaId(rotina_id);
          } else {
            console.error("Erro ao gravar rotina na API");
          }
        } catch (error) {
          console.error("Erro de conexão com o Django:", error);
        }
      };
      fetchRotina();
    }
  }, [open]);

  // =========================================================================
  // FUNÇÃO: handleCancel
  // Acionada quando o usuário clica em "Cancelar". Ela esvazia todos os
  // campos digitados, desmarca os exercícios selecionados e fecha os modais.
  // =========================================================================
  const handleCancel = () => {
    // setSelectedExercises([]);
    //setSearch("");
    setNomeTreino("");
    setOpenDialogconfig(false);
    onClose();
  };

  return (
    <>
      <Dialog open={open} onClose={handleCancel} maxWidth="lg" fullWidth>
        <DialogTitle>Crie seu treino</DialogTitle>

        <DialogContent>
          <Typography sx={{ mb: 1 }}>Nome do treino</Typography>
          <TextField
            fullWidth
            placeholder="Ex: Treino de peito"
            sx={{ mb: 3 }}
            value={nomeTreino}
            onChange={(e) => setNomeTreino(e.target.value)}
          />

          <DialogActions>
            <Button onClick={handleCancel}>Cancelar</Button>
            <Button
              variant="contained"
              onClick={() => setOpenDialogconfig(true)}
            >
              Continuar
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>

      {openDialogconfig && (
        <DialogConfig
          open={openDialogconfig}
          onClose={() => setOpenDialogconfig(false)}
        />
      )}
    </>
  );
}
