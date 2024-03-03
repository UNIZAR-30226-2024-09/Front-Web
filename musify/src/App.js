import React from 'react';
import InicioSesion from "./paginas/inicio_sesion/inicio_sesion";
import RegistroCorreo from "./paginas/registro_correo/registro_correo";
import RegistroClave from "./paginas/registro_clave/registro_clave";
import RegistroInfo from "./paginas/registro_info/registro_info";
import LoginForm from './components/LoginForm';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Musify from "./Musify"

export default class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/inicio_sesion" element={<InicioSesion />} />
          <Route path="/registro_correo" element={<RegistroCorreo />} />
          <Route path="/registro_clave" element={<RegistroClave />} />
          <Route path="/registro_info" element={<RegistroInfo />} />
          <Route path="/musify" element={<Musify />} />
          <Route path="/login" element={<LoginForm />} />
        </Routes>
      </BrowserRouter>
    );  
  }
}
