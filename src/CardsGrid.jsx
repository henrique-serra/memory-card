import './styles.css';
import Card from './Card';

export default function CardsGrid({ cards }) {
  return (
    <main className='main'>
      <div className='cards-grid'>
        {cards.map((card) => (
          <Card key={card.id} card={card} />
        ))}
      </div>
    </main>
  );
};