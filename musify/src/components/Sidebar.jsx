import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Link } from 'react-router-dom';
import { IoLibrary, IoChatbubblesOutline } from "react-icons/io5";
import { IoMdSettings, IoIosAddCircleOutline } from "react-icons/io";
import { MdHomeFilled, MdSearch, MdFavorite } from "react-icons/md"; // Assume MdFavorite is the star icon

export default function Sidebar() {
    const [playlists, setPlaylists] = useState([]);
    const [message, setMessage] = useState("");  // State to store message if no playlists

    useEffect(() => {
        const fetchPlaylists = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/listarPlaylistsUsuario/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ correo: 'zineb@gmail.com' })
                });
                const data = await response.json();
                if (response.ok) {
                    if (data.playlists) {
                        setPlaylists(data.playlists);
                        setMessage("");
                    } else {
                        setMessage(data.message || "No playlists available.");
                        setPlaylists([]);
                    }
                } else {
                    console.error('Failed to fetch playlists');
                    setMessage("Failed to fetch playlists.");
                }
            } catch (error) {
                console.error('Error fetching playlists:', error);
                setMessage("Error fetching playlists.");
            }
        };

        fetchPlaylists();
    }, []);

    return (
        <Container>
            <div className="top__links">
                <ul>
                    <li>
                        <IoMdSettings />
                        <span>Configuración</span>
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
                    <div className="separator"></div>
                    <li>
                        <IoLibrary />
                        <span>Biblioteca</span>
                        <div className="icon-container">
                            <Link to="/añadir-playlist" className="icon-link">
                                <IoIosAddCircleOutline />
                            </Link>
                        </div>
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
