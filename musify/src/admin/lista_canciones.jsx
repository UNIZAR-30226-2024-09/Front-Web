import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { FaCog } from "react-icons/fa";
import { Link } from 'react-router-dom';

const getImageSrc = (id) => {
    return `http://musify.servemp3.com:8000/imagenCancion/${id}`;
};


export default function ListaCancionesAdmin() {
    const [albums, setAlbums] = useState({});

    const [canciones, setCanciones] = useState([]);
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
                const response = await fetch('http://musify.servemp3.com:8000/listarPocasCanciones/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    const updatedCanciones = data.canciones.map(cancion => ({
                        id: cancion.id,
                        foto: getImageSrc(cancion.id),
                        nombre: cancion.nombre,
                        album: cancion.miAlbum
                    }));
                    setCanciones(updatedCanciones);
                    console.log(updatedCanciones);
                    const albumIds = updatedCanciones.map(cancion => cancion.album);
                    const fetchAlbumPromises = albumIds.map(id => fetchAlbum(id));
                    const albumsData = await Promise.all(fetchAlbumPromises);
                    setAlbums(albumsData);
                    console.log(albumIds);
                    console.log(albums);
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

        const fetchAlbum = async (idAlbum) => {
            try {
                if (idAlbum === null) {
                    return "undefined"; // Valor predeterminado cuando idAlbum es null
                }
        
                const response = await fetch(`http://musify.servemp3.com:8000/devolverAlbum/`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ albumId: idAlbum })
                });
                if (!response.ok) throw new Error("Failed to fetch album");
                const albumData = await response.json();
                if(albumData.album){
                    console.log(albumData);
                    console.log(albumData.album.nombre);
                    return albumData.album.nombre;
                } else{
                    return " ";
                }
            } catch (error) {
                console.log(error);
                setError(`Failed to fetch album: ${error.message}`);
            }
        };
        fetchData();
    }, []);
    
    if (loading) return <p>Cargando...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!canciones.length) return <p>No hay canciones disponibles</p>;

    return(
        <>
            <Container>
            <Table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Título</th>
                            <th>Álbum</th>
                            <th>Editar</th>
                        </tr>
                    </thead>
                    <tbody>
                        {canciones.slice(indiceInicio, indiceInicio + filasPorGrupo).map((c, index) => (
                            <tr key={c.id}>
                                <td>{indiceInicio + index + 1}</td>
                                <td>
                                    <div className="cancion__details">
                                        <img src={c.foto} alt={c.nombre} />
                                        <div>
                                            <div className="cancion__title">{c.nombre}</div>
                                            <div className="cancion__artist">{c.artista}</div>
                                        </div>
                                    </div>
                                </td>
                                <td>{albums[indiceInicio + index]}</td>
                                <Link to={`/editar_cancion/${c.id}`} className="cancion__settings">
                                  <FaCog />
                                </Link>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                    <tr>
                        <td colSpan="4" className="pagination-buttons">
                            {canciones.length > indiceInicio + filasPorGrupo && (
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
