const { app, io } = require("../../home/home");

// ---------------Classes---------------
const Player = require("../../classes/Player");
const PlayerData = require("../../classes/PlayerData");
const PlayerConfiguration = require("../../classes/PlayerConfiguration");
const Orb = require("../../classes/Orb");
//--------------------------------------

const currentOrbs = [];
const players = [];

const settings = {
  defaultOrbsNumber: 500,
  defaultSpeed: 6,
  defaultSize: 6,
  defaultZoom: 1.5,
  worldWidth: 500,
  worldHeight: 500,
  defaultGenericOrbSize: 5,
};

initGame();

io.on("connect", (socket) => {
  socket.on("init", (playerObject, ackCallBack) => {
    const playerConfig = new PlayerConfiguration(settings);
    const playerData = new PlayerData(playerObject.name, settings);
    const player = new Player(socket.id, playerConfig, playerData);
    players.push(player);
    ackCallBack(currentOrbs);
  });
});

function initGame() {
  for (let i = 0; i < settings.defaultOrbsNumber; i++) {
    currentOrbs.push(new Orb(settings));
  }
}
module.exports = io;
