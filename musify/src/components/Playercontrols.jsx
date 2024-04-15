import React, { useState, useRef, useEffect} from "react";
import styled from "styled-components";
import {
    BsFillPlayCircleFill,
    BsFillPauseCircleFill,
    BsShuffle,
} from "react-icons/bs";
import { CgPlayTrackNext, CgPlayTrackPrev } from "react-icons/cg";
import { FiRepeat } from "react-icons/fi";
import Progress from "./Progress";
import LyricsWindow from './LyricsWindow'; // Asegúrate de que la ruta de importación es correcta
import { songLyrics } from './Lyrics'; // Asume que aquí es donde tienes las letras de tus canciones
import cancion from "./assets/Homecoming.mp3";
import { PiMicrophoneStageFill } from "react-icons/pi";

export default function PlayerControls() {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(new Audio(cancion));
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [currentLyric, setCurrentLyric] = useState(null); // Añade este nuevo estado para la letra actual
    const [showLyricsModal, setShowLyricsModal] = useState(false);


    useEffect(() => {
        // Event listener para cargar metadata
        audioRef.current.addEventListener('loadedmetadata', () => {
            setDuration(audioRef.current.duration);
        });

        // Event listener para actualizar el tiempo actual
        const updateTime = () => {
            setCurrentTime(audioRef.current.currentTime);

            // Mueve la lógica para encontrar la letra actual aquí, dentro de updateTime
            const lyric = songLyrics.filter(lyric => lyric.time <= audioRef.current.currentTime).pop(); // Encuentra la última línea relevante
            setCurrentLyric(lyric); // Actualiza el estado con la nueva letra actual
        };
        audioRef.current.addEventListener('timeupdate', updateTime);

        // Limpieza de los event listeners al desmontar
        return () => {
            audioRef.current.removeEventListener('loadedmetadata', updateTime);
            audioRef.current.removeEventListener('timeupdate', updateTime);
        };
    }, [songLyrics]); // Añade songLyrics a las dependencias si tus letras podrían cambiar

    const handleTimeUpdate = (e) => {
        const newTime = e.target.value;
        audioRef.current.currentTime = newTime;
        setCurrentTime(newTime);
    };

    const togglePlayPause = () => {
        setIsPlaying(!isPlaying);
        if (!isPlaying) {
            audioRef.current.play();
        } else {
            audioRef.current.pause();
        }
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };


    return <Container>
        <div className="shuffle">
            <BsShuffle />
        </div>
        <div className="previous">
            <CgPlayTrackPrev />
        </div>
        <div className="state"onClick={togglePlayPause}>
            {isPlaying ? <BsFillPauseCircleFill /> : <BsFillPlayCircleFill />}
        </div>
        <div className="next">
            <CgPlayTrackNext />
        </div>
        <div className="repeat">
            <FiRepeat />
        </div>
        <div className="progress-bar">
            <Progress 
                currentTime={currentTime} 
                duration={duration} 
                onTimeUpdate={handleTimeUpdate}
            />
        </div>
        <PiMicrophoneStageFill onClick={() => setShowLyricsModal(true)} style={{ cursor: 'pointer' }} />
        {showLyricsModal && <LyricsWindow lyrics={currentLyric ? [currentLyric] : []} onClose={() => setShowLyricsModal(false)} />}
    </Container>
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
