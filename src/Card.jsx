import './styles.css';

// Componente Card individual
export default function Card({ card }) {
  return (
    <div className='card'>
      <div className='image-container'>
        <img 
          src={card.image} 
          alt={card.title}
          className='card-image'
        />
      </div>
      <div className='card-content'>
        <h3 className='card-title'>{card.title}</h3>
      </div>
    </div>
  );
};