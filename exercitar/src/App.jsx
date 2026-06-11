/*App.jsx*/
import { useState } from 'react'
import { BrowserRouter, Routes, Route,Link } from 'react-router-dom' 
import Login from "./paginas/login"
import Cadastro from "./paginas/Cadastro"
import Home from "./paginas/home"



function App() {
  const [count, setCount] = useState(0)

  return (

    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
