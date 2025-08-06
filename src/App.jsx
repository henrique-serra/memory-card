import { useState, useEffect } from 'react';
import './styles.css';
import Header from './Header';
import CardsGrid from './CardsGrid';
import { useRandomPokemons } from './useRandomPokemons';

// Componente Principal
const App = () => {

  const {
    pokemons,
    loading,
    error,
    progress,
    refetch,
    fetchMore,
    cacheStats,
    clearCache
  } = useRandomPokemons(12, {
    enableProgress: true,
    autoFetch: true
  });

  console.log(pokemons);

  // Dados dos cards
  const cardsData = [
    { id: 1, title: 'Mountain Landscape', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop' },
    { id: 2, title: 'Ocean Sunset', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop' },
    { id: 3, title: 'Forest Path', image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop' },
    { id: 4, title: 'City Lights', image: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=400&h=300&fit=crop' },
    { id: 5, title: 'Desert Dunes', image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=400&h=300&fit=crop' },
    { id: 6, title: 'Snowy Peaks', image: 'https://images.unsplash.com/photo-1464822759844-d150baec493a?w=400&h=300&fit=crop' },
    { id: 7, title: 'Lake Reflection', image: 'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=400&h=300&fit=crop' },
    { id: 8, title: 'Autumn Forest', image: 'https://images.unsplash.com/photo-1507041957456-9c397ce39c97?w=400&h=300&fit=crop' },
    { id: 9, title: 'River Valley', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop' },
    { id: 10, title: 'Starry Night', image: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&h=300&fit=crop' },
    { id: 11, title: 'Tropical Beach', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop' },
    { id: 12, title: 'Canyon View', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop' }
  ];

  // Dados do header
  const headerData = {
    title: 'Memory Game',
    description: "Get points by clicking on an image but don't click on any more than once!",
  };

  return (
    <div className='container'>
      <Header 
        title={headerData.title} 
        description={headerData.description} 
      />
      <CardsGrid pokemons={pokemons} />
    </div>
  );
};

export default App;