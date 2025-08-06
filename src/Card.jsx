import './styles.css';

// Componente Card individual
export default function Card({ pokemon }) {
  return (
    <div className='card'>
      <div className='image-container'>
        <img 
          src={pokemon.images.classic} 
          alt={pokemon.name}
          className='card-image'
        />
      </div>
      <div className='card-content'>
        <h3 className='card-title'>{pokemon.name}</h3>
      </div>
    </div>
  );
};