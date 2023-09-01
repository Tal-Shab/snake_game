const gameBoard = document.querySelector("#gameBoard");
const gameWidth = gameBoard.width;
const gameHeight = gameBoard.height;
const gameBoardCtx = gameBoard.getContext("2d");
const scoreText = document.querySelector("#scoreText");
const resetBtn = document.querySelector("#resetBtn");

//const boardBackground = "white";
const backgroundImage = new Image();
backgroundImage.src = "greenBackground.png"; 


const snakeColor = "darkgreen";
const snakeBorder = "black";
const foodColor = "red"; 
const unitSize = 25;

let running = false;
let firstPress = true;
let xVolecity = unitSize;
let yVolecity = 0;

let speeds = {
    "master":75,
    "medium":100,
    "easy":200
};

let gameSpeed = speeds["medium"];

let foodX;
let foodY;
let score = 0;
let snake = [
    {x:unitSize*3, y:0},
    {x:unitSize*2, y:0},
    {x:unitSize, y:0},
    {x:0, y:0}
];

// Wait for the image to load
backgroundImage.onload = function() {
    // Draw the background image on the canvas
    gameBoardCtx.drawImage(backgroundImage, 0, 0, gameWidth, gameHeight);
    resetBtn.addEventListener("click", resetGame);
    DisplayGameStart();
  };


function DisplayGameStart() {
    running = false;
    gameBoardCtx.font = "40px MV Boli";
    gameBoardCtx.fillStyle = "black";
    gameBoardCtx.textAlign = "center";
    //gameBoardCtx.drawImage(backgroundImage, 0, 0, gameWidth, gameHeight);
    gameBoardCtx.fillText("press any key to start", gameWidth/2, gameHeight/2);
    window.addEventListener("keydown", gameStart);
}

function gameStart(event) {
    window.removeEventListener("keydown", gameStart);
    window.addEventListener("keydown", changeDirection);
    running = true;
    scoreText.textContent = score;
    setGameSpeed();
    createFood();
    drawFood();
    nextTick();
}
function setGameSpeed(){
    const LevelOptions = document.querySelectorAll('[name="levelOptions"]');
    for (const option of LevelOptions) {
        if (option.checked) {
          gameSpeed = speeds[option.value]
        }
    }
}

function nextTick() {
    if(running){
        setTimeout( () => {
            clearBoard();
            drawFood();
            moveSnake();
            drawSnake();
            checkGameOver();
            nextTick();
        } , gameSpeed);
    }
    else{
        DisplayGameOver();
    }
}
function clearBoard() {
    //gameBoardCtx.fillStyle = boardBackground;
    //gameBoardCtx.fillRect(0, 0, gameWidth, gameHeight);
    gameBoardCtx.drawImage(backgroundImage, 0, 0, gameWidth, gameHeight);
}
function createFood() {
    function randomFoodPlace(min,max) {
        const randNum = Math.round( (Math.random() * (max-min) + min )/unitSize ) * unitSize;
        return randNum;
    }
    foodX = randomFoodPlace(0, gameWidth - unitSize);
    foodY = randomFoodPlace(0, gameWidth - unitSize);
}
function drawFood() {
    gameBoardCtx.fillStyle = foodColor;
    gameBoardCtx.fillRect(foodX, foodY, unitSize, unitSize);
}
function moveSnake() {
    const head = {x: snake[0].x + xVolecity, 
                y: snake[0].y + yVolecity};

    snake.unshift(head);
    if (snake[0].x == foodX && snake[0].y == foodY) //food is eaten
    {
        score++;
        scoreText.textContent = score;
        createFood();
    }
    else{
        snake.pop();
    }
}
function drawSnake() {
    gameBoardCtx.fillStyle = snakeColor;
    gameBoardCtx.strokeStyle = snakeBorder;
    snake.forEach( bodyPart => {
        gameBoardCtx.fillRect(bodyPart.x, bodyPart.y, unitSize, unitSize);
        gameBoardCtx.strokeRect(bodyPart.x, bodyPart.y, unitSize, unitSize);
    } )
}
function changeDirection(event) {
    //event.preventDefault();
    const keyPressed = event.keyCode;
    const LEFT = 37;
    const UP = 38;
    const RIGHT = 39;
    const DOWN = 40;
    const currentlyGoingUp = (yVolecity == -unitSize);
    const currentlyGoingDown = (yVolecity == unitSize);
    const currentlyGoingRight = (xVolecity == unitSize);
    const currentlyGoingLeft = (xVolecity == -unitSize);            

    switch (true) {
        case (keyPressed == LEFT && !currentlyGoingRight):
            xVolecity = -unitSize;
            yVolecity = 0;
            break;
        case (keyPressed == RIGHT && !currentlyGoingLeft):
            xVolecity = unitSize;
            yVolecity = 0;
            break;
        case (keyPressed == UP && !currentlyGoingDown):
            xVolecity = 0;
            yVolecity = -unitSize;
            break;
        case (keyPressed == DOWN && !currentlyGoingUp):
            xVolecity = 0;
            yVolecity = unitSize;
            break;
    }

}
function checkGameOver() {
    switch (true) {
        case (snake[0].x < 0 || snake[0].y < 0):
            running = false;
            break;

        case (snake[0].x >= gameWidth || snake[0].y >= gameHeight):
            running = false;
            break;
    }
    headX = snake[0].x;
    headY = snake[0].y;
    for(let i=1; i<snake.length; i++){
        if(snake[i].x == headX && snake[i].y == headY)
        {
            running = false;
            break;
        }
    }
}

function DisplayGameOver() {
    running = false;
    gameBoardCtx.font = "40px MV Boli";
    gameBoardCtx.fillStyle = "black";
    gameBoardCtx.textAlign = "center";
    gameBoardCtx.fillText("GAME OVER LOSER!", gameWidth/2, gameHeight/2);
}

function resetGame() {
    clearBoard();
    score = 0;
    xVolecity = unitSize;
    yVolecity = 0;
    firstPress = true;
    snake = [
        {x:unitSize*3, y:0},
        {x:unitSize*2, y:0},
        {x:unitSize, y:0},
        {x:0, y:0}
    ];
    window.removeEventListener("keydown", changeDirection);
    DisplayGameStart();
}

