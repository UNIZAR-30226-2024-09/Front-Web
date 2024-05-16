import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { BsFillPlayCircleFill, BsFillPauseCircleFill, BsShuffle} from "react-icons/bs";
import { CgPlayTrackNext, CgPlayTrackPrev } from "react-icons/cg";
import { FiRepeat } from "react-icons/fi";
import { PiMicrophoneStageFill } from "react-icons/pi";
import Progress from "../Progress/progress";
import { useTrack } from '../../TrackContext/trackContext'; 
import LyricsWindow from '../lyricsModal/lyricsVentana';

export default function PlayerControls() {
    const {
        isPlaying,
        play,
        pause,
        audioRef,
        currentTrackId,
        changeTrack,
        isShuffling,
        toggleShuffle,
    } = useTrack();

    const [lyrics, setLyrics] = useState([]);
    const [showLyrics, setShowLyrics] = useState(false);
    const [isRepeating, setIsRepeating] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    
    useEffect(() => {
        if (isPlaying) {
            audioRef.current.play();
        } else {
            audioRef.current.pause();
        }
    }, [isPlaying, audioRef.current]);
    

    useEffect(() => {
        const audio = audioRef.current;
    
        const onCanPlay = () => {
            if (isPlaying) play();  // Reproducir solo si el estado previo era 'reproduciendo'
        };
    
        audio.addEventListener('canplay', onCanPlay);
    
        return () => {
            audio.removeEventListener('canplay', onCanPlay);
        };
    }, [isPlaying, play, audioRef]);
    
    const toggleRepeat = () => {
        setIsRepeating(!isRepeating);  // Cambia el estado de isRepeating
    };
    
    useEffect(() => {
        if (isPlaying) {
            audioRef.current.play();
        } else {
            audioRef.current.pause();
        }
    }, [isPlaying, audioRef.current]);
    
    const togglePlayPause = () => {
        if (isPlaying) {
            pause();
        } else {
            play();
        }
    };
    
    const handleNextTrack = () => {
        changeTrack(true);
    };
    
    const handlePrevTrack = () => {
        changeTrack(false);
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
                audio.currentTime = 0;
                play();
            } else {
                changeTrack(true);
                play();  // Asegúrate de llamar a play para comenzar la siguiente canción
            }
        };
    
        audio.addEventListener('ended', onEnded);
    
        return () => {
            audio.removeEventListener('ended', onEnded);
        };
    }, [audioRef, isRepeating, changeTrack, play]);  // Incluye 'play' en las dependencias si es una función obtenida del contexto
        
    const handleShowLyrics = () => setShowLyrics(true);
    const handleCloseLyrics = () => setShowLyrics(false);

    useEffect(() => {
        const onLoadedData = () => {
            if (isPlaying) play();
        };
        const audio = audioRef.current;
        audio.addEventListener('loadeddata', onLoadedData);
    
        return () => audio.removeEventListener('loadeddata', onLoadedData);
    }, [audioRef, isPlaying, play]);
    

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

    const handleTimeChange = (e) => {
        const newTime = parseFloat(e.target.value);
        audioRef.current.currentTime = newTime; // Establece directamente el nuevo tiempo en el elemento de audio
        setCurrentTime(newTime); // Actualiza el estado para reflejar el cambio en la interfaz de usuario
    };

    useEffect(() => {
        const audio = audioRef.current;
    
        const onEnded = () => {
            if (isRepeating) {
                audio.currentTime = 0;
                play();  // Reproduce la misma canción de nuevo
            } else {
                handleNextTrack();  // Pasa a la siguiente pista automáticamente
            }
        };
    
        audio.addEventListener('ended', onEnded);
    
        return () => {
            audio.removeEventListener('ended', onEnded);
        };
    }, [audioRef, isRepeating, play, handleNextTrack]); // Añade handleNextTrack a la lista de dependencias
    
    const repeatIconStyle = isRepeating ? { color: 'red' } : { color: 'grey' };

    return (
        <Container>
            <div className="shuffle" onClick={toggleShuffle}>
                <BsShuffle style={{ color: isShuffling ? 'red' : 'grey' }} />
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
                onTimeUpdate={handleTimeChange}
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