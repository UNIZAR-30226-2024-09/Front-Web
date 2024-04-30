import React, { useState, useEffect } from "react";
import styled from 'styled-components';
import { FaListAlt, FaHeart, FaPlayCircle } from 'react-icons/fa';
import PerfilIcon from '../panda2.jpg'; 
import { useParams, Link } from 'react-router-dom';
import Modal from '../agnadirCancionPlaylistModal/agnadirCancion';


export default function PerfilAmigoBody () {
    const { correoAmigo } = useParams();
    const [amigo, setAmigo] = useState({});
    const [siguiendo, setSiguiendo] = useState(false);
    const [seguidores, setSeguidores] = useState([]);
    const [seguidos, setSeguidos] = useState([]);
    const [showSeguidoresModal, setShowSeguidoresModal] = useState(false);
    const [showSeguidosModal, setShowSeguidosModal] = useState(false);
    const [numSeguidores, setNumSeguidores] = useState(0);
    const [numSeguidos, setNumSeguidos] = useState(0);
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
            fetchUsuario();
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

    const toggleSeguir = () => {
        setSiguiendo(!siguiendo);
    };


    const fetchUsuario = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/devolverUsuario/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ correo: correoAmigo })
            });
            const data = await response.json();
            if (response.ok) {
                if (data.usuario) {
                    setAmigo(data.usuario);
                    fetchPlaylists(data.usuario.correo)
                    fetchSeguidores(data.usuario.correo)
                    fetchSeguidos(data.usuario.correo)
                    //checkEsSeguido(data.usuario.correo)
                }
            } else {
                console.error('Failed to fetch user:', data);
            }
        } catch (error) {
            console.error('Error fetching user details:', error);
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
    
    /*const checkEsSeguido = async (amigo) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/esSeguido/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ correo : email, amigo : amigo}) // Pasa el ID del amigo al backend para verificar
            });
            const data = await response.json();
            if (response.ok) {
                setSiguiendo(data.sigue); // Actualiza el estado de "siguiendo" basado en la respuesta del backend
            } else {
                console.error('Failed to check if user follows friend:', data);
            }
        } catch (error) {
            console.error('Error checking if user follows friend:', error);
        }
    };*/

    return (
        <PerfilContainer>
            <ProfileIcon src={PerfilIcon} alt="Icono de perfil" />
            <NombreUsuario>{amigo && amigo.nombre}</NombreUsuario>
            <SeguidosYSeguidoresContainer>
                <SeguidosYSeguidoresButton onClick={() => setShowSeguidosModal(true)}>
                    Seguidos {numSeguidos}
                </SeguidosYSeguidoresButton>

                <SeguidosYSeguidoresButton onClick={() => setShowSeguidoresModal(true)}>
                    Seguidores {numSeguidores}
                </SeguidosYSeguidoresButton>
            </SeguidosYSeguidoresContainer>
            {showSeguidosModal && (
            <Modal title="Usuarios a los que sigue" onClose={() => setShowSeguidosModal(false)}>
              <ul>
                {seguidos.map((seguido, index) => (
                  <Link key={index} to={`/perfil_amigo/${seguido.miUsuarioSeguido}`} className="link">
                    <UsuarioItem key={index}>{seguido.seguido}</UsuarioItem>
                  </Link>
                ))}
              </ul>
            </Modal>
          )}

          {showSeguidoresModal && (
            <Modal title="Usuarios que le siguen" onClose={() => setShowSeguidoresModal(false)}>
              <ul>
                {seguidores.map((seguidor, index) => (
                  <UsuarioItem key={index}>{seguidor.miUsuarioSeguidor}</UsuarioItem>
                ))}
              </ul>
            </Modal>
          )}

            <SeguidoresYSeguidos />
            {/*<ListasTitulo>Sus listas</ListasTitulo>
            <ListasContainer key={playlists}>
                {playlists.map((playlist, index) => (
                <Link key={index} to={`/musify/${playlist.id}`} className="link">
                    <Lista>
                    <div>{playlist && playlist.nombre}</div>
                    </Lista>
                </Link>
                ))}
            </ListasContainer>
            
            <BotonSeguir onClick={toggleSeguir}>
                {siguiendo ? "Siguiendo" : "Seguir"}
            </BotonSeguir>
            {(siguiendo || amigo.esPublico) && <ListasUsuario listas={usuarioPredeterminado.listas} />}
            {(!siguiendo && !usuarioPredeterminado.esPublico) && <p>Este perfil es privado. Sigue a este usuario para ver sus listas.</p>}*/}
            <BotonSeguir onClick={toggleSeguir}>
                {siguiendo ? "Siguiendo" : "Seguir"}
            </BotonSeguir>
            {((siguiendo || amigo.esPublico) && playlists.length > 0) && (
                <>
                    <ListasTitulo>Sus listas</ListasTitulo>
                    <ListasContainer>
                        {playlists.map((playlist, index) => (
                            <Link key={index} to={`/musify/${playlist.id}`} className="link">
                                <Lista>
                                    <div>{playlist.nombre}</div>
                                </Lista>
                            </Link>
                        ))}
                    </ListasContainer>
                </>
            )}
            {(!siguiendo && !amigo.esPublico && playlists.length === 0) && (
                <p>Este perfil es privado o no tiene listas públicas.</p>
            )}
            
        </PerfilContainer>
    );
}


// Estilos aquí
const PerfilContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
`;

const ProfileIcon = styled.img`
    width: 230px;
    height: 230px;
    border-radius: 50%;
    margin-bottom: 20px;
`;

const NombreUsuario = styled.div`
    font-size: 48px;
    font-weight: bold;
    color: white;
    margin-bottom: 20px;
`;

const SeguidoresYSeguidos = styled.div`
    display: flex;
    justify-content: center;
    gap: 10px;
    font-size: 16px;
    color: white;
    margin-bottom: 20px; // Espacio antes de la sección de listas
`;

const BotonSeguir = styled.button`
    border: none;
    background-color: #1db954;
    color: white;
    padding: 10px 20px;
    border-radius: 20px;
    cursor: pointer;
    margin-bottom: 20px;
    &:hover {
        background-color: #17a849;
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

const Seguidores = styled.div``;

const Seguidos = styled.div``;

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

const ListasTitulo = styled.h2`
    font-size: 20px;
    margin: 20px 0 10px;
    color: white;
`;


/*const Lista = styled.div`
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
`;*/

const UsuarioItem = styled.li`
    padding: 10px;
    cursor: pointer;

    &:hover {
        background-color: #f0f0f0;
    }
`;