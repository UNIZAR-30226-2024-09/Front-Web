import React from 'react'
import styled from "styled-components";
import Desplegable from './desplegable'

export default function Ayuda() {
  return (
        <Container>
                <div className='wrapper'>
                <Header>
                        <h1>Ayuda con la aplicación</h1>
                </Header>
                <Desplegable title='¿Qué es Musify?'>
                        <p>Musify es una plataforma de streaming de música que te permite escuchar tus canciones, álbumes y artistas favoritos en cualquier momento y lugar. Con Musify, puedes crear playlists personalizadas, explorar nuevas músicas según tus gustos y conectar con una comunidad de amantes de la música.</p>
                </Desplegable>
                <Desplegable title='Tú biblioteca'>
                        <p>Tu biblioteca en Musify es el lugar donde se guardan todas tus canciones y playlists favoritas. Aquí puedes acceder fácilmente a todo lo que has guardado y organizado, permitiéndote disfrutar de tu música seleccionada siempre que quieras.</p>
                </Desplegable>
                <Desplegable title='Buscar'>
                        <p>La función de búsqueda en Musify te permite encontrar rápidamente cualquier canción, artista, álbum o playlist. Simplemente escribe lo que estás buscando en la barra de búsqueda y explora los resultados para encontrar exactamente lo que deseas.</p>
                </Desplegable>
                <Desplegable title='Cola de reproducción'>
                        <p>La cola de reproducción de Musify te muestra una lista de todas las canciones que están por reproducirse. Aquí puedes organizar el orden de las canciones según tus preferencias, agregar nuevas pistas o eliminar las que ya no quieres escuchar.</p>
                </Desplegable>
                <Desplegable title='Historial'>
                        <p>En el historial de Musify puedes ver todas las canciones que has escuchado recientemente.</p>
                </Desplegable>
                <Desplegable title='Ver Lyrics'>
                        <p>Musify te ofrece la posibilidad de ver la letra de las canciones mientras las escuchas. Solo necesitas seleccionar el icono del micrófono en la barra de reproducción mientras una canción está sonando para cantar junto a tus artistas favoritos</p>
                </Desplegable>
                <Desplegable title='Sonando'>
                        <p>En la barra de reproducción de Musify puedes ver y gestionar la canción que está tocando actualmente. Además, aquí puedes ajustar el volumen, pasar a la siguiente pista o volver a la anterior</p>
                </Desplegable>
                <Desplegable title='Podcasts'>
                        <p> Además de música, Musify también ofrece una variedad de podcasts.</p>
                </Desplegable>
                <Desplegable title='Playlists privadas VS públicas'>
                        <p> En Musify, puedes crear playlists privadas que solo tú puedes ver o decidir hacerlas públicas para compartir con otros usuarios. Las playlists públicas son una gran manera de conectar con otros y descubrir nueva música a través de las selecciones de otros.</p>
                </Desplegable>
                <Desplegable title='Seguir Amigos'>
                        <p> Sigue a tus amigos en Musify para ver qué están escuchando. Puedes compartir música directamente con ellos y descubrir nuevas canciones a través de sus bibliotecas.</p>
                </Desplegable>
                <Desplegable title='Comparte desde Musify'>
                        <p> Musify te permite compartir música directamente desde la plataforma a través de enlaces directos. Comparte tus descubrimientos y gustos con tus amigos y el mundo.</p>
                </Desplegable>
                </div>
        </Container>
  )
}

const Container = styled.div` 
.wrapper {
        width: 800px;
        height: 100%;
        padding: 10px;
        color: #fff;
}

.h1{
        font-size: 36px;
        text-align: left;
        margin-top: 20px;
        font-size: 2.5rem;
        color: #ffffff;
}
`;

const Header = styled.header`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    max-width: 1150px;
    margin-top: 40px;
    margin-bottom: 10px;

    h1 {
        font-size: 2.5rem;
        color: #ffffff;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }
`;