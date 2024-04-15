import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios"; // Asegúrate de tener axios instalado

export default function CurrentTrack() {
    const [track, setTrack] = useState({
        nombre: "",
        artista: "", // Asumiendo que agregarás el campo 'artista' en tu backend
        imagen: "/imagenes/prueba.jpg", // Valor predeterminado
    });

    useEffect(() => {
        axios.get("//cancion-actual")
            .then(response => {
                const data = response.data;
                setTrack({
                    nombre: data.nombre,
                    imagen: data.nombre_foto, // Asumiendo que esto es un URL directo
                });
            })
            .catch(error => {
                console.log("Error al obtener la canción actual:", error);
            });
    }, []);
    

    return (
        <Container>
            <div className="track">
                <div className="track__image">
                    <img src={track.imagen} alt="Portada de la Canción" style={{ width: "70px", height: "auto" }}/>
                </div>
                <div className="track__info">
                    <h4>{track.nombre}</h4>
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
            h4 {
                color: white;
                font-size: 15px; // Corrección: debería ser 'px' no 'x'
                margin-bottom: 0;
                margin-top: 20px;
            }
            h6 {
                color: #b3b3b3;
                font-size: 10px;
                margin-bottom: 50px;
            }
        }
    }
`;
