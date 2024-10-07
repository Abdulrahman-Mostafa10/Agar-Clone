const URI = "http://localhost:3000";

const socket = io.connect(URI);

socket.on("init", ({ currentOrbs }) => {
  orbs = currentOrbs;
});
