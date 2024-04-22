import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from 'react-router-dom';
import AniadirWindow from "./salir_sin_guardar";

export default function EditarCancion(tituloI, artistaI, albumI, duracionI) {
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false); // Estado para controlar la visibilidad del modal
    const [modificado, setModificado] = useState(false);
    const [cancionValid, setCancionValid] = useState(false);

    const [titulo, setTitulo] = useState(tituloI);
    const [artista, setArtista] = useState(artistaI);
    const [album, setAlbum] = useState(albumI);
    const [duracion, setDuracion] = useState(duracionI);
    const [genero, setGenero] = useState('');
    const [imagen, setImagen] = useState(null);
    const [audio, setAudio] = useState(null);

    useEffect(() => {
        // Aquí, verifica si la contraseña y su confirmación están llenas y son iguales
        if (titulo.trim() !== '' && artista.trim() !== '' && album.trim() !== '' && duracion.trim() !== '') {
          setCancionValid(true);
        } else {
          setCancionValid(false);
        }
    }, [titulo, artista, album, duracion, genero]);

    useEffect(() => {
        // Verifica si hay cambios en los datos de la canción
        const haCambiado = (
            titulo !== tituloI ||
            artista !== artistaI ||
            album !== albumI ||
            duracion !== duracionI 
        );
        setModificado(haCambiado);
    }, [titulo, artista, album, duracion, genero, imagen, audio, tituloI, artistaI, albumI, duracionI]);

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
                                value={titulo}
                                onChange={e=>setTitulo(e.target.value)}
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
                                type="password" 
                                value={duracion}
                                onChange={e=>setDuracion(e.target.value)}
                                placeholder="Duración" required />
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