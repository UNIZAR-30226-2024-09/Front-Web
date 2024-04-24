import React, { useState } from "react";
import styled from "styled-components";
import { FaSearch, FaCog, FaClock } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

const podcast = [
    {
      id: 1,
      name: "Podcast 1",
      presentador: "Presentador 1",
      fecha: "Fecha 1",
      cap: "2",
      imageUrl: "/imagenes/prueba.jpg",
    },
    {
        id: 2,
        name: "Podcast 2",
        presentador: "Presentador 2",
        fecha: "Fecha 2",
        cap: "3",
        imageUrl: "/imagenes/prueba.jpg",
    },
];


export default function ListaPodcastsAdmin() {
    const navigate = useNavigate();
    const [busqueda, setBusqueda] = useState("");

    // Función para filtrar las canciones
    const podcastFiltrados = podcast.filter(podcast =>
        podcast.name.toLowerCase().includes(busqueda.toLowerCase()) ||
        podcast.presentador.toLowerCase().includes(busqueda.toLowerCase())
    );

    const handleEdicion = () => {
        
    };

    return(
        <>
            <Container>
                <div className="search__bar">
                    <FaSearch />
                    <input 
                        type="text" 
                        placeholder="Buscar podcast por nombre, autor..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                    />
                </div>
                <Table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Título</th>
                            <th>Fecha</th>
                            <th>Capítulos</th>
                            <th>Editar</th>
                        </tr>
                    </thead>
                    <tbody>
                        {podcastFiltrados.map(podcast => (
                            <tr key={podcast.id}>
                                <td>{podcast.id}</td>
                                <td>
                                    <div className="podcast__details">
                                        <img src={podcast.imageUrl} alt={podcast.name} />
                                        <div>
                                            <div className="podcast__title">{podcast.name}</div>
                                            <div className="podcast__author">{podcast.presentador}</div>
                                        </div>
                                    </div>
                                </td>
                                <td>{podcast.fecha}</td>
                                <td>{podcast.cap}</td>
                                <FaCog 
                                    className="podcast__settings" 
                                    
                                />
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
  .podcast__title {
    font-weight: bold;
  }
  .podcast__author {
    color: #555;
    font-style: italic;
  }
  .podcast__settings {
    cursor: pointer;
  }
  .podcast__details {
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