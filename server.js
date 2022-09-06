const express = require("express");
const cors = require("cors");
const { createServer } = require("http");
const { Server } = require("socket.io");
const mongoose = require("./database/db");
const dotenv = require("dotenv");
const appRouter = require("./routes");
const app = express();
const jwt = require("jsonwebtoken")
const {socketAuth} = require("./middleware/auth")
const Socket = require("./SocketServer")

const PORT = process.env.PORT || 8080;
dotenv.config();

//middlewares
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api", appRouter);

app.get("/", (req, res) => {
  res.send(`Running app on ${PORT}`)
})

//SOCKET IO CONFIG
const httpServer = createServer(app)

const io = new Server(httpServer, {
  cors: {
    methods: ["GET", "POST"],
    maxHttpBufferSize: 1e8,
    pingTimeout: 60000,
  },
  allowEIO3: true,
});

//SOCKET MIDDLEWARE TO CHECK USER AUTHORIZATION
io.use(socketAuth)

//SOCKET CONNECTION
io.on("connection", (socket) => {
  Socket(socket)
});

httpServer.listen(PORT, () => {
  console.log(`App running on ${PORT}`)
})