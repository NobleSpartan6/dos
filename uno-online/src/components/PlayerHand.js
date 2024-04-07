// src/components/PlayerHand.js
import React from 'react';
import '../Card.css'; // Make sure to create a Card.css file for styling
import Card from './Card';


const PlayerHand = ({ hand, onCardClick }) => {
  if (!hand) {
    // Render nothing or a placeholder if hand is undefined
    return null;
  }

  return (
    <div className="player-hand">
      {hand.map(card => (
        <Card
          key={card.id}
          color={card.color}
          value={card.value}
          onClick={() => onCardClick(card)}
        />
      ))}
    </div>
  );
};


export default PlayerHand;