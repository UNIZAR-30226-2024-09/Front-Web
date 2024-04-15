import React, { useState } from "react";
import styled from "styled-components";
import { FiVolume2 } from 'react-icons/fi';
import { MdQueueMusic } from "react-icons/md";
import { PiMicrophoneStageFill } from "react-icons/pi";
import LyricsWindow from './LyricsWindow';

export default function Volume() {
    const [showLyrics, setShowLyrics] = useState(false);
    const setVolume = e => {}

    const toggleLyrics = () => setShowLyrics(!showLyrics);

    return (
        <Container>
           <PiMicrophoneStageFill color="white" size="17px" onClick={toggleLyrics} />
            <MdQueueMusic color="white" size="24px" />
            <FiVolume2 color="white" size="24px" />
            <input type="range" min={0} max={100} onMouseUp={(e) => setVolume(e)} />
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
