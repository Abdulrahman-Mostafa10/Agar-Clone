const path = require("path");

const socketio = require("socket.io");
const express = require("express");

const app = express();
const server = app.listen(3000);

const io = socketio(server);

app.use(express.static(path.join( __dirname, "../public")));

exports.app = app;
exports.io = io;
