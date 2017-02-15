function keyDown(event){
    switch (event.keyCode) {
        case 38:  /* Up arrow was pressed */
        case 87:  /* W */
            keyPressed.up = true;
            break;
        case 40:  /* Down arrow was pressed */
        case 83:  /* S */
            keyPressed.down = true;
            break;
        case 37:  /* Left arrow was pressed */
        case 65:  /* A */
            keyPressed.left = true;
            break;
        case 39:  /* Right arrow was pressed */
        case 68:  /* D */
            keyPressed.right = true;
            break;
        case 32: /* Space Bar */
            if (gameover) {
                if (mouse.control) {
                    mouse.control = false;
                }
                restart();
            }
            break;
        case 77: /* M */
            if (sounds.muted) {
                unmute();
            } else {
                mute();
            }
    }
}

function keyUp(event) {
    switch (event.keyCode) {
        case 38:  /* Up arrow was released */
        case 87:  /* W */
            keyPressed.up = false;
            break;
        case 40:  /* Down arrow was released */
        case 83:  /* S */
            keyPressed.down = false;
            break
        case 37:  /* Left arrow was released */
        case 65:  /* A */
            keyPressed.left = false;
            break;
        case 39:  /* Right arrow was released */
        case 68:  /* D */
            keyPressed.right = false;
            break;
        }
}

function getMousePos(event) {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
}

function click(event) {
    if (gameover) {
        if (!mouse.control) {
            mouse.control = true;
        }
        restart();
    }
}
