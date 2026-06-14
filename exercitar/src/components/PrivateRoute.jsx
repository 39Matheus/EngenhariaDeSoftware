import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
  // O guarda verifica se a chave "token" existe no navegador
  const isAuthenticated = localStorage.getItem("token");

  // Se existir, ele deixa a página carregar (renderiza os 'children').
  // Se não existir, ele redireciona o usuário para a rota "/" (Login).
  return isAuthenticated ? children : <Navigate to="/" />;
}