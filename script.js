const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

class snakePart{
    constructor(x,y){
        this.x = x;
        this.y = y;
    }
}

let tileCount = 20;
let tileSize = canvas.clientWidth/tileCount-2;
let headX = 10;
let headY = 10;

let speed = 7;

let xvelocity = 0;
let yvelocity = 0;

let appleX = 5;
let appleY = 5;

let score = 0;

const snakeParts = [];
let tailLength = 2;

function drawGame(){
    changeSnakePosition();

    let result = isGameOver();
    if(result){
        return;
    }
    
    clearScreen();
    drawSnake();
    checkCollision();
    drawApple();
    drawScore()
    setTimeout(drawGame, 1000/speed);
 }

 function isGameOver(){
    let gameOver = false;
    //check whether the game has started
    if (yvelocity == 0 && xvelocity == 0){
        return false;
    }
    if(headX < 0){
        gameOver = true;
    }
    else if(headX == tileCount){
        gameOver = true;
    }
    else if(headY < 0){
        gameOver = true;
    }
    else if(headY == tileCount){
        gameOver = true;
    }

    for(let i = 0; i < snakeParts.length; i++){
        let part = snakeParts[i];
        if(part.x == headX && part.y == headY){
            gameOver = true;
            break;
        }
        if(gameOver){
            endScore = score
            clearScreen();
            ctx.fillStyle = "white";
            ctx.font = "50px verdana";
            var gameOverText = `Game Over! \nScore: ${endScore}`;
            var x =  canvas.clientWidth/6.5;
            var y = canvas.clientHeight/2;
            var lineheight = 60;
            var lines = gameOverText.split('\n');
            for(let i = 0; i < lines.length; i++){
                ctx.fillText(lines[i], x, y + (i*lineheight));
            
            }
            //Binding the click event on the canvas
            document.body.addEventListener('click', function(evt) {
                if(evt){
                    document.location.reload();
                }
            });
        }
        return gameOver;
    }
 }

// Touch Test
let pageWidth = window.innerWidth || document.body.clientWidth;
let treshold = Math.max(1,Math.floor(0.01 * (pageWidth)));
let touchstartX = 0;
let touchstartY = 0;
let touchendX = 0;
let touchendY = 0;

const limit = Math.tan(45 * 1.5 / 180 * Math.PI);
//const gestureZone = document.getElementById('modalContent');

canvas.addEventListener('touchstart', function(event) {
    event.preventDefault()  
  touchstartX = event.changedTouches[0].screenX;
    touchstartY = event.changedTouches[0].screenY;
}, false);

canvas.addEventListener('touchend', function(event) {
      event.preventDefault()
    touchendX = event.changedTouches[0].screenX;
    touchendY = event.changedTouches[0].screenY;
    handleGesture(event);
}, false);

function handleGesture(e) {
    let x = touchendX - touchstartX;
    let y = touchendY - touchstartY;
    let xy = Math.abs(x / y);
    let yx = Math.abs(y / x);
    if (Math.abs(x) > treshold || Math.abs(y) > treshold || snake.dx === 0 ) {
        if (yx <= limit) {
            if (x < 0) {
                console.log("left");
              if (xvelocity === 0){ 
               xvelocity = -1;
               yvelocity = 0;};
            } else {
                console.log("right");
              if (xvelocity === 0){
                xvelocity = 1;
                yvelocity = 0;}
            }
        }
        if (xy <= limit) {
            if (y < 0 ) {
                console.log("top");
              if (yvelocity === 0){
                yvelocity = -1;
                xvelocity = 0;}
            } else {
           
              console.log("bottom");
              if (yvelocity === 0){
                yvelocity = 1;
                xvelocity = 0;
            }}
        }
    } else {
        console.log("tap");
    }
}

 document.body.addEventListener('keydown', keyDown);

function keyDown(event){
    // Up direction
    if(event.keyCode == 38){
        if(yvelocity == 1)
        return;
        yvelocity = -1; // Move one tile up
        xvelocity = 0;
    }
    // Down direction
    if(event.keyCode == 40){
        if(yvelocity == -1)
        return;
        yvelocity = 1; // Move one tile down
        xvelocity = 0;
    }
    // Left direction
    if(event.keyCode == 37){
        if(xvelocity == 1)
        return;
        yvelocity = 0;
        xvelocity = -1; // Move one tile left
    }
    // Right direction
    if(event.keyCode == 39){
        if(xvelocity == -1)
        return;
        yvelocity = 0;
        xvelocity = 1; // Move one tile right
    }
}

function changeSnakePosition(){
    headX = headX + xvelocity;
    headY = headY + yvelocity;
}


function drawScore(){
    ctx.fillStyle = "white"
    ctx.font = "10px verdena"
    ctx.fillText("score: " + score, canvas.clientWidth - 50, 10);
}

function checkCollision(){
    if(appleX == headX && appleY == headY){
        appleX = Math.floor(Math.random()*tileCount);
        appleY = Math.floor(Math.random()*tileCount);
        tailLength++;
        score++;
    }
}

function drawApple(){
    ctx.fillStyle = "red";
    ctx.fillRect(appleX * tileCount, appleY * tileCount, tileSize, tileSize)
}

function drawSnake(){
    
    ctx.fillStyle = "green";
    for(let i = 0; i < snakeParts.length; i++){
        let part = snakeParts[i]
        ctx.fillRect(part.x *tileCount, part.y *tileCount, tileSize, tileSize)
    }
    snakeParts.push(new snakePart(headX, headY));
    if(snakeParts.length > tailLength){
        snakeParts.shift();
    }
    ctx.fillStyle="orange";
    ctx.fillRect(headX* tileCount,headY* tileCount, tileSize,tileSize)
}

function clearScreen(){
    ctx.fillStyle = "black"
    ctx.fillRect(0,0,canvas.clientWidth,canvas.clientHeight)
}
drawGame();