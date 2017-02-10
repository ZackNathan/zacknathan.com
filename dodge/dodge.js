var canvas;
var ctx;
var framerate = 60;
var speed = 5;
var dx = 0;
var dy = 0;
var count = 1;
var score = 1;
var coins = 0;
var WIDTH;
var HEIGHT;
var x;
var y;
var radius = 15;
var upPressed = false;
var downPressed = false;
var leftPressed = false;
var rightPressed = false;
var monsters = []
var gameover = false;
var interval;
var deathmonster = [];
var diagonalSlow = false;
var minColour = 100;
var maxColour = 250;
var r1 = [randint(minColour+1, maxColour-1), [-1, 1][randint(0, 1)]];
var g1 = [randint(minColour+1, maxColour-1), [-1, 1][randint(0, 1)]];
var b1 = [randint(minColour+1, maxColour-1), [-1, 1][randint(0, 1)]];
var r2 = [randint(minColour+1, maxColour-1), [-1, 1][randint(0, 1)]];
var g2 = [randint(minColour+1, maxColour-1), [-1, 1][randint(0, 1)]];
var b2 = [randint(minColour+1, maxColour-1), [-1, 1][randint(0, 1)]];
var foregroundColour = "rgb("+(255-(r1[0]+r2[0])/2)+", "+(255-(g1[0]+g2[0])/2)+", "+(255-(b1[0]+b2[0])/2)+")";
var background;
var rotatePeriod = 100;
var music = new Audio('audio/music.mp3');
var coinSound = new Audio('audio/gold.mp3');
var speedUpSound = new Audio('audio/speedup.mp3');
var speedDownSound = new Audio('audio/speeddown.mp3');
var reverseSound = new Audio('audio/reverse.mp3');
var gameOverSound = new Audio('audio/gameover.mp3');
var muted = false;
var highscore;
var gamesPlayed;

// Important starting function
function init() {
    canvas = document.getElementById("game");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx = game.getContext("2d");

    WIDTH = canvas.width;
    HEIGHT = canvas.height;
    x = WIDTH/2;
    y = HEIGHT/2;

    background = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT);

    if (localStorage.getItem("highscore")) {
        highscore = localStorage.getItem("highscore");
    } else {
        localStorage.setItem("highscore", 1);
        highscore = 1;
    }

    if (localStorage.getItem("gamesPlayed")) {
        gamesPlayed = localStorage.getItem("gamesPlayed");
    } else {
        localStorage.setItem("gamesPlayed", 0);
        gamesPlayed = 0;
    }

    interval = setInterval(frame, 1000/framerate);
    gameOverSound.volume = 0.4;
    reverseSound.volume = 0.7;
    speedUpSound.volume = 0.8;
    coinSound.volume = 0.6;
    music.play();
}

function randint(min, max) {
    return Math.floor(min + Math.random() * (max - min + 1));
}

function circle(x, y, r) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI*2, true);
    ctx.fill();
}

function rect(x, y, w, h) {
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.closePath();
    ctx.fill();
}

function move() {
    dx = 0;
    dy = 0;
    if (upPressed) {
        dy -= speed;
    } if (downPressed) {
        dy += speed;
    } if (leftPressed) {
        dx -= speed;
    } if (rightPressed) {
        dx += speed;
    }
    if (Math.abs(dx) + Math.abs(dy) > speed && diagonalSlow) {
        dx /= 2;
        dy /= 2;
        if (dx > 0) {
            dx += 1;
        } else {
            dx -= 1;
        } if (dy > 0) {
            dy += 1;
        } else {
            dy -= 1;
        }
    }
    y += dy;
    x += dx;
    if (y < radius) {
        y = radius;
    } if (x < radius) {
        x = radius;
    } if (y > HEIGHT - radius) {
        y = HEIGHT - radius;
    } if (x > WIDTH - radius) {
        x = WIDTH - radius;
    }

    for (var i = monsters.length-1; i >= 0; i--) {
        if (!monsters[i].dead) {
            monsters[i].moveMonster();
        } else {
            monsters.splice(i, 1);
        }
    }
}

function gameoverScreen() {
    clearInterval(interval);
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    ctx.fillStyle = "rgb(0, 0, 0)";
    rect(0 ,0, WIDTH, HEIGHT);

    ctx.fillStyle = "rgb(150, 30, 30)";
    circle(x, y, radius);

    if (deathmonster[3]) {
        if (deathmonster[4]) {
            rect(deathmonster[0] - deathmonster[2], deathmonster[1] - 7, deathmonster[2] * 2, 14);
        } else {
            rect(deathmonster[0] - 7, deathmonster[1] - deathmonster[2], 14, deathmonster[2] * 2);
        }
    } else {
        circle(deathmonster[0], deathmonster[1], deathmonster[2]);
    }

    score = Math.trunc(score);

    ctx.textAlign = "center";
    ctx.fillStyle = "rgb(240, 240, 240)";

    ctx.font = "96px Arial Black";
    ctx.fillText("Game Over " + "(" + score.toString() + ")", WIDTH/2, HEIGHT/2-20);
    ctx.font = "36px Arial Black";
    ctx.fillText("Press the space bar to play again", WIDTH/2, HEIGHT/2+150);

    if (score <= highscore) {
        ctx.fillText("Your high score is " + highscore.toString(), WIDTH/2, HEIGHT/2+50);
    } else {
        ctx.fillText("New high score!", WIDTH/2, HEIGHT/2+50);
        highscore = score
        localStorage.setItem("highscore", highscore);
    }

    gamesPlayed = parseInt(gamesPlayed)++;
    ctx.fillText("You have played "+gamesPlayed+" games", WIDTH/2, HEIGHT/2+100);
    localStorage.setItem("gamesPlayed", 105);

    music.pause();
    gameOverSound.currentTime=0;
    gameOverSound.play();
}

function restart() {
    gameover = false;
    x = WIDTH/2;
    y = HEIGHT/2;
    monsters = [];
    count = 1;
    score = 1;
    speed = 5;
    coins = 0;

    r1 = [randint(minColour+1, maxColour-1), [-1, 1][randint(0, 1)]];
    g1 = [randint(minColour+1, maxColour-1), [-1, 1][randint(0, 1)]];
    b1 = [randint(minColour+1, maxColour-1), [-1, 1][randint(0, 1)]];
    r2 = [randint(minColour+1, maxColour-1), [-1, 1][randint(0, 1)]];
    g2 = [randint(minColour+1, maxColour-1), [-1, 1][randint(0, 1)]];
    b2 = [randint(minColour+1, maxColour-1), [-1, 1][randint(0, 1)]];

    var upPressed = false;
    var downPressed = false;
    var leftPressed = false;
    var rightPressed = false;
    interval = setInterval(frame, 1000/framerate);

    gameOverSound.pause();
    music.currentTime=0;
    music.play();
}

function changeColour(c) {
    if (c[0] >= maxColour) {c[1] = -1;}
    else if (c[0] <= minColour) {c[1] = 1;}
    c[0] += c[1];
}

function draw() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    changeColour(r1)
    changeColour(r2)
    changeColour(g1)
    changeColour(g2)
    changeColour(b1)
    changeColour(b2)

    background = ctx.createLinearGradient(
                    Math.max(Math.min( WIDTH, WIDTH - WIDTH*((Math.abs((3*rotatePeriod/8.0-(count%rotatePeriod)))-(rotatePeriod/8.0))/(rotatePeriod/4.0)) ), 0),
                 Math.max(Math.min( HEIGHT, HEIGHT - HEIGHT*((Math.abs((5*rotatePeriod/8.0-(count%rotatePeriod)))-(rotatePeriod/8.0))/(rotatePeriod/4.0)) ), 0),
            WIDTH - Math.max(Math.min( WIDTH, WIDTH - WIDTH*((Math.abs((3*rotatePeriod/8.0-(count%rotatePeriod)))-(rotatePeriod/8.0))/(rotatePeriod/4.0)) ), 0),
        HEIGHT - Math.max(Math.min( HEIGHT, HEIGHT - HEIGHT*((Math.abs((5*rotatePeriod/8.0-(count%rotatePeriod)))-(rotatePeriod/8.0))/(rotatePeriod/4.0)) ), 0));

    background.addColorStop(0, "rgb("+r1[0]+", "+g1[0]+", "+b1[0]+")");
    background.addColorStop(1, "rgb("+r2[0]+", "+g2[0]+", "+b2[0]+")");

    ctx.fillStyle = background;
    rect(0 ,0, WIDTH, HEIGHT);

    foregroundColour = "rgb("+(Math.trunc(255-(r1[0]+r2[0])/2)-100)+", "+(Math.trunc(255-(g1[0]+g2[0])/2)-100)+", "+(Math.trunc(255-(b1[0]+b2[0])/2)-100)+")";
    ctx.fillStyle = foregroundColour;
    circle(x, y, radius);
    ctx.fillStyle = "white";
    circle(x, y, radius-4);
    ctx.fillStyle = foregroundColour;

    for (var i = 0; i < monsters.length; i++) {
        if (monsters[i].isCollide(x, y, 10) == true) {
            if (monsters[i].powerup) {
                if (monsters[i].coin) {
                    score += 100;
                    coins += 1;
                    coinSound.currentTime = 0;
                    coinSound.play();
                } else if (monsters[i].speedup) {
					if (speed <= -2) {
						speed -= 1;
					} else if (speed >= 2) {
						speed += 1;
					}
                    speedUpSound.currentTime = 0;
                    speedUpSound.play();
                } else if (monsters[i].speeddown) {
					if (speed <= -2) {
						speed += 1;
					} else if (speed >= 2) {
						speed -= 1;
					}
                    speedDownSound.currentTime = 0;
                    speedDownSound.play();
                } else if (monsters[i].reverser) {
                    speed *= -1;
                    reverseSound.currentTime = 0;
                    reverseSound.play();
                }
                monsters[i].dead = true;
            } else {
                gameover = true;
            }
        }
        monsters[i].drawMonster();
    }

    ctx.textAlign = "center";
    ctx.fillStyle = foregroundColour;
    ctx.font = "42px Arial Black";
    ctx.fillText(Math.trunc(score), WIDTH/2, 40);
    ctx.textAlign = "left";
    ctx.font = "24px Arial Black";
    ctx.fillText("Speed: " + speed.toString(), 40, 40);
    ctx.textAlign = "right";
    ctx.fillText("Coins: " + coins.toString(), WIDTH-40, 40);
    if (gameover) {
        gameoverScreen();
    }
}

function mute() {
    gameOverSound.volume = 0;
    reverseSound.volume = 0;
    speedUpSound.volume = 0;
    coinSound.volume = 0;
    speedDownSound.volume = 0;
    music.volume = 0;
    muted = true;
}

function unmute() {
    gameOverSound.volume = 0.4;
    reverseSound.volume = 0.7;
    speedUpSound.volume = 0.8;
    coinSound.volume = 0.6;
    speedDownSound.volume = 1.0;
    music.volume = 1.0;
    muted = false;
}

function frame() {
    if (count % 8 == 0) {
        monsters.push(new Monster());
    }
    move();
    draw();
    count++;
    score++;
	if (speed < 0) {
		score += 0.5;
	}
}

// Main part of program
init();
window.addEventListener('keydown', keyDown, true);
window.addEventListener('keyup', keyUp, true);
