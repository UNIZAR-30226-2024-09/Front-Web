import React from "react";
import styled from "styled-components";
import { FiVolume2 } from 'react-icons/fi';
import { MdQueueMusic } from "react-icons/md";
import { useTrack } from './TrackContext';  // Asegúrate de importar useTrack desde su ubicación correcta
import LyricsWindow from './LyricsWindow';

export default function Volume() {
    const { volume, adjustVolume, toggleLyrics, showLyrics } = useTrack();  // Utiliza useTrack para acceder a las funciones y estados del contexto

    const handleVolumeChange = e => {
        adjustVolume(e.target.value / 100); // Ajusta el volumen a través del contexto, convierte el valor a un número entre 0 y 1
    };

    return (
        <Container>
            <MdQueueMusic color="white" size="24px" />
            <FiVolume2 color="white" size="24px" />
            {/* Asegúrate de que el valor del input refleje el volumen del contexto correctamente */}
            <input type="range" min={0} max={100} value={volume * 100} onChange={handleVolumeChange} />
            {showLyrics && <LyricsWindow />}
        </Container>
    );
}

const Container = styled.div`
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 10px;

    input {
        width: 15rem;
        border-radius: 2rem;
        height: 0.5rem;
    }
`;
