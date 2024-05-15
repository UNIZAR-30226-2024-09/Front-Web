import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { AiFillClockCircle } from 'react-icons/ai';
import { FaPlay, FaPause } from 'react-icons/fa';
import { useTrack } from "../../TrackContext/trackContext";


const base64ToAudioSrc = (base64) => {
    const base64WithoutPrefix = base64.replace(/^data:audio\/mp3;base64,/, '').replace(/^data:[^;]+;base64,/, '');
    return `data:audio/mp3;base64,${atob(base64WithoutPrefix)}`;
};

const PodcastDetails = () => {
    const { podcastId } = useParams();
    const [chapters, setChapters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [podcastImage, setPodcastImage] = useState('');
    const [podcastName, setPodcastName] = useState('');
    const [durations, setDurations] = useState({});
    const [hoverIndex, setHoverIndex] = useState(-1);
    const { updateTrack, play, pause, isPlaying, currentTrack, audioRef } = useTrack();

    useEffect(() => {
        const fetchPodcastDetails = async () => {
            try {
                const response = await fetch(`http://musify.servemp3.com:8000/devolverPodcast/`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ podcastId })
                });
                if (!response.ok) throw new Error("Failed to fetch podcast details");
                const data = await response.json();
                // Construye la URL de la imagen usando el servidor como base
                setPodcastImage(`http://musify.servemp3.com:8000/imagenPodcast/${podcastId}/`);
                setPodcastName(data.podcast.nombre);
                fetchChapters(data.podcast.nombre);
            } catch (error) {
                setError(`Failed to fetch podcast details: ${error.message}`);
            }
        };

        const fetchChapters = async (podcastName) => {
            try {
                const response = await fetch(`http://musify.servemp3.com:8000/listarCapitulosPodcast/`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ nombrePodcast: podcastName })
                });
                if (!response.ok) throw new Error("Failed to fetch chapters");
                const chaptersData = await response.json();
                setChapters(chaptersData.capitulos);
                chaptersData.capitulos.forEach((chapter, index) => {
                    fetchAudioDuration(base64ToAudioSrc(chapter.archivoMp3))
                        .then(duration => setDurations(prev => ({ ...prev, [index]: duration })))
                        .catch(console.error);
                });
            } catch (error) {
                setError(`Failed to fetch chapters: ${error.message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchPodcastDetails();
    }, [podcastId]);

    const fetchAudioDuration = (audioSrc) => {
        return new Promise((resolve, reject) => {
            const audio = new Audio(audioSrc);
            audio.onloadedmetadata = () => {
                resolve(audio.duration);
            };
            audio.onerror = () => {
                reject('Failed to load audio');
            };
        });
    };    

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    const togglePlayPause = (index) => {
        const chapter = chapters[index];
        if (!chapter) return;
    
        if (currentTrack && currentTrack.id === chapter.id && !audioRef.current.paused) {
            pause();
        } else {
            updateTrack({
                id: chapter.id,
                src: base64ToAudioSrc(chapter.archivoMp3),
                nombre: chapter.nombre,
                type: 'podcast' // Añadiendo tipo de track
            });
            play();
        }
    };
    

    const formatDuration = (duration) => {
        if (!duration) return 'N/A';
        const minutes = Math.floor(duration / 60);
        const seconds = Math.floor(duration % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const noChaptersMessage = "No chapters available.";

    return (
        <Container>
            <div className="playlist">
            <div className="image">
            <img src={podcastImage} alt={podcastName} />
            </div>
            <div className="details">
                <span className="type">PODCAST</span>
                <h1 className="title">{podcastName}</h1>
            </div>
        </div>
        <div className="list">
                <div className="header__row">
                    <div className="col"><span>#</span></div>
                    <div className="col"><span>TITULO</span></div>
                    <div className="col"><span>PODCAST</span></div>
                    <div className="col"><span><AiFillClockCircle /></span></div>
                </div>
            </div>
            <div className="tracks">
                {chapters.length > 0 ? (
                    chapters.map((chapter, index) => (
                        <div className="row" key={chapter.id}
                            onMouseEnter={() => setHoverIndex(index)}
                            onMouseLeave={() => setHoverIndex(-1)}
                            onClick={() => togglePlayPause(index)}>
                            <div className="col"><span>{index + 1}</span></div>
                            <div className="col detail">
                            <div className="image">
                                <img src={podcastImage} alt={chapter.nombre} style={{ width: "50px", height: "auto" }} />
                                {hoverIndex === index && (
                                    <div className="play-icon">
                                        {isPlaying && currentTrack.id === chapter.id ? <FaPause size="2em" /> : <FaPlay size="2em" />}
                                    </div>
                                )}
                            </div>
                                <div className="info">
                                    <span className="name">{chapter.nombre}</span>
                                </div>
                            </div>
                            <div className="col"><span>{podcastName}</span></div>
                            <div className="col"><span>{formatDuration(durations[index])}</span></div>
                        </div>
                    ))
                ) : (
                    <div className="row">{noChaptersMessage}</div>
                )}
            </div>
        </Container>
    );
}

export default PodcastDetails;

const Container = styled.div`
.image {
    position: relative;
    img {
        display: block;
    }
    .play-icon {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: white;
        cursor: pointer;
    }
}
.playlist{
    margin: 0 2rem;
    display: flex;
    align-items:center;
    gap: 2rem;
    .image {
        img {
            height: 15rem;
            box-shadow:rgba(0,0,0,0.1) 0px 25px 50px-12px;
        }
    }
    .details{
        display: flex;
        flex-direction: column;
        gap: 2rem;
        color: #e0dede;
        .title{
            color: white;
            font-size: 4rem;
        }
    }
}
.list {
    .header__row {
        display: grid;
        grid-template-columns: 0.3fr 3fr 2fr 0.1fr;
        color: #dddcdc;
        margin: 1rem 0 0 0;
        position: sticky;
        top: 15vh;
        padding: 1rem 3rem;
        transition: 0.3s ease-in-out;
    }
}
    .tracks {
        margin: 0 2rem;
        display: flex;
        flex-direction: column;
        margin-bottom: 5rem;
        .row {
            padding: 0.5rem 1rem;
            display: grid;
            grid-template-columns: 0.3fr 3.1fr 2fr 0.1fr;
            &:hover {
                background-color: rgba(0, 0, 0, 0.7);
            }
            .col {
                display: flex;
                align-items: center;
                color: #dddcdc;
            }
            .detail {
                display: flex;
                gap: 1rem;
                .info {
                    display: flex;
                    flex-direction: column;
                }
            }
        }
    }
}
}
`;