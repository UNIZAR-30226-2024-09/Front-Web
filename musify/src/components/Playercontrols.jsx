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
import Progress from "./Progress";


export default function Playercontrols() {
    const [isPlaying, setIsPlaying] = useState(false); // Estado inicial: no se está reproduciendo
    const [currentTime, setCurrentTime] = useState(0);


    const togglePlayPause = () => {
        setIsPlaying(!isPlaying); // Alternar entre verdadero y falso
    };

    //const currentTime = "00:00"; // Valor de ejemplo
    const duration = "04:30"; // Valor de ejemplo

    // Función para actualizar la barra de progreso
    /*const handleTimeUpdate = (e) => {
        setCurrentTime(newProgress);
    };*/

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
        <div className="progress-bar">
            <Progress />
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

   .progress-bar {
        margin: 0;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        bottom: 10%;
        width: 45%; /* Tamaño de la barra de progreso */
        z-index: 1;
    }
`;