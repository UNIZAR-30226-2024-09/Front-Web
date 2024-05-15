import React, { createContext, useContext, useRef, useState, useEffect } from 'react';

const TrackContext = createContext();

export const useTrack = () => useContext(TrackContext);

export const TrackProvider = ({ children }) => {
    const audioRef = useRef(new Audio());
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTrack, setCurrentTrack] = useState({});
    const [currentTrackId, setCurrentTrackId] = useState(null);
    const [volume, setVolume] = useState(0.5);
    const [trackIndex, setTrackIndex] = useState(-1);
    const [shouldPlayNext, setShouldPlayNext] = useState(false);
    const [tracks, setTracks] = useState([]);
    const [isShuffling, setIsShuffling] = useState(false);
    const [userEmail, setUserEmail] = useState('');
    const [playedTime, setPlayedTime] = useState(0);
    const [intervalId, setIntervalId] = useState(null);

    useEffect(() => {
        if (tracks.length > 0 && trackIndex < tracks.length) {
            const track = tracks[trackIndex];
            fetchAudio(track.id);
        }
    }, [trackIndex, tracks]);

    // Función para cargar y preparar el audio
    const fetchAudio = async (trackId) => {
        try {
            const response = await fetch(`http://musify.servemp3.com:8000/audioCancion/${trackId}/`);
            const data = await response.blob();
            const objectURL = URL.createObjectURL(data);
            audioRef.current.src = objectURL;
            audioRef.current.load();
            audioRef.current.oncanplaythrough = () => audioRef.current.play(); // Autoplay cuando esté listo
        } catch (error) {
            console.error("Error loading full audio:", error);
        }
    };
    
    const updateTrack = (track) => {
        if (track && track.id && track.id !== currentTrack.id) {
            setCurrentTrack({
                ...track,
                type: track.type || 'song' // Asumimos 'song' como default
            });
            audioRef.current.src = track.src;
            audioRef.current.load();
            audioRef.current.oncanplaythrough = play;
        }
    };
    

    useEffect(() => {
        const handleEnded = () => {
            if (trackIndex < tracks.length - 1) {
                setTrackIndex(trackIndex + 1);  // Avanzar al siguiente índice
            } else {
                setIsPlaying(false);  // Si es el final de la lista, detener la reproducción
            }
        };
        audioRef.current.addEventListener('ended', handleEnded);
        return () => audioRef.current.removeEventListener('ended', handleEnded);
    }, [trackIndex, tracks]);

    const play = () => {
        if (!isPlaying) {
            audioRef.current.play()
            .then(() => setIsPlaying(true))
            .catch(error => console.error("Error during play:", error));
        }
    };

    useEffect(() => {
        if (shouldPlayNext) {
            playAudio();
            setShouldPlayNext(false);
        }
    }, [shouldPlayNext]);
    
    const onEnded = () => {
        changeTrack(true);
        setShouldPlayNext(true);
    };

    const playAudio = () => {
        const playPromise = audioRef.current.play();
    
        if (playPromise !== undefined) {
            playPromise.then(() => {
                setIsPlaying(true);
            }).catch(error => {
                console.error("Error during play:", error);
                if (error.name === "AbortError") {
                    console.log("Play was aborted, retrying...");
                    audioRef.current.play().then(() => {
                        setIsPlaying(true);
                    }).catch(error => console.error("Retry failed:", error));
                }
            });
        }
    };
    
    const pause = () => {
        audioRef.current.pause();
        setIsPlaying(false);
    };

    const startTimer = () => {
        clearInterval(intervalId);  // Limpiar intervalo existente si hay alguno
        const id = setInterval(() => {
            setPlayedTime(prev => prev + 1);  // Incrementar playedTime cada segundo
        }, 1000);
        setIntervalId(id);  // Guardar el ID del nuevo intervalo
    };

    // Función para detener el seguimiento del tiempo de reproducción
    const stopTimer = () => {
        clearInterval(intervalId);
    };

    useEffect(() => {
        const onEnded = () => {
            changeTrack(true); // Cambia a la siguiente pista cuando una canción termina.
            play(); // Comienza a reproducir automáticamente la siguiente canción.
        };
    
        const audio = audioRef.current;
        audio.addEventListener('ended', onEnded);
    
        return () => {
            audio.removeEventListener('ended', onEnded);
        };
    }, [trackIndex, tracks, isShuffling]); // Asegúrate de incluir isShuffling en las dependencias si su estado afecta la lógica de cambio de pista.
    
    useEffect(() => {
        if (!isPlaying) {
            stopTimer();
            if (playedTime >= 60) {
                addToHistory(currentTrackId);  // Llama a addToHistory solo si el tiempo reproducido es al menos 60 segundos
            }
            setPlayedTime(0);  // Resetear el contador de tiempo reproducido
        } else {
            startTimer();  // Iniciar el timer cuando la canción empieza a reproducirse
        }
    }, [isPlaying]);

    const toggleShuffle = () => {
        setIsShuffling(!isShuffling);
    };

    useEffect(() => {
        if (trackIndex >= 0 && trackIndex < tracks.length) {
            updateTrack(tracks[trackIndex]);
        }
    }, [trackIndex, tracks]);

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
                    setUserEmail(data.correo); // Asegúrate de que estás accediendo a la propiedad correcta
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
    
    
    const addToHistory = async (trackId) => {
        const url = 'http://musify.servemp3.com:8000/agnadirCancionHistorial/';
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'Content-Type': 'application/json',
                    'X-CSRFToken': 'UnjuTS7rMXrft4KWKiqLVILmhWpy1ezsY5VuFAS2bdQty4YzOO7ImxLFmJaIANG0' 
                },
                body: JSON.stringify({ correo: userEmail, cancionId: trackId })  // Uso del correo obtenido
            });
    
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Error al agregar la canción al historial");
            console.log("Canción añadida al historial:", data);
        } catch (error) {
            console.error("Error al añadir la canción al historial:", error);
        }
    };
    
    const actualizarEstadoCancion = async () => {
        if (!currentTrackId) return;
        const currentTime = audioRef.current.currentTime;
        const cancionID = currentTrackId;
        const correo = userEmail;
    
        try {
            const response = await fetch('http://musify.servemp3.com:8000/actualizarEstadoCancionesAPI/', {
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'Content-Type': 'application/json',
                    'X-CSRFToken': 'tu_token_csrf'  // Make sure this token is managed securely
                },
                body: JSON.stringify({ correo, cancionID, tiempo: currentTime })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Error al actualizar el estado de la canción");
            console.log("Estado de canción actualizado con éxito:", data.message);
        } catch (error) {
            console.error('Error al actualizar el estado de la canción:', error);
        }
    };
    const obtenerUltimoEstadoYReproducir = async () => {
        if (!userEmail) return;
        try {
            const response = await fetch('http://musify.servemp3.com:8000/obtenerEstadoCancionesAPI/', {
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'Content-Type': 'application/json',
                    'X-CSRFToken': 'tu_token_csrf'
                },
                body: JSON.stringify({ correo: userEmail })
            });
            const data = await response.json();
            if (response.ok && data.ultima_cancion && data.ultima_minutos !== undefined) {
                audioRef.current.src = getAudioUrl(data.ultima_cancion);
                audioRef.current.currentTime = data.ultima_minutos;
                audioRef.current.play().then(() => {
                    setCurrentTrackId(data.ultima_cancion);
                    setIsPlaying(true);
                }).catch(error => console.error('Error during auto-resume play:', error));
                console.log("Canción cargada y lista para reproducirse desde el último punto guardado.");
            }
        } catch (error) {
            console.error('Error al obtener el estado de la canción o al cargar la canción:', error);
        }
    };
    
    
    useEffect(() => {
        if (userEmail) {
            obtenerUltimoEstadoYReproducir();
        }
    }, [userEmail]);
    
    const fetchArtistsForSong = async (songId) => {
        try {
            const response = await fetch(`http://musify.servemp3.com:8000/listarArtistasCancion/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': 'tu_token_csrf'  // Ensure this token is dynamically obtained or managed securely
                },
                body: JSON.stringify({ cancionId: songId })
            });
    
            const data = await response.json();
    
            if (response.ok) {
                if (data.artistas && data.artistas.length > 0) {
                    return data.artistas.map(artista => artista.nombre).join(', ');
                } else {
                    console.error('No artists found in response:', data);
                    return 'Artista Desconocido';
                }
            } else {
                throw new Error('API responded with an error: ' + data.message);
            }
        } catch (error) {
            console.error('Error fetching artists for song:', error);
            return 'Artista Desconocido';  // Return default or error-specific message
        }
    };

    const getImageUrl = (songId) => {
    return `http://musify.servemp3.com:8000/imagenCancion/${songId}/`;
};
    const getAudioUrl = (songId) => {
    return `http://musify.servemp3.com:8000/audioCancion/${songId}/`;
};

    const updateTrackDetails = async (track) => {
        if (!track.id) return;
        // Fetch artist name if missing
        if (!track.artista) {
            track.artista = await fetchArtistsForSong(track.id);
        }
        // Fetch image if missing
        if (!track.imagen) {
            track.imagen = await getImageUrl(track.id);
        }
        updateTrack(track);
    };
    
    const setTrackList = (list) => {
        setTracks(list);
        if (list.length > 0) {
            setTrackIndex(0);
            updateTrack(list[0]);
        }
    };

    const changeTrack = (forward = true) => {
        let newIndex;
        if (isShuffling) {
            do {
                newIndex = Math.floor(Math.random() * tracks.length);
            } while (tracks.length > 1 && newIndex === trackIndex); // Asegura no repetir la misma canción si hay más de una canción
        } else {
            newIndex = trackIndex + (forward ? 1 : -1);
            if (newIndex >= tracks.length) {
                newIndex = 0; // Vuelve al inicio si es el fin de la lista
            } else if (newIndex < 0) {
                newIndex = tracks.length - 1; // Va al final si retrocede antes del inicio
            }
        }
        setTrackIndex(newIndex);
    };
    

    useEffect(() => {
        audioRef.current.onended = () => {
            changeTrack(true); // Cambia a la siguiente pista cuando una canción termina.
            play(); // Comienza a reproducir automáticamente la siguiente canción.
        };
    }, [trackIndex, tracks]); 
    
    
    useEffect(() => {
        if (tracks.length > 0 && trackIndex >= 0) {
            updateTrackDetails(tracks[trackIndex]);
        }
    }, [trackIndex, tracks]);

    const adjustVolume = (newVolume) => {
        audioRef.current.volume = newVolume; // Ajusta el volumen del elemento audio
        setVolume(newVolume);  // Actualiza el estado
    };

    useEffect(() => {
        if (isPlaying) {
            audioRef.current.play().catch(error => console.error("Error durante la reproducción:", error));
        } else {
            audioRef.current.pause();
        }
    }, [isPlaying]);
    

    const value = {
        // Expose all necessary states and functions through context
        isPlaying,
        currentTrack,
        play: () => {
            if (!isPlaying) {
                audioRef.current.play().then(() => setIsPlaying(true)).catch(error => console.error("Error during play:", error));
            }
        },
        pause: () => {
            if (isPlaying) {
                audioRef.current.pause();
                setIsPlaying(false);
            }
        },
        audioRef,
        volume,
        adjustVolume: (newVolume) => {
            audioRef.current.volume = newVolume;
            setVolume(newVolume);
        },
        trackIndex,
        setTrackIndex, // Ensure this is correctly passed
        currentTrackId,
        updateTrack,
        changeTrack,
        setTrackList,
        tracks,
        setTracks,
        toggleShuffle,
        isShuffling,
}   ;

    return <TrackContext.Provider value={value}>{children}</TrackContext.Provider>;
};
