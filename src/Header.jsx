import './styles.css';

export default function Header({ title, description }) {
  return (
    <header className='header'>
      <h1 className='title'>{title}</h1>
      <p className='description'>{description}</p>
    </header>
  );
};