import React from 'react';
import LoginForm from './components/LoginForm';
import RegisterMail from "./components/register_1";
import RegisterPasswd from "./components/register_2";
import RegisterInfo from "./components/register_3";
import Asistencia from "./components/asistencia";
import Busqueda from "./Musify_busqueda";
import Chat from "./MusifyChat";
import PantallaInicio from "./Musify_inicio";
import Preguntas from "./components/Preguntas";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Musify from "./Musify";

export default class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/register_1" element={<RegisterMail />} />
          <Route path="/register_2" element={<RegisterPasswd />} />
          <Route path="/register_3" element={<RegisterInfo />} />
          <Route path="/musify" element={<Musify />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/inicio" element={<PantallaInicio />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/asistencia" element={<Asistencia />} />
          <Route path="/busqueda" element={<Busqueda />} />
          <Route path="/faq" element={<Preguntas />} />
        </Routes>
      </BrowserRouter>
    );  
  }
}
