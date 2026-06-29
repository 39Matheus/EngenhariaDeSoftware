import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'; 
import { CssBaseline, GlobalStyles } from '@mui/material';
import MeuAppBar from './components/AppBar';
import PrivateRoute from "./components/PrivateRoute";

import Login from "./paginas/login";
import Cadastro from "./paginas/Cadastro";
import Home from "./paginas/home";
import Professor from "./paginas/Professor";

// 1. Criamos um componente de Layout interno aqui mesmo (ou em outro arquivo)
function Navbar() {
  return (
    <>
      <MeuAppBar />
      <div className="App">
        {/* O Outlet é onde as páginas (Home, Professor, etc) vão "encaixar" abaixo do AppBar */}
        <Outlet />
      </div>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <CssBaseline />
      <GlobalStyles styles={{ 
        'html, body': { margin: 0, padding: 0, width: '100%', height: '100%' },
        '#root': { margin: 0, padding: 0, width: '100%', maxWidth: 'none' } 
      }} />

      <Routes>
        {/* ROTAS SEM APPBAR (Públicas) */}
        <Route path="/" element={<Login />} />

        {/* ROTAS COM APPBAR (Envolvidas pelo LayoutComNavbar) */}
        <Route element={<Navbar />}>
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
          <Route path="/Professor" element={<PrivateRoute><Professor /></PrivateRoute>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;