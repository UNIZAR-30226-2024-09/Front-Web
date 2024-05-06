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
    

    const play = () => {
        audioRef.current.play();
        setIsPlaying(true);
    };

    const actualizarEstadoCancion = async () => {
        const tiempo = Math.floor(audioRef.current.currentTime);
        const correo = "saineb@gmail.com";
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
    
    // Función para obtener la última canción y su estado
    const obtenerUltimoEstadoYReproducir = async () => {
        const correo = "saineb@gmail.com";  // Asumiendo que tienes esta información de la sesión del usuario
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

                    // Tercero, actualizamos el reproductor con la nueva canción y el tiempo guardado
                    updateTrack({
                        id: cancion.id,
                        src: base64ToAudioSrc(cancion.archivoMp3),
                        nombre: cancion.nombre
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
    
    const updateTrack = (track) => {
        const src = base64ToAudioSrc(track.archivoMp3);
        if (src) {
            audioRef.current.src = src;
            setCurrentTrack({ ...track, src });
        } else {
            console.error('Invalid audio source:', track.archivoMp3);
        }
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
            newIndex = Math.floor(Math.random() * tracks.length);
        } else {
            const indexIncrement = forward ? 1 : -1;
            newIndex = (trackIndex + indexIncrement + tracks.length) % tracks.length;
        }
        setTrackIndex(newIndex);
        updateTrack(tracks[newIndex]);
        play();
    };


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
