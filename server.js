const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const cors = require("cors");

const PORT = process.env.PORT || 5000;

const app = express();
const server = http.createServer(app);
const io = socketio(server);


app.use(cors());
app.use(express.json());

// const server = http.createServer(app);
// const io = socketio(server);

app.get('/', (req, res) => {
  res.sendFile(__dirname + './server.js');
});

/* app.get('/', (req, res) =>{
  res.send('server is running');
}); */
// const players = [];

io.on('connection', (socket) => {
  const players = [];
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
    io.emit('player-left', socket.id);
  });
  socket.on("player-join", () => {
    const player = { id: socket.id, symbol: players.length === 0 ? "X" : "O" };
    players.push(player);
    console.log("player joined", player);
    socket.emit("player-joined", player);
    io.emit("player-join", player);
  });
  socket.on("player-move", (data) => {
    console.log("player move", data);
    socket.broadcast.emit("player-move", data);
  });
  // socket.on('game-end', (data) => {
  //   console.log('game end', data);
  //   io.emit('game-end', data);
  // });
});

server.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
});

// ----

/* io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
    io.emit('player-left', socket.id);
  });
  socket.on('player-join', () => {
    const player = { id: socket.id, symbol: players.length === 0 ? 'X' : 'O' };
    players.push(player);
    console.log('player joined', player);
    socket.emit('player-joined', player);
    io.emit('player-join', player);
  });
  socket.on('player-move', (data) => {
    console.log('player move', data);
    socket.broadcast.emit('player-move', data);
  });
  socket.on('game-end', (data) => {
    console.log('game end', data);
    io.emit('game-end', data);
  });
}); */
