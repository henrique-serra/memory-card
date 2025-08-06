import './styles.css';
import Card from './Card';

export default function CardsGrid({ pokemons, onPokemonClick }) {
  return (
    <main className='main'>
      <div className='cards-grid'>
        {pokemons.map((pokemon) => (
          <Card key={pokemon.id} pokemon={pokemon} onPokemonClick={onPokemonClick} />
        ))}
      </div>
    </main>
  );
};