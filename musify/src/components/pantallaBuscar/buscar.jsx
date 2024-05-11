import React, { useState} from "react";
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

    const handleSearch = (results) => {
        const mappedResults = results.map(item => {
            let imageUrl = '';
            if (item.cancion) {
                imageUrl = `http://localhost:8000/imagenCancion/${item.cancion.id}/`;
            } else if (item.podcast) {
                imageUrl = `http://localhost:8000/imagenPodcast/${item.podcast.id}/`;
            } else if (item.album) {
                imageUrl = `http://localhost:8000/imagenAlbum/${item.album.id}/`;
            }
    
            return {
                ...item,
                imageUrl, // Agregar la URL de la imagen al objeto del resultado
            };
        });

    
        console.log("Search results received in Musify:", mappedResults);
        setSearchResults(mappedResults);
        setShowSearchResults(true);
    };
    
    const handleClick = (item) => {
        if (item.cancion) {
            navigate(`/musifyc/${item.cancion.id}`);
        } else if (item.podcast) {
            navigate(`/musifyp/${item.podcast.id}`);
        } else if (item.album) {
            navigate(`/musifya/${item.album.id}`);
        }
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
                            {showSearchResults ? (
                                <div>
                                    {searchResults.map((item, index) => (
                                        <ResultContainer key={index}>
                                            {item.imageUrl && (
                                                <ArtistImage
                                                    src={item.imageUrl}
                                                    alt={item.cancion ? item.cancion.nombre : item.podcast ? item.podcast.nombre : item.album.nombre}
                                                    onClick={() => handleClick(item)}
                                                />
                                            )}
                                            {/* Más información del item... */}
                                        </ResultContainer>
                                    ))}
                                </div>
                            ) : (
                                <Card />
                            )}
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
