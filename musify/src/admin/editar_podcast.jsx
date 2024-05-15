import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import AniadirWindow from "./salir_sin_guardar";
import { FaCog, FaClock } from "react-icons/fa";
import { IoAddCircle } from "react-icons/io5";

const base64ToImageSrc = (base64) => {
    const base64WithoutPrefix = base64.replace(/^data:image\/[a-z]+;base64,/, '');
    const imageSrc = `data:image/jpeg;base64,${atob(base64WithoutPrefix)}`;
    return imageSrc;
};

const base64ToAudioSrc = (base64) => {
    const base64WithoutPrefix = base64.replace(/^data:audio\/mp3;base64,/, '').replace(/^data:[^;]+;base64,/, '');
    return `data:audio/mp3;base64,${atob(base64WithoutPrefix)}`;
};

const getImageSrc = (id) => {
    return `http://localhost:8000/imagenPodcast/${id}`;
};

export default function EditarPodcasrAdmin() {
    const navigate = useNavigate();
    const { idPodcast } = useParams();
    const [podcast, setPodcast] = useState(null);
    const [capitulos, setCapitulos] = useState([]);
    const [nomCapitulos, setNomCapitulos] = useState({});
    const [duraciones, setDuraciones] = useState({});

    const [nombre, setNombre] = useState('');
    const [presentadores, setPresentadores] = useState([]);
    const [generosPodcast, setGenerosPodcast] = useState([]);
    const [foto, setFoto] = useState(null);
    const [audio, setAudio] = useState(null);
    const [generos, setGeneros] = useState([]);

    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    /*useEffect(() => {
        if (titulo.trim() !== '' && fecha.trim() !== '' && duracion.trim() !== '' ) {
          setPodcastValid(true);
        } else {
          setPodcastValid(false);
        }
    }, [titulo, presentador, fecha]);
    */

    useEffect(() => {
        const fetchPodcast = async () => {
            setLoading(true);
            try {
                const response = await fetch('http://127.0.0.1:8000/devolverPodcast/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ podcastId: idPodcast })
                });
                if (response.ok) {
                    if (!response.ok) throw new Error("Failed to fetch song details");
                    const podcastData = await response.json();
                    setPodcast(podcastData);
                    setNombre(podcastData.podcast.nombre);
                    setFoto(getImageSrc(idPodcast));
                    fetchPresentadores(idPodcast);
                    fetchCapitulos(podcastData.podcast.nombre);
                    fetchGenerosPodcast(idPodcast);
                    fetchGeneros();
                }else {
                    const errorData = await response.text();
                    throw new Error(errorData || "Error al recibir datos");
                }
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        const fetchCapitulos = async (nomPodcast) => {
            try {
                const response = await fetch(`http://127.0.0.1:8000/listarCapitulosPodcast/`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ nombrePodcast: nomPodcast })
                });
                if (!response.ok) throw new Error("Failed to fetch chapters");
                const chaptersData = await response.json();
                setCapitulos(chaptersData.capitulos);
                console.log(chaptersData.capitulos);
                if (chaptersData.capitulos !== undefined) {
                    chaptersData.capitulos.forEach((chapter, index) => {
                        fetchAudioDuration(base64ToAudioSrc(chapter.archivoMp3))
                            .then(duration => setDuraciones(prev => ({ ...prev, [index]: duration })))
                            .catch(console.error);
                    });
                    const nombresCapitulos = chaptersData.capitulos.map(capitulo => capitulo.nombre);
                    setNomCapitulos(nombresCapitulos);
                }
            } catch (error) {
                setError(`Failed to fetch chapters: ${error.message}`);
            } finally {
                setLoading(false);
            }
        };

        const fetchPresentadores = async (idPodcast) => {
            try {
                const response = await fetch(`http://127.0.0.1:8000/listarPresentadoresPodcast/`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ podcastId: idPodcast })
                });
                if (!response.ok) throw new Error("Failed to fetch album");
                const podcastData = await response.json();
                if (podcastData.presentadores && podcastData.presentadores.length > 0) {
                    const nombresPresentadores = podcastData.presentadores.map(presentador => presentador.nombre);
                    setPresentadores(nombresPresentadores);
                } else {
                    return null;
                }
            } catch (error) {
                setError(`Failed to fetch presentadores: ${error.message}`);
            }
          };

        const fetchGenerosPodcast = async (idPodcast) => {
            try {
                const response = await fetch(`http://127.0.0.1:8000/listarGenerosPodcast/`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ podcastId: idPodcast })
                });
                if (!response.ok) throw new Error("Failed to fetch album");
                const podcastData = await response.json();
                if (podcastData.generos && podcastData.generos.length > 0) {
                    const nombresGeneros = podcastData.generos.map(genero => genero.nombre);
                    setGenerosPodcast(nombresGeneros);
                }
            } catch (error) {
                setError(`Failed to fetch generos del podcast: ${error.message}`);
            } finally {
                setLoading(false);
            }
        };

        const fetchGeneros = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:8000/generosPodcasts/`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });
                if (!response.ok) throw new Error("Failed to fetch album");
                const generosData = await response.json();
                const nombresGeneros = generosData.generos.map(genero => genero.nombre);
                setGeneros(nombresGeneros);
            } catch (error) {
                setError(`Failed to fetch generos: ${error.message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchPodcast();
    }, [idPodcast]);

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

    const formatDuration = (duration) => {
        if (!duration) return 'N/A';
        const minutes = Math.floor(duration / 60);
        const seconds = Math.floor(duration % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    const handleExitWithoutSave = () => {
        setShowModal(true); // Muestra el modal al hacer clic en "Salir sin guardar"
    };
    
    const handleCloseModal = () => {
        setShowModal(false); // Cierra el modal al hacer clic en "Cancelar" o fuera del modal
    };

    const handleCloseModalNoSave = () => {
        navigate('/lista_podcast_admin'); //Vuelve a la lista de canciones
    };

    const handleAddCap = () => {
        navigate('/aniadir_capitulo');
    };

    const handleActualizarPodcast = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/actualizarPodcast/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ podcastId: idPodcast, nombre: nombre }),
            });
    
            if (response.ok) {
                // Actualización exitosa
                navigate('/lista_podcast_admin');
                console.log('Podcast actualizada correctamente en la base de datos');
            } else {
                // Maneja errores de respuesta
                console.error('Error al actualizar la canción en la base de datos');
            }
        } catch (error) {
            // Maneja errores de red u otros
            console.error('Error de red al actualizar la canción:', error);
        }
    }

    const handleEliminarPodcast = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/eliminarPodcast/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ podcastId: idPodcast }),
            });
    
            if (response.ok) {
                // Borrado exitoso
                navigate('/lista_podcast_admin');
                console.log('Podcast eliminado correctamente en la base de datos');
            } else {
                // Maneja errores de respuesta
                console.error('Error al eliminar el podcast en la base de datos');
            }
        } catch (error) {
            // Maneja errores de red u otros
            console.error('Error de red al eliminar el podcast:', error);
        }
    }

    return (
        <>
          <Container>
            <div className='wrapper'>
                <form action="">
                    <div className="info">
                        <div className="titulo">
                            <h6>Título:</h6>
                            <input 
                                type="text" 
                                value={nombre}
                                onChange={e=>setNombre(e.target.value)}
                                placeholder="Título de la canción" required 
                            />
                        </div>
                        <div className="presentadores">
                            <h6>Presentadores:</h6>
                            <input 
                                type="text" 
                                value={presentadores ? (
                                    presentadores.join(", ")
                                ) : (
                                    "No hay presentadores"
                                )}
                                onChange={e=>setNombre(e.target.value)}
                                placeholder="Presentadores" 
                            />
                        </div>
                        <select value={generosPodcast} onChange={e=>setGenerosPodcast(e.target.value)} >
                            <option value="">Selecciona un género</option>
                            {generos.map((genero, index) => (
                                <option key={index} value={genero}>{genero}</option>
                            ))}
                        </select>
                    </div>
                    <div className="image">
                    <h6>Imagen:</h6>
                        <img 
                            className="podcast-image"
                            src={foto} alt="Imagen predefinida" 
                        />
                        <input type="file" accept="image/*" onChange={e=>setFoto(e.target.value)}/>
                    </div>
                    <div className="chapter-list-header">
                        <div className="chapter-list-item">Capítulo</div>
                        <div className="chapter-list-item">Título</div>
                        <div className="chapter-list-item"><FaClock /></div>
                        <div className="chapter-list-item">Editar</div>
                    </div>
                    <div className="chapter-list-container">
                    <div className="chapter-list-body">
                        {capitulos !== undefined ? (
                            capitulos.map((capitulo, index) => (
                                <div key={capitulo.id} className="chapter-list-row">
                                    <div className="chapter-list-item">{index + 1}</div>
                                    <div className="chapter-list-item">{nomCapitulos[index]}</div>
                                    <div className="chapter-list-item">{formatDuration(duraciones[index])}</div>
                                    <div className="chapter-list-item">
                                        <Link to={`/editar_capitulo/${capitulo.id}`}>
                                            <FaCog className="capitulo__settings" />
                                        </Link>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="no-chapters-message">El podcast no tiene capítulos</div>
                        )}
                    </div>
                    <Link to={`/aniadir_capitulo/${idPodcast}`}>
                        <button type="button" className="chapter-button" onClick={handleAddCap}>
                            <IoAddCircle className="icon" />
                            Añadir capítulo
                        </button>
                    </Link>
                    </div>
                    <div className="buttons-container">
                        <button type="button" className="cancel-button" onClick={handleExitWithoutSave}>Salir sin guardar</button>
                        {showModal && <AniadirWindow onClose={handleCloseModal} ruta={handleCloseModalNoSave} />}
                        <button type="submit" className="delete-button" onClick={handleEliminarPodcast}>Eliminar</button>
                        <button type="submit" className="save-button" onClick={handleActualizarPodcast}>Guardar</button>
                    </div>
                </form>
            </div>
        </Container>
        </>
      );
}


const Container = styled.div`
.wrapper {
    position: relative;
    width: 800px;
    height: 600px;
    color: #fff;
    border-radius: 40px;
    display: flex;
    flex-direction: column;
    align-items: left;
    gap: 30px;
    margin-top: 80px;
    background: rgba(0, 0, 0, 0.25);
}

.info {
    width: 100%;
    height: 370px;
    padding: 30px;
    .titulo {
        width: 400px;
        height: 80px;
        margin-bottom: 40px;
    }
    
    .presentadores{
        width: 400px;
        height: 80px;
        margin-bottom: 30px;
        textarea {
            width: 100%;
            height: 100%;
            background: transparent;
            outline: none;
            border: 2px solid #fff;
            border-radius: 20px;
            font-size: 20px;
            color: #fff;
            padding: 20px;
            appearance: none;
        }
    }

    .input-box {
        position: relative;
        width: 400px;
        height: 40px;
        margin: 30px 0;
    }

    select {
        position: relative;
        width: 400px;
        height: 40px;
        margin-top: 35px;
        background: none;
        border: 2px solid #fff;
        border-radius: 20px;
        color: #fff;
    }
    select option {
        color: #000;
    }

    input{
        width: 100%;
        height: 100%;
        background: transparent;
        outline: none;
        border: 2px solid #fff;
        border-radius: 20px;
        font-size: 16px;
        color: #fff;
        padding-left: 20px;
        appearance: none;
    }

}

.audio{
    position: absolute;
    bottom: 260px;
    right: 40px;
    width: 300px;
    height: 50px;
    outline: none;
    input {
        width: 100%;
        height: 100%;
        background: transparent;
    }
}

.image {
    position: absolute;
    text-align: center; 
    top: 30px;
    right: 40px;
    width: 300px;
    height: 200px;
    outline: none;
    border: 2px solid #fff;
    border-radius: 20px;
    h6 {
        border: 10px;
        text-align: center;
    }
    .podcast-image{
        width: 120px; 
        height: 120px;
        align: center
    }
    input { 
        width: 100%;
        height: 100%;
        background: transparent;
    }
}

  .buttons-container {
    display: flex;
    justify-content: space-between;
    padding: 30px 20px;
  }

  .cancel-button, .save-button, .delete-button {
    padding: 10px 20px;
    border: 20px;
    border-radius: 20px;
    cursor: pointer;
    font-weight: bold;
    bottom: 1px;
  }

  .cancel-button {
    background-color: #f44336; /* Rojo */
    color: #fff;
  }

  .save-button {
    background-color: #4CAF50; /* Verde */
    color: #fff;
  }

  .delete-button {
    background-color: #808080; /* Gris */
    color: #fff;
  }


.chapter-list-header {
    display: flex;
    background-color: none;
    padding: 6px;
    font-weight: bold;
    margin-left: 70px; 
    z-index: 1;
    gap: 140px;

}

  .chapter-list-container {
    height: 100px;
    overflow-y: auto; 
    scroll-behavior: smooth;
    border: 1px solid #ccc;
    margin-left: 30px; 
    margin-right: 30px;
        .capitulos__settings {
            cursor: pointer;
        }
        .chapter-list-body {
            overflow-y: auto; 
            .capitulo_settings{
                color: #FFF;
            }
        }
    
        .chapter-list-row {
            display: flex;
            justify-content: space-between;
            padding: 8px;
            gap: 5px;
        }
    
        .chapter-list-item {
            flex: 1;
            text-align: center;
        }

        .chapter-button {
            width: 200px;
            height: 40px;
            border: none;
            background: #fff;
            color: #000;
            text-align: center;
            border: 20px;
            border-radius: 20px;
        }
    }

`;
