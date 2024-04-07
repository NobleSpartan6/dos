import React from 'react';
import './GameComponents.css';

const OpponentHand = ({ cardCount }) => {
  return (
    <div className="opponent-hand">
      {Array.from({ length: cardCount }, (_, index) => (
        <div key={index} className="card back"></div>
      ))}
    </div>
  );
}

export default OpponentHand;
