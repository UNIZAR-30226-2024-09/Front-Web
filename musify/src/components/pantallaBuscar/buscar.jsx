import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import styled, { createGlobalStyle } from "styled-components";
import Sidebar from "../Sidebar/sidebar";
import Navbar from "../Navbar/navbar";
import Footer from "../Footer/footer";
import Card from "./tarjetasGeneros";

export default function Musify(){
    const navigate = useNavigate();
    const [showSearchResults, setShowSearchResults] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [userSearchResults, setUserSearchResults] = useState([]);
    const [showUserSearchResults, setShowUserSearchResults] = useState(false);
    

    const handleSearch = (results) => {
        const generalResults = [];
        const userResults = [];

        results.forEach(item => {
            if (item.usuario) {
                userResults.push(item);
            } else {
                let imageUrl = '';
                if (item.cancion) {
                    imageUrl = `http://musify.servemp3.com:8000/imagenCancion/${item.cancion.id}/`;
                } else if (item.podcast) {
                    imageUrl = `http://musify.servemp3.com:8000/imagenPodcast/${item.podcast.id}/`;
                } else if (item.album) {
                    imageUrl = `http://musify.servemp3.com:8000/imagenAlbum/${item.album.id}/`;
                }
    
                generalResults.push({
                    ...item,
                    imageUrl,
                });
            }
        });

        console.log("General search results received in Musify:", generalResults);
        console.log("User search results received in Musify:", userResults);
        setSearchResults(generalResults);
        setUserSearchResults(userResults);
        setShowSearchResults(true);
        setShowUserSearchResults(userResults.length > 0);
    };
    
    const handleClick = (item) => {
        if (item.cancion) {
            navigate(`/musifyc/${item.cancion.id}`);
        } else if (item.podcast) {
            navigate(`/musifyp/${item.podcast.id}`);
        } else if (item.album) {
            navigate(`/musifya/${item.album.id}`);
        }
        else if (item.playlist) {
        navigate(`/musify/${item.playlist.id}`); 
    }
    };

    const handleUserClick = (email) => {
        navigate(`/perfilAmigo/${email}`);
    };

    return (
        <>
            <GlobalStyle />
            <MusifyContainer>
                <div className="musify__body">
                    <Sidebar />
                    <div className="body">
                        <Navbar onSearch={handleSearch} />
                        <div className="body__contents">
                        {showUserSearchResults && userSearchResults.map(user => (
                                  <UserResultButton key={user.usuario.id} onClick={() => handleUserClick(user.usuario.correo)}>
                                  Correo: {user.usuario.correo} - Nombre: {user.usuario.nombre}
                              </UserResultButton>
                              
                                ))}
                            {showSearchResults && (
                                searchResults.map((item, index) => (
                                    <ResultContainer key={index}>
                                        {item.imageUrl && (
                                            <ArtistImage
                                                src={item.imageUrl}
                                                alt={item.cancion ? item.cancion.nombre : item.podcast ? item.podcast.nombre : item.album.nombre}
                                                onClick={() => handleClick(item)}
                                            />
                                        )}
                                        {/* More information about the item */}
                                    </ResultContainer>
                                ))
                            )}
                            {!showSearchResults && <Card />}
                        </div>
                    </div>
                </div>
                <div className="musify__footer">
                    <Footer />
                </div>
            </MusifyContainer>
        </>
    );
};

const GlobalStyle = createGlobalStyle`
    body {
        background-color: #f5f5f5;
        color: #111;
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-family: sans-serif;
    }
`;

const MusifyContainer = styled.div`
    max-width: 100vw;
    max-height: 100vh;
    overflow: hidden;
    display: grid;
    grid-template-rows: 85vh 15vh;
    .musify__body {
        display: grid;
        grid-template-columns: 23vw 77vw;
        height: 100%;
        width: 100%;
        background: linear-gradient(transparent, rgba(0,0,0,1));
        background-color: rgb(32, 87, 100);
        .body{
            height: 100%;
            width: 100%; 
            overflow: auto;
        }
    }
`;

const ResultContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
`;

const ArtistImage = styled.img`
    width: 230px;
    height: 230px;
    border-radius: 50%;
    margin-bottom: 20px;
    object-fit: cover;
`;

const UserResultButton = styled.button`
    padding: 10px 15px;
    margin: 10px 0;
    margin-left: 400px;
    margin-top: 150px;
    background-color: #318ce7; /* Green background */
    color: white; /* White text color */
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
        background-color: #45a049; /* Darker green background on hover */
    }
`;