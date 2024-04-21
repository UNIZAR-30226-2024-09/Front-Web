import React, { useState } from "react";
import styled from "styled-components";
import { useTrack } from "./TrackContext";
import { FaHeart, FaRegHeart, FaStar } from "react-icons/fa";

export default function CurrentTrack() {
    const { currentTrack } = useTrack();
    const [isFavorited, setIsFavorited] = useState(false);
    const [rating, setRating] = useState(0);

    if (!currentTrack) return <div>No track selected</div>;

    const handleFavorite = () => {
        setIsFavorited(!isFavorited);
    };

    const handleRating = (index) => {
        setRating(index);
    };

    return (
        <Container>
            <div className="track">
                <div className="track__image">
                    <img src={currentTrack.imagen} alt="Portada de la Canción" style={{  color: "white", width: "70px", height: "auto" }}/>
                </div>
                <div className="track__info">
                    <h4>{currentTrack.nombre}</h4>
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
                    <h6>{currentTrack.artista}</h6>
                </div>
                <div className="track__actions">
                    <div onClick={handleFavorite}>
                        {isFavorited ? <FaHeart color="red" /> : <FaRegHeart color="white" />}
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

        &__info {
            display: flex;
            flex-direction: column;
            gap: 0.3rem;
            
            h4, h6 {
                margin: 0;
                h4 {
                    color: white;
                    font-size: 15px;
                    margin-top: 20px;
                }
                h6 {
                    color: white;
                    font-size: 10px;
                    margin-top: 0.5rem;
                }
            }

            .rating {
                display: flex;
                button {
                    background: none;
                    border: none;
                    cursor: pointer;
                }
            }
        }
        
        &__actions {
            margin-left: auto; // Move heart to the right
            display: flex;
            align-items: center;
        }
    }
`;
