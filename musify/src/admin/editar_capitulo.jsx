import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import AniadirWindow from "./salir_sin_guardar";


const getAudioUrl = (id) => {
    return `http://musify.servemp3.com:8000/audioCapitulo/${id}/`;
};

export default function EditCapitulo() {
  const navigate = useNavigate();
  const { idCap } = useParams();
  const [capitulo, setCapitulo] = useState(null);
  const [podcast, setPodcast] = useState('');
  const [nomPodcast, setNomPodcast] = useState('');
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [duracion, setDuracion] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [capituloValid, setCapituloValid] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCapitulo = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://musify.servemp3.com:8000/devolverCapitulo/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ capituloId: idCap })
            });
            if (!response.ok) throw new Error("Failed to fetch song details");
            const capituloData = await response.json();
            setCapitulo(capituloData);
            console.log(capituloData);
            setNombre(capituloData.capitulo.nombre);
            setDescripcion(capituloData.capitulo.descripcion);
            setPodcast(capituloData.capitulo.miPodcast);
            fetchNomPodcast(capituloData.capitulo.miPodcast);
            //fetchDuracion(getAudioUrl(capituloData.capitulo.id));
            setDuracion('0');
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchNomPodcast = async (idPodcast) => {
        setLoading(true);
        try {
            const response = await fetch('http://musify.servemp3.com:8000/devolverPodcast/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ podcastId: idPodcast })
            });
            if (response.ok) {
                if (!response.ok) throw new Error("Failed to fetch song details");
                const podcastData = await response.json();
                setNomPodcast(podcastData.podcast.nombre);
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

    fetchCapitulo();
}, [idCap]);

    const fetchDuracion = (audioSrc) => {
        return new Promise((resolve, reject) => {
            const audio = new Audio(audioSrc);
            audio.onloadedmetadata = () => {
                resolve(audio.duration);
                setDuracion(audio.duration);
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

  const handleExitWithoutSave = () => {
    setShowModal(true); // Muestra el modal al hacer clic en "Salir sin guardar"
  };

  const handleCloseModal = () => {
      setShowModal(false); // Cierra el modal al hacer clic en "Cancelar" o fuera del modal
  };

  const handleCloseModalNoSave = () => {
      navigate(`/editar_podcast/${podcast}`); 
  };

    const handleCapituloEditado = async () => {
        try {
            const response = await fetch('http://musify.servemp3.com:8000/actualizarCapitulo/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ capituloId: idCap, nombre: nombre, descripcion: descripcion, miPodcast: nomPodcast }),
            });
    
            if (response.ok) {
                // Actualización exitosa
                console.log('Capitulo actualizada correctamente en la base de datos');
                navigate(`/editar_podcast/${podcast}`);
            } else {
                // Maneja errores de respuesta
                console.error('Error al actualizar el capítulo en la base de datos');
            }
        } catch (error) {
            // Maneja errores de red u otros
            console.error('Error de red al actualizar el capítulo:', error);
        }
    };

    const handleDescripcionChange = (e) => {
        setDescripcion(e.target.value);
    };

    const handleEliminarCapitulo = async () => {
        try {
            const response = await fetch('http://musify.servemp3.com:8000/eliminarCapitulo/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ capituloId: idCap }),
            });
    
            if (response.ok) {
                // Borrado exitoso
                navigate(`/editar_podcast/${podcast}`);
                console.log('Capitulo eliminado correctamente en la base de datos');
            } else {
                // Maneja errores de respuesta
                console.error('Error al eliminar el capítulo de la base de datos');
            }
        } catch (error) {
            // Maneja errores de red u otros
            console.error('Error de red al eliminar el capítulo:', error);
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
                            onChange={(e) => {setNombre(e.target.value)}}
                            />
                    </div>
                    <div className="input-box">
                        <h6>Duración:</h6>
                        <input 
                            type="duracion" 
                            value={formatDuration(duracion)} 
                            onChange={(e) => setDuracion(e.target.value)}
                            />
                    </div>
                </div>
                <div className="input-box">
                    <h6>Descripción:</h6>
                    <textarea className='input' value={descripcion} onChange={handleDescripcionChange}/>
                </div>
                <div className="buttons-container">
                    <button type="button" className="cancel-button" onClick={handleExitWithoutSave}>Salir sin guardar</button>
                    {showModal && <AniadirWindow onClose={handleCloseModal} ruta={handleCloseModalNoSave} />}
                    <button type="button" className="delete-button" onClick={handleEliminarCapitulo}>Eliminar</button>
                    <button type="button" className="save-button" onClick={handleCapituloEditado}>Guardar</button>
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
    height: 250px;
    padding: 30px;
    margin-top: 20px;
    .titulo {
        width: 400px;
        height: 80px;
        margin-bottom: 30px;
    }
    
    .input-box{
        position: relative;
        width: 400px;
        height: 40px;
        margin: 30px 0;
    }
    input{
        width: 100%;
        height: 100%;
        background: transparent;
        outline: none;
        border: 2px solid #fff;
        border-radius: 20px;
        font-size: 20px;
        color: #fff;
        padding-left: 20px;
        appearance: none;
    }
}
    .input-box{
        position: relative;
        width: 750px;
        height: 200px;
        margin-left: 30px;
        margin-bottom: 40px
    }
    textarea{
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

  .buttons-container {
    display: flex;
    justify-content: space-between;
    padding: 0 20px;
  }

  .cancel-button, .save-button, .delete-button {
    padding: 10px 20px;
    border: none;
    border-radius: 20px;
    cursor: pointer;
    font-weight: bold;
    bottom: 100px;
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

`;