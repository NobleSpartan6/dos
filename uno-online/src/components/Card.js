// src/components/Card.js

import React from 'react';
import '../Card.css'; // Make sure the path is correct based on your project structure

// Wrapping the Card component with React.memo for performance optimization.
const Card = React.memo(({ color, value, onClick }) => {
  return (
    <div className={`card ${color}`} onClick={onClick}>
      <span className="card-value">{value}</span>
    </div>
  );
});


export default Card;
