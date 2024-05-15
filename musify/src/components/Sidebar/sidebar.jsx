import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Link, useNavigate } from 'react-router-dom';
import { IoLibrary, IoChatbubblesOutline} from "react-icons/io5";
import { FaPowerOff, FaUser } from "react-icons/fa";
import { IoMdSettings, IoIosAddCircleOutline } from "react-icons/io";
import { MdHomeFilled, MdSearch, MdFavorite } from "react-icons/md";
import PlaylistForm from "../crearPlaylistModal/crearPlaylist";

export default function Sidebar() {
    const [playlists, setPlaylists] = useState([]);
    const [message, setMessage] = useState("");
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const [showForm, setShowForm] = useState(false);


    const handleLogout = async () => {
        const token = localStorage.getItem('userToken');
    
        if (token) {
            try {
                const response = await fetch('http://musify.servemp3.com:8000/cerrarSesionAPI/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ token })
                });
                const data = await response.json();
                if (response.ok) {
                    console.log('Cierre de sesión correcto:', data.message);
                    localStorage.removeItem('userToken');
                    navigate('/login')
                } else {
                    console.error('Error al cerrar sesión:', data.message);
                }
            } catch (error) {
                console.error('Error al realizar la petición de cierre de sesión:', error);
            }
        }
    };
    
    useEffect(() => {
        const fetchUserDetails = async () => {
            const token = localStorage.getItem('userToken');
            try {
                const response = await fetch('http://musify.servemp3.com:8000/obtenerUsuarioSesionAPI/', {
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
                    setUser(data);
                } else {
                    console.error('Failed to fetch user details:', data);
                }
            } catch (error) {
                console.error('Error fetching user details:', error);
            }
        };
    
        if(localStorage.getItem('userToken')) {
            fetchUserDetails();
        }
    }, []);
    

    useEffect(() => {
        if (user && user.correo) {
            const fetchPlaylists = async () => {
                try {
                    const response = await fetch('http://musify.servemp3.com:8000/listarPlaylistsUsuario/', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ correo: user.correo })
                    });
                    const data = await response.json();
                    if (response.ok) {
                        if (data.playlists) {
                            setPlaylists(data.playlists);
                        }
                    } else {
                        console.error('Failed to fetch playlists');
                    }
                } catch (error) {
                    console.error('Error fetching playlists:', error);
                }
            };

            fetchPlaylists();
        }
    }, [user]);

    return (
        <Container>
            <div className="top__links">
                <ul>
                    <li onClick={handleLogout}>
                        <FaPowerOff />
                        <span>Cerrar Sesión</span>
                    </li>
                    <li>
                    <Link to="/asistencia" className="link">
                        <IoMdSettings />
                        <span>Configuración</span>
                    </Link>
                    </li>
                    <li>
                        <Link to="/inicio" className="link">
                            <MdHomeFilled />
                            <span>Inicio</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/busqueda" className="link">
                            <MdSearch />
                            <span>Buscar</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/salas" className="link">
                            <IoChatbubblesOutline />
                            <span>Salas</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/miPerfil" className="link">
                            <FaUser />
                            <span>Mi perfil</span>
                        </Link>
                    </li>
                    <div className="separator"></div>
                    <li>
                        <IoLibrary />
                        <span>Biblioteca</span>
                        <div className="icon-container" onClick={() => setShowForm(true)}>
                <IoIosAddCircleOutline />
            </div>
            {showForm && (
                <PlaylistForm
                    userEmail={user.correo}  // Asegurarse que user tiene un correo
                    onClose={() => setShowForm(false)}
                    onCreate={() => {
                        console.log("Playlist creada exitosamente");
                        // Aquí puedes implementar la recarga de las playlists
                    }}
                />
            )}
                    </li>
                    {playlists.length > 0 ? (
                        playlists.map((playlist, index) => (
                            <StyledListItem key={playlist.id}>
                                <Link to={`/musify/${playlist.id}`} className="link">
                                    {index === 0 ? <MdFavorite color="#b3b3b3" /> : <IoLibrary />}
                                    <span>{playlist.nombre}</span>
                                </Link>
                            </StyledListItem>
                        ))
                    ) : (
                        <li>{message}</li>
                    )}
                </ul>
            </div>
        </Container>
    );
}

const StyledListItem = styled.li`
    display: flex;
    align-items: center;
    padding: 3px 0px;
    margin:0;
    border-radius: 4px;
    color: #b3b3b3;
    &:hover {
        background-color: #54b2e7;
    }
    .link {
        display: flex;
        align-items: center;
        gap: 10px
        color: inherit;
        text-decoration: none;
        width: 100%;
    }
`;

const Container = styled.div`
    background-color: black;
    color: #b3b3b3;
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 350px;
    .top__links {
        display: flex;
        flex-direction: column;
    }
    ul {
        list-style-type: none;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        padding: 1rem;
        li {
            display: flex;
            align-items: center;
            gap: 1rem;
            cursor: pointer;
            transition: 0.3s ease-in-out;
            &:hover {
                color: white;
            }
        }
        .icon-container {
            margin-left: auto;
            display: flex;
            align-items: center;
        }
        .icon-link {
            display: flex;
            align-items: center;
            text-decoration: none;
            color: inherit;
        }
    }
    .separator {
        height: 1px;
        background-color: #fff;
        width: 300px;
        margin: 10px auto;
    }
    .link {
        display: flex;
        align-items: center;
        gap: 1rem;
        text-decoration: none;
        color: inherit;
    }
`;
