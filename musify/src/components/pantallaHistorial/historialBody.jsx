import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useTrack } from "../TrackContext/trackContext";

const base64ToImageSrc = (base64) => {
    const base64WithoutPrefix = base64.replace(/^data:image\/[a-z]+;base64,/, '');
    return `data:image/jpeg;base64,${atob(base64WithoutPrefix)}`;
};

export default function Body_historial() {
    const { playlistId } = useParams();
    const [songs, setSongs] = useState([]);
    const [message, setMessage] = useState('');
    const { setTrackList } = useTrack();

    useEffect(() => {
        const fetchUserDetails = async () => {
            const token = localStorage.getItem('userToken');
            try {
                const response = await fetch('http://127.0.0.1:8000/obtenerUsuarioSesionAPI/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        token: token,
                    }),
                });
                const data = await response.json();
                if (response.ok) {
                    const email = data.correo;
                    fetchHistorySongs(email);
                } else {
                    console.error('Failed to fetch user details:', data);
                }
            } catch (error) {
                console.error('Error fetching user details:', error);
            }
        };
    
        if (localStorage.getItem('userToken')) {
            fetchUserDetails();
        }
    }, []);

    const fetchHistorySongs = async (email) => {
        const response = await fetch(`http://127.0.0.1:8000/listarHistorial/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ correo: email })
        });
        const data = await response.json();
        console.log("Respuesta del servidor:", data);
        if (response.ok) {
            if (data.historial && data.historial.length > 0) {
                console.log("Canciones recibidas:", data.historial);
                const enrichedSongs = await Promise.all(data.historial.map(async (song) => {
                    const imageUrl = base64ToImageSrc(song.foto);
                    const artistas = await fetchArtistsForSong(song.id);  // Llamada a la función para obtener los artistas
                    return {
                        ...song,
                        imageUrl,
                        artistas  // Almacenando los nombres de los artistas obtenidos
                    };
                }));
                console.log("Canciones procesadas:", enrichedSongs);
                setSongs(enrichedSongs);
                setTrackList(enrichedSongs);
            } else {
                setMessage('El historial no tiene canciones');
            }
        } else {
            console.error('Failed to fetch data for historial');
            setMessage('Error al cargar las canciones del historial.');
        }
    };
    

    const fetchArtistsForSong = async (songId) => {
        const response = await fetch(`http://localhost:8000/listarArtistasCancion/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': 'tu_token_csrf'
            },
            body: JSON.stringify({ cancionId: songId })
        });
        const data = await response.json();
        return response.ok ? data.artistas.map(artista => artista.nombre).join(', ') : 'Artista Desconocido';
    };

    return (
        <Container>
            <div className="historial">
                <div className="details">
                    <h1 className="title">HISTORIAL</h1>
                </div>
            </div>
            <div className="list">
                <div className="header__row">
                    <div className="col"><span>#</span></div>
                    <div className="col"><span>TITULO</span></div>
                </div>
            </div>
            <div className="tracks">
                {songs.length > 0 ? (
                    songs.map((song, index) => (
                        <div className="row" key={song.id}>
                            <div className="col"><span>{index + 1}</span></div>
                            <div className="col detail">
                                <div className="image">
                                    <img src={song.imageUrl} alt={song.nombre} style={{ width: "50px", height: "auto" }} />
                                </div>
                                <div className="info">
                                    <span className="name">{song.nombre}</span>
                                    <span>{song.artistas || 'Artista Desconocido'}</span>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="row">{message}</div>
                )}
            </div>
        </Container>
    );
}

const Container = styled.div`
color: #fff;
margin-top: 10px;
margin-left: 10px;
.image {
    position: relative;
    img {
        display: block;
    }
    .play-icon {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: white;
        cursor: pointer;
    }
}
.playlist{
    margin: 0 2rem;
    display: flex;
    align-items:center;
    gap: 2rem;
    .image {
        img {
            height: 15rem;
            box-shadow:rgba(0,0,0,0.1) 0px 25px 50px-12px;
        }
    }
    .historial .details {
        background-color: #333;
        padding: 1rem;
        border-radius: 8px;
        .title {
            color: white;
            font-size: 4rem;
            font-weight: bold;
        }
    } 
}
.list {
    .header__row {
        display: grid;
        grid-template-columns: 0.3fr 3fr 2fr 0.1fr;
        color: #dddcdc;
        margin: 1rem 0 0 0;
        position: sticky;
        top: 15vh;
        padding: 1rem 3rem;
        transition: 0.3s ease-in-out;
    }
}
    .tracks {
        margin: 0 2rem;
        display: flex;
        flex-direction: column;
        margin-bottom: 5rem;
        .row {
            padding: 0.5rem 1rem;
            display: grid;
            grid-template-columns: 0.3fr 3.1fr 2fr 0.1fr;
            &:hover {
                background-color: rgba(0, 0, 0, 0.7);
            }
            .col {
                display: flex;
                align-items: center;
                color: #dddcdc;
            }
            .detail {
                display: flex;
                gap: 1rem;
                .info {
                    display: flex;
                    flex-direction: column;
                }
            }
        }
    }
}
}
`;