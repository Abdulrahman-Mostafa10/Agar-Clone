module.exports = class Player {
  constructor(socketId, playerConfig, playerData) {
    this.socketId = socketId;
    this.playerConfiguration = playerConfig;
    this.playerData = playerData;
  }
};
