const URI = "http://localhost:3000";

const socket = io.connect(URI);

const init = async () => {
  const initData = await socket.emitWithAck("init", {
    playerName: player.name,
  });

  setInterval(() => {
    socket.emit("tock", {
      xVector: player.xVector || 0.1,
      yVector: player.yVector || 0.1,
    });
  });

  orbs = initData.currentOrbs;
  player.indexInPlayers = initData.indexInPlayers;
  draw();
};

socket.on("tick", (playersArray) => {
  players = playersArray;

  if (players[player.indexInPlayers].playerData) {
    player.locX = players[player.indexInPlayers].playerData.locX;
    player.locY = players[player.indexInPlayers].playerData.locY;
  }
});

socket.on("orbSwitch", (orbData) => {
  orbs.splice(orbData.capturedOrbId, 1, orbData.newOrb);
});

socket.on("playerAbsorbed", (absorbedData) => {
  document.querySelector(
    "#game-message"
  ).innerHTML = `${absorbedData.absorbed} was absorbed by ${absorbedData.absorbedBy}`;

  document.querySelector("#game-message").style.opacity = 1;

  window.setTimeout(() => {
    document.querySelector("#game-message").style.opacity = 0;
  }, 2000);
});

socket.on("updateLeaderBoard", (leaderBoardArray) => {
  leaderBoardArray.sort((a, b) => {
    return b.score - a.score;
  });

  document.querySelector(".leader-board").innerHTML = "";

  leaderBoardArray.forEach((p) => {
    if (!p.name) {
      return;
    }
    document.querySelector(".leader-board").innerHTML += `
        <li class="leaderboard-player">${p.name} - ${p.score}</li>
    `;
  });
});
