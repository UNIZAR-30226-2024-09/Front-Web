import React, { useState } from "react";
import styled from "styled-components";
import { useTrack } from "../../TrackContext/trackContext";
import { FaStar } from "react-icons/fa";

export default function CurrentTrack() {
    const { currentTrack } = useTrack();
    const [rating, setRating] = useState(0);

    if (!currentTrack) return <div>No track selected</div>;

    const handleRating = (index) => {
        setRating(index);
    };

    return (
        <Container>
            <div className="track">
                <div className="track__image">
                    <img src={currentTrack.imagen} alt="Portada de la Canción" style={{ width: "70px", height: "auto" }} />
                </div>
                <div className="track__info">
                    <h4>{currentTrack.nombre}</h4>
                    <h6>{currentTrack.artista || 'Artista Desconocido'}</h6>
                    <div className="rating">
                        {[...Array(5)].map((star, index) => {
                            index += 1;
                            return (
                                <button
                                    key={index}
                                    onClick={() => handleRating(index)}
                                    style={{ color: index <= rating ? "#ffc107" : "#e4e5e9" }}
                                >
                                    <FaStar />
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </Container>
    );
}

const Container = styled.div`
    .track {
        display: flex;
        align-items: center;
        gap: 1rem;
        background: none;

        &__info {
            display: flex;
            flex-direction: column;
            gap: 0.3rem;

            h4 {
                font-size: 16px;
                font-weight: 700;
                margin: 0;
                margin-top: 0px;
                color: #fff;
            }

            h6 {
                font-size: 10px; 
                font-weight: 700;
                margin: 0;
                margin-top: 0rem;
                color: #fff; 
            }

            .rating {
                display: flex;
                button {
                    background: none;
                    border: none;
                    cursor: pointer;
                    color: #e4e5e9;

                    &:hover {
                        color: #ffc107; 
                    }
                }
            }
        }
        
        &__actions {
            margin-left: auto;
            display: flex;
            align-items: center;

            svg {
                fill: currentColor;
            }
        }
    }
`;
