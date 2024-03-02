import React, { useState } from "react";
import styled from "styled-components";
import {
    BsFillPlayCircleFill,
    BsFillPauseCircleFill,
    BsShuffle,
} from "react-icons/bs";
import { CgPlayTrackNext, CgPlayTrackPrev } from "react-icons/cg" ;
import { FiRepeat } from "react-icons/fi";


export default function Playercontrols() {
    const [isPlaying, setIsPlaying] = useState(false); // Estado inicial: no se está reproduciendo

    const togglePlayPause = () => {
        setIsPlaying(!isPlaying); // Alternar entre verdadero y falso
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

`;