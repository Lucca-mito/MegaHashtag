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

  socket.on('challenge sent', opponent => {
    socket.broadcast.to(opponent).emit('challenge received', socket.id);
  });

  socket.on('challenge accepted', challenger => {
    const room = `${challenger} vs ${socket.id}`;
    const challengerSocket = io.sockets.connected[challenger];
    challengerSocket.emit('challenge accepted', socket.id);

    challengerSocket.join(room);
    socket.join(room);
  });

  socket.on('mark', play => {
    
  });

  socket.on('disconnect', () => {
  });
});

http.listen(3000, () => console.log('listening on *:3000'));
