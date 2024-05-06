import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from 'react-router-dom';
import AniadirWindow from "./salir_sin_guardar";
import { useSong } from "./songContext";

export default function AniadirCancionesAdmin() {
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const { songDetails, setSongDetails } = useSong() || {};

    const [titulo, setTitulo] = useState('');
    const [artista, setArtista] = useState('');
    const [album, setAlbum] = useState('');
    const [duracion, setDuracion] = useState('');
    const [generos, setGeneros] = useState('');
    const [imagen, setImagen] = useState(null);
    const [audio, setAudio] = useState(null);
    const [cancionValid, setCancionValid] = useState(false);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (titulo.trim() !== '' && artista.trim() !== '' && album.trim() !== '' && imagen.trim() !== '' && audio.trim() !== '') {
          setCancionValid(true);
        } else {
          setCancionValid(false);
        }
    }, [titulo, artista, album, imagen, audio]);

    useEffect(() => {
        const fetchGeneros = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:8000/generosCanciones/`, {
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
        fetchGeneros();
    }, []);

    if (loading) return <p>Cargando...</p>;
    if (error) return <p>Error: {error}</p>;

    const handleExitWithoutSave = () => {
        setShowModal(true); // Muestra el modal al hacer clic en "Salir sin guardar"
    };
    
    const handleCloseModal = () => {
        setShowModal(false); // Cierra el modal al hacer clic en "Cancelar" o fuera del modal
    };

    const handleCloseModalNoSave = () => {
        navigate('/lista_canciones_admin'); //Vuelve a la lista de canciones
    };
    
    const handleCancionAniadida = async () => {
        if(cancionValid) {
            const updatedSongDetails = { ...songDetails, nombre: titulo, miAlbum: album, foto: imagen, archivoMp3: audio};
            setSongDetails(updatedSongDetails);
            console.log(songDetails);
            try {
                const response = await fetch('http://127.0.0.1:8000/crearCancion/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({nombre: titulo, nombreFoto: imagen, miAlbum: album, nombreArchivoMp3: audio}),
                });

                if (response.ok) {
                    // Si el registro es exitoso, redirige al usuario
                    navigate('/lista_canciones_admin');
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
                                placeholder="Título de la canción" required 
                                style={{ '::placeholder': { color: '#000' } }}/>
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
                        <select value={generos} onChange={e=>setGeneros(e.target.value)} required>
                            <option value="">Selecciona un género</option>
                            {generos.map((genero, index) => (
                                <option key={index} value={genero}>{genero}</option>
                            ))}
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
    text-align: center;
    h6 {
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