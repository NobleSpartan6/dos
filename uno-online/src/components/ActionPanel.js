import React from 'react';
import './GameComponents.css';

const ActionPanel = ({ onDrawCard, onCallUno }) => {
  return (
    <div className="action-panel">
      <button onClick={onDrawCard} className="action-button">Draw Card</button>
      <button onClick={onCallUno} className="action-button uno-button">Call Uno</button>
    </div>
  );
}

export default ActionPanel;
