import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { AiFillClockCircle } from 'react-icons/ai';
import { FaPlay, FaPause } from 'react-icons/fa';
import { useTrack } from "./TrackContext";

const canciones = [
    {
      id: 1,
      name: "Canción 1",
      artists: "Artista 1",
      album: "Álbum 1",
      duration: "3:45",
      imageUrl: "/imagenes/prueba.jpg",
    },
  ];

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

const base64ToAudioSrc = (base64) => {
    console.log("Base64 original:", base64); // Imprimir la base64 original

    // Eliminar cualquier prefijo incorrecto y asegurar que es el correcto para audio/mp3
    const base64WithoutPrefix = base64.replace(/^data:audio\/mp3;base64,/, '').replace(/^data:[^;]+;base64,/, '');
    const audioSrc = `data:audio/mp3;base64,${atob(base64WithoutPrefix)}`;
    console.log("Audio transformado:", audioSrc); // Imprimir el src del audio transformado

    return audioSrc;
};

export default function Body() {
    const { playlistId } = useParams();
    const [songs, setSongs] = useState([]);
    const [message, setMessage] = useState('');
    const [hoverIndex, setHoverIndex] = useState(-1); // Para manejar el hover sobre las canciones
    const { updateTrack, play, pause, isPlaying } = useTrack(); // Asumiendo que ya tienes estas funciones en tu contexto
    const audioRef = useRef(new Audio());

    useEffect(() => {
        const fetchPlaylistSongs = async () => {
            const response = await fetch(`http://127.0.0.1:8000/listarCancionesPlaylist/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ playlistId })
            });
            const data = await response.json();
            if (response.ok) {
                if (data.canciones) {
                    const transformedSongs = data.canciones.map(song => ({
                        ...song,
                        imageUrl: base64ToImageSrc(song.foto),
                        audioUrl: base64ToAudioSrc(song.archivoMp3)
                    }));
                    setSongs(transformedSongs);
                } else {
                    setMessage('La playlist no tiene canciones');
                    setSongs([]);
                }
            } else {
                console.error('Failed to fetch data for playlist');
                setMessage('Error al cargar las canciones de la playlist.');
            }
        };

        if (playlistId) {
            fetchPlaylistSongs();
        }
    }, [playlistId]);

    const togglePlayPause = (index) => {
        const song = songs[index];
        if (!audioRef.current) {
            audioRef.current = new Audio(song.audioUrl);
        } else {
            if (audioRef.current.src !== song.audioUrl) {
                audioRef.current.src = song.audioUrl;
            }
        }
    
        updateTrack(song);
    
        if (isPlaying && audioRef.current.paused === false) {
            pause();
        } else {
            play();
        }
    };

    return (
        <Container>
            <div className="list">
                <div className="header__row">
                    <div className="col"><span>#</span></div>
                    <div className="col"><span>TITULO</span></div>
                    <div className="col"><span>ÁLBUM</span></div>
                    <div className="col"><span><AiFillClockCircle /></span></div>
                </div>
            </div>
            <div className="tracks">
                {songs.length > 0 ? (
                    songs.map((song, index) => (
                        <div className="row" key={song.id}
                             onMouseEnter={() => setHoverIndex(index)}
                             onMouseLeave={() => setHoverIndex(-1)}>
                            <div className="col"><span>{index + 1}</span></div>
                            <div className="col detail">
                                <div className="image">
                                    <img src={song.imageUrl} alt={song.name} style={{ width: "50px", height: "auto" }} />
                                    {hoverIndex === index && (
                                        <div className="play-icon" onClick={() => togglePlayPause(index)}> {/* Agregamos onClick aquí */}
                                            {isPlaying && audioRef.current.src === song.audioUrl ? <FaPause size="2em" /> : <FaPlay size="2em" />}
                                        </div>
                                    )}
                                </div>
                                <div className="info">
                                    <span className="name">{song.name}</span>
                                    <span>{song.artists || 'Artista Desconocido'}</span>
                                </div>
                            </div>
                            <div className="col"><span>{song.album || 'Álbum Desconocido'}</span></div>
                            <div className="col"><span>{song.duration || 'Duración Desconocida'}</span></div>
                            <audio ref={(el) => audioRef.current = el} src={song.audioUrl} />
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
        color: white; // Asegúrate de que el ícono sea visible
        cursor: pointer; // Indica que el ícono es interactivo
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
    .details{
        display: flex;
        flex-direction: column;
        gap: 2rem;
        color: #e0dede;
        .title{
            color: white;
            font-size: 4rem;
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