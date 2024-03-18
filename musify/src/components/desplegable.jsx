import React, { useState } from 'react'
import styled from "styled-components";
import {  AiOutlineCaretDown, AiOutlineCaretRight } from 'react-icons/ai'

export default function Desplegable({ title, children}) {
    const [isOpen, setIsOpen] = useState(false);
  return (
    <Container>
        <div className='wrapper'>
            <button onClick={() => setIsOpen((prev) => !prev)} className='button'>
                {!isOpen ? (
                    <AiOutlineCaretRight />
                ) : (
                    <AiOutlineCaretDown  />
                )}
            <span>{title}</span>
            </button>
            {isOpen && (
                <div className="content-box">
                    <div className="content-inner">{children}</div>
                </div>
            )}
        </div>
    </Container>
  )
}

const Container = styled.div` 
.wrapper {
    display: flex-colon;
    justify-content: flex-end;
}

.button {
    background: #54b2e7;
    color: #fff;
    padding: 8px;
    width: 100%;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-weight: bold;
    font-size: large;
    border-radius: 8px;
    letter-spacing: wider;
    border: 4px solid transparent;
    transition: all 300ms;

    icon {
        color: #000000;
    }
}

.wrapper button:hover, .wrapper button:active {
    border-color: white;
    color: white;
}

.content-box {
    border: 1px;
    padding: 10px
    margin-top: 10px;
}

.content-inner {
    padding: 10px;
    margin-right: 10px;
}

`;
