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