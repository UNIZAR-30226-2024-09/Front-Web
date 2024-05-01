import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from 'react-router-dom';
import AniadirWindow from "./salir_sin_guardar";
import { FaClock } from "react-icons/fa";
import { IoAddCircle } from "react-icons/io5";
import { usePodcast } from "./podcastContext";

export default function AniadirPodcasrAdmin() {
    const navigate = useNavigate();
    const { podcastDetails, setPodcastDetails } = usePodcast() || {};
    const [showModal, setShowModal] = useState(false); // Estado para controlar la visibilidad del modal
    const [showModalCap, setShowModalCap] = useState(false);
    const [podcastValid, setPodcastValid] = useState(false);

    const [titulo, setTitulo] = useState('');
    const [presentador, setPresentador] = useState('');
    const [fecha, setFecha] = useState('');
    const [duracion, setDuracion] = useState('');
    const [genero, setGenero] = useState('');
    const [imagen, setImagen] = useState(null);
    const [audio, setAudio] = useState(null);

    useEffect(() => {
        if (titulo.trim() !== '' && fecha.trim() !== '' && duracion.trim() !== '' ) {
          setPodcastValid(true);
        } else {
          setPodcastValid(false);
        }
    }, [titulo, fecha, duracion]);

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
        navigate('/aniadir_capitulo'); //Vuelve a la lista de canciones
    };
    
    const handleCancionAniadida = async () => {
        if(podcastValid) {
            const updatedPodcastDetails = { ...podcastDetails, nombre: titulo, foto: imagen };
            setPodcastDetails(updatedPodcastDetails);
            console.log(podcastDetails);
            try {
                const response = await fetch('http://127.0.0.1:8000/crearCancion/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({nombre: titulo, nombreFoto: audio}),
                });

                if (response.ok) {
                    // Si el registro es exitoso, redirige al usuario
                    navigate('/lista_podcast_admin');
                } else {
                    // Maneja errores, por ejemplo, mostrar un mensaje al usuario
                }
            } catch (error) {
                // Maneja excepciones
            }
        }
    };

    return (
        <>
          <Container>
            <div className='wrapper'>
                <form action="">
                    <div className="info">
                        <div className="titulo">
                            <input 
                                type="titulo" 
                                value={titulo}
                                onChange={e=>setTitulo(e.target.value)}
                                placeholder="Título de la canción" required />
                        </div>
                        <div className="input-box">
                            <input 
                                type="presentador" 
                                value={presentador}
                                onChange={e=>setPresentador(e.target.value)}
                                placeholder="Presentador" required />
                        </div>
                        <div className="input-box">
                            <input 
                                type="año" 
                                value={fecha}
                                onChange={e=>setFecha(e.target.value)}
                                placeholder="Año" required />
                        </div>
                        <select value={genero} onChange={e=>setGenero(e.target.value)} required>
                            <option value="">Selecciona un género</option>
                            <option value="Rock">Rock</option>
                            <option value="Pop">Pop</option>
                            <option value="Hip-Hop">Hip-Hop</option>
                            {/* Otros géneros */}
                        </select>
                    </div>
                    <div className="audio">
                        <h6>Archivo de audio (.mp3):</h6>
                        <input type="file" accept=".mp3" onChange={e=>setAudio(e.target.value)} required />
                    </div>
                    <div className="image">
                        <h6>Imagen:</h6>
                        <input type="file" accept="image/*" onChange={e=>setImagen(e.target.value)} required />
                    </div>
                    <div className="chapter-list-container">
                        <div className="chapter-list-header">
                            <div className="chapter-list-item">Capítulo</div>
                            <div className="chapter-list-item">Título</div>
                            <div className="chapter-list-item">Fecha</div>
                            <div className="chapter-list-item"><FaClock /></div>
                            <div className="chapter-list-item">Editar</div>
                        </div>
                        <button type="button" className="chapter-button">
                            <IoAddCircle className="icon" onClick={handleAddCap}/>
                        </button>
                    </div>

                    <div className="buttons-container">
                        <button type="button" className="cancel-button" onClick={handleExitWithoutSave}>Salir sin guardar</button>
                        {showModal && <AniadirWindow onClose={handleCloseModal} ruta={handleCloseModalNoSave} />}
                        <button type="submit" className="save-button" onClick={handleCancionAniadida}>Guardar</button>
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
    height: 380px;
    padding: 30px;
    .titulo {
        width: 400px;
        height: 80px;
        margin-bottom: 20px;
    }
    
    .input-box, select{
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
    top: 30px;
    right: 40px;
    width: 300px;
    height: 200px;
    outline: none;
    border: 2px solid #fff;
    border-radius: 20px;
    h7 {
        border: 10px;
        text-align: center;
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

  .cancel-button, .save-button, .chapter-button {
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

  .chapter-button {
    margin-top: 10px;
    margin-left: 25px;
    background-color: #fff;
    color: #000;
  }

  .chapter-list-container {
    overflow-y: auto; 
    scroll-behavior: smooth;
        .capitulos__settings {
            cursor: pointer;
        }
        .chapter-list-header {
            display: flex;
            justify-content: space-between;
            background-color: none;
            padding: 8px;
            font-weight: bold;
        }
        .chapter-list-body {
            overflow-y: auto; 
        }
    
        .chapter-list-row {
            display: flex;
            justify-content: space-between;
            border-bottom: 1px solid #ccc;
            padding: 8px;
        }
    
        .chapter-list-item {
            flex: 1;
            text-align: center;
        }
    }

`;
