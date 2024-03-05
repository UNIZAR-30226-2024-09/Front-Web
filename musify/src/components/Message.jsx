import React from "react";
import styled from "styled-components";

export default function Message() {
    return <Container>
        <div className="message owner"> {/* Asegúrate de que el nombre de la clase coincida */}
            <div className="messageInfo">
                <img src="/imagenes/pandita.png" alt="Descripción" />
                <span>Justo ahora</span>
            </div>
            <div className="messageContent">
                <p>Hola</p>
               <img src="/imagenes/pandita.png" alt="Descripción" />
            </div>
        </div>
    </Container>
}

const Container = styled.div`
.message {
    display: flex;
    gap: 20px;

    .messageInfo {
        display: flex;
        flex-direction:column;
        color: gray;
        font-weight: 300;
        
        img {
            width: 50px; /* Ajusta el tamaño según necesites */
            height: 50px; /* Ajusta el tamaño según necesites */
            border-radius: 50%;
            object-fit: cover;
        }    
    }

    .messageContent {
       max-width: 80%;
       display: flex;
       flex-direction: column;
       gap: 10px;

       p{
        background-color: white;
        padding: 10px 20px;
        border-radius: 0px 10px 10px 10px;
        max-width: max-content;
       }
        img{
            width: 50px; /* Ajusta el tamaño según necesites */
            height: 50px; /* Ajusta el tamaño según necesites */
            border-radius: 50%;
            object-fit: cover;
        }
    }

    &.owner {
        flex-direction:row-reverse;

        .messageContent {
            align-items:flex-end;
        }

        p{
            background-color: #8da4f1;
            color: white;
            border-radius: 10px 0px 10px 10px; 
        }
    }
}
`;