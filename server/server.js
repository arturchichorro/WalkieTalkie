const express = require("express");
const app = express();
const http = require("http");
const { Server } = require('socket.io');
const cors = require("cors");

app.use(cors());
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

io.on("connection", (socket) => {
  console.log('A user connected');

  socket.on("send_audio", (audioData) => {
    console.log('Received audio data:', audioData);
    socket.broadcast.emit("receive_audio", audioData);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

server.listen(3001, () => {
    console.log("SERVER IS RUNNING");
});
