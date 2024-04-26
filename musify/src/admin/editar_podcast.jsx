import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import AniadirWindow from "./salir_sin_guardar";
import EditCapWindow from "./editr_capitulo";
import { FaCog, FaClock } from "react-icons/fa";

const base64ToImageSrc = (base64) => {
    console.log("Base64 original:", base64); // Imprimir la base64 original

    // Eliminar el prefijo de la cadena base64 si está presente
    const base64WithoutPrefix = base64.replace(/^data:image\/[a-z]+;base64,/, '');
    console.log("Base64 sin prefijo:", base64WithoutPrefix); // Imprimir la base64 sin prefijo

    // Decodificar la cadena base64
    const byteCharacters = atob(base64WithoutPrefix);
    console.log("Caracteres de bytes:", byteCharacters); // Opcional: Imprimir los caracteres después de atob
    const imageSrc = `data:image/jpeg;base64,${atob(base64WithoutPrefix)}`;
    console.log("Imagen transformada:", imageSrc); // Imprimir el src de la imagen transformada
    return imageSrc;
};

export default function EditarPodcasrAdmin() {
    const { podcastId } = useParams();
    const[podcast, setPodcast] = useState(null);
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false); // Estado para controlar la visibilidad del modal
    const [capitulos, setCapitulos] = useState([]);

    const [nombre, setNombre] = useState('');
    const [presentador, setPresentador] = useState('');
    const [anio, setAnio] = useState('');
    const [genero, setGenero] = useState([]);
    const [foto, setFoto] = useState(null);
    const [audio, setAudio] = useState(null);

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

    const handleExitWithoutSave = () => {
        setShowModal(true); // Muestra el modal al hacer clic en "Salir sin guardar"
    };
    
    const handleCloseModal = () => {
        setShowModal(false); // Cierra el modal al hacer clic en "Cancelar" o fuera del modal
    };

    const handleCloseModalNoSave = () => {
        navigate('/lista_podcast_admin'); //Vuelve a la lista de canciones
    };

    useEffect(() => {
        const fetchPodcast = async () => {
            setLoading(true);
            try {
                const response = await fetch('http://127.0.0.1:8000/devolverPodcast/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ id: podcastId })
                });
                if (response.ok) {
                    const data = await response.json();
                    const podcastData = {
                      id: data.id,
                      foto: base64ToImageSrc(data.foto),
                      nombre: data.nombre,
                      presentador: data.presentador,
                      fecha: data.fecha,
                    };
                    setPodcast(podcastData);
                    console.log(podcastData);
                    setNombre(podcastData.nombre);
                    setPresentador(podcastData.presentador);
                    setAnio(podcastData.fecha);
                    //setGenero(podcastData);
                    setFoto(podcastData.foto);

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
    }, [podcastId]);

    useEffect(() => {
        const fetchCapitulos = async () => {
            setLoading(true);
            try {
                const response = await fetch('http://127.0.0.1:8000/listarCapitulosPodcast/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ id: podcastId })
                });
                if (response.ok) {
                    const data = await response.json();
                    const updatedCapitulos = data.canciones.map(capitulo => ({
                        id: capitulo.id,
                        nombre: capitulo.nombre
                    }));
                    setCapitulos(updatedCapitulos);
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
        fetchCapitulos();
    }, []);

    return (
        <>
          <Container>
            <div className='wrapper'>
                <form action="">
                    <div className="info">
                        <div className="titulo">
                            <input 
                                type="titulo" 
                                value={nombre}
                                onChange={e=>setNombre(e.target.value)}
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
                                value={anio}
                                onChange={e=>setAnio(e.target.value)}
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
                        <h7>Archivo de audio (.mp3):</h7>
                        <input type="file" accept=".mp3" onChange={e=>setAudio(e.target.value)} required />
                    </div>
                    <div className="image">
                        <h7>Imagen:</h7>
                        <input type="file" accept="image/*" onChange={e=>setFoto(e.target.value)} required />
                    </div>
                    <div className="chapter-list-container">
                        <div className="chapter-list-header">
                            <div className="chapter-list-item">Capítulo</div>
                            <div className="chapter-list-item">Título</div>
                            <div className="chapter-list-item">Fecha</div>
                            <div className="chapter-list-item"><FaClock /></div>
                            <div className="chapter-list-item">Editar</div>
                        </div>
                        <div className="chapter-list-body">
                            {capitulos.map(capitulo => (
                                <div key={capitulo.id} className="chapter-list-row">
                                    <div className="chapter-list-item">{capitulo.id}</div>
                                    <div className="chapter-list-item">{capitulo.name}</div>
                                    <div className="chapter-list-item">{capitulo.fecha}</div>
                                    <div className="chapter-list-item">{capitulo.duration}</div>
                                    <div className="chapter-list-item">
                                        <FaCog className="capitulos__settings" 
                                        onClick={() => showModal && EditCapWindow(capitulo.name, capitulo.fecha, capitulo.duration)}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="buttons-container">
                        <button type="button" className="cancel-button" onClick={handleExitWithoutSave}>Salir sin guardar</button>
                        {showModal && <AniadirWindow onClose={handleCloseModal} ruta={handleCloseModalNoSave} />}
                        <button type="submit" className="save-button">Guardar</button>
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

  .cancel-button, .save-button {
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
