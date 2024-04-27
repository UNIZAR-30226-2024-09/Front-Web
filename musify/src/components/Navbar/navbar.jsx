import React, { useState } from "react";
import styled from "styled-components";
import { FaSearch } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";


const base64ToAudioSrc = (base64) => {
  console.log("Base64 original:", base64); // Imprimir la base64 original

    // Eliminar cualquier prefijo incorrecto y asegurar que es el correcto para audio/mp3
    const base64WithoutPrefix = base64.replace(/^data:audio\/mp3;base64,/, '').replace(/^data:[^;]+;base64,/, '');
    const audioSrc = `data:audio/mp3;base64,${atob(base64WithoutPrefix)}`;
    console.log("Audio transformado:", audioSrc); // Imprimir el src del audio transformado

    return audioSrc;
};

export default function Navbar({ onSearch: parentOnSearch }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [artistData, setArtistData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showResults, setShowResults] = useState(false); 

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    setShowResults(false);
    try {
      const response = await fetch('http://127.0.0.1:8000/buscar/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nombre: searchQuery }),
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log("Data from search:", data);  // Agrega esta línea para ver los datos
        if (parentOnSearch) parentOnSearch(data);  
    } else {
        setError("Error al buscar. Por favor, intenta de nuevo.");
    }
    } catch (error) {
      setError("Error al conectar con el servicio. Por favor, verifica tu conexión.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <form className="search__bar" onSubmit={handleSearchSubmit}>
        <FaSearch />
        <input
          type="text"
          placeholder="Artistas, canciones, o podcasts"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </form>
      <div className="avatar">
        <a href="#">
          <CgProfile />
        </a>
      </div>
      {loading && <p>Cargando...</p>}
      {error && <p>{error}</p>}
      {showResults && artistData.map((item, index) => (
        <div key={index}>
          {item.cancion && <p>Canción: {item.cancion.nombre}</p>}
          {item.capitulo && <p>Capítulo: {item.capitulo.nombre}</p>}
          {item.podcast && <p>Podcast: {item.podcast.nombre}</p>}
          {item.artista && <p>Artista: {item.artista.nombre}</p>}
          {item.album && <p>Álbum: {item.album.nombre}</p>}
          {item.playlist && <p>Playlist: {item.playlist.nombre}</p>}
        </div>
      ))}
    </Container>
  );
}

const Container = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 2rem;
    height: 15vh;
    position: sticky;
    top: 0;
    transition: 0.3s ease-in-out;
    background-color: none;
    .search__bar{
        background-color: white;
        width: 30%;
        padding: 0.4rem 1rem;
        border-radius: 2rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        input{
            border: none;
            height: 2rem;
            width: 100%;
            &:focus{
                outline: none;
            }
            .avatar {
                background-color: black;
                padding: 0.3rem 0.4rem;
                padding-right: 1rem;
                border-radius: 2rem;
                display: flex;
                justify-content: center;
                align-items: center;
                a {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: 0.5rem;
                    text-decoration: none;
                    color: white;
                    font-weight: bold;
                    svg {
                        fontsize: 1.3rem;
                        backgroung-color: #282828;
                        padding: 0.2rem;
                        border-radius: 1rem;
                        color: #c7c5c5;
                    }
                }

            }
        }
    }
`;