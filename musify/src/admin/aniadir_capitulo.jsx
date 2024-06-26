import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from 'react-router-dom';
import AniadirWindow from "./salir_sin_guardar";
import { useParams } from 'react-router-dom';

export default function EditCapitulo() {
  const navigate = useNavigate();
  const { miPodcast } = useParams();
  const [capitulo, setCapitulo] = useState(null);
  const [nomPodcast, setNomPodcast] = useState('');
  const [titulo, setNombre] = useState('');
  const [desc, setDescripcion] = useState('');
  const [audio, setAudio] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [capituloValid, setCapituloValid] = useState(true);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');


    /*useEffect(() => {
        if (titulo.trim() !== '' && desc.trim() !== '' && miPodcast.trim() !== '' && audio.trim() !== '') {
        setCapituloValid(true);
        } else {
        setCapituloValid(false);
        }
    }, [titulo, desc, miPodcast, audio]);*/

    useEffect(() => {
        const fetchPodcast = async () => {
            setLoading(true);
            try {
                const response = await fetch('http://musify.servemp3.com:8000/devolverPodcast/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ podcastId: miPodcast })
                });
                if (response.ok) {
                    if (!response.ok) throw new Error("Failed to fetch song details");
                    const podcastData = await response.json();
                    setNomPodcast(podcastData.podcast.nombre);
                    console.log(podcastData.podcast.nombre);
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
        fetchPodcast();
    }, [miPodcast]);

    const handleExitWithoutSave = () => {
        setShowModal(true); // Muestra el modal al hacer clic en "Salir sin guardar"
    };

    const handleCloseModal = () => {
        setShowModal(false); // Cierra el modal al hacer clic en "Cancelar" o fuera del modal
    };

    const handleCloseModalNoSave = () => {
        navigate(`/editar_podcast/${miPodcast}`); //Vuelve a la lista de canciones
    };

    const handleCapituloAniadido = async () => {
        if(audio) {
            console.log(audio);
            try {
                const response = await fetch('http://musify.servemp3.com:8000/crearCapitulo/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({nombre: titulo, descripcion: desc, podcastId: miPodcast, nombreArchivoMp3: audio}),
                });

                if (response.ok) {
                    // Si el registro es exitoso, redirige al usuario
                    navigate(`/editar_podcast/${miPodcast}`);
                    console.log('Capitulo creado');
                } else {
                    // Maneja errores, por ejemplo, mostrar un mensaje al usuario
                }
            } catch (error) {
                // Maneja excepciones
            }
        }
    };

    const handleDescripcionChange = (e) => {
        setDescripcion(e.target.value);
    };

    const handleAudioChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onloadend = () => {
            // Cuando la carga del archivo esté completa, establecemos el audio en base64
            setAudio(reader.result);
        };

        // Leemos el archivo como una URL de datos en base64
        reader.readAsDataURL(file);
        console.log(reader.result);
    };

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
                            value={titulo}
                            onChange={(e) => {setNombre(e.target.value)}}
                            placeholder="Título del capítulo" required
                            />
                    </div>
                    <div className="input-box">
                        <h6>Podcast:</h6>
                        <input 
                            type="podcast" 
                            value={nomPodcast}
                            />
                    </div>
                </div>
                <div className="audio">
                    <h6>Archivo de audio (.mp3):</h6>
                    <input type="file" accept=".mp3" onChange={handleAudioChange}/>
                </div>
                <div className="input-box">
                    <h6>Descripción:</h6>
                    <textarea className='input' value={desc} onChange={handleDescripcionChange}/>
                </div>
                <div className="buttons-container">
                    <button type="button" className="cancel-button" onClick={handleExitWithoutSave}>Salir sin guardar</button>
                    {showModal && <AniadirWindow onClose={handleCloseModal} ruta={handleCloseModalNoSave} />}
                    <button type="button" className="save-button" onClick={handleCapituloAniadido}>Guardar</button>
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

    .input-box input::placeholder {
        color: #fff;
    }

    .titulo input::placeholder {
        color: #fff;
    }

    .audio{
        position: absolute;
        right: 30px;
        top: 165px;
        width: 300px;
        height: 50px;
        outline: none;
        input {
            width: 100%;
            height: 100%;
            background: transparent;
        }
    }

  .buttons-container {
    display: flex;
    justify-content: space-between;
    padding: 0 20px;
  }

  .cancel-button, .save-button {
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
`;