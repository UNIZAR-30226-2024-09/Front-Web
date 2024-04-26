import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { FaSearch, FaCog, FaClock } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

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

export default function ListaPodcastsAdmin() {
    const [podcasts, setPodcasts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [busqueda, setBusqueda] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await fetch('http://127.0.0.1:8000/listarPodcasts/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({})
                });
                if (response.ok) {
                    const data = await response.json();
                    const updatedPodcasts = data.podcasts.slice(0, 3).map(podcast => ({
                        id: podcast.id,
                        foto: base64ToImageSrc(podcast.foto),
                        nombre: podcast.nombre,
                        presentador: podcast.presentador
                    }));
                    setPodcasts(updatedPodcasts);
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
        fetchData();
    }, []);

    return(
        <>
            <Container>
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
                        {podcasts.map((p, index) => (
                            <tr key={p.id}>
                                <td>{index + 1}</td>
                                <td>
                                    <div className="podcast__details">
                                        <img src={p.foto} alt={p.nombre} />
                                        <div>
                                            <div className="podcast__title">{p.nombre}</div>
                                            <div className="podcast__author">{p.presentador}</div>
                                        </div>
                                    </div>
                                </td>
                                <td>{p.fecha}</td>
                                <td>{p.cap}</td>
                                <Link to={`/editar_podcast/${p.id}`} className="cancion__settings">
                                  <FaCog />
                                </Link>
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
`;