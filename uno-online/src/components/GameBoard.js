import React, { useState, useEffect } from 'react';
import PlayerHand from './PlayerHand';
import DiscardPile from './DiscardPile';
import DrawPile from './DrawPile';
import ActionPanel from './ActionPanel';
import OpponentHand from './OpponentHand';

import { gameManager } from './GameManager';



// Render function or component using these handlers


const generateInitialDrawPile = () => {
  const colors = ['red', 'yellow', 'green', 'blue'];
  const values = Array.from({ length: 9 }, (_, i) => i + 1);
  let deck = [];

  colors.forEach(color => {
    values.forEach(value => {
      deck.push({ id: `${color}-${value}`, color, value: value.toString() });
    });
  });


  // Shuffle deck
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }

  return deck;
};

const dealInitialHands = (drawPile, playerCount) => {
  let hands = Array.from({ length: playerCount }, () => []);
  const handSize = 7;

  for (let i = 0; i < handSize; i++) {
    hands.forEach(hand => hand.push(drawPile.pop()));
  }

  return hands;
};

const GameBoard = () => {
  const initialPlayerCount = 2;

  const reshuffleDiscardIntoDrawPile = () => {
    let newDiscardPile = [...gameState.discardPile];
    const topCard = newDiscardPile.pop(); // Keep the top card out of the shuffle
    const reshuffled = newDiscardPile.sort(() => 0.5 - Math.random()); // Simple shuffle
    setGameState(prevState => ({
      ...prevState,
      drawPile: reshuffled,
      discardPile: [topCard] // Reset discard pile with only the top card
    }));
  };

  // Function to handle new player joining
const handleNewPlayer = (playerName) => {
  gameManager.addPlayer(playerName);
};

// Function to start the game from the UI
const handleStartGame = () => {
  gameManager.startGame();
};


// Initial gameState definition with hands correctly initialized as an array of arrays
const [gameState, setGameState] = useState({
  drawPile: [],
  hands: [], // Make sure this is correctly initialized
  discardPile: [],
  currentPlayerIndex: 0,
  playDirection: 1,
  playerCount: initialPlayerCount,
  currentColor: null,
});


useEffect(() => {
  const initialDrawPile = generateInitialDrawPile();
  const initialHands = dealInitialHands(initialDrawPile, gameState.playerCount);

  // Start the game by moving the top card from the draw pile to the discard pile
  const initialDiscardPile = initialDrawPile.splice(0, 1);

  setGameState(prevState => ({
    ...prevState,
    drawPile: initialDrawPile.slice(initialHands.flat().length), // Adjust draw pile after dealing cards
    hands: initialHands,
    discardPile: initialDiscardPile, // Initialize discard pile with one card
  }));
}, []);



  const getNextPlayerIndex = () => {
    return (gameState.currentPlayerIndex + gameState.playDirection + gameState.playerCount) % gameState.playerCount;
  };

  const advanceTurn = () => {
    setGameState(prevState => ({
      ...prevState,
      currentPlayerIndex: getNextPlayerIndex(),
    }));
  };

  const reversePlayDirection = () => {
    setGameState(prevState => ({
      ...prevState,
      playDirection: prevState.playDirection * -1,
    }));
  };

  const drawCards = (playerIndex, numberOfCards) => {
    // Adjusted to include reshuffling if necessary
    let newDrawPile = [...gameState.drawPile];
    if(newDrawPile.length === 0) reshuffleDiscardIntoDrawPile();
    let newHands = { ...gameState.hands };
    let cardsToDraw = numberOfCards;
  
    while (cardsToDraw > 0 && newDrawPile.length > 0) {
      const card = newDrawPile.shift(); // Removes the first card from the draw pile
      newHands[playerIndex].push(card); // Adds the card to the player's hand
      cardsToDraw--;
    }
  
    // If the draw pile is empty and there are still cards to draw, you might reshuffle the discard pile into the draw pile here
  
    setGameState(prevState => ({
      ...prevState,
      drawPile: newDrawPile,
      hands: newHands,
    }));
  };

  const callUno = (playerIndex) => {
    // Check if the player has exactly one card left and if Uno was called correctly.
    if (gameState.hands[playerIndex].length === 1) {
      console.log("Uno called correctly by player", playerIndex);
    } else {
      console.log("Incorrect Uno call by player", playerIndex);
      // Potentially draw penalty cards if called incorrectly
    }
  };

  const handleDrawCard = () => {
    let newDrawPile = [...gameState.drawPile];
    let newHands = [...gameState.hands]; // Clone the hands structure

    if (newDrawPile.length === 0) {
        reshuffleDiscardIntoDrawPile();
        newDrawPile = [...gameState.drawPile]; // Update after reshuffle
    }

    const drawnCard = newDrawPile.shift(); // Assume there's at least one card to draw
    newHands[gameState.currentPlayerIndex].push(drawnCard); // Update the correct player's hand

    setGameState(prevState => ({
        ...prevState,
        drawPile: newDrawPile,
        hands: newHands,
    }));
};


const applyCardEffect = (card) => {
  switch (card.value) {
    case 'Skip':
      advanceTurn();
      break;
    case 'Reverse':
      reversePlayDirection();
      break;
    case 'Draw Two':
      const nextPlayer = getNextPlayerIndex();
      drawCards(nextPlayer, 2);
      advanceTurn();
      break;
    case 'Wild':
      // Prompt player to choose a color. This can be done using a modal or a set of buttons.
      // Update gameState.currentColor with the chosen color
      break;
    case 'Wild Draw Four':
      // Similar to Wild, prompt for color choice, then make the next player draw four cards.
      // Validate the play according to Uno rules (player must not have a card matching the discard pile color)
      const nextPlayerIndex = getNextPlayerIndex();
      drawCards(nextPlayerIndex, 4);
      advanceTurn();
      break;
    // Other cases as needed
  }
};

  

const handleCardClick = (card) => {
  // Example validation: Check if the card can be played
  const topDiscard = gameState.discardPile[gameState.discardPile.length - 1];
  if (card.color === topDiscard.color || card.value === topDiscard.value || card.color === 'wild') {
    // Valid move: Play the card
    const newHands = [...gameState.hands];
    newHands[gameState.currentPlayerIndex] = newHands[gameState.currentPlayerIndex].filter(c => c.id !== card.id);

    const newDiscardPile = [...gameState.discardPile, card]; // Add card to the discard pile

    setGameState(prevState => ({
      ...prevState,
      hands: newHands,
      discardPile: newDiscardPile,
    }));

    applyCardEffect(card); // Apply any special effects of the card
    console.log(`Playing card: ${card.value}`);
  } else {
    // Invalid move: Provide feedback or ignore
    console.log(`Cannot play ${card.value}. It does not match the discard pile.`);
  }
};


  return (
    <div className="game-board">
      <OpponentHand cardCount={gameState.hands[getNextPlayerIndex()]?.length || 0} />
      <PlayerHand hand={gameState.hands[gameState.currentPlayerIndex]} onCardClick={handleCardClick} />
      <DrawPile cardsLeft={gameState.drawPile.length} onDrawCard={handleDrawCard} />
      <DiscardPile topCard={gameState.discardPile[gameState.discardPile.length - 1]} />
      <ActionPanel onDrawCard={() => drawCards(gameState.currentPlayerIndex, 1)} onCallUno={callUno} /> 
    </div>
  );
  
};

export default GameBoard;
