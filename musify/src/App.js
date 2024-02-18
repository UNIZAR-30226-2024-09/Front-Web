import React from 'react';
import InicioSesion from "./paginas/inicio_sesion/inicio_sesion";
import { BrowserRouter, Route, Routes } from "react-router-dom";

export default class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/inicio_sesion" element={<InicioSesion />} />
        </Routes>
      </BrowserRouter>
    );  
  }
}
