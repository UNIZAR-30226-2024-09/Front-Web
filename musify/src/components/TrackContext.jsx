import React, { createContext, useContext, useRef, useState } from 'react';

const TrackContext = createContext();

export const useTrack = () => useContext(TrackContext);

export const TrackProvider = ({ children }) => {
    const audioRef = useRef(new Audio());
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTrack, setCurrentTrack] = useState({});
    const [currentTrackId, setCurrentTrackId] = useState(null);
    const [volume, setVolume] = useState(0.5);
    const [trackIndex, setTrackIndex] = useState(-1);
    const [tracks, setTracks] = useState([]); // Definición correcta de tracks y setTracks

    const play = () => {
        audioRef.current.play();
        setIsPlaying(true);
    };

    const pause = () => {
        audioRef.current.pause();
        setIsPlaying(false);
    };

    const setTrackList = (list) => {
        console.log("Setting track list:", list);  // Imprimir el listado de pistas
        setTracks(list);
        if (list.length > 0 && trackIndex === -1) {
            setTrackIndex(0);
        }
    };

    const changeTrack = (next) => {
        console.log('Current track index:', trackIndex); // Muestra el índice actual
        const newIndex = next ? trackIndex + 1 : trackIndex - 1;
        console.log('New track index:', newIndex); // Muestra el nuevo índice
        if (newIndex < 0 || newIndex >= tracks.length) return;
        setTrackIndex(newIndex);
        audioRef.current.src = tracks[newIndex].archivo_mp3;
        console.log('New track src:', tracks[newIndex].archivo_mp3); // Muestra la nueva fuente
        play();
    };
    
    const updateTrack = (track) => {
        if (currentTrack.src !== track.src) {
            audioRef.current.src = track.src;
            setCurrentTrack(track);
            setCurrentTrackId(track.id);
        }
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
        currentTrackId,
        updateTrack,
        volume,
        adjustVolume,  
        tracks,
        setTrackList,
        changeTrack
    };

    return <TrackContext.Provider value={value}>{children}</TrackContext.Provider>;
};
