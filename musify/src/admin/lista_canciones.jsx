import React, { useState } from "react";
import styled from "styled-components";
import { FaSearch, FaCog, FaClock } from "react-icons/fa";

const canciones = [
    {
      id: 1,
      name: "Canción 1",
      artist: "Artista 1",
      album: "Álbum 1",
      duration: "3:45",
      imageUrl: "/imagenes/prueba.jpg",
    },
    {
      id: 2,
      name: "Canción 2",
      artist: "Artista 2",
      album: "Álbum 2",
      duration: "4:05",
      imageUrl: "/imagenes/prueba.jpg",
    },
    {
        id: 3,
        name: "Canción 3",
        artist: "Artista 3",
        album: "Álbum 3",
        duration: "4:05",
        imageUrl: "/imagenes/prueba.jpg",
    },
    {
        id: 4,
        name: "Canción 5",
        artist: "Artista 4",
        album: "Álbum 4",
        duration: "4:05",
        imageUrl: "/imagenes/prueba.jpg",
    },
    {
        id: 5,
        name: "Canción 5",
        artist: "Artista 5",
        album: "Álbum 5",
        duration: "4:05",
        imageUrl: "/imagenes/prueba.jpg",
    },
];


export default function ListaCancionesAdmin() {
    const [busqueda, setBusqueda] = useState("");

    // Función para filtrar las canciones
    const cancionesFiltradas = canciones.filter(cancion =>
        cancion.name.toLowerCase().includes(busqueda.toLowerCase()) ||
        cancion.artist.toLowerCase().includes(busqueda.toLowerCase())
    );
    return(
        <>
            <Container>
                <div className="search__bar">
                    <FaSearch />
                    <input 
                        type="text" 
                        placeholder="Buscar canciones por nombre, artista..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                    />
                </div>
                <Table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Título</th>
                            <th>Álbum</th>
                            <th><FaClock /></th>
                            <th>Editar</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cancionesFiltradas.map(cancion => (
                            <tr key={cancion.id}>
                                <td>{cancion.id}</td>
                                <td>
                                    <div className="cancion__details">
                                        <img src={cancion.imageUrl} alt={cancion.name} />
                                        <div>
                                            <div className="cancion__title">{cancion.name}</div>
                                            <div className="cancion__artist">{cancion.artist}</div>
                                        </div>
                                    </div>
                                </td>
                                <td>{cancion.album}</td>
                                <td>{cancion.duration}</td>
                                <FaCog className="cancion__settings" />
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Container>
        </>
    );
}

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px;
    .search__bar{
        background-color: white;
        width: 1000px;
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
            
        }
    }
`;

const Table = styled.table`
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    margin-top: 20px;
    border-radius: 10px;
    overflow: hidden;
  th, td {
    padding: 8px;
    text-align: left;
  }
  th {
    color: #fff;
    font-weight: bold;
  }
  .cancion__title {
    font-weight: bold;
  }
  .cancion__artist {
    color: #555;
    font-style: italic;
  }
  .cancion__settings {
    cursor: pointer;
  }
  .cancion__details {
    display: flex;
    align-items: center;
    img {
      width: 50px;
      height: 50px;
      object-fit: cover;
      border-radius: 5px;
      margin-right: 10px;
    }
    div {
        display: flex;
        flex-direction: column;
        div {
          margin-bottom: 2px;
        }
    }
  }
  tbody tr {
    border-bottom: 1px solid #ddd;
  }
`;