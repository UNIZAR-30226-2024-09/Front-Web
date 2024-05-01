import React, { createContext, useContext, useState } from 'react';

const SongContext = createContext();

export function useSong() {
  return useContext(SongContext);
}

export const SongProvider = ({ children }) => {
    const [songDetails, setSongDetails] = useState({
      nombre: '',
      miAlbum: '',
      foto: null,
      archivoMp3: null,
    });
  
    return (
      <SongContext.Provider value={{ songDetails, setSongDetails }}>
        {children}
      </SongContext.Provider>
    );
  };