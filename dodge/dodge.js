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
var monsters = []
var gameover = false;
var interval;
var deathmonster = [];
var diagonalSlow = false;
var keyPressed = {};
var colour = {};
var sounds = {};
var mouse = {};
var rotatePeriod = 100;
var highscore;
var gamesPlayed;
var monsterPeriod = 8;

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

function changeColour(c) {
    if (c[0] >= colour.max) {c[1] = -1;}
    else if (c[0] <= colour.min) {c[1] = 1;}
    c[0] += c[1];
}

function mute() {
    sounds.gameOver.volume = 0;
    sounds.reverser.volume = 0;
    sounds.speedUp.volume = 0;
    sounds.speedDown.volume = 0;
    sounds.coin.volume = 0;
    sounds.music.volume = 0;
    sounds.muted = true;
}

function unmute() {
    sounds.gameOver.volume = 0.2;
    sounds.reverser.volume = 0.4;
    sounds.speedUp.volume = 0.5;
    sounds.speedDown.volume = 0.7;
    sounds.coin.volume = 0.3;
    sounds.music.volume = 1.0;
    sounds.muted = false;
}

function init() {
    canvas = document.getElementById("game");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx = game.getContext("2d");

    WIDTH = canvas.width;
    HEIGHT = canvas.height;
    x = WIDTH/2;
    y = HEIGHT/2;
    mouse.x = x;
    mouse.y = y;
    mouse.control = false;
    monsterPeriod = Math.round(8.0/(WIDTH*HEIGHT/1152000.0));
    colour.gradient = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT);

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

    keyPressed.up = false;
    keyPressed.down = false;
    keyPressed.left = false;
    keyPressed.right = false;

    colour.min = 100;
    colour.max = 250;
    colour.r1 = [randint(colour.min+1, colour.max-1), [-1, 1][randint(0, 1)]];
    colour.g1 = [randint(colour.min+1, colour.max-1), [-1, 1][randint(0, 1)]];
    colour.b1 = [randint(colour.min+1, colour.max-1), [-1, 1][randint(0, 1)]];
    colour.r2 = [randint(colour.min+1, colour.max-1), [-1, 1][randint(0, 1)]];
    colour.g2 = [randint(colour.min+1, colour.max-1), [-1, 1][randint(0, 1)]];
    colour.b2 = [randint(colour.min+1, colour.max-1), [-1, 1][randint(0, 1)]];
    colour.foreground = "rgb("+(255-(colour.r1[0]+colour.r2[0])/2)+", "+
                                (255-(colour.g1[0]+colour.g2[0])/2)+", "+
                                (255-(colour.b1[0]+colour.b2[0])/2)+")";
    colour.speedUp = "rgb(40, 230, 40)";
    colour.speedDown = "rgb(230, 40, 40)";
    colour.reverser = "rgb(230, 40, 230)";
    colour.coin = "rgb(230, 230, 40)";

    sounds.gameOver = new Audio('audio/gameover.mp3');
    sounds.reverser = new Audio('audio/reverse.mp3');
    sounds.speedUp = new Audio('audio/speedup.mp3');
    sounds.speedDown = new Audio('audio/speeddown.mp3');
    sounds.coin = new Audio('audio/gold.mp3');
    sounds.music = new Audio('audio/music.mp3');

    sounds.muted = false;
    sounds.gameOver.volume = 0.2;
    sounds.reverser.volume = 0.4;
    sounds.speedUp.volume = 0.5;
    sounds.speedDown.volume = 0.7;
    sounds.coin.volume = 0.3;
    sounds.music.volume = 1.0;
    sounds.music.play();
}

function frame() {
    if (count % monsterPeriod == 0) {
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

function move() {
    dx = 0;
    dy = 0;
    if (mouse.control) {
        if (Math.abs(mouse.y-y) >= Math.abs(speed) || Math.abs(mouse.x-x) >= Math.abs(speed)) {
            mouse.angle = Math.atan2(mouse.y-y, -(mouse.x-x)) + Math.PI;
            dy = -Math.abs(speed)*Math.sin(mouse.angle)/Math.abs(Math.cos(mouse.angle));
            if (Math.abs(dy) > Math.abs(speed)) {
                if (dy > 0) {
                    dy = Math.abs(speed);
                } else {
                    dy = -Math.abs(speed);
                }
            }
            dx = Math.abs(speed)*Math.cos(mouse.angle)/Math.abs(Math.sin(mouse.angle));
            if (Math.abs(dx) > Math.abs(speed)) {
                if (dx > 0) {
                    dx = Math.abs(speed);
                } else {
                    dx = -Math.abs(speed);
                }
            }
        }
        if (speed < 0) {
            dy *= -1;
            dx *= -1;
        }
    } else {
        if (keyPressed.up) {
            dy -= speed;
        } if (keyPressed.down) {
            dy += speed;
        } if (keyPressed.left) {
            dx -= speed;
        } if (keyPressed.right) {
            dx += speed;
        }
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
        if (monsters[i].isCollide(x, y, 10) == true) {
            if (monsters[i].powerup) {
                if (monsters[i].coin) {
                    score += 100;
                    coins += 1;
                    sounds.coin.currentTime = 0;
                    sounds.coin.play();
                } else if (monsters[i].speedUp) {
					if (speed <= -2) {
						speed -= 1;
					} else if (speed >= 2) {
						speed += 1;
					}
                    sounds.speedUp.currentTime = 0;
                    sounds.speedUp.play();
                } else if (monsters[i].speedDown) {
					if (speed <= -2) {
						speed += 1;
					} else if (speed >= 2) {
						speed -= 1;
					}
                    sounds.speedDown.currentTime = 0;
                    sounds.speedDown.play();
                } else if (monsters[i].reverser) {
                    speed *= -1;
                    sounds.reverser.currentTime = 0;
                    sounds.reverser.play();
                }
                monsters[i].dead = true;
            } else {
                gameover = true;
            }
        }

        if (!monsters[i].dead) {
            monsters[i].moveMonster();
        } else {
            monsters.splice(i, 1);
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    changeColour(colour.r1);
    changeColour(colour.r2);
    changeColour(colour.g1);
    changeColour(colour.g2);
    changeColour(colour.b1);
    changeColour(colour.b2);

    colour.gradient = ctx.createLinearGradient(
                    Math.max(Math.min( WIDTH, WIDTH - WIDTH*((Math.abs((3*rotatePeriod/8.0-(count%rotatePeriod)))-(rotatePeriod/8.0))/(rotatePeriod/4.0)) ), 0),
                 Math.max(Math.min( HEIGHT, HEIGHT - HEIGHT*((Math.abs((5*rotatePeriod/8.0-(count%rotatePeriod)))-(rotatePeriod/8.0))/(rotatePeriod/4.0)) ), 0),
            WIDTH - Math.max(Math.min( WIDTH, WIDTH - WIDTH*((Math.abs((3*rotatePeriod/8.0-(count%rotatePeriod)))-(rotatePeriod/8.0))/(rotatePeriod/4.0)) ), 0),
        HEIGHT - Math.max(Math.min( HEIGHT, HEIGHT - HEIGHT*((Math.abs((5*rotatePeriod/8.0-(count%rotatePeriod)))-(rotatePeriod/8.0))/(rotatePeriod/4.0)) ), 0));

    colour.gradient.addColorStop(0, "rgb("+colour.r1[0]+", "+colour.g1[0]+", "+colour.b1[0]+")");
    colour.gradient.addColorStop(1, "rgb("+colour.r2[0]+", "+colour.g2[0]+", "+colour.b2[0]+")");

    ctx.fillStyle = colour.gradient;
    rect(0 ,0, WIDTH, HEIGHT);

    colour.foreground = "rgb("+(Math.trunc(255-(colour.r1[0]+colour.r2[0])/2)-100)+", "+
                                (Math.trunc(255-(colour.g1[0]+colour.g2[0])/2)-100)+", "+
                                (Math.trunc(255-(colour.b1[0]+colour.b2[0])/2)-100)+")";
    ctx.fillStyle = colour.foreground;
    circle(x, y, radius);
    ctx.fillStyle = "white";
    circle(x, y, radius-4);
    ctx.fillStyle = colour.foreground;

    for (var i = 0; i < monsters.length; i++) {
        monsters[i].drawMonster();
    }

    ctx.textAlign = "center";
    ctx.fillStyle = colour.foreground;
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
    if (mouse.control) {
        ctx.fillText("Press space to use keyboard controls", WIDTH/2, HEIGHT/2+200);
        ctx.fillText("Click to play again", WIDTH/2, HEIGHT/2+150);
    } else {
        ctx.fillText("Click to use mouse controls", WIDTH/2, HEIGHT/2+200);
        ctx.fillText("Press the space bar to play again", WIDTH/2, HEIGHT/2+150);
    }

    if (score <= highscore) {
        ctx.fillText("Your high score is " + highscore.toString(), WIDTH/2, HEIGHT/2+50);
    } else {
        ctx.fillText("New high score!", WIDTH/2, HEIGHT/2+50);
        highscore = score
        localStorage.setItem("highscore", highscore);
    }

    gamesPlayed = parseInt(gamesPlayed) + 1;
    ctx.fillText("You have played "+gamesPlayed+" games", WIDTH/2, HEIGHT/2+100);
    localStorage.setItem("gamesPlayed", gamesPlayed);
    ctx.fillText("zacknathan.com/dodge", WIDTH/2, 150);

    sounds.music.pause();
    sounds.gameOver.currentTime=0;
    sounds.gameOver.play();
}

function restart() {
    gameover = false;
    x = WIDTH/2;
    y = HEIGHT/2;
    mouse.x = x;
    mouse.y = y;
    monsters = [];
    count = 1;
    score = 1;
    speed = 5;
    coins = 0;

    colour.r1 = [randint(colour.min+1, colour.max-1), [-1, 1][randint(0, 1)]];
    colour.g1 = [randint(colour.min+1, colour.max-1), [-1, 1][randint(0, 1)]];
    colour.b1 = [randint(colour.min+1, colour.max-1), [-1, 1][randint(0, 1)]];
    colour.r2 = [randint(colour.min+1, colour.max-1), [-1, 1][randint(0, 1)]];
    colour.g2 = [randint(colour.min+1, colour.max-1), [-1, 1][randint(0, 1)]];
    colour.b2 = [randint(colour.min+1, colour.max-1), [-1, 1][randint(0, 1)]];

    keyPressed.up = false;
    keyPressed.down = false;
    keyPressed.left = false;
    keyPressed.right = false;
    interval = setInterval(frame, 1000/framerate);

    sounds.gameOver.pause();
    sounds.music.currentTime=0;
    sounds.music.play();
}

window.onLoad = init();
window.addEventListener('keydown', keyDown, true);
window.addEventListener('keyup', keyUp, true);
window.addEventListener('mousemove', getMousePos, true);
window.addEventListener('click', click, true);
