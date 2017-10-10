var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/node_modules'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

function updateAllUsers() { io.emit('update all users', Object.keys(io.engine.clients)); }

io.on('connection', socket => {
  updateAllUsers();
  socket.on('disconnect', updateAllUsers);

  socket.on('challenge sent', opponentID => {
    io.to(opponentID).emit('challenge received', socket.id);
  });

  socket.on('challenge accepted', challengerID => {
    io.to(challengerID).emit('challenge accepted', socket.id);
  });

  socket.on('game start', opponentID => {
    socket.on('mark', coords => {
      io.to(opponentID).emit('my turn', coords);
    });

    socket.on('time out', () => {
      io.to(opponentID).emit('time out');
    });
  });
});

http.listen(process.env.PORT, process.env.IP);
//http.listen(3000, () => console.log('Listening on *:3000'));
