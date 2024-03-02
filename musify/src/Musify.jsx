import React from "react";
import styled from "styled-components";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Body from "./components/Body";
import Footer from "./components/Footer";


export default function Musify(){
    return (
    <Container>
        <div className="musify__body">
            <Sidebar />
            <div className="body">
            <Navbar />
                <div className="body__contents">
                <Body />
                </div>
            </div>
        </div>
        <div className="musify__footer">
            <Footer />
        </div>
    </Container>
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
    } `;
