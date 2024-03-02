import React from "react";
import styled from "styled-components";
import {AiFillClockCircle} from "react-icons/ai";
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
  ];

export default function Body() {
    return (
        <Container>
        <div className="playlist">
            <div className="image">
                <img src="/imagenes/playlist.jpg" alt="Descripción" />

              
            </div>
            <div className="details">
                <span className="type">PLAYLIST</span>
                <h1 className="title">HOT DAY VIBES</h1>
                <p className="descripción">PROBANDO PROBANDO</p>
            </div>
        </div>
        <div className="list">
            <div className="header__row">
                <div className="col">
                    <span>#</span>
                </div>
                <div className="col">
                    <span>TITULO</span>
                </div>
                <div className="col">
                    <span>ÁLBUM</span>
                </div>
                <div className="col">
                    <span>
                        <AiFillClockCircle />
                    </span>
                </div>
            </div>
        </div>
           <div className="tracks">
            {canciones.map((cancion, index) => (
            <div className="row" key={cancion.id}>
                <div className="col">
                <span>{index + 1}</span>
                </div>
                <div className="col detail">
                <div className="image">
                <img src={cancion.imageUrl} alt={cancion.name} style={{ width: "50px", height: "auto" }} />

                </div>
                <div className="info">
                    <span className="name">{cancion.name}</span>
                    <span>{cancion.artists}</span>
                </div>
                </div>
                <div className="col">
                <span>{cancion.album}</span>
                </div>
                <div className="col">
                <span>{cancion.duration}</span>
                </div>
            </div>
            ))}
        </div>
    </Container>
    );
}

const Container = styled.div`
.playlist{
    margin: 0 2rem;
    display: flex;
    align-items:center;
    gap: 2rem;
    .image {
        img {
            height: 15rem;
            box-shadow:rgba(0,0,0,0.1) 0px 25px 50px-12px;
        }
    }
    .details{
        display: flex;
        flex-direction: column;
        gap: 2rem;
        color: #e0dede;
        .title{
            color: white;
            font-size: 4rem;
        }
    }
}
.list {
    .header__row {
        display: grid;
        grid-template-columns: 0.3fr 3fr 2fr 0.1fr;
        color: #dddcdc;
        margin: 1rem 0 0 0;
        position: sticky;
        top: 15vh;
        padding: 1rem 3rem;
        transition: 0.3s ease-in-out;
    }
}
    .tracks {
        margin: 0 2rem;
        display: flex;
        flex-direction: column;
        margin-bottom: 5rem;
        .row {
            padding: 0.5rem 1rem;
            display: grid;
            grid-template-columns: 0.3fr 3.1fr 2fr 0.1fr;
            &:hover {
                background-color: rgba(0, 0, 0, 0.7);
            }
            .col {
                display: flex;
                align-items: center;
                color: #dddcdc;
            }
            .detail {
                display: flex;
                gap: 1rem;
                .info {
                    display: flex;
                    flex-direction: column;
                }
            }
        }
    }
}
}
`;