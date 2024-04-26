import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import AniadirWindow from "./salir_sin_guardar";

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

const base64ToAudioSrc = (base64) => {
    console.log("Base64 original:", base64); // Imprimir la base64 original

    // Eliminar cualquier prefijo incorrecto y asegurar que es el correcto para audio/mp3
    const base64WithoutPrefix = base64.replace(/^data:audio\/mp3;base64,/, '').replace(/^data:[^;]+;base64,/, '');
    const audioSrc = `data:audio/mp3;base64,${atob(base64WithoutPrefix)}`;
    console.log("Audio transformado:", audioSrc); // Imprimir el src del audio transformado

    return audioSrc;
};

export default function EditarCancion() {
    const navigate = useNavigate();
    const { cancionId } = useParams();
    const[cancion, setCancion] = useState(null);

    const[nombre, setNombre] = useState('');
    const[artista, setArtista] = useState('');
    const[album, setAlbum] = useState('');
    const[genero, setGenero] = useState('');
    const[foto, setFoto] = useState(null);
    const[audio, setAudio] = useState(null);

    const [showModal, setShowModal] = useState(false); // Estado para controlar la visibilidad del modal
    //const [modificado, setModificado] = useState(false);
    const [cancionValid, setCancionValid] = useState(false);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCancion = async () => {
            setLoading(true);
            try {
                const response = await fetch('http://127.0.0.1:8000/devolverCancion/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ id: cancionId })
                });
                if (response.ok) {
                    const data = await response.json();
                    const cancionData = {
                      id: data.id,
                      foto: base64ToImageSrc(data.foto),
                      archivo_mp3: base64ToAudioSrc(data.archivoMp3),
                      nombre: data.nombre,
                      artista: data.artista,
                      album: data.album,
                    };
                    setCancion(cancionData);
                    console.log(cancionData);
                    setNombre(cancionData.nombre);
                    setArtista(cancionData.artista);
                    setAlbum(cancionData.album);
                    //setGenero(cancionData);
                    setFoto(cancionData.foto);
                    setAudio(cancionData.archivo_mp3);

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
        fetchCancion();
    }, [cancionId]);

    useEffect(() => {
        if (nombre.trim() !== '' && artista.trim() !== '' && album.trim() !== '' ) {
          setCancionValid(true);
        } else {
          setCancionValid(false);
        }
    }, [nombre, artista, album]);

    if (loading) return <p>Cargando...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!cancion.length) return <p>No hay cancion disponibles</p>;

    /*useEffect(() => {
        // Verifica si hay cambios en los datos de la canción
        const haCambiado = (
            titulo !== tituloI ||
            artista !== artistaI ||
            album !== albumI ||
            duracion !== duracionI 
        );
        setModificado(haCambiado);
    }, [titulo, artista, album, duracion, genero, imagen, audio, tituloI, artistaI, albumI, duracionI]);
    */

    const handleExitWithoutSave = () => {
        setShowModal(true); // Muestra el modal al hacer clic en "Salir sin guardar"
    };
    
    const handleCloseModal = () => {
        setShowModal(false); // Cierra el modal al hacer clic en "Cancelar" o fuera del modal
    };

    const handleCloseModalNoSave = () => {
        navigate('/lista_canciones_admin'); //Vuelve a la lista de canciones
    };
    
    const handleCancionAniadida = () => {
        if(cancionValid) {
            navigate('/lista_canciones_admin');
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
                                value={nombre}
                                onChange={e=>setNombre(e.target.value)}
                                placeholder="Título de la canción" required />
                        </div>
                        <div className="input-box">
                            <input 
                                type="artista" 
                                value={artista}
                                onChange={e=>setArtista(e.target.value)}
                                placeholder="Artista" required />
                        </div>
                        <div className="input-box">
                            <input 
                                type="album" 
                                value={album}
                                onChange={e=>setAlbum(e.target.value)}
                                placeholder="Album" required />
                        </div>
                        <div className="input-box">
                            <input 
                                type="duracion" 
                                value={''}
                                />
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
                        <input type="file" accept=".mp3" />
                    </div>
                    <div className="image">
                        <h7>Imagen:</h7>
                        <input type="file" accept="image/*"/>
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
    height: 500px;
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
    bottom: 180px;
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