import React from "react";
import styled from "styled-components";


export default function Input() {
    return <Container>
        <div className='input'>
            <input type="text" placeholder='Escribe algo ...' />
            <div className="send">
                <button>Enviar</button>
            </div>
        </div>

    </Container>
}


const Container = styled.div`
    .input {
        height: 50px;
        width: 767px;
        background-color: white;
        padding: 10px;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    input{
        width: 100%;
        border: none;
        outline: none;
        color: #2f2d52;
        font-size: 18px;

        &::placeholder{
            color: lightgray;
        }
    }

    .send {
        display:flex;
        align-items: center;
        gap: 10px;

        button{
            border: none;
            height: 40px;
            border-radius: 20px;
            padding: 10px 15px;
            color: white;
            background-color: #8da4f1;
            cursor: pointer;
        }
    }
`;