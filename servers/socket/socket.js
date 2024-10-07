const { app, io } = require("../../home/home");

// ---------------Classes---------------
const Player = require("../../classes/Player");
const PlayerData = require("../../classes/PlayerData");
const PlayerConfiguration = require("../../classes/PlayerConfiguration");
const Orb = require("../../classes/Orb");
const {
  checkForOrbCollisions,
  checkForPlayerCollisions,
} = require("./checkCollisions");
//--------------------------------------

const currentOrbs = [];
let players = [];
let playersForUsers = [];
let intervalCall;

const settings = {
  defaultOrbsNumber: 500,
  defaultSpeed: 2,
  defaultSize: 6,
  defaultZoom: 1.5,
  worldWidth: 500,
  worldHeight: 500,
  defaultGenericOrbSize: 5,
};

initGame();

io.on("connect", (socket) => {
  let currentPlayer = {};
  socket.on("init", (playerObject, ackCallBack) => {
    if (players.length === 0) {
      intervalCall = setInterval(() => {
        io.to("game").emit("tick", playersForUsers);
      }, 33);
    }
    socket.join("game");

    const { playerName } = playerObject;
    const playerConfig = new PlayerConfiguration(settings);
    const playerData = new PlayerData(playerName, settings);
    currentPlayer = new Player(socket.id, playerConfig, playerData);

    players.push(currentPlayer);
    playersForUsers.push({ playerData });
    // console.log(playersForUsers.length - 1);
    console.log(playersForUsers);
    ackCallBack({ currentOrbs, indexInPlayers: playersForUsers.length - 1 });
  });

  socket.on("tock", (data) => {
    if (!currentPlayer || !currentPlayer.playerConfiguration) {
      return;
    }

    const { speed } = currentPlayer.playerConfiguration;
    const xV = (currentPlayer.playerConfiguration.xVector = data.xVector);
    const yV = (currentPlayer.playerConfiguration.yVector = data.yVector);

    if (
      (currentPlayer.playerData.locX > 5 && xV < 0) ||
      (currentPlayer.playerData.locX < settings.worldWidth && xV > 0)
    ) {
      currentPlayer.playerData.locX += speed * xV;
    }
    if (
      (currentPlayer.playerData.locY > 5 && yV > 0) ||
      (currentPlayer.playerData.locY < settings.worldHeight && yV < 0)
    ) {
      currentPlayer.playerData.locY -= speed * yV;
    }

    const capturedOrbId = checkForOrbCollisions(
      currentPlayer.playerData,
      currentPlayer.playerConfiguration,
      currentOrbs
    );

    if (capturedOrbId !== null) {
      currentOrbs.splice(capturedOrbId, 1, new Orb(settings));

      const orbData = {
        capturedOrbId,
        newOrb: currentOrbs[capturedOrbId],
      };

      io.to("game").emit("orbSwitch", orbData);
      io.to("game").emit("updateLeaderBoard", getLeaderBoard());
    }

    const absorbedData = checkForPlayerCollisions(
      currentPlayer.playerData,
      currentPlayer.playerConfiguration,
      players,
      playersForUsers,
      socket.id
    );

    if (absorbedData) {
      io.to("game").emit("playerAbsorbed", absorbedData);
      io.to("game").emit("updateLeaderBoard", getLeaderBoard());
    }
  });

  socket.on("disconnect", () => {
    if (currentPlayer) {
      for (let i = 0; i < players.length; i++) {
        if (players[i].socketId === currentPlayer.socketId) {
          players.splice(i, 1, {});
          playersForUsers.splice(i, 1, {});
          break;
        }
      }
    }

    if (players.length === 0) {
      clearInterval(intervalCall);
    }
  });
});

function initGame() {
  for (let i = 0; i < settings.defaultOrbsNumber; i++) {
    currentOrbs.push(new Orb(settings));
  }
}

function getLeaderBoard() {
  return players.map((p) => {
    if (p.playerData) {
      return {
        name: p.playerData.name,
        score: p.playerData.score,
      };
    }
    return {};
  });
}

module.exports = io;
