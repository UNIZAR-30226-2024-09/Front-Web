import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from 'react-router-dom';
import AniadirWindow from "./salir_sin_guardar";
import EditCapWindow from "./ventana_cap";
import { FaCog, FaClock } from "react-icons/fa";

const capitulos = [
    {
      id: 1,
      name: "Capitulo 1",
      fecha: "Fecha 1",
      duration: "3:45",
    },
    {
      id: 2,
      name: "Capitulo 2",
      fecha: "Fecha 2",
      duration: "4:05",
    },
];

export default function EditarPodcasrAdmin(tituloI, presentadorI, anioI, generoI) {
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false); // Estado para controlar la visibilidad del modal
    const [podcastValid, setPodcastValid] = useState(false);

    const [titulo, setTitulo] = useState(tituloI);
    const [presentador, setPresentador] = useState(presentadorI);
    const [fecha, setFecha] = useState(anioI);
    const [duracion, setDuracion] = useState('');
    const [genero, setGenero] = useState(generoI);
    const [imagen, setImagen] = useState(null);
    const [audio, setAudio] = useState(null);

    useEffect(() => {
        if (titulo.trim() !== '' && fecha.trim() !== '' && duracion.trim() !== '' ) {
          setPodcastValid(true);
        } else {
          setPodcastValid(false);
        }
    }, [titulo, presentador, fecha]);

    const handleExitWithoutSave = () => {
        setShowModal(true); // Muestra el modal al hacer clic en "Salir sin guardar"
    };
    
    const handleCloseModal = () => {
        setShowModal(false); // Cierra el modal al hacer clic en "Cancelar" o fuera del modal
    };

    const handleCloseModalNoSave = () => {
        navigate('/lista_podcast_admin'); //Vuelve a la lista de canciones
    };
    
    const handleCancionAniadida = () => {
        if(podcastValid) {
            navigate('/lista_podcast_admin');
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
                        <h7>Archivo de audio (.mp3):</h7>
                        <input type="file" accept=".mp3" onChange={e=>setAudio(e.target.value)} required />
                    </div>
                    <div className="image">
                        <h7>Imagen:</h7>
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
