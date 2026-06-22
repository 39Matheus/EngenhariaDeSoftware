/*App.jsx*/
import { useState } from 'react'
import { BrowserRouter, Routes, Route,Link } from 'react-router-dom' 
import Login from "./paginas/login"
import Cadastro from "./paginas/Cadastro"
import Home from "./paginas/home"
import PrivateRoute from "./components/PrivateRoute"
import Professor from "./paginas/professor"



function App() {
  const [count, setCount] = useState(0)

  return (

    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
          <Route path="/Professor" element={<PrivateRoute><Professor /></PrivateRoute>} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
