const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve the static files from the React app build directory
app.use(express.static(path.join(__dirname, '..', 'build')));

// Handle requests for any route, serve index.html
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'));
});

let players = []; // Stores player information
let gameState = {
  // Initial game state setup
  drawPile: [],
  hands: {},
  discardPile: [],
  currentPlayerIndex: 0,
  playDirection: 1
};

// Function to initialize the game state, could be more complex depending on game rules
const initializeGameState = () => {
  // Reset gameState with initial values and generate cards, etc.
};

io.on('connection', (socket) => {
    console.log('New client connected', socket.id);

    // Example event for adding a player
    socket.on('addPlayer', (name) => {
        const player = { id: socket.id, name };
        players.push(player);
        console.log(`${name} joined the game.`);
        // Send back the player's id or other initial game data
        socket.emit('playerAdded', player);
        // Broadcast new player to all clients
        io.emit('updatePlayers', players);
    });

    // Example event for starting the game
    socket.on('startGame', () => {
        initializeGameState();
        io.emit('gameStarted', gameState);
        console.log(`Game started.`);
    });

    // Handle player actions, e.g., draw card, play card
    socket.on('drawCard', (playerId) => {
        // Handle drawing a card from the pile
        // Update gameState accordingly
        io.emit('updateGameState', gameState); // Broadcast updated game state
    });

    socket.on('playCard', ({ playerId, card }) => {
        // Handle playing a card, including rules and validation
        // Update gameState accordingly
        io.emit('updateGameState', gameState); // Broadcast updated game state
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected', socket.id);
        // Remove player from players array
        players = players.filter(player => player.id !== socket.id);
        io.emit('updatePlayers', players); // Update player list for all clients
    });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
