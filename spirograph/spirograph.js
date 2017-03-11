var canvas;
var ctx;
var framerate = 1000;
var WIDTH;
var HEIGHT;
var degree = 0;

function randint(min, max) {
    return Math.floor(min + Math.random() * (max - min + 1));
}

function click(event) {
}

function Circle() {
    this.orbitradius = randint(10, HEIGHT/12);
    this.orbittime = randint(20, 100);
    if (randint(0, 1) == 0) {
        this.orbittime *= -1;
    }
    this.colour;
    this.coordinates = [0, 0];
}

Circle.prototype.render = function(parent) {
    x = Math.cos(degree * 2 * Math.PI / this.orbittime) * this.orbitradius;
    y = Math.sin(degree * 2 * Math.PI / this.orbittime) * this.orbitradius;

    if (!parent) {
        parent = new Circle();
        parent.coordinates[0] = 0;
        parent.coordinates[1] = 0;
    }

    if (degree > 2) {
        ctx.beginPath();
        ctx.moveTo(x + parent.coordinates[0] + WIDTH/2, y + parent.coordinates[1] + HEIGHT/2);
        ctx.lineTo(this.coordinates[0] + WIDTH/2, this.coordinates[1] + HEIGHT/2);
        ctx.strokeStyle = this.colour;
        ctx.stroke();
    }

    this.coordinates = [x + parent.coordinates[0], y + parent.coordinates[1]];
}

function frame() {
    degree += 1;

    a.render();
    b.render(a);
    c.render(b);
    d.render(c);
    //e.render(d);
    //f.render(e);
    //g.render(f);

    ctx.fillStyle = "rgb(255, 255, 255)";
    ctx.beginPath();
    ctx.arc(WIDTH/2, HEIGHT/2, 5, 0, Math.PI*2, true);
    ctx.fill();
}

function init() {
    canvas = document.getElementById("game");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx = game.getContext("2d");

    WIDTH = canvas.width;
    HEIGHT = canvas.height;

    a = new Circle()
    a.orbitradius = randint(HEIGHT/6, HEIGHT/3);
    a.orbittime = randint(100, 500);
    a.colour = "rgb(100, 100, 100)";

    b = new Circle()
    b.colour = "rgb(0, 0, 255)";

    c = new Circle()
    c.colour = "rgb(0, 255, 0)";

    d = new Circle()
    d.colour = "rgb(255, 0, 0)";

    e = new Circle()
    e.colour = "rgb(0, 255, 255)";

    f = new Circle()
    f.colour = "rgb(255, 255, 0)";

    g = new Circle()
    g.colour = "rgb(255, 0, 255)";

    ctx.beginPath();
    ctx.rect(0, 0, WIDTH, HEIGHT);
    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.fill();

    interval = setInterval(frame, 1000/framerate);
}

window.onLoad = init();
window.addEventListener('click', click, true);
