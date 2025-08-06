import './VictoryDialog.css';

export default function VictoryDialog({ 
  isOpen, 
  onClose 
}) {
  if (!isOpen) return null;

  return (
    <div className="victory-dialog-overlay" onClick={onClose}>
      <div className="victory-dialog" onClick={(e) => e.stopPropagation()}>
        {/* Botão de fechar */}
        <button className="victory-close-btn" onClick={onClose}>
          ×
        </button>

        {/* Ícone de troféu */}
        <div className="victory-icon">
          🏆
        </div>

        {/* Título */}
        <h2 className="victory-title">
          You Win!
        </h2>

        {/* Confetti animation */}
        <div className="confetti">
          {Array.from({ length: 50 }, (_, i) => (
            <div 
              key={i} 
              className="confetti-piece" 
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                backgroundColor: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3'][Math.floor(Math.random() * 6)]
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}