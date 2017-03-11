var canvas;
var ctx;
var framerate = 60;
var WIDTH;
var HEIGHT;

function randint(min, max) {
    return Math.floor(min + Math.random() * (max - min + 1));
}

function click(event) {
}

function init() {
    canvas = document.getElementById("game");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx = game.getContext("2d");

    WIDTH = canvas.width;
    HEIGHT = canvas.height;
}

window.onLoad = init();
window.addEventListener('click', click, true);
