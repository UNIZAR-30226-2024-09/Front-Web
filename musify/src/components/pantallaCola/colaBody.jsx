import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useTrack } from "../../TrackContext/trackContext";
import { FaTrashAlt } from 'react-icons/fa';

export default function Body_cola() {
  const [songs, setSongs] = useState([]);
  const [message, setMessage] = useState('');
  const { setTrackList, setTrackIndex, updateTrack, play } = useTrack();

  const startPlayingQueue = () => {
    if (songs.length > 0) {
      const firstSong = songs[0];
      updateTrack({
        ...firstSong,
        src: `http://musify.servemp3.com:8000/audioCancion/${firstSong.id}`
      });
      setTrackIndex(0);
      play();
    } else {
      setMessage('No songs in queue');
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
  }, [setTrackList]);

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
      setTrackList(enrichedSongs);
    } else {
      console.error('Failed to fetch queue songs');
    }
  };

  const fetchArtistsForSong = async (songId) => {
    const response = await fetch(`http://musify.servemp3.com:8000/listarArtistasCancion/`, {
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

  const removeSongFromQueue = async (songId) => {
    const email = "zineb@gmail.com"; // Replace with actual email logic
  
    // Construct the payload
    const payload = {
      correo: email,
      cancionId: songId,
    };
  
    // Log the payload to the console
    console.log("Sending payload to server:", payload);
  
    try {
      const response = await fetch('http://musify.servemp3.com:8000//eliminarCancionCola/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add additional headers if needed
        },
        body: JSON.stringify(payload),
      });
  
      if (response.ok) {
        // Successfully removed from queue
        setSongs(prevSongs => prevSongs.filter(song => song.id !== songId));
        setTrackList(prevSongs => prevSongs.filter(song => song.id !== songId));
      } else {
        console.error('Failed to delete song from queue:', await response.json());
      }
    } catch (error) {
      console.error('Error deleting song from queue:', error);
    }
  };
  
  

  return (
    <Container>
        <div className="sonando">
          <div className="details">
            <h1 className="title">SONANDO</h1>
            <div className="start-playback">
              <button onClick={startPlayingQueue}>Play Queue</button>
            </div>
          </div>
        </div>
        <div className="list">
                <div className="header__row">
                    <div className="col"><span>#</span></div>
                    <div className="col"><span>TITULO</span></div>
                </div>
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
                      onClick={() => removeSongFromQueue(song.id)} // Add onClick to delete the song
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
  }
  `;