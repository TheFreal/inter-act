const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
var server = require('http').createServer(app);
var io = require('socket.io')(server);

io.on('connection', function (client) {
  console.log('Someone joined');

  // publish new viewcount
  io.emit("viewcount", io.engine.clientsCount)

  // handle disconnects
  client.on('disconnect', () => {
    // let everone know someone left
    io.emit("viewcount", io.engine.clientsCount)
    console.log("Someone left")
  });

  client.on("react", (reaction) => {
    console.log(reaction);
    io.emit("react", reaction)
  })

});

app.use(express.static(__dirname + '/hosted'));

server.listen(PORT, () => console.log(`Server listening on port ${PORT}`));