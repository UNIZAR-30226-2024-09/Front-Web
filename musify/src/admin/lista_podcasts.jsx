import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { FaCog } from "react-icons/fa";
import { Link } from 'react-router-dom';

const base64ToImageSrc = (base64) => {
    const base64WithoutPrefix = base64.replace(/^data:image\/[a-z]+;base64,/, '');
    const imageSrc = `data:image/jpeg;base64,${atob(base64WithoutPrefix)}`;
    return imageSrc;
};

const getImageSrc = (id) => {
    return `http://localhost:8000/imagenPodcast/${id}`;
};

export default function ListaPodcastsAdmin() {
    const [podcasts, setPodcasts] = useState([]);
    const [presentadores, setPresentadores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [indiceInicio, setIndiceInicio] = useState(0);
    const filasPorGrupo = 3;

    const handleMostrarSiguientesFilas = () => {
        setIndiceInicio(indiceInicio + filasPorGrupo);
    };

    const handleMostrarAnterioresFilas = () => {
        setIndiceInicio(Math.max(indiceInicio - filasPorGrupo, 0));
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await fetch('http://127.0.0.1:8000/listarPodcasts/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    const updatedPodcasts = data.podcasts.map(podcast => ({
                        id: podcast.id,
                        nombre: podcast.nombre,
                        foto: getImageSrc(podcast.id),
                    }));
                    setPodcasts(updatedPodcasts);
                    const fetchPodcastPromises = updatedPodcasts.map(podcast => fetchPresentadores(podcast.id));
                    const podcastsData = await Promise.all(fetchPodcastPromises);
                    const updatedPresentadores = podcastsData.reduce((acc, podcast, index) => {
                        acc[index] = podcast;
                        return acc;
                    }, {});
                    setPresentadores(updatedPresentadores);
                    console.log(updatedPresentadores);
                }else {
                    const errorData = await response.text();
                    throw new Error(errorData || "Error al recibir datos");
                }
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        const fetchPresentadores = async (idPodcast) => {
            try {
                const response = await fetch(`http://127.0.0.1:8000/listarPresentadoresPodcast/`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ podcastId: idPodcast })
                });
                if (!response.ok) throw new Error("Failed to fetch album");
                const podcastData = await response.json();
                console.log(podcastData.presentadores);
                if (podcastData.presentadores && podcastData.presentadores.length > 0) {
                    const nombresPresentadores = podcastData.presentadores.map(presentador => presentador.nombre);
                    return nombresPresentadores;
                } else {
                    return null;
                }
            } catch (error) {
              console.log(error);
                setError(`Failed to fetch album: ${error.message}`);
            }
          };

        fetchData();
    }, []);

    
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return(
        <>
            <Container>
            <Table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Título</th>
                        <th>Presentadores</th>
                        <th>Editar</th>
                    </tr>
                </thead>
                <tbody>
                    {podcasts.slice(indiceInicio, indiceInicio + filasPorGrupo).map((p, index) => (
                        <tr key={p.id}>
                            <td>{indiceInicio + index + 1}</td>
                            <td>
                                <div className="podcast__details">
                                    <img src={p.foto} alt={p.nombre} />
                                    <div className="podcast__title">{p.nombre}</div>
                                </div>
                            </td>
                            <td>
                                <div className="podcast__author">
                                    {presentadores[indiceInicio + index] ? (
                                        presentadores[indiceInicio + index].join(", ")
                                    ) : (
                                        "No hay presentadores disponibles"
                                    )}
                                </div>
                            </td>
                            <td>
                                <Link to={`/editar_podcast/${p.id}`} className="cancion__settings">
                                    <FaCog />
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan="4" className="pagination-buttons">
                            {podcasts.length > indiceInicio + filasPorGrupo && (
                                <button onClick={handleMostrarSiguientesFilas}>Mostrar siguientes</button>
                            )}
                            {indiceInicio > 0 && (
                                <button onClick={handleMostrarAnterioresFilas}>Mostrar anteriores</button>
                            )}
                        </td>
                    </tr>
                </tfoot>
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
    width: 800px;
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

  .pagination-buttons {
    text-align: center;
  }
  
  button {
    border: 1px solid #ccc;
    background-color: transparent;
    color: #333;
    padding: 8px 16px;
    margin: 0 5px;
    border-radius: 5px;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #f0f0f0;
  }
`;