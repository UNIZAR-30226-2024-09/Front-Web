import React from "react";
import styled from "styled-components";
import { AiFillClockCircle } from "react-icons/ai";

const canciones = [
    {
      id: 1,
      name: "Canción 1",
      duration: "3:45",
      imageUrl: "/imagenes/prueba.jpg",
    },
    {
      id: 2,
      name: "Canción 2",
      duration: "4:05",
      imageUrl: "/imagenes/prueba.jpg",
    },
    {
        id: 3,
        name: "Canción 3",
        duration: "4:05",
        imageUrl: "/imagenes/prueba.jpg",
      },
      {
        id: 4,
        name: "Canción 4",
        duration: "4:05",
        imageUrl: "/imagenes/prueba.jpg",
      },
      {
        id: 5,
        name: "Canción 5",
        duration: "4:05",
        imageUrl: "/imagenes/prueba.jpg",
      },
  ];


export default function ColaDeReproduccion() {
    return (
      <Container>
        {/* Sonando ahora */}
        <div className="sonando">
          <Titulo>Sonando</Titulo>
          {canciones.slice(0, 1).map((cancion, index) => (
            <FilaCancion key={cancion.id}>
                  <span>{1}</span>
              <ImagenCancion src={cancion.imageUrl} alt={cancion.name} />
              <InfoCancion>
                <NombreCancion>{cancion.name}</NombreCancion>
                <Duracion>{cancion.duration}</Duracion>
              </InfoCancion>
            </FilaCancion>
          ))}
        </div>

        <div className="siguiente">
          <Titulo>Siguiente</Titulo>
          {canciones.slice(1).map((cancion, index) => (
            <FilaCancion key={cancion.id}>
              <span>{index + 1}</span>
              <ImagenCancion src={cancion.imageUrl} alt={cancion.name} />
              <InfoCancion>
                <NombreCancion>{cancion.name}</NombreCancion>
                <Duracion>{cancion.duration}</Duracion>
              </InfoCancion>
            </FilaCancion>
          ))}
        </div>
      </Container>
    );
  }


  const Container = styled.div`
  color: white;
  padding: 20px;
`;

const Titulo = styled.h2`
  margin-bottom: 20px;
`;

const FilaCancion = styled.div`
  display: grid;
  grid-template-columns: 60px 1fr 1fr 1fr;
  gap: 5px; 
  align-items: center;
  margin-bottom: 5px;
`;

const ImagenCancion = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 5px;
`;

const InfoCancion = styled.div`
  display: flex;
  flex-direction: column;
`;

const NombreCancion = styled.span`
  font-weight: bold;
`;

const Duracion = styled.span`
  margin-left: auto;
`;