import React, { createContext, useContext, useRef, useState, useEffect } from 'react';

// Contexto para manejar el audio globalmente
const AudioContext = createContext();

export const AudioProvider = ({ children }) => {
    const audioRef = useRef(new Audio());
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    useEffect(() => {
        const audio = audioRef.current;

        const handleLoadedMetadata = () => {
            setDuration(audio.duration);
        };

        const handleTimeUpdate = () => {
            setCurrentTime(audio.currentTime);
        };

        audio.addEventListener('loadedmetadata', handleLoadedMetadata);
        audio.addEventListener('timeupdate', handleTimeUpdate);

        return () => {
            audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
            audio.removeEventListener('timeupdate', handleTimeUpdate);
        };
    }, []);

    return (
        <AudioContext.Provider value={{ audioRef, currentTime, duration }}>
            {children}
        </AudioContext.Provider>
    );
};

// Hook para usar el contexto de audio
export const useAudio = () => useContext(AudioContext);
