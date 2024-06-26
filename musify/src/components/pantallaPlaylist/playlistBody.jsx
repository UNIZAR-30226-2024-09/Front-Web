import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { AiFillClockCircle } from 'react-icons/ai';
import { FaPlay, FaPause, FaLock, FaUnlock, FaUserPlus, FaTrash } from 'react-icons/fa';
import { MdOutlineAddToPhotos } from 'react-icons/md';
import { useTrack } from "../../TrackContext/trackContext";
import Modal from '../agnadirColaboradorModal/agnadirColaborador';

const getAudioUrl = (songId) => {
    return `http://musify.servemp3.com:8000/audioCancion/${songId}/`;
};


export default function Body() {
    const { playlistId } = useParams();
    const [songs, setSongs] = useState([]);
    const [message, setMessage] = useState('');
    const [hoverIndex, setHoverIndex] = useState(-1);
    const { updateTrack, play, pause, isPlaying, currentTrack, audioRef, setTrackList } = useTrack();
    const [playlistName, setPlaylistName] = useState('');
    const [isPublic, setIsPublic] = useState(true);
    const [collaboratorEmail, setCollaboratorEmail] = useState('');
    const [isAddingCollaborator, setIsAddingCollaborator] = useState(false);
    const [setShowDeleteConfirm] = useState(false);
    const [userEmail, setUserEmail] = useState(null);

    useEffect(() => {
        const fetchUserDetails = async () => {
            const token = localStorage.getItem('userToken');
            if (!token) {
                console.error('No token available');
                return;
            }
    
            try {
                const response = await fetch('http://musify.servemp3.com:8000/obtenerUsuarioSesionAPI/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ token }),
                });
    
                const data = await response.json();
                if (response.ok) {
                    console.log("Datos Usuario:", data);
                    setUserEmail(data.correo); // Set the user email state
                } else {
                    console.error('Failed to fetch user details:', data);
                }
            } catch (error) {
                console.error('Error fetching user details:', error);
            }
        };
    
        fetchUserDetails();
    }, []);
    
    const getImageUrl = (type, filename) => {
        return `http://musify.servemp3.com:8000/imagen${type}/${filename}/`;
    };

    const handleAddCollaborator = async () => {
        if (!collaboratorEmail) {
            alert("Por favor, introduce un correo válido.");
            return;
        }
        const response = await fetch('http://musify.servemp3.com:8000/agnadirColaboradorAPI/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ correo: collaboratorEmail, playlistId })
        });
        const data = await response.json();
        if (response.ok) {
            setMessage('Colaborador añadido con éxito');
            setIsAddingCollaborator(false);  // Cierra modal si estás usando uno
        } else {
            setMessage(data.error || 'Error al añadir colaborador');
        }
        setIsAddingCollaborator(false);
    };

    useEffect(() => {
        const fetchPlaylistSongs = async () => {
            const response = await fetch(`http://musify.servemp3.com:8000/listarCancionesPlaylist/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ playlistId })
            });
            const data = await response.json();
            if (response.ok && data.canciones) {
                const enrichedSongs = await Promise.all(data.canciones.map(async song => {
                    const imageUrl = getImageUrl('Cancion', song.id);
                    const audioUrl = getAudioUrl(song.id);
                    const artistas = await fetchArtistsForSong(song.id);
                    const album = await fetchAlbumForSong(song.miAlbum);
                    const duration = await fetchAudioDuration(audioUrl).catch(() => 'Duración Desconocida');
                    return { ...song, imageUrl, audioUrl, artistas, album, duration: formatDuration(duration) };
                }));                
                setSongs(enrichedSongs);
            } else {
                console.error('Error fetching playlist songs:', data);
                setMessage('Error al cargar las canciones de la playlist.');
            }
        };    
        fetchPlaylistSongs();
    }, [playlistId]);

    const formatDuration = (duration) => {
        if (!duration) return '0:00';
        const minutes = Math.floor(duration / 60);
        const seconds = Math.floor(duration % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const fetchArtistsForSong = async (songId) => {
        const response = await fetch(`http://musify.servemp3.com:8000/listarArtistasCancion/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': 'tu_token_csrf'
            },
            body: JSON.stringify({ cancionId: songId })
        });
        const data = await response.json();
        console.log('fetchArtistsForSong - Data:', data);
    
        if (!data.artistas) {
            console.error('No artists found in response:', data);
            return 'Artista Desconocido';
        }
    
        return data.artistas.map(artista => artista.nombre).join(', ');
    };

    const fetchAlbumForSong = async (albumId) => {
        const response = await fetch(`http://musify.servemp3.com:8000/devolverAlbum/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': 'tu_token_csrf'  // Asegúrate de tener el token CSRF correcto
            },
            body: JSON.stringify({ albumId: albumId })  // Asegúrate de pasar el ID del álbum correctamente
        });
        const data = await response.json();
        return response.ok ? data.album.nombre : 'Álbum Desconocido';
    };    

    const fetchAudioDuration = (audioSrc) => {
        return new Promise((resolve, reject) => {
            const audio = new Audio(audioSrc);
            audio.preload = 'metadata';  // Pre-cargar solo metadatos
            audio.onloadedmetadata = () => {
                resolve(audio.duration);
            };
            audio.onerror = () => {
                reject('Failed to load audio');
            };
        });
    };
        

    const fetchPlaylistName = async (playlistId) => {
        const response = await fetch(`http://musify.servemp3.com:8000/devolverPlaylist/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': 'tu_token_csrf'
            },
            body: JSON.stringify({ playlistId })
        });
        const data = await response.json();
        if (response.ok) {
            setPlaylistName(data.playlist.nombre); 
        } else {
            console.error('Failed to fetch playlist name');
        }
    };    

    const removeSongFromPlaylist = async (songId) => {
        try {
            const response = await fetch('http://musify.servemp3.com:8000/eliminarCancionPlaylist/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': 'tu_token_csrf'
                },
                body: JSON.stringify({ playlistId, cancionId: songId })
            });
            const data = await response.json();
            if (response.ok) {
                setSongs(songs.filter(song => song.id !== songId));
                setShowDeleteConfirm(false);
                alert(data.message); 
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            console.error('Error removing song from playlist:', error.message);
            alert('Error al eliminar la canción de la playlist.');
        }
    };    

    useEffect(() => {
        const fetchPlaylistName = async () => {
            const response = await fetch(`http://musify.servemp3.com:8000/devolverPlaylist/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': 'tu_token_csrf'
                },
                body: JSON.stringify({ playlistId })
            });
            const data = await response.json();
            if (response.ok) {
                setPlaylistName(data.playlist.nombre);
                setIsPublic(data.playlist.publica);
            } else {
                console.error('Failed to fetch playlist name');
            }
        };
        fetchPlaylistName();
    }, [playlistId]);

    const addToQueue = async (correo, cancionId) => {
        try {
            const response = await fetch('http://musify.servemp3.com:8000/agnadirCancionCola/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': 'S7CtjKi19jEVUdMkUxKEVridb15UBJOrWPet5s3Cyz39Zd0XY3rBmgiwgOQ4aiVZ', // Adjust as needed
                    'accept': 'application/json'
                },
                body: JSON.stringify({ correo, cancionId })
            });
            const data = await response.json();
            if (response.ok) {
                alert(data.message); // Notify the user of success
            } else {
                console.error('Failed to add song to queue:', data);
                alert(data.error || 'Error adding song to queue.');
            }
        } catch (error) {
            console.error('Error adding song to queue:', error);
            alert('Error adding song to queue.');
        }
    };

    const handleAddToQueue = async (songId) => {
        if (!userEmail) {
            alert('User email is not available. Please wait.');
            return;
        }
        await addToQueue(userEmail, songId);
    };
    

    const togglePublic = async () => {
        const newPublicState = !isPublic;
        setIsPublic(newPublicState);
        const response = await fetch(`http://musify.servemp3.com:8000/actualizarPlaylist/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': 'tu_token_csrf'
            },
            body: JSON.stringify({ playlistId, nombre: playlistName, publica: newPublicState })
        });
        if (!response.ok) {
            console.error('Failed to update playlist visibility');
            setIsPublic(!newPublicState);  // Revertir cambio en caso de error
        }
    };

    useEffect(() => {
        fetchPlaylistName(playlistId);
    }, [playlistId]);
    

    useEffect(() => {
        if (songs.length > 0) {
            setTrackList(songs.map(song => ({
                ...song,
                src: song.audioUrl
            })));
        }
    }, [songs]);

    const togglePlayPause = (index) => {
        const song = songs[index];
        if (currentTrack && currentTrack.id === song.id) {
            if (!audioRef.current.paused) {
                pause();  // If the current track is playing, pause it.
            } else {
                play();   // If it's paused, play it.
            }
        } else {
            updateTrack({
                ...song,
                id: song.id,
                src: song.audioUrl,
                imagen: song.imageUrl,
                nombre: song.nombre,
                artista: song.artistas
            });
            play();  // Start playing the new track
        }
    };
    
    

    return (
        <Container>
            <div className="playlist">
            <div className="image">
                <img src="/imagenes/playlist.jpg" alt="Descripción" />
                
            </div>
            <div className="details">
                <span className="type">PLAYLIST</span>
                <h1 className="title">{playlistName || 'Loading...'}</h1>  {/* Mostrar el nombre de la playlist */}
                <div className='iconos'>
                    <IconButton onClick={() => setIsAddingCollaborator(true)}>
                        <FaUserPlus size="1.3em" />  
                    </IconButton>
                    <Modal show={isAddingCollaborator} onClose={() => setIsAddingCollaborator(false)}>
                        <input
                        type="email"
                        value={collaboratorEmail}
                        onChange={e => setCollaboratorEmail(e.target.value)}
                        placeholder="Correo del colaborador"
                        />
                        <button onClick={handleAddCollaborator}>Confirmar</button>
                    </Modal>
                    <div onClick={togglePublic}>
                        {isPublic ? <FaUnlock size="2em" /> : <FaLock size="2em" />}
                    </div>
                </div>
            </div>
        </div>
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
                            onMouseLeave={() => setHoverIndex(-1)}
                            onClick={() => togglePlayPause(index)}>
                            <div className="col"><span>{index + 1}</span></div>
                            <div className="col detail">
                                <div className="image">
                                <img src={song.imageUrl} alt={song.nombre} style={{ width: "50px", height: "auto" }} />
                                    {hoverIndex === index && (
                                        <div className="play-icon">
                                            {isPlaying && currentTrack.id === song.id ? <FaPause size="2em" /> : <FaPlay size="2em" />}
                                        </div>
                                    )}
                                </div>
                                <div className="info">
                                    <span className="name">{song.nombre}</span>
                                    <span>{song.artistas || 'Artista Desconocido'}</span>
                                </div>
                            </div>
                            <div className="col"><span>{song.album}</span></div>
                            <div className="col">
                                <span>{song.duration}</span>
                                <MdOutlineAddToPhotos // Add new icon here
                                    size="1em"
                                    style={{ cursor: 'pointer', marginLeft: '20px' }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleAddToQueue(song.id);
                                    }}
                                />
                                <FaTrash
                                    size="1em"
                                    style={{ cursor: 'pointer', marginLeft: '20px' }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeSongFromPlaylist(song.id);
                                    }}
                                />
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
    .details{
        display: flex;
        flex-direction: column;
        gap: 2rem;
        color: #e0dede;
        .title {
            color: white;
            font-size: 4rem;
        }
        .iconos {
            display: flex;
            align-items: center;
            gap: 1rem; 
            color: #dddcdc;
            margin-left: 10px;
        }
    }
}
.list {
    .header__row {
        display: grid;
        grid-template-columns: 0.3fr 3fr 2fr 0.45fr;
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

const IconButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2em;

  &:hover {
    color: #ccc;
  }

  &:focus {
    outline: none;
  }
`;