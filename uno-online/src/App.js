import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import GameBoard from './components/GameBoard';
import './App.css';

const socket = io(); // Connect to server root path

const App = () => {
  const [gameState, setGameState] = useState({});

  useEffect(() => {
    socket.on('gameStateUpdate', (updatedGameState) => {
      setGameState(updatedGameState);
    });

    // Clean up on component unmount
    return () => socket.off('gameStateUpdate');
  }, []);

  const handleAction = (action) => {
    socket.emit('playerAction', action);
  };

  const GameContext = React.createContext();

  return (
    <GameContext.Provider value={{ gameState, setGameState }}> 
      <GameBoard gameState={gameState} onAction={handleAction} />
      </GameContext.Provider>    
  );
};

export default App;
