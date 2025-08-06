import { useState, useEffect } from 'react';
import './styles.css';
import Header from './Header';
import CardsGrid from './CardsGrid';
import VictoryDialog from './VictoryDialog';
import { useRandomPokemons } from './useRandomPokemons';

// Componente Principal
const App = () => {
  const [clickedPokemons, setClickedPokemons] = useState([]);
  const [scores, setScores] = useState([0, 0]);
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
  const [pokemonsShuffled, setPokemonsShuffled] = useState([]);

  useEffect(() => {
    setPokemonsShuffled(pokemons);
  }, [pokemons])

  function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      // Generate a random index from 0 to i
      const j = Math.floor(Math.random() * (i + 1));

      // Swap elements at indices i and j
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }

  function onPokemonClick(pokemon) {
    const id = pokemon.id;

    if (!clickedPokemons.includes(id)) {
      setScores(([score, bestScore]) => {
        const newScore = score + 1;
        const newBestScore = newScore > bestScore ? newScore : bestScore;
        return [newScore, newBestScore]
      });
      setClickedPokemons([...clickedPokemons, id]);
      const newPokemonsShuffled = shuffleArray(pokemonsShuffled);
      setPokemonsShuffled(newPokemonsShuffled);
    } else {
      setClickedPokemons([]);
      setScores([0, scores[1]]);
      const newPokemonsShuffled = shuffleArray(pokemonsShuffled);
      setPokemonsShuffled(newPokemonsShuffled);
    }
  }

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
        score={scores[0]}
        bestScore={scores[1]}
      />
      <CardsGrid pokemons={pokemonsShuffled} onPokemonClick={onPokemonClick} />
      <VictoryDialog isOpen={scores[0] === 12} onClose={() => setScores([0, 0])}></VictoryDialog>
    </div>
  );
};

export default App;