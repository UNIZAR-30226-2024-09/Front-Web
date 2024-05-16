import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useTrack } from "../../TrackContext/trackContext";

export default function Body_historial() {
    const { correo } = useParams();
    const [songs, setSongs] = useState([]);
    const [message, setMessage] = useState('');
    const { setTrackList } = useTrack();

    useEffect(() => {
        const fetchUserDetails = async () => {
            const token = localStorage.getItem('userToken');
            try {
                const response = await fetch('http://musify.servemp3.com:8000/obtenerUsuarioSesionAPI/', {
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
                    fetchHistorySongs(email); // Si se obtienen los detalles del usuario, llamar a fetchHistorySongs con su correo
                } else {
                    console.error('Failed to fetch user details:', data);
                }
            } catch (error) {
                console.error('Error fetching user details:', error);
            }
        };

        if (!correo) { // Si no hay correo en los parámetros de la URL, buscar el correo del usuario del token
            fetchUserDetails();
        } else { // Si hay un correo en los parámetros de la URL, buscar las canciones del historial para ese correo
            fetchHistorySongs(correo);
        }
    }, [correo]);

    useEffect(() => {
        if (correo) {
            fetchUsuario();
        }
    }, [correo]);

    const fetchUsuario = async () => {
        try {
            const response = await fetch(`http://musify.servemp3.com:8000/devolverUsuario/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ correo: correo })
            });
            const data = await response.json();
            if (response.ok) {
                if (data.usuario) {
                    fetchHistorySongs(data.usuario.correo);
                }
            } else {
                console.error('Failed to fetch user:', data);
            }
        } catch (error) {
            console.error('Error fetching user details:', error);
        }
    };

    const fetchHistorySongs = async (email) => {
        const response = await fetch(`http://musify.servemp3.com:8000/listarHistorial/`, {
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
                    const imageUrl = `http://musify.servemp3.com:8000/imagenCancion/${song.id}`;
                    const artistas = await fetchArtistsForSong(song.id);
                    return {
                        ...song,
                        imageUrl,
                        artistas
                    };
                }));
                enrichedSongs.sort((a, b) => new Date(b.playedAt) - new Date(a.playedAt));  // Assuming `playedAt` is a date string                
                console.log("Canciones procesadas:", enrichedSongs);
                setSongs(enrichedSongs);
                setTrackList(enrichedSongs);
            } else {
                setMessage('No hay canciones en el historial');
            }
        } else {
            console.error('Failed to fetch data for historial');
            setMessage('Error al cargar las canciones del historial.');
        }
    };

    const fetchArtistsForSong = async (songId) => {
        const response = await fetch(`http://musify.servemp3.com:8000/listarArtistasCancion/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': 'tu_token_csrf'  // Ensure CSRF token is correctly managed
            },
            body: JSON.stringify({ cancionId: songId })
        });
        const data = await response.json();
    
        if (response.ok) {
            if (Array.isArray(data.artistas) && data.artistas.length > 0) {
                return data.artistas.map(artista => artista.nombre).join(', ');
            } else {
                return 'Artista Desconocido';  // Return default text if no artists are found
            }
        } else {
            console.error('API error on fetching artists:', data);
            return 'Artista Desconocido';  // Handle API errors gracefully
        }
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
                {songs.length > 0 ? songs.map((song, index) => (
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
                )) : (
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