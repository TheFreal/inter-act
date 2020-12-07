const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
var server = require('http').createServer(app);
var io = require('socket.io')(server);

let bigscreenId;
let moderatorId;

io.on('connection', function (client) {
  console.log('Someone joined');

  client.on("identify", (data, ack) => {
    if (data.device == "bigscreen") {
      console.log("Welcome, bigscreen");
      bigscreenId = client.id;
    }
    if (data.device == "moderator") {
      console.log("Welcome, moderator");
      moderatorId = client.id;
      ack(client.id);
    }
  });

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
    if (bigscreenId != null) {
      io.to(bigscreenId).emit("react", reaction)
    }
    if (moderatorId != null) {
      io.to(moderatorId).emit("react", reaction)
    }
  });

  client.on("askfor_proposals", (data) => {
    console.log(data);
    if (data.id == moderatorId) {
      // security cleared
      io.emit("askfor_proposals", data)
    }
  });

  client.on("receive_proposal", (data) => {
    console.log(data);
    if (bigscreenId != null) {
      io.to(bigscreenId).emit("receive_proposal", data);
    }
  });

});

app.use(express.static(__dirname + '/hosted'));

server.listen(PORT, () => console.log(`Server listening on port ${PORT}`));