// GameManager.js

class Player {
  constructor(id, name) {
    this.id = id;
    this.name = name;
    this.hand = [];
    this.isReady = false;
  }

  // Method to set player's readiness
  setReady(readyState) {
    this.isReady = readyState;
  }

  // Other methods like updateHand, playCard, etc.
}

// Helper function to generate unique ID for players
const generateUniqueId = (players) => {
  return players.length > 0
    ? Math.max(...players.map(player => player.id)) + 1
    : 1;
};

// Lobby management
class Lobby {
  constructor() {
    this.players = [];
  }

  addPlayer(name) {
    const player = new Player(generateUniqueId(this.players), name);
    this.players.push(player);
    return player;
  }

  removePlayer(id) {
    this.players = this.players.filter(player => player.id !== id);
  }

  setPlayerReady(id, readyState) {
    const player = this.players.find(player => player.id === id);
    if (player) {
      player.setReady(readyState);
    }
  }

  allPlayersReady() {
    return this.players.every(player => player.isReady);
  }

  // Function to start the game if all players are ready
  startGame() {
    if (this.allPlayersReady() && this.players.length > 1) {
      console.log('Starting game with players:', this.players);
      // Additional logic to initialize game state
    } else {
      console.log('Not all players are ready or not enough players to start the game');
    }
  }
}

export const gameManager = new Lobby();
