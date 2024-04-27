import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { BsFillPlayCircleFill, BsFillPauseCircleFill, BsShuffle} from "react-icons/bs";
import { CgPlayTrackNext, CgPlayTrackPrev } from "react-icons/cg";
import { FiRepeat } from "react-icons/fi";
import { PiMicrophoneStageFill } from "react-icons/pi";
import Progress from "../Progress/progress";
import { useTrack } from '../TrackContext/trackContext'; 
import LyricsWindow from '../lyricsModal/lyricsVentana';
import { FaHeart } from "react-icons/fa";

export default function PlayerControls() {
    const {
        isPlaying,
        play,
        pause,
        audioRef,
        currentTrackId,
        changeTrack,
        trackIndex,
        tracks, 
        setTrackIndex,
        updateTrack,
        isShuffling,
        toggleShuffle,
    } = useTrack();


    const [lyrics, setLyrics] = useState([]);
    const [showLyrics, setShowLyrics] = useState(false);
    const [isRepeating, setIsRepeating] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [isFavorited, setIsFavorited] = useState(false);

    // Función para verificar si la canción actual es favorita
    const checkIfFavorited = async () => {
        const email = "zineb@gmail.com";
        const cancionId = currentTrackId;
        const url = 'http://localhost:8000/esFavorita';  // Asegúrate de que la URL sea correcta

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'Content-Type': 'application/json',
                    'X-CSRFToken': 'xsxNP3cl2YT0BaNA3CcZXs9baPGpgJR4Ba9NBLXWreieGa1d78TWoh9ufCrzPiYC'
                },
                body: JSON.stringify({ correo: email, cancionId: cancionId })
            });
            const data = await response.json();
            if (response.ok) {
                setIsFavorited(data.esFavorita);  // Asumiendo que la API responde con un campo booleano `esFavorita`
            }
        } catch (error) {
            console.error('Error al verificar si la canción es favorita:', error);
        }
    };

    // Efecto para verificar el estado favorito cada vez que cambia currentTrackId
    useEffect(() => {
        if (currentTrackId) {
            checkIfFavorited();
        }
    }, [currentTrackId]);

    const handleFavorite = () => {
        const email = "zineb@gmail.com";
        const cancionId = currentTrackId;
        const shouldBeFavorited = !isFavorited;
    
        setIsFavorited(shouldBeFavorited);
    
        const url = 'http://localhost:8000/editarCancionFavoritos/';
        const body = {
            correo: email,
            cancionId: cancionId,
            favorito: shouldBeFavorited ? "True" : "False"
        };
    
        fetch(url, {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json',
                'X-CSRFToken': 'xsxNP3cl2YT0BaNA3CcZXs9baPGpgJR4Ba9NBLXWreieGa1d78TWoh9ufCrzPiYC'
            },
            body: JSON.stringify(body)
        })
        .then(response => response.json())
        .then(data => {
            if (!data.message.includes("éxito")) {
                // Si hay un problema, revertir el estado visual
                setIsFavorited(!shouldBeFavorited);
                console.error('Error de la API:', data.message);
            }
        })
        .catch(error => {
            // Revertir el estado en caso de error de red
            setIsFavorited(!shouldBeFavorited);
            console.error('Error al comunicarse con la API:', error);
        });
    };
    
    
    
    const togglePlayPause = () => {
        if (isPlaying) {
            pause();
        } else {
            play();
        }
    };

    const handlePrevTrack = () => {
        changeTrack(false);
    };

    const handleNextTrack = () => {
        const newIndex = (trackIndex + 1) % tracks.length;
        setTrackIndex(newIndex);
        updateTrack(tracks[newIndex]);
    };
    

    useEffect(() => {
        console.log("Current Track ID:", currentTrackId);  // Imprimir el ID de la pista actual
    }, [currentTrackId]);

    useEffect(() => {
        if (currentTrackId) {
            import(`../Lyrics/${currentTrackId}.js`)
                .then(songLyrics => {
                    console.log("Letras cargadas:", songLyrics.default);  // Accediendo al default export
                    if (Array.isArray(songLyrics.default)) {
                        setLyrics(songLyrics.default);
                    } else {
                        console.error('The lyrics are not an array:', songLyrics.default);
                        setLyrics([]);
                    }
                })
                .catch(err => {
                    console.error("No se pudo cargar las letras", err);
                    setLyrics([]);
                });
        }
    }, [currentTrackId]);

    useEffect(() => {
        const audio = audioRef.current;
    
        const onEnded = () => {
            if (isRepeating) {
                play();  // Reproduce la misma canción de nuevo
            } else {
                changeTrack(true);  // Pasa a la siguiente pista
            }
        };
    
        audio.addEventListener('ended', onEnded);
    
        return () => {
            audio.removeEventListener('ended', onEnded);
        };
    }, [audioRef, isRepeating, play, changeTrack]); // Añade changeTrack a la lista de dependencias
    
    
    
    const handleShowLyrics = () => setShowLyrics(true);
    const handleCloseLyrics = () => setShowLyrics(false);


    useEffect(() => {
        const audio = audioRef.current;

        const onLoadedMetadata = () => {
            setDuration(audio.duration);
        };
        const onTimeUpdate = () => {
            setCurrentTime(audio.currentTime);
        };

        audio.addEventListener('loadedmetadata', onLoadedMetadata);
        audio.addEventListener('timeupdate', onTimeUpdate);

        return () => {
            audio.removeEventListener('loadedmetadata', onLoadedMetadata);
            audio.removeEventListener('timeupdate', onTimeUpdate);
        };
    }, [audioRef]);

    useEffect(() => {
        const audio = audioRef.current;
    
        const onEnded = () => {
            if (isRepeating) {
                play();
            }
        };
    
        audio.addEventListener('ended', onEnded);
    
        return () => {
            audio.removeEventListener('ended', onEnded);
        };
    }, [audioRef, isRepeating, play]);

    const toggleRepeat = () => {
        setIsRepeating(!isRepeating);
    };
    
    const repeatIconStyle = isRepeating ? { color: 'red' } : { color: 'grey' };

    return (
        <Container>
            <div className="shuffle" onClick={toggleShuffle}>
                <BsShuffle style={{ color: isShuffling ? 'red' : 'grey' }} />
            </div>
            <div className="track__actions">
                    <div onClick={handleFavorite}>
                        {isFavorited ? <FaHeart color="red" /> : <FaHeart color="white" />}
                    </div>
            </div>
            <div className="previous" onClick={handlePrevTrack}><CgPlayTrackPrev /></div>
            <div className="state" onClick={togglePlayPause}>
                {isPlaying ? <BsFillPauseCircleFill /> : <BsFillPlayCircleFill />}
            </div>
            <div className="next" onClick={handleNextTrack}><CgPlayTrackNext /></div>
            <div className="repeat" onClick={toggleRepeat}>
                <FiRepeat style={repeatIconStyle} />
            </div>

            <div className="progress-bar">
                <Progress 
                    currentTime={currentTime} 
                    duration={duration} 
                    onTimeUpdate={(e) => {
                        audioRef.current.currentTime = parseFloat(e.target.value);
                        setCurrentTime(parseFloat(e.target.value));
                    }} 
                />
            </div>
            <PiMicrophoneStageFill onClick={handleShowLyrics} style={{ cursor: 'pointer' }} />
            {showLyrics && <LyricsWindow lyrics={lyrics} currentTime={currentTime} onClose={handleCloseLyrics} />}
        </Container>
    );
}

const Container = styled.div`
   display: flex;
   align-items: center;
   justify-content: center;
   gap: 2rem;
   position: relative;
   width: 100%;
   height: 100px;
   padding-bottom: 25px; 

   svg {
    color: #b3b3b3;
    transition: 0.2s ease-in-out;
    &:hover {
        color: white;
    }
   }
   .state {
    svg {
        color: white;
    }
   }
   .previous,.next,.state {
        font-size: 2rem;
   }

   .progress-bar {
        margin: 0;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        bottom: 0px;
        width: 80%;
        z-index: 1;
    }

    .time-info {
        color: #fff;
        margin-top: 10px;
    }
`;
