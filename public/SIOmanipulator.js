const URI = "http://localhost:3000";

const socket = io.connect(URI);

const init = async () => {
  const currentOrbs = await socket.emitWithAck("init", {
    playerName: player.name,
  });
  console.log(currentOrbs);
  orbs = currentOrbs;
  draw();
};
