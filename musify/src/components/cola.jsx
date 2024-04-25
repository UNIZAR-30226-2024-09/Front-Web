import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { AiFillClockCircle } from 'react-icons/ai';
import { useTrack } from "./TrackContext";

/*const canciones = [
    {
      id: 1,
      name: "Canción 1",
      duration: "3:45",
      imageUrl: "/imagenes/prueba.jpg",
    },
    {
      id: 2,
      name: "Canción 2",
      duration: "4:05",
      imageUrl: "/imagenes/prueba.jpg",
    },
    {
        id: 3,
        name: "Canción 3",
        duration: "4:05",
        imageUrl: "/imagenes/prueba.jpg",
      },
      {
        id: 4,
        name: "Canción 4",
        duration: "4:05",
        imageUrl: "/imagenes/prueba.jpg",
      },
      {
        id: 5,
        name: "Canción 5",
        duration: "4:05",
        imageUrl: "/imagenes/prueba.jpg",
      },
  ];*/

const base64ToImageSrc = (base64) => {
  const base64WithoutPrefix = base64.replace(/^data:image\/[a-z]+;base64,/, '');
  return `data:image/jpeg;base64,${atob(base64WithoutPrefix)}`;
};

export default function Cola() {
  const [songs, setSongs] = useState([]);
  const [message, setMessage] = useState('');
  const { setTrackList } = useTrack();

  useEffect(() => {
        const fetchUserDetails = async () => {
            const token = localStorage.getItem('userToken');
            try {
                const response = await fetch('http://127.0.0.1:8000/obtenerUsuarioSesionAPI/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        token: token,
                    }),
                });
                const data = await response.json();
                if (response.ok) {
                    const email = data.correo;
                    fetchQueueSongs(email);
                } else {
                    console.error('Failed to fetch user details:', data);
                }
            } catch (error) {
                console.error('Error fetching user details:', error);
            }
        };
    
        if (localStorage.getItem('userToken')) {
            fetchUserDetails();
        }
    }, []);

    const fetchQueueSongs = async (email) => {
        const response = await fetch(`http://127.0.0.1:8000/listarCola/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ correo: email })
        });
        const data = await response.json();
        console.log("Respuesta del servidor:", data);
        if (response.ok) {
            if (data.cola && data.cola.length > 0) {
                console.log("Canciones recibidas:", data.cola);
                const enrichedSongs = await Promise.all(data.cola.map(async (song) => {
                    const imageUrl = base64ToImageSrc(song.foto);
                    const artistas = await fetchArtistsForSong(song.id);
                    return {
                        ...song,
                        imageUrl,
                        artistas
                    };
                }));
                console.log("Canciones procesadas:", enrichedSongs);
                setSongs(enrichedSongs);
                setTrackList(enrichedSongs);
            } else {
                setMessage('No hay canciones en la cola de reproducción');
            }
        } else {
          console.error('Failed to fetch data for queue');
          setMessage('Error al obtener las canciones de la cola de reproducción');
        }
    };
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
    return (
      <Container>
        {/* Sonando ahora */}
        <div className="sonando">
          <Titulo>Sonando</Titulo>
          {songs.slice(0, 1).map((song, index) => (
            <FilaCancion key={song.id}>
                  <span>{1}</span>
              <ImagenCancion src={song.imageUrl} alt={song.name} />
              <InfoCancion>
                <NombreCancion>{song.name}</NombreCancion>
                <Duracion>{song.duration}</Duracion>
              </InfoCancion>
            </FilaCancion>
          ))}
        </div>

        <div className="siguiente">
          <Titulo>Siguiente</Titulo>
          {songs.slice(1).map((song, index) => (
            <FilaCancion key={song.id}>
              <span>{index + 1}</span>
              <ImagenCancion src={song.imageUrl} alt={song.name} />
              <InfoCancion>
                <NombreCancion>{song.name}</NombreCancion>
                <Duracion>{song.duration}</Duracion>
              </InfoCancion>
            </FilaCancion>
          ))}
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
  color: white;
  padding: 20px;
`;

const Titulo = styled.h2`
  margin-bottom: 20px;
`;

const FilaCancion = styled.div`
  display: grid;
  grid-template-columns: 60px 1fr 1fr 1fr;
  gap: 5px; 
  align-items: center;
  margin-bottom: 5px;
`;

const ImagenCancion = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 5px;
`;

const InfoCancion = styled.div`
  display: flex;
  flex-direction: column;
`;

const NombreCancion = styled.span`
  font-weight: bold;
`;

const Duracion = styled.span`
  margin-left: auto;
`;