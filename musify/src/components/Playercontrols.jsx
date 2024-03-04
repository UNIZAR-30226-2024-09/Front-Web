import React, { useState } from "react";
import styled from "styled-components";
import {
    BsFillPlayCircleFill,
    BsFillPauseCircleFill,
    BsShuffle,
} from "react-icons/bs";
import { CgPlayTrackNext, CgPlayTrackPrev } from "react-icons/cg" ;
import { FiRepeat } from "react-icons/fi";
import { ProgressBar } from "react-bootstrap";


export default function Playercontrols() {
    const [isPlaying, setIsPlaying] = useState(false); // Estado inicial: no se está reproduciendo
    const [progress, setProgress] = useState(0); // Estado inicial de la barra de progreso

    const togglePlayPause = () => {
        setIsPlaying(!isPlaying); // Alternar entre verdadero y falso
    };

    // Función para actualizar la barra de progreso
    const handleProgressChange = (e) => {
        const newProgress = parseFloat(e.target.value);
        setProgress(newProgress);
    };

    return <Container>
        <div className="shuffle">
            <BsShuffle />
        </div>
        <div className="previous">
            <CgPlayTrackPrev />
        </div>
        <div className="state"onClick={togglePlayPause}>
            {isPlaying ? <BsFillPauseCircleFill /> : <BsFillPlayCircleFill />}
        </div>
        <div className="next">
            <CgPlayTrackNext />
        </div>
        <div className="repeat">
            <FiRepeat />
        </div>
        <div className="progress">
            <ProgressBar
                now={progress}
                label={`${progress}%`}
                onChange={handleProgressChange}
            />
        </div>
    </Container>
}


const Container = styled.div`
   display: flex;
   align-items: center;
   justify-content: center;
   gap: 2rem;
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

   .progress {
        position: center;
        left: 50%;
        transform: translateX(-50%);
        bottom: 100%;
        width: 80%;
        z-index: 1;
   }
`;