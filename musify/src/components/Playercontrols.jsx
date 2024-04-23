import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { BsFillPlayCircleFill, BsFillPauseCircleFill, BsShuffle } from "react-icons/bs";
import { CgPlayTrackNext, CgPlayTrackPrev } from "react-icons/cg";
import { FiRepeat } from "react-icons/fi";
import { PiMicrophoneStageFill } from "react-icons/pi";
import Progress from "./Progress";
import { useTrack } from './TrackContext';  // Ensure this correctly imports the context
import LyricsWindow from './LyricsWindow';

export default function PlayerControls() {
    const { isPlaying, play, pause, audioRef, currentTrackId, changeTrack } = useTrack();  // Asumiendo que currentTrackId tiene el ID de la canción actual
    const [lyrics, setLyrics] = useState([]);
    const [showLyrics, setShowLyrics] = useState(false);


    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);

    // Este useEffect se encargará de imprimir currentTrackId cada vez que cambie
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
        changeTrack(true);
    };


    const formatTime = (time) => `${Math.floor(time / 60)}:${Math.floor(time % 60).toString().padStart(2, '0')}`;

    return (
        <Container>
            <div className="shuffle"><BsShuffle /></div>
            <div className="previous" onClick={handlePrevTrack}><CgPlayTrackPrev /></div>
            <div className="state" onClick={togglePlayPause}>
                {isPlaying ? <BsFillPauseCircleFill /> : <BsFillPlayCircleFill />}
            </div>
            <div className="next" onClick={handleNextTrack}><CgPlayTrackNext /></div>
            <div className="repeat"><FiRepeat /></div>
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
