import React, { useState, useEffect, useRef } from 'react';
import styled from "styled-components";
import { FaChevronLeft, FaChevronRight, FaPlay, FaPause } from 'react-icons/fa';
import { useTrack } from "./TrackContext";

const base64ToImageSrc = (base64) => {
    console.log("Base64 original:", base64); // Imprimir la base64 original

    // Eliminar el prefijo de la cadena base64 si está presente
    const base64WithoutPrefix = base64.replace(/^data:image\/[a-z]+;base64,/, '');
    console.log("Base64 sin prefijo:", base64WithoutPrefix); // Imprimir la base64 sin prefijo

    // Decodificar la cadena base64
    const byteCharacters = atob(base64WithoutPrefix);
    console.log("Caracteres de bytes:", byteCharacters); // Opcional: Imprimir los caracteres después de atob
    const imageSrc = `data:image/jpeg;base64,${atob(base64WithoutPrefix)}`;
    console.log("Imagen transformada:", imageSrc); // Imprimir el src de la imagen transformada
    return imageSrc;
};

const base64ToAudioSrc = (base64) => {
    console.log("Base64 original:", base64); // Imprimir la base64 original

    // Eliminar cualquier prefijo incorrecto y asegurar que es el correcto para audio/mp3
    const base64WithoutPrefix = base64.replace(/^data:audio\/mp3;base64,/, '').replace(/^data:[^;]+;base64,/, '');
    const audioSrc = `data:audio/mp3;base64,${atob(base64WithoutPrefix)}`;
    console.log("Audio transformado:", audioSrc); // Imprimir el src del audio transformado

    return audioSrc;
};

export default function Body_inicio() {
    const [canciones, setCanciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await fetch('http://127.0.0.1:8000/listarCanciones/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({})
                });
                if (response.ok) {
                    const data = await response.json();
                    const updatedCanciones = data.canciones.slice(0, 3).map(cancion => {
                        return {
                            ...cancion,
                            id: cancion.id,
                            foto: base64ToImageSrc(cancion.foto),
                            archivo_mp3: base64ToAudioSrc(cancion.archivo_mp3)
                        };
                    });
                    setCanciones(updatedCanciones);
                } else {
                    const errorData = await response.text();
                    throw new Error(errorData || "Error al recibir datos");
                }
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const { setTrackList } = useTrack();



    if (loading) return <p>Cargando...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!canciones.length) return <p>No hay canciones disponibles</p>;

    return (
        <Container>
            <ButtonContainer>
                <ButtonStyled>Todo</ButtonStyled>
                <ButtonStyled>Música</ButtonStyled>
                <ButtonStyled>Podcasts</ButtonStyled>
            </ButtonContainer>
            <SectionTitle>Has escuchado recientemente</SectionTitle>
            <SongRow canciones={canciones.slice(0, 7)} />
            <SectionTitle>Hecho para Usuario</SectionTitle>
            <SongRow canciones={canciones.slice(3, 7)} />
            <SectionTitle>Top Canciones</SectionTitle>
            <SongRow canciones={canciones.slice(3, 7)} />
        </Container>
    );
}

const SongRow = ({ canciones }) => {
    const { updateTrack, play, pause, isPlaying, audioRef } = useTrack();
    const scrollRef = useRef(null);
    const [playingIndex, setPlayingIndex] = useState(-1); // Índice de la canción actualmente en reproducción
    const [hoverIndex, setHoverIndex] = useState(-1); // Índice de la canción sobre la que se encuentra el mouse
    const audioRefs = useRef([]);

    const handleScroll = (direction) => {
        const distance = direction === 'left' ? -100 : 100;
        scrollSmoothly(scrollRef, distance);
    };

    const togglePlayPause = (index) => {
        const selectedSong = canciones[index];
        if (!audioRefs.current[index].src) {
            audioRefs.current[index].src = selectedSong.archivo_mp3; // Solo establece el src cuando es necesario
        }
        updateTrack({
            id: selectedSong.id,
            src: selectedSong.archivo_mp3,
            nombre: selectedSong.nombre,
            artista: selectedSong.artista,
            imagen: selectedSong.foto
        });
        
        if (audioRef.current.src && isPlaying) {
            pause();
        } else {
            play();
        }
    };

    return (
        <RowContainer>
            <ArrowButton onClick={() => handleScroll('left')}>
                <FaChevronLeft />
            </ArrowButton>
            <ImagesContainer ref={scrollRef}>
                {canciones.map((cancion, index) => (
                    <ImageBox key={index}
                              onMouseEnter={() => setHoverIndex(index)}
                              onMouseLeave={() => setHoverIndex(-1)}
                              onClick={() => togglePlayPause(index)}>
                        <ImgContainer>
                            <img src={cancion.foto} alt={cancion.nombre || 'Desconocido'} />
                            {hoverIndex === index && (
                                <PlayIconContainer isVisible={true}>
                                    {/* Mostrar el ícono de pausa solo si el índice coincide y está en reproducción */}
                                    {playingIndex === index && isPlaying ? <FaPause size="3em" /> : <FaPlay size="3em" />}
                                </PlayIconContainer>
                            )}
                            <audio ref={(el) => audioRefs.current[index] = el} src={cancion.archivo_mp3} />
                        </ImgContainer>
                        <p>{cancion.nombre}</p>
                    </ImageBox>
                ))}
            </ImagesContainer>
            <ArrowButton onClick={() => handleScroll('right')}>
                <FaChevronRight />
            </ArrowButton>
        </RowContainer>
    );
};

const RowContainer = styled.div`
    display: flex;
    align-items: center;
    position: relative;
`;

const scrollSmoothly = (ref, distance) => {
    ref.current.scrollBy({
        left: distance,
        behavior: 'smooth'
    });
}

const ImagesContainer = styled.div`
    display: flex;
    flex-direction: row;
    gap: 20px;
    overflow-x: auto;
    overflow-y: hidden;
    scroll-behavior: smooth;
    scrollbar-width: none;
    &::-webkit-scrollbar {
        display: none; 
    }
    -ms-overflow-style: none;
`;


const ImageBox = styled.div`
    flex: 0 0 auto;
    width: 200px; 
    height: 200px; 
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    img {
        width: 70%;
        height: 70%;
        object-fit: cover;
        border-radius:none;
        cursor: pointer; // Agregar cursor pointer para indicar que es interactivo
    }

    p {
        margin-top: 10px;
        font-size: 16px;
        color: #fff;
        text-align: center;
    }
`;


const ArrowButton = styled.button`
    background: #575151;
    border: none;
    color: #fff;
    cursor: pointer;
    font-size: 24px;
    padding: 10px 15px;
    user-select: none;
    transition: background-color 0.3s ease;
    &:hover {
        background-color: #54b2e7; // Color de fondo al pasar el mouse
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

const ImgContainer = styled.div`
    position: relative;
    img {
        width: 90px;
        height: 90px;
        object-fit: cover;
        border-radius: none;
        cursor: pointer;
        transition: filter 0.3s ease;
    }
    &:hover img {
        filter: grayscale(70%);
    }
`;

const PlayIconContainer = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: ${({ isVisible }) => isVisible ? 'block' : 'none'}; // Esto controla la visibilidad del ícono
`;