import React, { createContext, useContext, useState } from 'react';

const SongContext = createContext();

export function useSong() {
  return useContext(SongContext);
}

export const SongProvider = ({ children }) => {
  const [songDetails, setSongDetails] = useState({
    id: '',
  });
  
  return (
    <SongContext.Provider value={{ songDetails, setSongDetails }}>
      {children}
    </SongContext.Provider>
  );
};