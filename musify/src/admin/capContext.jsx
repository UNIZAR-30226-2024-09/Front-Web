import React, { createContext, useContext, useState } from 'react';

const CapituloContext = createContext();

export function useCap() {
  return useContext(CapituloContext);
}

export const CapituloProvider = ({ children }) => {
    const [capDetails, setCapDetails] = useState({
      titulo: '',
      podcast: '',
      descripcion: '',
      archivoMp3: null,
    });
  
    return (
      <CapituloContext.Provider value={{ capDetails, setCapDetails }}>
        {children}
      </CapituloContext.Provider>
    );
  };