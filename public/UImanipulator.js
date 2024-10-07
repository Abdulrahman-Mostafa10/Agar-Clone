let windowHeight = window.innerHeight;
let windowWidth = window.innerWidth;

const canvas = document.querySelector("#the-canvas");
const context = canvas.getContext("2d");

const loginModal = new bootstrap.Modal(document.querySelector("#loginModal"));
const spawnModal = new bootstrap.Modal(document.querySelector("#spawnModal"));

const player = {};

canvas.height = windowHeight;
canvas.width = windowWidth;

// Event Listeners =>

window.addEventListener("load", () => {
  loginModal.show();
});

document.querySelector(".name-form").addEventListener("submit", (event) => {
  event.preventDefault();

  player.name = document.querySelector("#name-input").value;
  document.querySelector(".player-name").innerHTML = player.name;

  loginModal.hide();
  spawnModal.show();
});

document.querySelector(".start-game").addEventListener("click", (event) => {
  spawnModal.hide();
  const hiddenElements = Array.from(
    document.querySelectorAll(".hiddenOnStart")
  );
  hiddenElements.forEach((element) => element.removeAttribute("hidden"));
  init();
});
