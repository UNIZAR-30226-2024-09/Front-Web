import React from "react";
import styled from "styled-components";

export default function CurrentTrack() {
    return <Container>
       <div className="track">
        <div className="track__image">
            <img src="/imagenes/prueba.jpg" style={{ width: "50px", height: "auto" }}/>
        </div>
        <div className="track__info">
            <h4>Outside</h4>
            <h6>Calvin Harris</h6>
        </div>
       </div>
    </Container>
}

const Container = styled.div`
    .track{
        display: flex;
        align-items: center;
        gap: 1rem;
        &__info {
            display: flex;
            flex-direction: column;
            gap: 0.3rem;
            h4 {
                color: white;
            }
            h6{
                color: #b3b3b3;
            }
        }
    }
`;