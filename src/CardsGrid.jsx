import './styles.css';
import Card from './Card';

export default function CardsGrid({ pokemons }) {
  return (
    <main className='main'>
      <div className='cards-grid'>
        {pokemons.map((pokemon) => (
          <Card key={pokemon.id} pokemon={pokemon} />
        ))}
      </div>
    </main>
  );
};