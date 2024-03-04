import React, { useRef } from "react";
import styled from "styled-components";

const canciones = [
    {
      id: 1,
      name: "Canción 1",
      artists: "Artista 1",
      album: "Álbum 1",
      duration: "3:45",
      imageUrl: "/imagenes/prueba.jpg",
    },
    {
      id: 2,
      name: "Canción 2",
      artists: "Artista 2",
      album: "Álbum 2",
      duration: "4:05",
      imageUrl: "/imagenes/prueba.jpg",
    },
    {
        id: 3,
        name: "Canción 3",
        artists: "Artista 3",
        album: "Álbum 3",
        duration: "4:05",
        imageUrl: "/imagenes/prueba.jpg",
      },
      {
        id: 4,
        name: "Canción 4",
        artists: "Artista 4",
        album: "Álbum 4",
        duration: "4:05",
        imageUrl: "/imagenes/prueba.jpg",
      },
      {
        id: 5,
        name: "Canción 5",
        artists: "Artista 5",
        album: "Álbum 5",
        duration: "4:05",
        imageUrl: "/imagenes/prueba.jpg",
      },
      {
        id: 6,
        name: "Canción 1",
        artists: "Artista 1",
        album: "Álbum 1",
        duration: "3:45",
        imageUrl: "/imagenes/prueba.jpg",
      },
      {
        id: 7,
        name: "Canción 2",
        artists: "Artista 2",
        album: "Álbum 2",
        duration: "4:05",
        imageUrl: "/imagenes/prueba.jpg",
      },
      {
          id: 8,
          name: "Canción 3",
          artists: "Artista 3",
          album: "Álbum 3",
          duration: "4:05",
          imageUrl: "/imagenes/prueba.jpg",
        },
        {
          id: 9,
          name: "Canción 4",
          artists: "Artista 4",
          album: "Álbum 4",
          duration: "4:05",
          imageUrl: "/imagenes/prueba.jpg",
        },
        {
          id: 10,
          name: "Canción 5",
          artists: "Artista 5",
          album: "Álbum 5",
          duration: "4:05",
          imageUrl: "/imagenes/prueba.jpg",
        },
  ];

export default function Body_inicio() {
   
    const recientes = canciones.slice(0, 10);
    const personalizadas = canciones.slice(0, 10);
    const topCanciones = canciones.slice(0, 10);

    return (
        <Container>
            <ButtonContainer>
                <ButtonStyled>Todo</ButtonStyled>
                <ButtonStyled>Música</ButtonStyled>
                <ButtonStyled>Podcasts</ButtonStyled>
            </ButtonContainer>
            <SectionTitle>Has escuchado recientemente</SectionTitle>
            <SongRow canciones={recientes} />
            <SectionTitle>Hecho para Usuario</SectionTitle>
            <SongRow canciones={personalizadas} />
            <SectionTitle>Top Canciones</SectionTitle>
            <SongRow canciones={topCanciones} />
        </Container>
    );
}

const SongRow = ({ canciones }) => {
    const scrollRef = useRef(null);

    const scroll = (direction) => {
        if (direction === 'left') {
            scrollRef.current.scrollBy({ left: -100, behavior: 'smooth' });
        } else {
            scrollRef.current.scrollBy({ left: 100, behavior: 'smooth' });
        }
    };

    return (
        <RowContainer>
            <ArrowButton onClick={() => scroll('left')}>{'<'}</ArrowButton>
            <ImagesContainer ref={scrollRef}>
                {canciones.map((cancion) => (
                    <ImageBox key={cancion.id}>
                        <img src={cancion.imageUrl} alt={cancion.name} />
                    </ImageBox>
                ))}
            </ImagesContainer>
            <ArrowButton onClick={() => scroll('right')}>{'>'}</ArrowButton>
        </RowContainer>
    );
};

const RowContainer = styled.div`
    display: flex;
    align-items: center;
`;

const ImagesContainer = styled.div`
    display: flex;
    flex-direction: row;
    gap: 20px;
    overflow-x: hidden; // Cambio importante aquí
    scroll-behavior: smooth;
`;

const ImageBox = styled.div`
    flex: 0 0 auto;
    width: 100px;
    height: 100px;
    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 10px;
    }
`;

const ArrowButton = styled.button`
    background: none;
    border: none;
    color: #fff;
    cursor: pointer;
    font-size: 24px;
    padding: 0 10px;
    user-select: none;
    &:hover {
        background-color: #ddd; // Estilo opcional para hover
    }
`;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2rem;
    margin-left: 5cm;
`;

const ButtonContainer = styled.div`
    margin-top: 1cm;
    display: flex;
    flex-direction: row;
    gap: 1cm;
`;

const SectionTitle = styled.h2`
    color: #fff;
    font-size: 16px;
    margin-left: 1rem;
    margin-bottom: none; /* Ajusta este valor para reducir el espacio */
    flex-direction: row;
`;


const ButtonStyled = styled.button`
    width: 90px;
    height: 40px;
    border: none;
    outline: none;
    border-radius: 40px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 700;
    background: #575151;
    color: #fff;
    box-shadow: 0 0 10px rgba(0,0,0, .1);
    border-radius: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    border: #575151;

    &:hover {
        background: #54b2e7;
        color: #fff;
    }
`;

