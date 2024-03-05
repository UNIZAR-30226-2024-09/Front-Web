import React, { useState } from "react";
import styled from "styled-components";


export default function Progress() {
    const [currentTime, setCurrentTime] = useState(0);

    const handleTimeUpdate = (e) => {
        setCurrentTime(e.target.value);
    };

    const formatTime = (time) => {
    };

    const duration = 60;

    return (
        <Container>
            <span className="time">00:00</span>
            <input 
                type="range" 
                value={currentTime} 
                onChange={handleTimeUpdate} 
                min={0} 
                max={duration} 
                step="1"
            />
            <span className="time">04:30</span>
        </Container>
    );
}



const Container = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
    padding-bottom: 10px;
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