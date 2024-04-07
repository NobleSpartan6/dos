import React from 'react';
import './GameComponents.css';

const DrawPile = ({ cardsLeft, onDrawCard }) => {
  return (
    <div className="draw-pile" onClick={onDrawCard}>
      <p>{cardsLeft} Cards Left</p>
    </div>
  );
}

export default DrawPile;
