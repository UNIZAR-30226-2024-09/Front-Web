// TrackContext.js
import React, { createContext, useContext, useRef, useState } from 'react';

const TrackContext = createContext();

export const useTrack = () => useContext(TrackContext);

export const TrackProvider = ({ children }) => {
    const audioRef = useRef(new Audio());
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTrack, setCurrentTrack] = useState({});

    const play = () => {
        audioRef.current.play();
        setIsPlaying(true);
    };

    const pause = () => {
        audioRef.current.pause();
        setIsPlaying(false);
    };

    const updateTrack = (track) => {
        if (currentTrack.src !== track.src) {
            audioRef.current.src = track.src; // Assuming 'src' is a property of 'track'
            setCurrentTrack(track);
        }
    };

    const value = {
        currentTrack,
        isPlaying,
        play,
        pause,
        audioRef,
        updateTrack
    };

    return (
        <TrackContext.Provider value={value}>
            {children}
        </TrackContext.Provider>
    );
};
