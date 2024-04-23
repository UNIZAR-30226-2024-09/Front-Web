import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Link } from 'react-router-dom';
import { IoLibrary, IoChatbubblesOutline } from "react-icons/io5";
import { IoMdSettings } from "react-icons/io";
import { MdHomeFilled, MdSearch, MdAdd } from "react-icons/md";

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
                <div className="logo">
                    {}
                </div>
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
                        <Link to="/añadir-playlist" className="link">
                            <MdAdd />
                        </Link>
                    </li>
                    <ButtonContainer>
                    <ButtonStyled>Playlists</ButtonStyled>
                    <ButtonStyled>Album</ButtonStyled>
                    <ButtonStyled>Artista</ButtonStyled>
                </ButtonContainer>
                {playlists.length > 0 ? (
                    playlists.map((playlist) => (
                        <StyledListItem key={playlist.id}>
                            <Link to={`/musify/${playlist.id}`}>{playlist.nombre}</Link>
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


const ButtonContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    margin-top: none;
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
            gap: 1rem;
            cursor: pointer;
            transition: 0.3s ease-in-out;
            &:hover {
                color: white;
            }

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
        gap: 1rem;
        text-decoration: none;
        color: inherit;
      }
`;

const ButtonStyled = styled.button`
    width: 90px;
    height: 40px;
    border: none;
    outline: none;
    border-radius: 40px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 700;
    background: #575151;
    color: #fff;
    box-shadow: 0 0 10px rgba(0,0,0, .1);
    border-radius: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    border: #575151;

    &:hover {
        background: #54b2e7;
        color: #fff;
    }
`;

const StyledListItem = styled.li`
    background-color: none; 
    padding: 8px 16px;
    margin: 5px 0;
    border-radius: 4px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    color: #ffffff; 

    &:hover {
        background-color: #54b2e7; 
    }
`;
