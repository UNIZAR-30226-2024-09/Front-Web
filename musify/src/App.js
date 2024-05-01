import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { UserProvider } from './components/UserContext/userContext';
import LoginForm from './components/pantallaInicioSesion/inicioSesion';
import RegisterMail from './components/pantallasRegistro/registro1';
import RegisterPasswd from './components/pantallasRegistro/registro2';
import RegisterInfo from './components/pantallasRegistro/registro3';
import Asistencia from './components/pantallaConfiguracion/configuracion';
import Profile from './components/pantallaEditarPerfil/editarPerfil';
import Busqueda from './components/pantallaBuscar/buscar';
import Chat from './components/pantallaChat/chat';
import Perfil from './components/pantallaPerfil/miPerfil';
import PerfilA from './components/pantallaPerfilAmigo/perfilAmigo';
import Salas from './components/pantallaSalas/salasChat';
import PantallaInicio from './components/pantallaInicial/inicio';
import Musify from './components/pantallaPlaylist/playlist';
import MusifyP from './components/pantallaPodcast/podcasts';
import MusifyC from './components/pantallaCanciones/canciones';
import Preguntas from './components/pantallaPreguntasFAQ/preguntas';
import Ayuda from './components/pantallasAyuda/ayudaCuenta';
import Ayuda2 from './components/pantallasAyuda/ayudaAplicacion';
import Ayuda3 from './components/pantallasAyuda/ayudaSeguridad';
import Reportar from './components/pantallaReporte/reportar';
import Cola from './components/pantallaCola/colaReproducción';
import IniAdmin from './admin/inicio_admin';
import ListaCancionesAdmin from './admin/lista_canciones';
import EditarCancionAdmin from './admin/editar_cancion';
import AniadirCancionAdmin from './admin/aniadir_cancion';
import ListaPodcastAdmin from './admin/lista_podcasts';
import AniadirPodcastAdmin from './admin/aniadir_podcast';
import EditarPodcastAdmin from './admin/editar_podcast';
import AniadirCapituloAdmin from './admin/aniadir_capitulo';
import EditarCapAdmin from './admin/editar_capitulo';
import Historial from './components/pantallaHistorial/historialReproducción';

export default class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <UserProvider>
          <Routes>
            <Route path="/register_1" element={<RegisterMail />} />
            <Route path="/register_2" element={<RegisterPasswd />} />
            <Route path="/register_3" element={<RegisterInfo />} />
            <Route path="/musify/:playlistId" element={<Musify />} />
            <Route path="/perfilAmigo/:correoAmigo" element={<PerfilA />} />
            <Route path="/musifyp/:podcastId" element={<MusifyP />} />
            <Route path="/musifyc/:cancionId" element={<MusifyC />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/inicio" element={<PantallaInicio />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/asistencia" element={<Asistencia />} />
            <Route path="/busqueda" element={<Busqueda />} />
            <Route path="/perfil" element={<Profile />} />
            <Route path="/preguntas" element={<Preguntas />} />
            <Route path="/ayuda_cuenta" element={<Ayuda />} />
            <Route path="/ayuda_aplicacion" element={<Ayuda2 />} />
            <Route path="/ayuda_seguridad" element={<Ayuda3 />} />
            <Route path="/problemas" element={<Reportar />} />
            <Route path="/miPerfil" element={<Perfil />} />
            <Route path="/salas" element={<Salas />} />
            <Route path="/cola" element={<Cola />} />
            <Route path="/ini_admin" element={<IniAdmin />} />
            <Route path="/lista_canciones_admin" element={<ListaCancionesAdmin />} />
            <Route path="/editar_cancion/:cancionId" element={<EditarCancionAdmin />} />
            <Route path="/aniadir_cancion" element={<AniadirCancionAdmin />} />
            <Route path="/lista_podcast_admin" element={<ListaPodcastAdmin />} />
            <Route path="/aniadir_podcast" element={<AniadirPodcastAdmin />} />
            <Route path="/editar_podcast/:idPodcast" element={<EditarPodcastAdmin />} />
            <Route path="/aniadir_capitulo" element={<AniadirCapituloAdmin />} />
            <Route path="/editar_capitulo/:idCap" element={<EditarCapAdmin />} />
            <Route path="/historial" element={<Historial />} />
            <Route path="/historial/:correo" element={<Historial />} />

          </Routes>
        </UserProvider>
      </BrowserRouter>
    );
  }
}
