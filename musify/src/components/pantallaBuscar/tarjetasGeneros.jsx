import React, { useState, useEffect, useRef} from 'react';
import styled from 'styled-components';
import { FaMusic, FaGuitar, FaHeadphones, FaRegSmileBeam, FaRocketchat, FaRegGrinStars, FaPlay, FaPause } from 'react-icons/fa';
import { useTrack } from '../TrackContext/trackContext';  // Ensure this context is properly set up to manage audio playback

const base64ToImageSrc = (base64) => {
    console.log("Base64 original:", base64); // Imprimir la base64 original

    // Eliminar el prefijo de la cadena base64 si está presente
    const base64WithoutPrefix = base64.replace(/^data:image\/[a-z]+;base64,/, '');
    console.log("Base64 sin prefijo:", base64WithoutPrefix); // Imprimir la base64 sin prefijo

    // Decodificar la cadena base64
    const byteCharacters = atob(base64WithoutPrefix);
    console.log("Caracteres de bytes:", byteCharacters);
    const imageSrc = `data:image/jpeg;base64,${atob(base64WithoutPrefix)}`;
    console.log("Imagen transformada:", imageSrc); 
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
        { title: 'Clásica', icon: <FaGuitar /> },
        { title: 'Electro', icon: <FaHeadphones /> },
        { title: 'Pop', icon: <FaRegSmileBeam /> },
        { title: 'Rock', icon: <FaRocketchat /> },
        { title: 'Reggaeton', icon: <FaRegGrinStars /> }
    ]);
    const [songs, setSongs] = useState({});
    const [view, setView] = useState('cards');
    const [activeGenre, setActiveGenre] = useState('');
    const [hoverIndex, setHoverIndex] = useState(-1);

    const { updateTrack, play, pause, isPlaying, audioRef } = useTrack();
    const audioRefs = useRef([]);

    useEffect(() => {
        if (view === 'songs' && !songs[activeGenre]) {
            const fetchSongs = async (genre) => {
                const response = await fetch(`http://127.0.0.1:8000/filtrarCancionesPorGenero/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ genero: genre })  // Asegúrate de que la propiedad se llama "genero"
                });
                const data = await response.json();
                if (response.ok) {
                    const songsWithArtists = await Promise.all(data.canciones.map(async (song) => {
                        const artistNames = await fetchArtistsForSong(song.id);
                        return {
                            ...song,
                            foto: base64ToImageSrc(song.foto),
                            archivoMp3: base64ToAudioSrc(song.archivoMp3),
                            artistas: artistNames  // Agrega los artistas a la información de la canción
                        };
                    }));
                    setSongs(prev => ({
                        ...prev,
                        [genre]: songsWithArtists
                    }));
                } else {
                    console.error('Failed to fetch songs for genre:', genre);
                }
            };
            fetchSongs(activeGenre);
        }
    }, [activeGenre, view, songs]);      

    const fetchArtistsForSong = async (songId) => {
        const response = await fetch(`http://localhost:8000/listarArtistasCancion/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': 'tu_token_csrf'  // Asegura que el token CSRF es correcto
            },
            body: JSON.stringify({ cancionId: songId })
        });
        const data = await response.json();
        return response.ok ? data.artistas.map(artista => artista.nombre).join(', ') : 'Artista Desconocido';
    };

    const togglePlayPause = (index, genre) => {
        const selectedSong = songs[genre][index];
        const isCurrentPlaying = audioRef.current && audioRef.current.src === selectedSong.archivoMp3;
    
        console.log("Artistas de la canción seleccionada:", selectedSong.artistas);  // Verifica el log de los artistas
    
        if (isPlaying && isCurrentPlaying) {
            pause();
        } else {
            if (!isCurrentPlaying) {
                updateTrack({
                    src: selectedSong.archivoMp3,
                    id: selectedSong.id,
                    imagen: selectedSong.foto,
                    nombre: selectedSong.nombre,
                    artista: selectedSong.artistas  // Usa la propiedad correcta que actualizaste
                });
            }
            play();
        }
    };    

    return (
        <CardsContainer>
            {view === 'cards' ? (
                <CardsWrapper>
                    {cards.map((card, i) => (
                        <Card
                            key={i}
                            style={{ background: gradients[i % gradients.length] }}
                            onClick={() => {
                                setActiveGenre(card.title);
                                setView('songs');
                            }}
                        >
                            <IconWrapper>{card.icon}</IconWrapper>
                            <CardTitle>{card.title}</CardTitle>
                            <CardText>{'Clic para ver canciones'}</CardText>
                        </Card>
                    ))}
                </CardsWrapper>
            ) : (
                <SongsWrapper>
                    {songs[activeGenre] && songs[activeGenre].map((song, index) => (
                        <SongCard
                            key={index}
                            onMouseEnter={() => setHoverIndex(index)}
                            onMouseLeave={() => setHoverIndex(-1)}
                            onClick={() => togglePlayPause(index, activeGenre)}
                        >
                            <SongImage src={song.foto} alt={song.nombre} />
                            <SongName>{song.nombre}</SongName>
                            {hoverIndex === index && (
                                <PlayIcon style={{ display: 'block' }}>
                                    {isPlaying && audioRef.current === audioRefs.current[index] ? <FaPause /> : <FaPlay />}
                                </PlayIcon>
                            )}
                            <audio ref={(el) => audioRefs.current[index] = el} />
                        </SongCard>
                    ))}
                </SongsWrapper>
            )}
        </CardsContainer>
    );
}

const PlayIcon = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white; // Ensure the icon is visible on your background
  font-size: 3em; // Adjust size as necessary
  display: none; // Hide by default
  z-index: 10;
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
    transition: opacity 0.3s; // Suavizar la transición de la opacidad
`;

const SongName = styled.h4`
    margin-top: 8px;
    font-weight: 700;
    color: #fff;
`;

const SongsWrapper = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    margin-top: 30px;
    gap: 50px;
`;

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
    font-family: 'Montserrat', sans-serif;

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
