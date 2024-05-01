import React, { createContext, useContext, useState } from 'react';

const PodcastContext = createContext();

export function usePodcast() {
  return useContext(PodcastContext);
}

export const PodcastProvider = ({ children }) => {
    const [podcastDetails, setPodcastDetails] = useState({
      nombre: '',
      foto: null,
    });
  
    return (
      <PodcastContext.Provider value={{ podcastDetails, setPodcastDetails }}>
        {children}
      </PodcastContext.Provider>
    );
  };