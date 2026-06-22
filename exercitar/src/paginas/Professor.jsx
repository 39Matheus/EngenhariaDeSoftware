import * as React from "react";
import { useNavigate } from "react-router-dom";

import AppBarComponent from "../components/AppBar";

export default function Professor() {

  return (
    <>
      <AppBarComponent /> 
      <h1 center = "true">Área do Professor</h1>
      <p>Aqui você pode criar, editar e deletar os treinos dos seus alunos.</p>
    </>
  );
}