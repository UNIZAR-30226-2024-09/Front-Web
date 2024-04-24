import React, { useState } from "react";
import styled, { createGlobalStyle } from "styled-components";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Card from "./components/Cards";

const base64ToImageSrc = (base64) => {
    console.log("Base64 original:", base64); // Imprimir la base64 original
  
    // Eliminar el prefijo de la cadena base64 si está presente
    const base64WithoutPrefix = base64.replace(/^data:image\/[a-z]+;base64,/, '');
    console.log("Base64 sin prefijo:", base64WithoutPrefix); // Imprimir la base64 sin prefijo
  
    // Decodificar la cadena base64
    const byteCharacters = atob(base64WithoutPrefix);
    console.log("Caracteres de bytes:", byteCharacters); // Opcional: Imprimir los caracteres después de atob
    const imageSrc = `data:image/jpeg;base64,${atob(base64WithoutPrefix)}`;
    console.log("Imagen transformada:", imageSrc); // Imprimir el src de la imagen transformada
    return imageSrc;
  };
  

export default function Musify(){
    const [showSearchResults, setShowSearchResults] = useState(false);
    const [searchResults, setSearchResults] = useState([]);

    const handleSearch = (results) => {
        console.log("Search results received in Musify:", results); // Verifica los resultados recibidos
        setSearchResults(results);
        setShowSearchResults(true);
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
                            {
                                showSearchResults ? (
                                    <div>
                                        {searchResults.map((item, index) => (
                                            <ResultContainer key={index}>
                                                {item.artista && (
                                                    <>
                                                        <ArtistImage src={base64ToImageSrc(item.artista.foto)} alt={item.artista.nombre} />
                                                        <p>Artista: {item.artista.nombre}</p>
                                                        <p>Descripción: {item.artista.descripcion}</p>
                                                    </>
                                                )}
                                                {item.cancion && <p>Canción: {item.cancion.nombre}</p>}
                                                {item.album && <p>Álbum: {item.album.nombre}</p>}
                                            </ResultContainer>
                                        ))}
                                    </div>
                                ) : (
                                    <Card />
                                )
                            }
                        </div>
                    </div>
                </div>
                <div className="musify__footer">
                    <Footer />
                </div>
            </MusifyContainer>
        </>
    );
}

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
