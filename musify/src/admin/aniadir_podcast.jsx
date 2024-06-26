import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from 'react-router-dom';
import AniadirWindow from "./salir_sin_guardar";

export default function AniadirPodcasrAdmin() {
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [podcastValid, setPodcastValid] = useState(true);

    const [titulo, setTitulo] = useState('');
    const [presentador, setPresentador] = useState('');
    const [genero, setGenero] = useState('');
    const [imagen, setImagen] = useState('');
    const [generos, setGeneros] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    /*useEffect(() => {
        if (titulo.trim() !== '' && fecha.trim() !== '' && duracion.trim() !== '' ) {
          setPodcastValid(true);
        } else {
          setPodcastValid(false);
        }
    }, [titulo, fecha, duracion]);*/

    useEffect(() => {
        const fetchGeneros = async () => {
            try {
                const response = await fetch(`http://musify.servemp3.com:8000/generosPodcasts/`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });
                if (!response.ok) throw new Error("Failed to fetch album");
                const generosData = await response.json();
                const nombresGeneros = generosData.generos.map(genero => genero.nombre);
                setGeneros(nombresGeneros);
                console.log(generosData);
            } catch (error) {
                setError(`Failed to fetch generos: ${error.message}`);
            } finally {
                setLoading(false);
            }
        };
        fetchGeneros();
    }, []);

    const handleExitWithoutSave = () => {
        setShowModal(true); // Muestra el modal al hacer clic en "Salir sin guardar"
    };
    
    const handleCloseModal = () => {
        setShowModal(false); // Cierra el modal al hacer clic en "Cancelar" o fuera del modal
    };

    const handleCloseModalNoSave = () => {
        navigate('/lista_podcast_admin'); //Vuelve a la lista de podcast
    };

    const handleImagenChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onloadend = () => {
            // Cuando la carga del archivo esté completa, establecemos la imagen en base64
            setImagen(reader.result);
        };

        // Leemos el archivo como una URL de datos en base64
        reader.readAsDataURL(file);
    };

    const handlePodcastAniadido = async () => {
        if(imagen) {
            console.log(imagen);
            try {
                const response = await fetch('http://musify.servemp3.com:8000/crearPodcast/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({nombre: titulo, imagen_b64: imagen, presentadores: presentador, generos: genero}),
                });
                if (response.ok) {
                    // Si el registro es exitoso, redirige al usuario
                    navigate('/lista_podcast_admin');
                    console.log('Podcast creado');
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
                                placeholder="Título del podcast" required />
                        </div>
                        <div className="input-box">
                            <input 
                                type="presentador" 
                                value={presentador}
                                onChange={e=>setPresentador(e.target.value)}
                                placeholder="Presentador"/>
                        </div>
                        <select value={genero} onChange={e=>setGenero(e.target.value)}>
                            <option value="">Selecciona un género</option>
                            {generos.map((genero, index) => (
                                <option key={index} value={genero}>{genero}</option>
                            ))}
                        </select>
                    </div>
                    <div className="image">
                        <h6>Imagen:</h6>
                        <input className="image-input" type="file" accept="image/*" onChange={handleImagenChange}/>
                        {imagen && (
                            <div className="preview">
                                <img src={imagen} alt="Vista previa de la imagen" />
                            </div>
                        )}
                    </div>
                    <div className="buttons-container">
                        <button type="button" className="cancel-button" onClick={handleExitWithoutSave}>Salir sin guardar</button>
                        {showModal && <AniadirWindow onClose={handleCloseModal} ruta={handleCloseModalNoSave} />}
                        <button type="button" className="save-button" onClick={handlePodcastAniadido}>Guardar</button>
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
    height: 400px;
    padding: 30px;
    .titulo {
        width: 400px;
        height: 80px;
        margin-top: 35px;
        margin-bottom: 20px;
    }
    
    .input-box{
        position: relative;
        width: 400px;
        height: 40px;
        margin: 30px 0;
    }
    select {
        position: relative;
        width: 400px;
        height: 40px;
        margin-top: 100px;
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

.input-box input::placeholder {
    color: #fff;
}

.titulo input::placeholder {
    color: #fff;
}

.audio{
    position: absolute;
    bottom: 220px;
    right: 40px;
    width: 300px;
    height: 50px;
    outline: none;
    text-align: center;
    input {
        width: 100%;
        height: 100%;
        background: transparent;
    }
}

.image {
    position: absolute;
    top: 60px;
    right: 40px;
    width: 300px;
    height: 200px;
    outline: none;
    border: 2px solid #fff;
    border-radius: 20px;
    align-items: center;
    overflow: hidden;
}

.image h6 {
    border: 10px;
    text-align: center;
}

.image preview {
    width: 100%; 
    height: 100%;
}

.preview img {
    width: 120px;
    height: 120px;
    text-align: center;
    object-fit: cover; /* Para ajustar la imagen al tamaño del contenedor sin deformarla */
}

  .buttons-container {
    display: flex;
    justify-content: space-between;
    padding: 90px 30px;
  }

  .cancel-button, .save-button {
    padding: 10px 20px;
    border: 20px;
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
