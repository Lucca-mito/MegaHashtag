var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/node_modules'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  socket.emit('clientsCount', io.engine.clientsCount)

  socket.on('request all users', () => {
    socket.emit('update all users', Object.keys(io.engine.clients));
  });

  socket.on('disconnect', () => {
  });
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});
