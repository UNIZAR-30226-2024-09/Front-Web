import React from 'react';
import './base.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faSearch, faComments, faBars } from '@fortawesome/free-solid-svg-icons';

function App() {
  return (
    <div className="App">
      <div className="background">
        <div className="contenedor-izquierdo">
          <div className="tarjeta-izquierda">
            <div className="iconos-vertical">
              <div className="icono-con-texto">
                <FontAwesomeIcon icon={faHouse} size="lg" /><span>Casa</span>
              </div>
              <div className="icono-con-texto">
                <FontAwesomeIcon icon={faSearch} size="lg" /><span>Buscar</span>
              </div>
              <div className="icono-con-texto">
                <FontAwesomeIcon icon={faComments} size="lg" /><span className="texto-icono">Chat</span>
              </div>
            </div>
          </div>
          <div className="tarjeta-izquierda-abajo">
          <div className="iconos-vertical">
              <div className="icono-con-texto">
                <FontAwesomeIcon icon={faBars} size="lg" /><span className="texto-icono">Biblioteca</span>
              </div>
              <div className="filtro-ovalo" onClick={() => console.log('Listas')}>Listas</div>
              <div className="filtro-ovalo" onClick={() => console.log('Álbumes')}>Álbumes</div>
              <div className="filtro-ovalo" onClick={() => console.log('Artistas')}>Artistas</div>
            </div>
          </div>
        </div>
        <div className="tarjeta-derecha">
            Tarjeta Derecha
        </div>
      </div>
      <div className="barra-inferior"></div>
      
      </div>
  );
}

export default App;
