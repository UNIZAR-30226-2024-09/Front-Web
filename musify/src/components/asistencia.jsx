import React from "react";
import styled, { keyframes } from "styled-components";
import { FaQuestionCircle } from "react-icons/fa";
import { MdReportProblem } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import "./asistencia.css"

export default function Asistencia() {
    return (
        <>
            <Container>
                <Header>
                    <h1>Configuración</h1>
                    <StyledCgProfile />
                </Header>
                <FlexContainer>
                <IconWrapper className='wrapper1'>
                        <h2>Editar Perfil</h2>
                        <StyledFaQuestionCircle />
                    </IconWrapper>
                    <IconWrapper className='wrapper1'>
                        <h2>Preguntas FAQ</h2>
                        <StyledFaQuestionCircle />
                    </IconWrapper>
                    <IconWrapper className='wrapper2'>
                        <h2>Reportar Problema</h2>
                        <StyledMdReportProblem />
                    </IconWrapper>
                </FlexContainer>
            </Container>
        </>
    );
}

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px;
    min-height: 100vh;
    background: none;
    color: #fff;
    animation: ${fadeIn} 0.8s ease-out;
    border:none;
`;

const Header = styled.header`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    max-width: 1150px;
    margin-bottom: 50px;

    h1 {
        font-size: 2.5rem;
        color: #ffffff;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }
`;

const FlexContainer = styled.div`
    display: flex;
    justify-content: center;
    gap: 50px;
    width: 800px;
    @media (max-width: 768px) {
        flex-direction: column;
        align-items: center;
    }
`;

const IconWrapper = styled.div`
    width: 600px;
    height: 300px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;
    background: none;
    border-radius: 20px;
    padding: 20px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
    transition: transform 0.3s ease;

    &:hover {
        transform: translateY(-10px);
    }

    h2 {
        font-size: 1.75rem;
        color: #ffffff;
        margin-bottom: 20px;
    }
`;

const iconStyle = `
    font-size: 8rem;
    color: #fff;
`;

const StyledFaQuestionCircle = styled(FaQuestionCircle)`
    ${iconStyle}
`;

const StyledMdReportProblem = styled(MdReportProblem)`
    ${iconStyle}
`;

const StyledCgProfile = styled(CgProfile)`
    font-size: 3rem;
    color: #fff;
    cursor: pointer;
    transition: transform 0.2s ease;

    &:hover {
        transform: scale(1.1);
    }
`;