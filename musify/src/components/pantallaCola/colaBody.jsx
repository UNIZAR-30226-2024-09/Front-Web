import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { FaTrashAlt } from 'react-icons/fa';

export default function Body_cola() {
  const [songs, setSongs] = useState([]);
  const [message, setMessage] = useState('');
  const audioRef = useRef(null);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlayPause = () => {
    if (songs.length > 0) {
      if (!isPlaying) {
        playSong(currentSongIndex);
      } else {
        audioRef.current.pause();
      }
      setIsPlaying(!isPlaying);
    } else {
      setMessage('No songs in queue');
    }
  };

  const playSong = (index) => {
    const song = songs[index];
    if (song) {
      audioRef.current.src = `http://musify.servemp3.com:8000/audioCancion/${song.id}`;
      audioRef.current.play();
      setCurrentSongIndex(index);
    }
  };

  const handleSongEnd = () => {
    const nextSongIndex = currentSongIndex + 1;
    if (nextSongIndex < songs.length) {
      playSong(nextSongIndex);
    } else {
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      const token = localStorage.getItem('userToken');
      const response = await fetch('http://musify.servemp3.com:8000/obtenerUsuarioSesionAPI/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
      const data = await response.json();
      if (response.ok) fetchQueueSongs(data.correo);
    };

    if (localStorage.getItem('userToken')) fetchUserDetails();
  }, []);

  const fetchQueueSongs = async (email) => {
    const response = await fetch('http://musify.servemp3.com:8000/listarCola/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correo: email }),
    });
    const data = await response.json();
    if (response.ok) {
      const enrichedSongs = data.queue.map(song => ({
        ...song,
        imageUrl: `http://musify.servemp3.com:8000/imagenCancion/${song.id}/`,
      }));
      setSongs(enrichedSongs);
    } else {
      console.error('Failed to fetch queue songs');
    }
  };

  const removeSongFromQueue = async (songId) => {
    const email = "zineb@gmail.com"; // Replace with actual email logic

    const payload = {
      correo: email,
      cancionId: songId,
    };

    console.log("Sending payload to server:", payload);

    try {
      const response = await fetch('http://musify.servemp3.com:8000/eliminarCancionCola/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setSongs(prevSongs => prevSongs.filter(song => song.id !== songId));
      } else {
        console.error('Failed to delete song from queue:', await response.json());
      }
    } catch (error) {
      console.error('Error deleting song from queue:', error);
    }
  };

  return (
    <Container>
      <audio ref={audioRef} onEnded={handleSongEnd} />
      <div className="sonando">
        <div className="details">
          <div className="start-playback">
            <button onClick={togglePlayPause}>
              {isPlaying ? 'Stop Queue' : 'Play Queue'}
            </button>
          </div>
        </div>
      </div>
      <div className="list">
      </div>
      <div className="siguiente">
        <div className="details">
          <h1 className="title">SIGUIENTE</h1>
        </div>
      </div>
      <div className="list">
        <div className="header__row">
          <div className="col"><span>#</span></div>
          <div className="col"><span>TITULO</span></div>
        </div>
      </div>
      <div className="tracks">
        {songs.length > 0 ? (
          songs.map((song, index) => (
            <div className="row" key={song.id}>
              <div className="col"><span>{index + 1}</span></div>
              <div className="col detail">
                <div className="image">
                  <img src={song.imageUrl} alt={song.nombre} style={{ width: "50px", height: "auto" }} />
                </div>
                <div className="info">
                  <span className="name">{song.nombre}</span>
                  <span>{song.artistas || 'Artista Desconocido'}</span>
                </div>
              </div>
              <div className="col">
                <FaTrashAlt
                  onClick={() => removeSongFromQueue(song.id)}
                  style={{ cursor: 'pointer', color: 'red' }}
                />
              </div>
            </div>
          ))
        ) : (
          <div className="row">{message}</div>
        )}
      </div>
    </Container>
  );
}

const Container = styled.div`
  color: #fff;
  margin-top: 10px;
  margin-left: 10px;

  .start-playback {
    margin-bottom: 20px;
    button {
      background-color: #1db954;
      color: white;
      padding: 10px 20px;
      border: none;
      border-radius: 5px;
      cursor: pointer;
    }
    button:hover {
      background-color: #1aa34a;
    }
  }
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
  .playlist {
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
    .cola .details {
      background-color: #333;
      padding: 1rem;
      border-radius: 8px;
      .title {
        color: white;
        font-size: 4rem;
        font-weight: bold;
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
`;
