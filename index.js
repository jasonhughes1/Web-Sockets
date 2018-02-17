var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', socket => {
  const date = Date.now()
  const lastFour = date.toString().split('').splice(9,4).join('')
  let user = `ID: ${lastFour}`

  console.log('A user has connected.');
  socket.broadcast.emit('user connect', `User ${user} has signed on!`);

  socket.on('typing', (msg) => {
    socket.broadcast.emit('other user typing', msg)
  })

  socket.on('chat message', function(msg) {
    io.emit('chat message', `${user}: ${msg}`);
  });

  socket.on('disconnect', () => {
    io.emit('user disconnect', `User ${user} has signed off :(`)
    console.log('User disconnected.');
  });
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});
