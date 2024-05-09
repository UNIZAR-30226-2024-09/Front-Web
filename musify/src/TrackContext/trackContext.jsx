import React, { createContext, useContext, useRef, useState, useEffect} from 'react';

const TrackContext = createContext();

const base64ToAudioSrc = (base64) => {
    const base64WithoutPrefix = base64.replace(/^data:audio\/mp3;base64,/, '').replace(/^data:[^;]+;base64,/, '');
    return `data:audio/mp3;base64,${atob(base64WithoutPrefix)}`;
};

export const useTrack = () => useContext(TrackContext);

export const TrackProvider = ({ children }) => {
    const audioRef = useRef(new Audio());
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTrack, setCurrentTrack] = useState({});
    const [currentTrackId, setCurrentTrackId] = useState(null);
    const [volume, setVolume] = useState(0.5);
    const [trackIndex, setTrackIndex] = useState(-1);
    const [tracks, setTracks] = useState([]);
    const [isShuffling, setIsShuffling] = useState(false);

    const toggleShuffle = () => {
        setIsShuffling(!isShuffling);
    };

    useEffect(() => {
        if (trackIndex >= 0 && trackIndex < tracks.length) {
            updateTrack(tracks[trackIndex]);
        }
    }, [trackIndex, tracks]);
    
    const addToHistory = async (trackId) => {
        const url = 'http://localhost:8000/agnadirCancionHistorial/';
        const correo = "zineb@gmail.com"; // Este valor podría ser dinámico, dependiendo del usuario logueado
    
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'Content-Type': 'application/json',
                    'X-CSRFToken': 'UnjuTS7rMXrft4KWKiqLVILmhWpy1ezsY5VuFAS2bdQty4YzOO7ImxLFmJaIANG0' 
                },
                body: JSON.stringify({ correo, cancionId: trackId })
            });
    
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Error al agregar la canción al historial");
            console.log("Canción añadida al historial:", data);
        } catch (error) {
            console.error("Error al añadir la canción al historial:", error);
        }
    };    

    const play = () => {
        if (currentTrackId) {
            addToHistory(currentTrackId);
        }
        audioRef.current.play();
        setIsPlaying(true);
    };

    const actualizarEstadoCancion = async () => {
        const tiempo = Math.floor(audioRef.current.currentTime);
        const correo = "zineb@gmail.com";
        const cancionID = currentTrackId;
        const url = 'http://localhost:8000/actualizarEstadoCancionesAPI/';
    
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'Content-Type': 'application/json',
                    'X-CSRFToken': 'tu_token_csrf'
                },
                body: JSON.stringify({ correo, cancionID, tiempo })
            });
            const data = await response.json();
            console.log(data.message); 
        } catch (error) {
            console.error('Error al actualizar el estado de la canción:', error);
        }
    };

    useEffect(() => {
        obtenerUltimoEstadoYReproducir();
    }, []);
    
    const fetchArtistsForSong = async (songId) => {
        try {
            const response = await fetch(`http://localhost:8000/listarArtistasCancion/`, {
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
    return `http://localhost:8000/imagenCancion/${songId}/`;
};

    // Función para obtener la última canción y su estado
    const obtenerUltimoEstadoYReproducir = async () => {
        const correo = "zineb@gmail.com";  // Asumiendo que tienes esta información de la sesión del usuario
        const obtenerEstadoUrl = 'http://localhost:8000/obtenerEstadoCancionesAPI/';
        const devolverCancionUrl = 'http://localhost:8000/devolverCancion/';

        try {
            // Primero, obtenemos el último estado de la canción
            const estadoResponse = await fetch(obtenerEstadoUrl, {
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'Content-Type': 'application/json',
                    'X-CSRFToken': 'tu_token_csrf'
                },
                body: JSON.stringify({ correo })
            });
            const estadoData = await estadoResponse.json();
            if (estadoResponse.ok) {
                const { ultima_cancion, ultima_minutos } = estadoData;

                // Segundo, obtenemos los detalles de la última canción, incluyendo el archivo MP3
                const cancionResponse = await fetch(devolverCancionUrl, {
                    method: 'POST',
                    headers: {
                        'accept': 'application/json',
                        'Content-Type': 'application/json',
                        'X-CSRFToken': 'tu_token_csrf'
                    },
                    body: JSON.stringify({ cancionId: ultima_cancion })
                });
                const cancionData = await cancionResponse.json();
                if (cancionResponse.ok) {
                    const { cancion } = cancionData;

                     // Obtener la lista de artistas para la canción
                    const artistas = await fetchArtistsForSong(ultima_cancion);

                    // Tercero, actualizamos el reproductor con la nueva canción y el tiempo guardado
                    updateTrack({
                        id: cancion.id,
                        src: base64ToAudioSrc(cancion.archivoMp3),
                        nombre: cancion.nombre,
                        imagen: getImageUrl(cancion.id),
                        artistas: artistas
                    });
                    audioRef.current.currentTime = ultima_minutos;
                    console.log("Canción cargada y lista para reproducirse desde el último punto guardado.");
                }
            }
        } catch (error) {
            console.error('Error al obtener el estado de la canción o al cargar la canción:', error);
        }
    };

    
    const pause = () => {
        audioRef.current.pause();
        setIsPlaying(false);
        actualizarEstadoCancion();
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
    
    const updateTrack = (track) => {
        if (track.src) {
            audioRef.current.src = track.src;
            audioRef.current.load();
            setCurrentTrack(track);
            setCurrentTrackId(track.id);
        } else {
            console.error('Invalid audio source:', track.src);
        }
    };

    const setTrackList = (list) => {
        setTracks(list);
        if (list.length > 0) {
            setTrackIndex(0);
            updateTrack(list[0]);
        }
    };

    const changeTrack = async (forward = true) => {
        let newIndex = trackIndex + (forward ? 1 : -1);
        if (newIndex >= tracks.length) {
            newIndex = 0;  // Loop to start
        } else if (newIndex < 0) {
            newIndex = tracks.length - 1;  // Loop to end
        }
        await updateTrackDetails(tracks[newIndex]);
        setTrackIndex(newIndex);
    };

    useEffect(() => {
        if (trackIndex >= 0 && trackIndex < tracks.length) {
            updateTrackDetails(tracks[trackIndex]);
        }
    }, [trackIndex, tracks]);

    const adjustVolume = (newVolume) => {
        audioRef.current.volume = newVolume; // Ajusta el volumen del elemento audio
        setVolume(newVolume);  // Actualiza el estado
    };

    const value = {
        currentTrack,
        isPlaying,
        play,
        pause,
        audioRef,
        trackIndex,
        setTrackIndex, // Ensure this is correctly passed
        currentTrackId,
        updateTrack,
        changeTrack,
        setTrackList,
        volume,
        adjustVolume,
        tracks,
        setTracks,
        toggleShuffle,
        isShuffling
}   ;

    return <TrackContext.Provider value={value}>{children}</TrackContext.Provider>;
};
