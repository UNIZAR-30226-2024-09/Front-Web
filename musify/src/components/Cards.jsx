import { React, useState } from "react";
import styled from "styled-components";
import { createGlobalStyle } from 'styled-components';
import { FaMusic, FaGuitar, FaHeadphones, FaRegSmileBeam, FaRocketchat, FaRegGrinStars } from 'react-icons/fa'; // Importa los iconos que necesites


const gradients = [
    'linear-gradient(135deg, #000066 0%, #6699FF 100%)',
    'linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)',
    'linear-gradient(135deg, #2af598 0%, #009efd 100%)',
    'linear-gradient(135deg, #654ea3 0%, #eaafc8 100%)',
    'linear-gradient(135deg, #5ee7df 0%, #b490ca 100%)',
    'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)' 
  ];

  
export default function Cards() {
    const [cards] = useState([
        {
            title: 'Rap',
            text: 'Descubre lo mejor del rap',
            icon: <FaMusic />
        },
        {
            title: 'Clásica',
            text: 'Explora la música clásica',
            icon: <FaGuitar />
        },
        {
            title: 'Electro',
            text: 'Vibra con la electrónica',
            icon: <FaHeadphones />
        },
        {
            title: 'Pop',
            text: 'Los hits pop del momento',
            icon: <FaRegSmileBeam />
        },
        {
            title: 'Rock',
            text: 'Rockea con los clásicos y novedades',
            icon: <FaRocketchat />
        },
        {
            title: 'Reggaeton',
            text: 'Baila al ritmo del reggaeton',
            icon: <FaRegGrinStars />
        }
    ]);

    return (
        <CardsContainer>
            <CardsWrapper>
                {cards.map((card, i) => (
                    <Card 
                      key={i}
                      style={{background: gradients[i % gradients.length]}}
                    >
                        <IconWrapper>{card.icon}</IconWrapper>
                        <CardTitle>{card.title}</CardTitle>
                        <CardText>{card.text}</CardText>
                    </Card>
                ))}
            </CardsWrapper>
        </CardsContainer>
    );
}

const GlobalStyle = createGlobalStyle`
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap');

  body {
    font-family: 'Montserrat', sans-serif;
  }
`;

const CardsContainer = styled.div`
    text-align: center;
    margin-bottom: 40px;
    color: #fff;
`;

const CardsWrapper = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 20px;
`;
const Card = styled.div`
    flex: 0 0 calc(33.33% - 80px);
    height: auto;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    gap: 10px;
    transition: transform 0.3s ease-in-out;
    border: 1px solid #0f3460;
    font-family: 'Montserrat', sans-serif;

    &:hover {
        transform: translateY(-10px);
        background: #16213E;
    }
`;

const IconWrapper = styled.div`
    font-size: 3rem;
    color: black;
`;

const CardTitle = styled.h3`
    color: black;
    font-weight: 700;
    font-family: 'Montserrat', sans-serif;
`;

const CardText = styled.p`
    color: black;
    font-weight: 400;
    font-family: 'Montserrat', sans-serif;
`;
