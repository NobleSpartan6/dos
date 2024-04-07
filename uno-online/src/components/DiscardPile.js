import React from 'react';
import './GameComponents.css';

const DiscardPile = ({ topCard }) => {
  return (
    <div className="discard-pile">
      {topCard ? (
        <div className={`card ${topCard.color}`}>
          <span className="card-value">{topCard.value}</span>
        </div>
      ) : (
        <div className="card back">No cards discarded yet</div>
      )}
    </div>
  );
}

export default DiscardPile;
