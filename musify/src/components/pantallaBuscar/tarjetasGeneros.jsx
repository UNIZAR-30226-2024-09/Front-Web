import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { FaMusic, FaGuitar, FaHeadphones, FaRegSmileBeam, FaRocketchat, FaRegGrinStars, FaPodcast, FaSpa, FaDumbbell, FaCar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const base64ToAudioSrc = (base64) => {
    const base64WithoutPrefix = base64.replace(/^data:audio\/mp3;base64,/, '').replace(/^data:[^;]+;base64,/, '');
    return `data:audio/mp3;base64,${atob(base64WithoutPrefix)}`;
};

const gradients = [
    'linear-gradient(135deg, #000066 0%, #6699FF 100%)',
    'linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)',
    'linear-gradient(135deg, #2af598 0%, #009efd 100%)',
    'linear-gradient(135deg, #654ea3 0%, #eaafc8 100%)',
    'linear-gradient(135deg, #5ee7df 0%, #b490ca 100%)',
    'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)'
];

export default function Cards() {
    const [cards] = useState([
        { title: 'Rap', icon: <FaMusic /> },
        { title: 'Clasica', icon: <FaGuitar /> },
        { title: 'Electro', icon: <FaHeadphones /> },
        { title: 'Pop', icon: <FaRegSmileBeam /> },
        { title: 'Rock', icon: <FaRocketchat /> },
        { title: 'Reggaeton', icon: <FaRegGrinStars /> },
        { title: 'Ciencias', icon: <FaPodcast />, isPodcast: true },
        { title: 'Cultura', icon: <FaPodcast />, isPodcast: true },
        { title: 'Ingles', icon: <FaPodcast />, isPodcast: true },
        { title: 'Psicologia', icon: <FaPodcast />, isPodcast: true },
        // Añadir tarjetas para playlists predefinidas
        { title: 'Canciones Coche', icon: <FaCar />, id: 'idCoche' },
        { title: 'Canciones Gym', icon: <FaDumbbell />, id: 'idGym' },
        { title: 'Canciones Relax', icon: <FaSpa />, id: 'idRelax' }
    ]);
    const [songs, setSongs] = useState({});
    const [podcasts, setPodcasts] = useState({});
    const [view, setView] = useState('cards');
    const [activeGenre, setActiveGenre] = useState('');
    const [hoverIndex, setHoverIndex] = useState(-1);
    const [isPodcastGenre, setIsPodcastGenre] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSongs = async (genre) => {
            try {
                const response = await fetch(`http://127.0.0.1:8000/filtrarCancionesPorGenero/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ genero: genre })
                });
                const data = await response.json();
                if (response.ok && data.canciones) {
                    const songsWithArtists = data.canciones.map((song) => ({
                        ...song,
                        foto: `http://localhost:8000/imagenCancion/${song.id}/`, // Usando ID para construir la URL
                        archivoMp3: base64ToAudioSrc(song.archivoMp3),
                    }));
                    setSongs(prev => ({
                        ...prev,
                        [genre]: songsWithArtists
                    }));
                } else {
                    console.error('Failed to fetch songs for genre:', genre, data);
                }
            } catch (error) {
                console.error('Error fetching songs:', error);
            }
        };
        if (view === 'songs' && !isPodcastGenre && !songs[activeGenre]) {
            fetchSongs(activeGenre);
        }
    }, [activeGenre, view, songs, isPodcastGenre]);
    
    useEffect(() => {
        const fetchPodcasts = async (genre) => {
            try {
                const response = await fetch(`http://127.0.0.1:8000/filtrarPodcastsPorGenero/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ genero: genre })
                });
                const data = await response.json();
                if (response.ok && data.podcasts) {
                    const podcastsWithDetails = data.podcasts.map((podcast) => ({
                        ...podcast,
                        foto: `http://localhost:8000/imagenPodcast/${podcast.id}/`, // Usando ID para construir la URL
                    }));
                    setPodcasts(prev => ({
                        ...prev,
                        [genre]: podcastsWithDetails
                    }));
                } else {
                    console.error('Failed to fetch podcasts for genre:', genre, data);
                }
            } catch (error) {
                console.error('Error fetching podcasts:', error);
            }
        };
        if (view === 'songs' && isPodcastGenre && !podcasts[activeGenre]) {
            fetchPodcasts(activeGenre);
        }
    }, [activeGenre, view, podcasts, isPodcastGenre]);

    const handleSongClick = (index, genre) => {
        if (isPodcastGenre) {
            const podcast = podcasts[genre][index];
            console.log("Navigating to podcast ID:", podcast.id); 
            if(podcast.id) {
                navigate(`/musifyp/${podcast.id}`);
            } else {
                console.error("Error: podcast ID is undefined.");
            }
        } else {
            const song = songs[genre][index];
            console.log("Navigating to song ID:", song.id); 
            if(song.id) {
                navigate(`/musifyc/${song.id}`);
            } else {
                console.error("Error: song ID is undefined.");
            }
        }
    };

    const handleCardClick = (card) => {
        if (card.isPodcast) {
            setIsPodcastGenre(true);
            setView('songs');
        } else if (card.id) {  // Manejar click en playlists predefinidas
            navigate(`/musify/${card.id}`);
        } else {
            setIsPodcastGenre(false);
            setView('songs');
        }
        setActiveGenre(card.title);
    };

    return (
        <CardsContainer>
            {view === 'cards' ? (
                <CardsWrapper>
                    {cards.map((card, i) => (
                        <Card
                        key={i}
                        style={{ background: gradients[i % gradients.length] }}
                        onClick={() => handleCardClick(card)}  // Modificado para usar la nueva función de manejo
                    >
                        <IconWrapper>{card.icon}</IconWrapper>
                        <CardTitle>{card.title}</CardTitle>
                        <CardText>{card.text || 'Descubre más aquí'}</CardText>
                    </Card>
                    ))}
                </CardsWrapper>
            ) : (
                <SongsWrapper>
                    {(isPodcastGenre ? podcasts : songs)[activeGenre] && (isPodcastGenre ? podcasts : songs)[activeGenre].map((item, index) => (
                        <SongCard
                        key={index}
                        onMouseEnter={() => setHoverIndex(index)}
                        onMouseLeave={() => setHoverIndex(-1)}
                        onClick={() => handleSongClick(index, activeGenre)}
                    >
                        <SongImage src={item.foto} alt={item.nombre} />
                        <SongName>{item.nombre}</SongName>
                    </SongCard>
                    ))}
                </SongsWrapper>
            )}
        </CardsContainer>
    );
}

const CardsContainer = styled.div`
    text-align: center;
    margin-bottom: 40px;
    color: #fff;
`;

const CardsWrapper = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 20px;
`;

const Card = styled.div`
    flex: 0 0 calc(33.33% - 80px);
    height: auto;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    gap: 10px;
    transition: transform 0.3s ease-in-out;
    border: 1px solid #0f3460;

    &:hover {
        transform: translateY(-10px);
        background: #16213E;
    }
`;

const IconWrapper = styled.div`
    font-size: 3rem;
    color: black;
`;

const CardTitle = styled.h3`
    color: black;
    font-weight: 700;
    font-family: 'Montserrat', sans-serif;
`;

const CardText = styled.p`
    color: black;
    font-weight: 400;
    font-family: 'Montserrat', sans-serif;
`;

const SongsWrapper = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    margin-top: 30px;
    gap: 50px;
`;

const SongCard = styled.div`
    position: relative;
    cursor: pointer;
    flex: 0 0 calc(20% - 20px);
    margin: 10px;
    text-align: center;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    overflow: hidden;
    transition: transform 0.3s, box-shadow 0.3s;

    &:hover {
        transform: scale(1.05);
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    }
`;

const SongImage = styled.img`
    width: 30%;
    height: auto;
    transition: opacity 0.3s;
`;

const SongName = styled.h4`
    margin-top: 8px;
    font-weight: 700;
    color: #fff;
`;