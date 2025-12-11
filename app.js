const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

const getColor = require("./util/getRandomColor");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT;

app.use(express.static("public"));

const users = {};

io.on("connection", (socket) => {
  console.log("user connected: ", socket.id);

  users[socket.id] = {
    x: 0,
    y: 0,
    color: getColor(),
  };

  socket.emit("current_users", users);
  socket.emit("your_id", socket.id);

  socket.broadcast.emit("user_connected", {
    id: socket.id,
    ...users[socket.id],
  });

  socket.on("mouse_move", (data) => {
    if (users[socket.id]) {
      users[socket.id].x = data.x;
      users[socket.id].y = data.y;

      socket.broadcast.emit("user_moved", {
        id: socket.id,
        x: data.x,
        y: data.y,
      });
    }
  });

  socket.on("disconnect", () => {
    console.log("user disconnected: ", socket.id);
    delete users[socket.id];
    io.emit("user_disconnected", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
