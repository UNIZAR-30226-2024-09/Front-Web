import React, { useState } from "react";
import styled from "styled-components";

export default function PlaylistForm({ userEmail, onClose, onCreate }) {
    const [nombre, setNombre] = useState("");
    const [publica, setPublica] = useState(true);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const url = 'http://127.0.0.1:8000/crearPlaylist/';
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    correo: userEmail,
                    nombre,
                    publica
                })
            });
            const data = await response.json();
            if (response.ok) {
                onCreate();
                onClose();
            } else {
                console.error('Error al crear playlist:', data);
            }
        } catch (error) {
            console.error('Error al enviar datos:', error);
        }
    };

    return (
        <ModalOverlay>
            <FormContainer>
                <StyledForm onSubmit={handleSubmit}>
                    <StyledInput
                        type="text"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        placeholder="Nombre de la playlist"
                        required
                    />
                    <StyledLabel>
                        <input
                            type="checkbox"
                            checked={publica}
                            onChange={(e) => setPublica(e.target.checked)}
                        />
                        Pública
                    </StyledLabel>
                    <Button type="submit">Crear Playlist</Button>
                    <CancelButton type="button" onClick={onClose}>Cancelar</CancelButton>
                </StyledForm>
            </FormContainer>
        </ModalOverlay>
    );
}

const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1000;
`;

const FormContainer = styled.div`
    padding: 20px;
    background: #fff; 
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    width: 100%;
    max-width: 400px;
`;

const StyledForm = styled.form`
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

const StyledInput = styled.input`
    padding: 10px;
    border: 2px solid #ccc;
    border-radius: 4px;
    font-size: 16px;
    &:focus {
        border-color: #007BFF;
        outline: none;
    }
`;

const StyledLabel = styled.label`
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 18px;
`;

const Button = styled.button`
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    background-color: #007BFF;
    color: white;
    font-size: 16px;
    cursor: pointer;
    &:hover {
        background-color: #0056b3;
    }
`;

const CancelButton = styled(Button)`
    background-color: #6c757d;
    &:hover {
        background-color: #545b62;
    }
`;