import React from 'react';
import InicioSesion from "./paginas/inicio_sesion/inicio_sesion";
import Base from "./componentes/base";
import RegistroCorreo from "./paginas/registro_correo/registro_correo";
import RegistroClave from "./paginas/registro_clave/registro_clave";
import RegistroInfo from "./paginas/registro_info/registro_info";
import { BrowserRouter, Route, Routes } from "react-router-dom";

export default class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/inicio_sesion" element={<InicioSesion />} />
          <Route path="/base" element={<Base />} />
          <Route path="/registro_correo" element={<RegistroCorreo />} />
          <Route path="/registro_clave" element={<RegistroClave />} />
          <Route path="/registro_info" element={<RegistroInfo />} />
        </Routes>
      </BrowserRouter>
    );  
  }
}
