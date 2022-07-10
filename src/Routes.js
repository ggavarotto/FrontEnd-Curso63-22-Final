import React from "react";
import { BrowserRouter, Routes, Route, } from 'react-router-dom';
import App from './App';
import Login from './login';


function Rutas() {
    return (
        
        <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="App" element={<App />} />
        </Routes>
      </BrowserRouter>
    
    );
}

export default Rutas;