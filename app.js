var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/node_modules'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.log('New client connected!');
  socket.on('eventFromClient', (data) => {
    console.log(data);
    socket.emit('eventFromServer', 'Hello from server!');
  });

  socket.on('disconnect', function() {});
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});
