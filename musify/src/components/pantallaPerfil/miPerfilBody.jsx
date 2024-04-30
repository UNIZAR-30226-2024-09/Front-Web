import React from 'react';
import styled from 'styled-components';
import ProfileIcon from '../panda.jpg';
import { useState, useEffect } from 'react';
import Modal from '../agnadirCancionPlaylistModal/agnadirCancion';
import { Link } from 'react-router-dom';

export default function Body_perfil() {
    const [seguidores, setSeguidores] = useState([]);
    const [seguidos, setSeguidos] = useState([]);
    const [numSeguidores, setNumSeguidores] = useState(0);
    const [numSeguidos, setNumSeguidos] = useState(0);
    const [showSeguidoresModal, setShowSeguidoresModal] = useState(false);
    const [showSeguidosModal, setShowSeguidosModal] = useState(false);
    const [usuario, setUsuario] = useState();
    const [playlists, setPlaylists] = useState([]);

    useEffect(() => {
        const fetchUserDetails = async () => {
        const token = localStorage.getItem('userToken');
        try {
          const response = await fetch('http://127.0.0.1:8000/obtenerUsuarioSesionAPI/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              token: token,
            }),
          });
          const data = await response.json();
          if (response.ok) {
            const email = data.correo;
            fetchSeguidores(email);
            fetchSeguidos(email);
            fetchUsuario(email);
            fetchPlaylists(email);
          } else {
            console.error('Failed to fetch user details:', data);
          }
        } catch (error) {
          console.error('Error fetching user details:', error);
        }
        };
        
        if (localStorage.getItem('userToken')) {
          fetchUserDetails();
        }
      }, []);

    const fetchUsuario = async (email) => {
        const response = await fetch(`http://127.0.0.1:8000/devolverUsuario/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ correo: email })
            });
        const data = await response.json();
        console.log("Respuesta del servidor:", data);
        if (response.ok) {
            if (data.usuario) {
                console.log("Usuario recibido:", data.usuario);
                setUsuario(data.usuario);
            }
        } else {
            console.error('Failed to fetch user:', data);
        }
    };
                
    const fetchPlaylists = async (email) => {
        const response = await fetch(`http://127.0.0.1:8000/listarPlaylistsUsuario/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ correo: email })
        });
        const data = await response.json();
        if (response.ok) {
            console.log("Playlists recibidas:", data.playlists);
            setPlaylists(data.playlists || []);
        } else {
            console.error('Failed to fetch playlists:', data);
        }
    };
    

    const fetchSeguidores = async (email) => {
        const response = await fetch(`http://127.0.0.1:8000/listarSeguidores/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ correo: email })
        });
        const data = await response.json();
        if (response.ok) {            
            setSeguidores(data.seguidores || []);
            setNumSeguidores(data.numSeguidores || 0);
        } else {
            console.error('Failed to fetch seguidores:', data);
        }
    };

    const fetchSeguidos = async (email) => {
        const response = await fetch(`http://127.0.0.1:8000/listarSeguidos/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ correo: email })
        });
        const data = await response.json();
        if (response.ok) {
            setSeguidos(data.seguidos || []);
            setNumSeguidos(data.numSeguidos || 0);
        } else {
            console.error('Failed to fetch seguidos:', data);
        }
    };
    

    return (
        <PerfilContainer>
            <PerfilIcon src={ProfileIcon} alt="Icono de perfil" />
            <NombreUsuario>{usuario && usuario.nombre}</NombreUsuario>
      
            <SeguidosYSeguidoresContainer>
                <SeguidosYSeguidoresButton onClick={() => setShowSeguidosModal(true)}>
                    Seguidos {numSeguidos}
                </SeguidosYSeguidoresButton>

                <SeguidosYSeguidoresButton onClick={() => setShowSeguidoresModal(true)}>
                    Seguidores {numSeguidores}
                </SeguidosYSeguidoresButton>
            </SeguidosYSeguidoresContainer>
      
          {showSeguidosModal && (
            <Modal title="Usuarios a los que sigues" onClose={() => setShowSeguidosModal(false)}>
              <ul>
                {seguidos.map((seguido, index) => (
                  <Link key={index} to={`/perfilAmigo/${seguido.seguido}`} className="link">
                    <UsuarioItem key={index}>{seguido.seguido}</UsuarioItem>
                  </Link>
                ))}
              </ul>
            </Modal>
          )}

          {showSeguidoresModal && (
            <Modal title="Usuarios que te siguen" onClose={() => setShowSeguidoresModal(false)}>
              <ul>
                {seguidores.map((seguidor, index) => (
                  <Link key={index} to={`/perfilAmigo/${seguidor.seguidor}`} className="link">
                    <UsuarioItem key={index}>{seguidor.seguidor}</UsuarioItem>
                  </Link>
                ))}
              </ul>
            </Modal>
          )}
      
          <SeguidoresYSeguidos />
          <ListasTitulo>Mis listas</ListasTitulo>
          <ListasContainer key={playlists}>
            {playlists.map((playlist, index) => (
              <Link key={index} to={`/musify/${playlist.id}`} className="link">
                <Lista>
                  <div>{playlist && playlist.nombre}</div>
                </Lista>
              </Link>
            ))}
          </ListasContainer>
        </PerfilContainer>
      );      
}
const PerfilContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
`;

const PerfilIcon = styled.img`
    width: 230px;
    height: 230px;
    border-radius: 50%;
    margin-bottom: 20px;
`;

const NombreUsuario = styled.div`
    font-size: 48px;
    font-weight: bold;
    color: white;
    margin-bottom: 20px; // Espacio entre el nombre de usuario y seguidores/seguidos
`;

const SeguidoresYSeguidos = styled.div`
    display: flex;
    justify-content: center;
    gap: 10px;
    font-size: 16px;
    color: white;
    margin-bottom: 20px; // Espacio antes de la sección de listas
`;


const ListasTitulo = styled.h2`
    font-size: 20px;
    margin: 20px 0 10px;
    color: white;
`;


const Lista = styled.div`
    flex: 0 0 calc(33.33% - 80px);
    height: auto;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 40px;
    transition: transform 0.3s ease-in-out;
    border: 1px solid #0f3460;
    background-color: #0f3460;
    color: white;
    &:hover {
        transform: translateY(-10px);
        background: #16213E;
    }
`;

const UsuarioItem = styled.li`
    padding: 10px;
    cursor: pointer;

    &:hover {
        background-color: #f0f0f0;
    }
`;

const ListasContainer = styled.div`
    text-align: center;
    margin-bottom: 40px;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 20px;
`;

const SeguidosYSeguidoresContainer = styled.div`
  display: flex;
  gap: 10px; /* Espacio entre los botones */
`;

const SeguidosYSeguidoresButton = styled.button`
  background-color: black;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out;

  &:hover {
    background-color: grey;
  }
`;
