import React from "react";
import styled from "styled-components";

const Progress = ({ currentTime, duration, onTimeUpdate }) => {
    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    return (
        <Container>
            <span className="time">{formatTime(currentTime)}</span>
            <input
                type="range"
                value={currentTime}
                onChange={onTimeUpdate} // Aquí usamos la prop para manejar cambios
                min="0"
                max={duration}
                step="1"
            />
            <span className="time">{formatTime(duration)}</span>
        </Container>
    );
};

export default Progress;

const Container = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
    padding-bottom: 10px;
    input {
        width: 100%; // Ajustado para tomar el ancho completo del contenedor
        border-radius: 2rem;
        height: 0.5rem;
    }

    .time{
        font-size: 0.8rem;
        color: white;
    }
`;
