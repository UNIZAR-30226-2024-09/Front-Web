import React from 'react';
import inicio_sesion from "./componentes/inicio_sesion/inicio_sesion";
import { BrowserRouter, Route, Routes} from "react-router-dom";

export default class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/iniciarSesion" element={<inicio_sesion />} />
        </Routes>
      </BrowserRouter>
    );  
  }
}
