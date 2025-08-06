import './styles.css';

export default function Header({ title, description, score, bestScore }) {
  return (
    <header className='header'>
      <div className='header-content'>
        <div className='header-left'>
          <h1 className='title'>{title}</h1>
          <p className='description'>{description}</p>
        </div>
        <div className='header-right'>
          <div className='score-item'>
            <span className='score-label'>Score:</span>
            <span className='score-value'>{score}</span>
          </div>
          <div className='score-item'>
            <span className='score-label'>Best score:</span>
            <span className='score-value'>{bestScore}</span>
          </div>
        </div>
      </div>
    </header>
  );
};