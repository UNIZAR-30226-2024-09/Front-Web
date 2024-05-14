import React, { useState, useEffect, useRef } from 'react';
import styled from "styled-components";
import { FaChevronLeft, FaChevronRight, FaPlay, FaPause } from 'react-icons/fa';
import { useTrack } from "../../TrackContext/trackContext";
import { useNavigate } from 'react-router-dom';


const getImageSrc = (type, id) => {
    return `http://localhost:8000/imagen${type}/${id}`;
};
const getAudioUrl = (songId) => {
    return `http://localhost:8000/audioCancion/${songId}/`;
};

export default function Body_inicio() {
    const [canciones, setCanciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [podcasts, setPodcasts] = useState([]);
    const [email, setEmail] = useState('');
    const [cancionesRecomendadas, setCancionesRecomendadas] = useState([]);
    const [podcastsRecomendados, setPodcastsRecomendados] = useState([]);
    const { updateTrack, play, pause, isPlaying, currentTrack, audioRef } = useTrack();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserDetails = async () => {
            const token = localStorage.getItem('userToken');
            try {
                const response = await fetch('http://127.0.0.1:8000/obtenerUsuarioSesionAPI/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ token: token })
                });
                const data = await response.json();
                if (response.ok) {
                    setEmail(data.correo);
                } else {
                    console.error('Failed to fetch user details:', data);
                }
            } catch (error) {
                console.error('Error fetching user details:', error);
            }
        };
        fetchUserDetails();
    }, [email]);

    useEffect(() => {
        if(email){
            const fetchData = async () => {
                setLoading(true);
                console.log(email);
                try {
                    const recomendedResponse = await fetch('http://localhost:8000/recomendar/', {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({ correo: email })
                    });
        
                    if (!recomendedResponse.ok) {
                        throw new Error("Failed to fetch data recomendacion");
                    }
                    const recomendedData = await recomendedResponse.json();
    
                    setCancionesRecomendadas(recomendedData.recomendaciones.canciones);
                    setPodcastsRecomendados(recomendedData.recomendaciones.podcasts);
                    console.log(recomendedData.recomendaciones.canciones);
                    console.log(cancionesRecomendadas);
                    console.log(recomendedData.recomendaciones.podcasts);
                    console.log(podcastsRecomendados);
                } catch (error) {
                    setError(error.message);
                } finally {
                    setLoading(false);
                }
            };
            fetchData();
        }
        
    }, [email]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [songsResponse, podcastsResponse] = await Promise.all([
                    fetch('http://127.0.0.1:8000/listarPocasCanciones/', {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'}
                    }),
                    fetch('http://localhost:8000/listarPocosPodcasts/', {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'}
                    })
                ]);
    
                if (!songsResponse.ok || !podcastsResponse.ok) {
                    throw new Error("Failed to fetch data");
                }
    
                const songsData = await songsResponse.json();
                const podcastsData = await podcastsResponse.json();
    
                const songsWithImages = songsData.canciones.map(cancion => ({
                    id: cancion.id,
                    foto: getImageSrc('Cancion', cancion.id),
                    nombre: cancion.nombre,
                    artista: 'Artista Desconocido' // Asumiendo que no tenemos esta info
                }));
    
                const podcastsFormatted = podcastsData.podcasts.map(podcast => ({
                    id: podcast.id,
                    nombre: podcast.nombre,
                    foto: getImageSrc('Podcast', podcast.id)
                }));
    
                setCanciones(songsWithImages);
                setPodcasts(podcastsFormatted);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);


    const fetchArtistsForSong = async (songId) => {
        const response = await fetch(`http://localhost:8000/listarArtistasCancion/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': 'tu_token_csrf'
            },
            body: JSON.stringify({ cancionId: songId })
        });
        const data = await response.json();
        return response.ok ? data.artistas.map(artista => artista.nombre).join(', ') : 'Artista Desconocido';
    };

    const { setTrackList } = useTrack();

    if (loading) return <p>Cargando...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!canciones.length) return <p>No hay canciones disponibles</p>;

    const PodcastRow = ({ podcasts, onSelectPodcast }) => {
        const containerRef = useRef(null);
        const [isHovered, setIsHovered] = useState(false);
        const [scrollPosition, setScrollPosition] = useState(0);
    
        const handleMouseEnter = () => {
            setIsHovered(true);
        };
    
        const handleMouseLeave = () => {
            setIsHovered(false);
        };
    
        const handleScroll = (e) => {
            const scrollWidth = e.target.scrollWidth;
            const clientWidth = e.target.clientWidth;
            const maxScroll = scrollWidth - clientWidth;
            const scrollPercentage = (e.target.scrollLeft / maxScroll) * 100;
            setScrollPosition(scrollPercentage);
        };
    
        return (
            <div>
                <SectionTitle>Podcasts</SectionTitle>
                <ScrollContainer
                    ref={containerRef}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    onScroll={handleScroll}
                >
                    <ScrollContent style={{ transform: `translateX(-${scrollPosition}%)` }}>
                        {podcasts.map((podcast, index) => (
                            <ImageBox key={index} onClick={() => onSelectPodcast(podcast.id)}>
                                <ImgContainer>
                                    <img src={podcast.foto} alt={podcast.nombre} />
                                </ImgContainer>
                                <p>{podcast.nombre}</p>
                            </ImageBox>
                        ))}
                    </ScrollContent>
                </ScrollContainer>
            </div>
        );
    };
    
    

    const onSelectPodcast = (podcastId) => {
        navigate(`/musifyp/${podcastId}`);
    };
    
    return (
        <Container>
            <SectionTitle>Canciones</SectionTitle>
            <SongRow canciones={canciones.slice(0, 7)} />
            <PodcastRow podcasts={podcasts} onSelectPodcast={onSelectPodcast} />
            <SectionTitle>Recomendaciones</SectionTitle>
            <RecomendadosRow cancionesRecomendadas={cancionesRecomendadas} podcastsRecomendados={podcastsRecomendados} onSelectPodcast={onSelectPodcast}/>
        </Container>
    );    
}

const SongRow = ({ canciones }) => {
    const { updateTrack, play, pause, isPlaying, audioRef } = useTrack();
    const scrollRef = useRef(null);
    const [playingIndex, setPlayingIndex] = useState(-1); // Índice de la canción actualmente en reproducción
    const [hoverIndex, setHoverIndex] = useState(-1); // Índice de la canción sobre la que se encuentra el mouse
    const audioRefs = useRef([]);
    const containerRef = useRef(null);
    const [isHovered, setIsHovered] = useState(false);
    const [scrollPosition, setScrollPosition] = useState(0);

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    const handleScroll = (e) => {
        const scrollWidth = e.target.scrollWidth;
        const clientWidth = e.target.clientWidth;
        const maxScroll = scrollWidth - clientWidth;
        const scrollPercentage = (e.target.scrollLeft / maxScroll) * 100;
        setScrollPosition(scrollPercentage);
    };

    const togglePlayPause = async (index) => {
        const selectedSong = canciones[index];
        // Verifica si la canción a reproducir es diferente o si el reproductor está pausado
        if (playingIndex !== index || !isPlaying) {
            try {
                // Solicitar el archivo de audio solo si es necesario
                const response = await fetch('http://127.0.0.1:8000/devolverCancion/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ cancionId: selectedSong.id })
                });
                if (!response.ok) {
                    throw new Error('Failed to load the song audio');
                }
                const data = await response.json();
                //const audioUrl = base64ToAudioSrc(data.cancion.archivoMp3);
                //const audioUrl = getAudioUrl(data.cancion.id); Version vinal <----------
                const audioUrl = getAudioUrl(selectedSong.id);

                
                // Actualiza el track actual con la nueva información, incluido el URL del audio
                updateTrack({
                    id: selectedSong.id,
                    src: audioUrl,
                    nombre: selectedSong.nombre,
                    artista: selectedSong.artista,
                    imagen: selectedSong.foto
                });
                audioRef.current.src = audioUrl; 
                setPlayingIndex(index);
                play();
            } catch (error) {
                console.error("Error loading audio:", error.message);
            }
        } else if (playingIndex === index && isPlaying) {
            // Si se hace clic en el mismo índice y la música está reproduciendo, pausa
            pause();
        }
    };
    
    return (
        <RowContainer>
            <ScrollContainer
                ref={containerRef}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onScroll={handleScroll}
            >
                <ScrollContent style={{ transform: `translateX(-${scrollPosition}%)` }}>
                    {canciones.map((cancion, index) => (
                        <ImageBox key={index} onMouseEnter={() => setHoverIndex(index)} onMouseLeave={() => setHoverIndex(-1)} onClick={() => togglePlayPause(index)}>
                            <ImgContainer>
                                <img src={cancion.foto} alt={cancion.nombre || 'Desconocido'} />
                                {hoverIndex === index && (
                                    <PlayIconContainer isVisible={true}>
                                        {playingIndex === index && isPlaying ? <FaPause size="3em" /> : <FaPlay size="3em" />}
                                    </PlayIconContainer>
                                )}
                                <audio ref={(el) => audioRefs.current[index] = el} src={cancion.archivoMp3} />
                            </ImgContainer>
                            <p>{cancion.nombre}</p>
                        </ImageBox>
                    ))}
                </ScrollContent>
            </ScrollContainer>
        </RowContainer>
    );
};

const RecomendadosRow = ({ cancionesRecomendadas, podcastsRecomendados, onSelectPodcast }) => {
    const { updateTrack, play, pause, isPlaying, audioRef } = useTrack();
    const scrollRef = useRef(null);
    const [playingIndex, setPlayingIndex] = useState(-1); // Índice de la canción actualmente en reproducción
    const [hoverIndex, setHoverIndex] = useState(-1); // Índice de la canción sobre la que se encuentra el mouse
    const audioRefs = useRef([]);
    const containerRef = useRef(null);
    const [isHovered, setIsHovered] = useState(false);
    const [scrollPosition, setScrollPosition] = useState(0);
    const [error, setError] = useState('');
    const navigate = useNavigate(); 

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    const handleScroll = (e) => {
        const scrollWidth = e.target.scrollWidth;
        const clientWidth = e.target.clientWidth;
        const maxScroll = scrollWidth - clientWidth;
        const scrollPercentage = (e.target.scrollLeft / maxScroll) * 100;
        setScrollPosition(scrollPercentage);
    };

    const togglePlayPause = async (index) => {
        const selectedSong = cancionesRecomendadas[index];
        // Verifica si la canción a reproducir es diferente o si el reproductor está pausado
        if (playingIndex !== index || !isPlaying) {
            try {
                // Solicitar el archivo de audio solo si es necesario
                const response = await fetch('http://127.0.0.1:8000/devolverCancion/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ cancionId: selectedSong.id })
                });
                if (!response.ok) {
                    throw new Error('Failed to load the song audio');
                }
                const data = await response.json();
                //const audioUrl = base64ToAudioSrc(data.cancion.archivoMp3);
                //const audioUrl = getAudioUrl(data.cancion.id); Version vinal <----------
                const audioUrl = getAudioUrl(selectedSong.id);

                
                // Actualiza el track actual con la nueva información, incluido el URL del audio
                updateTrack({
                    id: selectedSong.id,
                    src: audioUrl,
                    nombre: selectedSong.nombre,
                    artista: selectedSong.artista,
                    imagen: selectedSong.foto
                });
                audioRef.current.src = audioUrl; 
                setPlayingIndex(index);
                play();
            } catch (error) {
                console.error("Error loading audio:", error.message);
            }
        } else if (playingIndex === index && isPlaying) {
            // Si se hace clic en el mismo índice y la música está reproduciendo, pausa
            pause();
        }
    };

    return (
        <RowContainer>
            <ScrollContainer
                ref={containerRef}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onScroll={handleScroll}
            >
                <ScrollContent style={{ transform: `translateX(-${scrollPosition}%)` }}>
                    {cancionesRecomendadas.map((cancion, index) => (
                        <ImageBox key={index} onMouseEnter={() => setHoverIndex(index)} onMouseLeave={() => setHoverIndex(-1)} onClick={() => togglePlayPause(index)}>
                            <ImgContainer>
                                <img src={getImageSrc('Cancion', cancion.id)} alt={cancion.nombre || 'Desconocido'} />
                                {hoverIndex === index && (
                                    <PlayIconContainer isVisible={true}>
                                        {playingIndex === index && isPlaying ? <FaPause size="3em" /> : <FaPlay size="3em" />}
                                    </PlayIconContainer>
                                )}
                                <audio ref={(el) => audioRefs.current[index] = el} src={getAudioUrl(cancion.id)} />
                            </ImgContainer>
                            <p>{cancion.nombre}</p>
                        </ImageBox>
                    ))}
                    {podcastsRecomendados.map((podcast, index) => (
                            <ImageBox key={index} onClick={() => onSelectPodcast(podcast.id)}>
                                <ImgContainer>
                                    <img src={getImageSrc('Podcast', podcast.id)} alt={podcast.nombre} />
                                </ImgContainer>
                                <p>{podcast.nombre}</p>
                            </ImageBox>
                        ))}
                </ScrollContent>
            </ScrollContainer>
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
margin-top: 50px;
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

const ScrollContainer = styled.div`
    overflow-x: hidden;
    overflow-y: hidden;
    position: relative;
    cursor: grab;
    transition: scroll 0.2s ease;

    &:hover {
        overflow-x: auto;
    }
`;

const ScrollContent = styled.div`
    display: flex;
    gap: 20px;
    padding-bottom: 20px; // Agrega espacio al final para evitar que el último elemento quede oculto bajo la barra de desplazamiento
`;