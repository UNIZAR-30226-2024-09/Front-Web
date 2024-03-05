import React from 'react';
import RegistroCorreo from "./components/register_1";
import Chat from "./MusifyChat";
import RegistroClave from "./paginas/registro_clave/registro_clave";
import RegistroInfo from "./paginas/registro_info/registro_info";
import LoginForm from './components/LoginForm';
import PantallaInicio from "./Musify_inicio";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Musify from "./Musify"

export default class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/registro_correo" element={<RegistroCorreo />} />
          <Route path="/registro_clave" element={<RegistroClave />} />
          <Route path="/registro_info" element={<RegistroInfo />} />
          <Route path="/musify" element={<Musify />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/inicio" element={<PantallaInicio />} />
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </BrowserRouter>
    );  
  }
}
