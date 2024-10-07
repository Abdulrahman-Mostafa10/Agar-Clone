const { app, io } = require("../../home/home");
const Orb = require("../../classes/Orb");

const currentOrbs = [];

initGame();

io.on("connect", (socket) => {
  socket.emit("init", { currentOrbs });
});

function initGame() {
  for (let i = 0; i < 500; i++) {
    currentOrbs.push(new Orb());
  }
}
module.exports = io;
