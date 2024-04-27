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

    const[nombre, setNombre] = useState('');
    const[artistas, setArtistas] = useState([]);
    const[album, setAlbum] = useState('');
    const[genero, setGenero] = useState('');
    const[foto, setFoto] = useState(null);
    const[audio, setAudio] = useState(null);
    const[duracion, setDuracion] = useState('');

    const [showModal, setShowModal] = useState(false); // Estado para controlar la visibilidad del modal
    //const [modificado, setModificado] = useState(false);
    const [cancionValid, setCancionValid] = useState(false);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCancion = async () => {
            setLoading(true);
            try {
                const response = await fetch(`http://127.0.0.1:8000/devolverCancion/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ cancionId })
                });
                if (!response.ok) throw new Error("Failed to fetch song details");
                const data = await response.json();
                setNombre(data.cancion.nombre);
                setAlbum(data.cancion.miAlbum);
                setFoto(base64ToImageSrc(data.cancion.foto));
                setAudio(base64ToAudioSrc(data.cancion.archivoMp3));
                fetchArtistas();
                fetchAlbum(data.cancion.miAlbum);
                fetchDuracion(base64ToAudioSrc(data.cancion.archivoMp3))
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        const fetchArtistas = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:8000/listarArtistasCancion/`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ cancionId })
                });
                if (!response.ok) throw new Error("Failed to fetch artistas");
                const songData = await response.json();
                const updatedArtistas = songData.artistas.map(artista => ({
                    nombre: artista.nombre
                }));
                setArtistas(updatedArtistas);
            } catch (error) {
                setError(`Failed to fetch artistas: ${error.message}`);
            } finally {
                setLoading(false);
            }
        };

        const fetchAlbum = async (idAlbum) => {
            try {
                const response = await fetch(`http://127.0.0.1:8000/devolverAlbum/`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ albumId: idAlbum })
                });
                if (!response.ok) throw new Error("Failed to fetch album");
                const albumData = await response.json();
                setAlbum(albumData.album.nombre);
            } catch (error) {
                setError(`Failed to fetch album: ${error.message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchCancion();
    }, [cancionId]);

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

    /*useEffect(() => {
        if (nombre.trim() !== '' && artista.trim() !== '' && album.trim() !== '' ) {
          setCancionValid(true);
        } else {
          setCancionValid(false);
        }
    }, [nombre, artista, album]);*/

    if (loading) return <p>Cargando...</p>;
    if (error) return <p>Error: {error}</p>;

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

    const handleInputChange = (e) => {
        const nuevosArtistas = e.target.value.split(",").map((nombre) => nombre.trim());
        setArtistas(nuevosArtistas);
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
                                value={nombre}
                                onChange={(e) => {
                                    console.log('Valor del nombre:', e.target.value);
                                    setNombre(e.target.value)
                                }}
                                placeholder={nombre}
                                />
                        </div>
                        <div className="artistas">
                            <h6>Artistas:</h6>
                            <textarea
                                rows={4} 
                                value={artistas.map(artista => artista.nombre).join(",")}
                                onChange={handleInputChange}
                                placeholder="Escribe los nombres de los artistas separados por comas"
                            />
                        </div>
                        <div className="input-box">
                            <h6>Album:</h6>
                            <input 
                                type="album" 
                                value={album} 
                                onChange={(e) => setAlbum(e.target.value)}
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
                        <input type="file" accept=".mp3" />
                    </div>
                    <div className="image">
                        <h6>Imagen:</h6>
                        <img 
                            className="album-image"
                            src={foto} alt="Imagen predefinida" 
                        />
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
        margin-bottom: 30px;
    }

    .artistas{
        width: 400px;
        height: 80px;
        margin-bottom: 20px;
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
        font-size: 20px;
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
    .album-image{
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