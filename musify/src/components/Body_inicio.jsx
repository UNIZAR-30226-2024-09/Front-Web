import React, { useState, useEffect, useRef } from 'react';
import styled from "styled-components";
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

export default function Body_inicio() {
    const [canciones, setCanciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const cleanBase64 = (base64) => base64.replace('caracteres_incorrectos', '');  // Ajusta esta función según sea necesario.

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await fetch('http://34.175.117.0:8000/listarCanciones/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({})
                });
                if (response.ok) {
                    const data = await response.json();
                    console.log("Datos recibidos:", data);
                    const updatedCanciones = data.canciones.map(cancion => ({
                        ...cancion,
                        // Asegúrate de que el tipo MIME es correcto según el tipo de imágenes que esperas.
                        foto: `data:image/jpeg;base64,${cleanBase64(cancion.foto)}`
                    }));
                    setCanciones(updatedCanciones);
                } else {
                    const errorData = await response.text();  // Cambio aquí para capturar la respuesta no-JSON
                    throw new Error(errorData || "Error al recibir datos");
                }
            } catch (error) {
                setError(error.message);
                console.error("Error fetching data: ", error);
            } finally {
                setLoading(false);
            }
        };
    
        fetchData();
    }, []);
    
    if (loading) return <p>Cargando...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!canciones || canciones.length === 0) return <p>No hay canciones disponibles</p>;
    
    const recientes = canciones.slice(0, 5);
    const personalizadas = canciones.slice(5, 10);
    const topCanciones = canciones.slice(10, 15);

    return (
        <Container>
            <ButtonContainer>
                <ButtonStyled>Todo</ButtonStyled>
                <ButtonStyled>Música</ButtonStyled>
                <ButtonStyled>Podcasts</ButtonStyled>
            </ButtonContainer>
            <SectionTitle>Has escuchado recientemente</SectionTitle>
            <SongRow canciones={recientes} />
            <SectionTitle>Hecho para Usuario</SectionTitle>
            <SongRow canciones={personalizadas} />
            <SectionTitle>Top Canciones</SectionTitle>
            <SongRow canciones={topCanciones} />
        </Container>
    );
}

const SongRow = ({ canciones }) => {
    const scrollRef = useRef(null);

    const scroll = (direction) => {
        if (direction === 'left') {
            scrollRef.current.scrollBy({ left: -100, behavior: 'smooth' });
        } else {
            scrollRef.current.scrollBy({ left: 100, behavior: 'smooth' });
        }
    };

    return (
        <RowContainer>
            <ArrowButton onClick={() => scroll('left')}>
                <FaChevronLeft />
            </ArrowButton>
            <ImagesContainer ref={scrollRef}>
                {canciones.map((cancion, index) => (
                    <ImageBox key={index}>
                        <img src={cancion.foto} alt={cancion.nombre || 'Desconocido'} />
                    </ImageBox>
                ))}
            </ImagesContainer>
            <ArrowButton onClick={() => scroll('right')}>
                <FaChevronRight />
            </ArrowButton>
        </RowContainer>
    );
};

const RowContainer = styled.div`
    display: flex;
    align-items: center;
`;

const ImagesContainer = styled.div`
    display: flex;
    flex-direction: row;
    gap: 20px;
    overflow-x: hidden; // Cambio importante aquí
    scroll-behavior: smooth;
`;

const ImageBox = styled.div`
    flex: 0 0 auto;
    width: 100px;
    height: 100px;
    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 10px;
    }
`;

const ArrowButton = styled.button`
    background: none;
    border: none;
    color: #fff;
    cursor: pointer;
    font-size: 24px;
    padding: 0 10px;
    user-select: none;
    &:hover {
        background-color: #ddd; // Estilo opcional para hover
    }
`;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2rem;
    margin-left: 5cm;
`;

const ButtonContainer = styled.div`
    margin-top: 1cm;
    display: flex;
    flex-direction: row;
    gap: 1cm;
`;

const SectionTitle = styled.h2`
    color: #fff;
    font-size: 16px;
    margin-left: 1rem;
    margin-bottom: none; /* Ajusta este valor para reducir el espacio */
    flex-direction: row;
`;


const ButtonStyled = styled.button`
    width: 90px;
    height: 40px;
    border: none;
    outline: none;
    border-radius: 40px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 700;
    background: #575151;
    color: #fff;
    box-shadow: 0 0 10px rgba(0,0,0, .1);
    border-radius: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    border: #575151;

    &:hover {
        background: #54b2e7;
        color: #fff;
    }
`;

