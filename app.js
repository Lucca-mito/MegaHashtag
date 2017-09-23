var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/node_modules'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', socket => {
  socket.on('request all users', () => {
    socket.emit('update all users', Object.keys(io.engine.clients));
  });

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

http.listen(3000, () => console.log('listening on *:3000'));
