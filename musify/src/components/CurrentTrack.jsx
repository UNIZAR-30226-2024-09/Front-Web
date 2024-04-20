import styled from "styled-components";
import { useTrack } from "./TrackContext"; // Asegúrate de que la ruta de importación sea correcta

export default function CurrentTrack() {
    const { currentTrack } = useTrack();

    if (!currentTrack) return <div>No track selected</div>;

    return (
        <Container>
            <div className="track">
                <div className="track__image">
                    <img src={currentTrack.imagen} alt="Portada de la Canción" style={{ width: "70px", height: "auto" }}/>
                </div>
                <div className="track__info">
                    <h4>{currentTrack.nombre}</h4>
                    <h6>{currentTrack.artista}</h6> {/* Asegúrate de que `artista` esté siendo proporcionado correctamente */}
                </div>
            </div>
        </Container>
    );
}


const Container = styled.div`
    .track {
        display: flex;
        align-items: center;
        gap: 1rem;
        &__info {
            display: flex;
            flex-direction: column;
            gap: 0.3rem;
            h4 {
                color: white;
                font-size: 15px; // Corrección: debería ser 'px' no 'x'
                margin-bottom: 0;
                margin-top: 20px;
            }
            h6 {
                color: #b3b3b3;
                font-size: 10px;
                margin-bottom: 50px;
            }
        }
    }
`;
