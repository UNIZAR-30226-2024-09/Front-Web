import React, { useState, useEffect } from "react";
import styled from "styled-components";
import "../pantallaInicioSesion/inicioSesion.css"
import { useNavigate } from 'react-router-dom';

export default function RegisterTerminosCondiciones() {
    const navigate = useNavigate();
    const [generosCanciones, setGenerosCanciones] = useState([]);
    const [generoCancionFav, setGeneroCancionFav] = useState('');
    const [generosPodcasts, setGenerosPodcasts] = useState([]);
    const [generoPodcastFav, setGeneroPodcastFav] = useState('');
    const [artistas, setArtistas] = useState([]);
    const [artistaFav, setArtistaFav] = useState('');
    const [presentadores, setPresentadores] = useState([]);
    const [presentadorFav, setPresentadorFav] = useState('');

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchGenerosCanciones = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:8000/generosCanciones/`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });
                if (!response.ok) throw new Error("Failed to fetch generos de canciones");
                const generosData = await response.json();
                const nombresGeneros = generosData.generos.map(genero => genero.nombre);
                setGenerosCanciones(nombresGeneros);
                console.log(nombresGeneros);
            } catch (error) {
                setError(`Failed to fetch generos: ${error.message}`);
            } finally {
                setLoading(false);
            }
        };
        fetchGenerosCanciones();
    }, []);

    useEffect(() => {
        const fetchGenerosPodcasts = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:8000/generosPodcasts/`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });
                if (!response.ok) throw new Error("Failed to fetch generos de podcasts");
                const generosData = await response.json();
                const nombresGeneros = generosData.generos.map(genero => genero.nombre);
                setGenerosPodcasts(nombresGeneros);
                console.log(nombresGeneros);
            } catch (error) {
                setError(`Failed to fetch generos: ${error.message}`);
            } finally {
                setLoading(false);
            }
        };
        fetchGenerosPodcasts();
    }, []);

    useEffect(() => {
        const fetchArtistas = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:8000/artistas/`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });
                if (!response.ok) throw new Error("Failed to fetch artistas");
                const artistasData = await response.json();
                const nombresArtistas = artistasData.artistas.map(artista => artista.nombre);
                setArtistas(nombresArtistas);
                console.log(nombresArtistas);
            } catch (error) {
                setError(`Failed to fetch artistas: ${error.message}`);
            } finally {
                setLoading(false);
            }
        };
        fetchArtistas();
    }, []);

    useEffect(() => {
        const fetchPresentadores = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:8000/presentadores/`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });
                if (!response.ok) throw new Error("Failed to fetch podcasts");
                const presentadoresData = await response.json();
                const nombresPresentadores = presentadoresData.presentadores.map(presentador => presentador.nombre);
                setPresentadores(nombresPresentadores);
                console.log(nombresPresentadores);
            } catch (error) {
                setError(`Failed to fetch presentadores: ${error.message}`);
            } finally {
                setLoading(false);
            }
        };
        fetchPresentadores();
    }, []);

    const handleSaltar = () => {
        navigate('/login'); //Vuelve a la lista de canciones
    };

    const handleTerminar = () => {
        navigate('/aniadir_capitulo'); //Vuelve a la lista de canciones
    };

    return (
        <>
            <Logo src="/imagenes/logo-musify.png" alt="Logo de Musify" />
            <Container>
                <div className='wrapper'>
                    <h1>¿Qué prefieres?</h1>
                    <div className="question">
                        <h6>¿Qué artistas prefieres?</h6>
                        <select className='seleccion' value={artistaFav} onChange={e=>setArtistaFav(e.target.value)}>
                            <option value="">Selecciona un artista</option>
                            {artistas.map((artista, index) => (
                                <option key={index} value={artista}>{artista}</option>
                            ))}
                        </select>
                    </div>

                    <div className="question">
                        <h6>¿Qué género de canciones prefieres?</h6>
                        <select className='seleccion' value={generoCancionFav} onChange={e=>setGeneroCancionFav(e.target.value)}>
                            <option value="">Selecciona un género</option>
                            {generosCanciones.map((genero, index) => (
                                <option key={index} value={genero}>{genero}</option>
                            ))}
                        </select>
                    </div>

                    <div className="question">
                        <h6>¿Qué presentador prefieres?</h6>
                        <select className='seleccion' value={presentadorFav} onChange={e=>setPresentadorFav(e.target.value)}>
                            <option value="">Selecciona un presentador</option>
                            {presentadores.map((presentador, index) => (
                                <option key={index} value={presentador}>{presentador}</option>
                            ))}
                        </select>
                    </div>

                    <div className="question">
                        <h6>¿Qué género de podcasts prefieres?</h6>
                        <select className='seleccion' value={generoPodcastFav} onChange={e=>setGeneroPodcastFav(e.target.value)}>
                            <option value="">Selecciona un género</option>
                            {generosPodcasts.map((podcast, index) => (
                                <option key={index} value={podcast}>{podcast}</option>
                            ))}
                        </select>
                    </div>

                    <div className="buttons-container">
                        <button type="button" className="button-saltar" onClick={handleSaltar}>Saltar</button>
                        <button type="button" className="button-terminar" onClick={handleTerminar}>Terminar</button>
                    </div>
                </div>
            </Container>
        </>
    );
}


const Logo = styled.img`
    position: absolute;
    top: 0;
    left: 0;
    height: 200px;
    margin-left: 15px;
    margin-top: 0px;
`;

const Container = styled.div`
.wrapper {
    width: 800px;
    height: 550px;
    color: #fff;
    border-radius: 40px;
    padding: 30px 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 80px;
    background: rgba(0, 0, 0, 0.25);
}
.wrapper h1{
    font-size: 36px;
    text-align: center;
    margin-top: 20px;
}

.wrapper .input-box {
    position: relative;
    width: 100%;
    max-width: 400px;
    height: 50px;
    margin: 30px auto;
    margin-top: 50px;
}

.date-input-box {
    position: relative;
}

.input-box input {
    width: 100%;
    height: 100%;
    background: transparent;
    outline: none;
    border: 2px solid rgba(255,255,255, .2);
    border-radius: 20px;
    font-size: 16px;
    color: #fff;
    padding: 20px 45px 20px 20px;
    border: 2px solid #fff;

}

.input-box input::placeholder {
    color: #fff;
}

.input-box .icon {
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 16px;
}

.question {
    width: 100%;
    display: inline-block;
    background-color: none;
    padding: 10px;
    margin-bottom: 10px;
    .seleccion {
        width: 100%;
        background-color: none;
    }
    h6 {
        font-size: 20px;
    }
}

.buttons-container {
    display: flex;
    justify-content: space-between;
}

.button-saltar, .button-terminar {
    padding: 10px 20px;
    border: none;
    border-radius: 20px;
    margin-top: 20px;
    margin-right: 200px;
    margin-left: 200px;
    background: #54b2e7;
    color: #fff;
    cursor: pointer;
    font-weight: bold;
    bottom: 100px;
}

`;