import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { AiFillClockCircle } from 'react-icons/ai';
import { FaPlay, FaPause } from 'react-icons/fa';
import { MdOutlineAddToPhotos } from 'react-icons/md';
import Modal from '../agnadirCancionPlaylistModal/agnadirCancion';
import { RiMenuAddFill } from "react-icons/ri";
import { useTrack } from "../../TrackContext/trackContext";
import { CiShare1 } from "react-icons/ci";

const base64ToAudioSrc = (base64) => {
    const base64WithoutPrefix = base64.replace(/^data:audio\/mp3;base64,/, '').replace(/^data:[^;]+;base64,/, '');
    return `data:audio/mp3;base64,${atob(base64WithoutPrefix)}`;
};

const SongDetails = () => {
    const { cancionId } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [songImage, setSongImage] = useState('');
    const [songName, setSongName] = useState('');
    const [songMp3, setSongMp3] = useState('');
    const [album, setAlbum] = useState('');
    const [artistas, setArtistas] = useState('');
    const [duration, setDuration] = useState('');
    const { updateTrack, play, pause, isPlaying, audioRef } = useTrack();
    const [playlists, setPlaylists] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [user, setUser] = useState(null);
    const [songUrl, setSongUrl] = useState('');

    useEffect(() => {
        // Generar la URL de la canción
        setSongUrl(`${window.location.origin}/musifyc/${cancionId}`);
    }, [cancionId]);

    const handleShareClick = () => {
        // Copiar la URL al portapapeles
        navigator.clipboard.writeText(songUrl).then(() => {
            alert('URL copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy:', err);
        });
    };

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
                    setUser(data);
                } else {
                    console.error('Failed to fetch user details:', data);
                }
            } catch (error) {
                console.error('Error fetching user details:', error);
            }
        };
    
        if(localStorage.getItem('userToken')) {
            fetchUserDetails();
        }
    }, []);

    const fetchPlaylists = async () => {
        if (user && user.correo) {
            try {
                const response = await fetch('http://127.0.0.1:8000/listarPlaylistsUsuario/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ correo: user.correo })
                });
                const data = await response.json();
                if (response.ok) {
                    if (data.playlists) {
                        setPlaylists(data.playlists);
                    }
                } else {
                    console.error('Failed to fetch playlists');
                }
            } catch (error) {
                console.error('Error fetching playlists:', error);
            }
        }
    };

    useEffect(() => {
        fetchPlaylists();
    }, [user]);

    useEffect(() => {
        const fetchSongDetails = async () => {
            setLoading(true);
            try {
                const response = await fetch(`http://127.0.0.1:8000/devolverCancion/`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ cancionId })
                });
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(`Server responded with status ${response.status}: ${data.detail || JSON.stringify(data)}`);
                }
                // Actualizar para usar URL directa para la imagen de la canción
                setSongImage(`http://localhost:8000/imagenCancion/${data.cancion.id}`);
    
                setSongName(data.cancion.nombre);
                const audioSrc = base64ToAudioSrc(data.cancion.archivoMp3);
                setSongMp3(audioSrc);
    
                fetchAudioDuration(audioSrc).then(duration => {
                    setDuration(formatDuration(duration)); 
                }).catch(error => {
                    console.error('Error loading audio:', error);
                    setDuration('Failed to load');
                });
    
                if (data.cancion.miAlbum) {
                    fetchAlbumForSong(data.cancion.miAlbum);
                }
                if (data.cancion.artistas) {
                    setArtistas(data.cancion.artistas.join(', '));
                } else {
                    fetchArtistsForSong(cancionId);
                }
            } catch (error) {
                setError(`Failed to fetch song details: ${error.message}`);
            } finally {
                setLoading(false);
            }
        };
        fetchSongDetails();
    }, [cancionId]);
    

    const addToQueue = async (correo, cancionId) => {
        try {
            const response = await fetch('http://localhost:8000/agnadirCancionCola/', {
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
        // Replace with the actual email you want to use
        const email = 'zineb@gmail.com';
        await addToQueue(email, songId);
    };
    


    // Función para añadir una canción a la playlist
    const addToPlaylist = async (playlistId) => {
        try {
            const response = await fetch('http://localhost:8000/agnadirCancionPlaylist/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': 'tu_token_csrf'
                },
                body: JSON.stringify({ playlistId, cancionId })
            });
            const data = await response.json();
            if (response.ok) {
                alert(data.message); // Muestra un mensaje de éxito
                setShowModal(false); // Cierra el modal después de añadir
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            console.error('Error adding song to playlist:', error.message);
        }
    };
    
    const fetchArtistsForSong = async (songId) => {
        try {
            const response = await fetch(`http://localhost:8000/listarArtistasCancion/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': 'tu_token_csrf'
                },
                body: JSON.stringify({ cancionId: songId })
            });
            const data = await response.json();
            if (response.ok) {
                setArtistas(data.artistas.map(artista => ({
                    nombre: artista.nombre,
                    imagen: `http://localhost:8000/imagenArtista/${artista.id}`
                })));
            } else {
                throw new Error('Failed to fetch artists');
            }
        } catch (error) {
            console.error('Failed to fetch artists:', error);
        }
    };

    const fetchAlbumForSong = async (albumId) => {
        try {
            const response = await fetch(`http://localhost:8000/devolverAlbum/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': 'tu_token_csrf'
                },
                body: JSON.stringify({ albumId })
            });
            const data = await response.json();
            if (response.ok) {
                setAlbum({
                    nombre: data.album.nombre,
                    imagen: `http://localhost:8000/imagenAlbum/${data.album.id}`
                });
            } else {
                throw new Error('Failed to fetch album');
            }
        } catch (error) {
            console.error('Failed to fetch album:', error);
        }
    };
    
    

    const formatDuration = (duration) => {
        if (!duration) return 'N/A';
        const minutes = Math.floor(duration / 60);
        const seconds = Math.floor(duration % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const fetchAudioDuration = (audioSrc) => {
        return new Promise((resolve, reject) => {
            const audio = new Audio(audioSrc);
            audio.onloadedmetadata = () => {
                resolve(audio.duration);
            };
            audio.onerror = () => {
                reject('Failed to load audio');
            };
        });
    };  

    const togglePlayPause = () => {
        if (isPlaying && audioRef.current && audioRef.current.src === songMp3) {
            pause();
        } else {
            updateTrack({
                src: songMp3,
                nombre: songName
            });
            play();
        }
    };

    return (
        <Container>
            <div className="playlist">
                <div className="image">
                    <img src={songImage} alt={songName} />
                </div>
                <div className="details">
                <span className="type">CANCIÓN</span>
                <h1 className="title">{songName}</h1>  {/* Mostrar el nombre de la playlist */}
                <div className='iconos'>
                <IconButton onClick={() => setShowModal(true)}>
                        <RiMenuAddFill size="1.3em" />
                    </IconButton>
                    <IconButton onClick={handleShareClick}>
                            <CiShare1 size="1.3em" />
                        </IconButton>
                    {showModal && (
                        <Modal title="Selecciona una Playlist" onClose={() => setShowModal(false)}>
                            <ul>
                                {playlists.map(playlist => (
                                    <PlaylistItem key={playlist.id} onClick={() => addToPlaylist(playlist.id)}>
                                        {playlist.nombre}
                                    </PlaylistItem>
                                ))}
                            </ul>
                        </Modal>
                    )}
                </div>
            </div>
            </div>
            <div className="list">
                <div className="header__row">
                    <div className="col"><span>#</span></div>
                    <div className="col"><span>TÍTULO</span></div>
                    <div className="col"><span>ÁLBUM</span></div>
                    <div className="col"><span><AiFillClockCircle /></span></div>
                </div>
            </div>
            <div className="tracks">
                <div className="row">
                    <div className="col"><span>1</span></div>
                    <div className="col detail">
                        <div className="image">
                            <img src={songImage} alt={songName} style={{ width: "50px", height: "auto" }} />
                            <div className="play-icon">
                                {isPlaying ? <FaPause size="2em" onClick={togglePlayPause} /> : <FaPlay size="2em" onClick={togglePlayPause} />}
                            </div>
                        </div>
                        <div className="info">
                            <span className="name">{songName}</span>
                            <span>{artistas.nombre}</span>
                        </div>
                    </div>
                    <div className="col"><span>{album.nombre}</span></div>
                    <div className="col"><span>{duration}
                    <MdOutlineAddToPhotos // Add new icon here
                                    size="1em"
                                    style={{ cursor: 'pointer', marginLeft: '20px' }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleAddToQueue(cancionId);
                                    }}
                                />
                    </span></div>
                </div>
            </div>
        </Container>
    );
};

export default SongDetails;

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

const PlaylistItem = styled.li`
    padding: 10px;
    cursor: pointer;
    list-style: none;
    border-bottom: 1px solid #ccc;

    &:hover {
        background-color: #f0f0f0; // Light grey on hover
    }

    &:active {
        background-color: #ddd; // Darker grey to indicate click
    }
`;