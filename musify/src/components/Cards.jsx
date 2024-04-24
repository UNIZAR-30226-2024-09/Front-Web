import React, { useState, useEffect, useRef} from 'react';
import styled from 'styled-components';
import { createGlobalStyle } from 'styled-components';
import { FaMusic, FaGuitar, FaHeadphones, FaRegSmileBeam, FaRocketchat, FaRegGrinStars, FaPlay, FaPause } from 'react-icons/fa';
import { useTrack } from './TrackContext';  // Ensure this context is properly set up to manage audio playback

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
                    body: JSON.stringify({ genero: genre })
                });
                const data = await response.json();
                setSongs(prev => ({
                    ...prev,
                    [genre]: data.canciones.slice(0, 2).map(song => ({ // Solo tomar las primeras dos canciones
                        ...song,
                        foto: base64ToImageSrc(song.foto),
                        archivoMp3: base64ToAudioSrc(song.archivoMp3)
                    }))
                }));
            };
            fetchSongs(activeGenre);
        }
    }, [activeGenre, view, songs]);

    const togglePlayPause = (index, genre) => {
        const audioElement = audioRefs.current[index];
        const selectedSong = songs[genre][index];
    
        if (!audioElement.src) {
            audioElement.src = selectedSong.archivoMp3;  // Set src only if it's not already set
            updateTrack({
                src: selectedSong.archivoMp3,
                id: selectedSong.id,
                imagen: selectedSong.foto,
                nombre: selectedSong.nombre,
                artista: selectedSong.artista  // Make sure artist data is included in your song data
            });
        }
    
        if (audioRef.current && audioRef.current.src === audioElement.src) {
            // Toggle play/pause if the same track is played
            if (isPlaying) {
                pause();
            } else {
                play();
            }
        } else {
            // If another track is playing, do nothing or pause the current track before switching
            if (isPlaying) {
                // Comment out this line if you don't want to switch to a new song while another is playing
                // pause();
                // play new song after pausing the current one
                audioRef.current = audioElement;  // Update the current playing audio element in context
                play();
            } else {
                audioRef.current = audioElement;  // Update the current playing audio element in context
                play();
            }
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

// Agregar estilos para SongCard y SongsWrapper
const SongCard = styled.div`
    position: relative;
    cursor: pointer;
    flex: 0 0 calc(33.33% - 20px);
    margin: 10px;
    text-align: center;
`;

const SongsWrapper = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 20px;
`;

const SongImage = styled.img`
    width: 50%;
    height: auto;
    border-radius: 8px;
`;

const SongName = styled.h4`
    margin-top: 8px;
`;


const GlobalStyle = createGlobalStyle`
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap');

  body {
    font-family: 'Montserrat', sans-serif;
  }
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
