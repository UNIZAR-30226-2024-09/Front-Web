import React, { createContext, useContext, useRef, useState, useEffect} from 'react';

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

    useEffect(() => {
        if (trackIndex >= 0 && trackIndex < tracks.length) {
            updateTrack(tracks[trackIndex]);
        }
    }, [trackIndex, tracks]);
    

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

    const updateTrack = (track) => {
        if (!currentTrack || currentTrack.src !== track.src) {
            audioRef.current.src = track.src;
            setCurrentTrack(track);
            setCurrentTrackId(track.id);
        }
    };

    const changeTrack = (forward = true) => {
        const indexIncrement = forward ? 1 : -1;
        const newIndex = (trackIndex + indexIncrement + tracks.length) % tracks.length;
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
        setTracks
    };

    return <TrackContext.Provider value={value}>{children}</TrackContext.Provider>;
};
