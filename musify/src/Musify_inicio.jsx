import React from "react";
import styled from "styled-components";
import { TrackProvider } from "./components/TrackContext"; // Asegúrate de tener esta importación
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import Body_inicio from "./components/Body_inicio";

export default function Musify_inicio() {
    return (
        <TrackProvider> {/* Añade el TrackProvider aquí */}
            <Container>
                <div className="musify__body">
                    <Sidebar />
                    <div className="body">
                        <div className="body__contents">
                            <Body_inicio />
                        </div>
                    </div>
                </div>
                <div className="musify__footer">
                    <Footer />
                </div>
            </Container>
        </TrackProvider>
    );
}

const Container = styled.div`
    max-width: 100vw;
    max-height: 100vh;
    overflow: hidden;
    display: grid;
    grid-template-rows: 85vh 15vh;
    .musify__body {
        display: grid;
        grid-template-columns: 15vw 85vw;
        height: 100%;
        width: 100%;
        background: linear-gradient(transparent, rgba(0,0,0,1));
        background-color: rgb(32, 87, 100);
        .body{
            height: 100%;
            width: 100%; 
            overflow: auto;
        }
    }
`;
