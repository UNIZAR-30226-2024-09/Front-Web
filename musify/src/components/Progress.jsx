import React, { useState } from "react";
import styled from "styled-components";


export default function Progress() {
    const [currentTime, setCurrentTime] = useState(0)

    const handleTimeUpdate = () => {
        setCurrentTime(currentTime)
    }

    const formatTime = time => {
        if (time == null) return `0:00`
    
        const seconds = Math.floor(time % 60)
        const minutes = Math.floor(time / 60)
    
        return `${minutes}:${seconds.toString().padStart(2, '0')}`
    }

    const duration = 60 //por ejempo

    return <Container>
        <span className = "time">00:00</span>
        <input value={[currentTime]} min={0} max={duration} 
            onValueChange={(value) => {
                const [newCurrentTime] = value
                currentTime = newCurrentTime
            }}
        
        />
        <span className = "time">{formatTime(duration)}</span>
    </Container>
}


const Container = styled.div`
    display: flex;
    justify-content: space-between;
    align-content: center;
    padding: 0;
    input {
        width: 40rem;
        border-radius: 2rem;
        height: 0.5rem;
    }

    .time{
        font-size: 0.8rem;
        color: white;
    }
`;