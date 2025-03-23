const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 500;

let basket = { x: 160, y: 450, width: 90, height: 15 }; // Slightly bigger basket
let ball = { x: Math.random() * 340, y: 0, width: 60, height: 60, speed: 2.5 }; // Bigger head + faster speed
let score = 0;
let gameOver = false;

const headImage = new Image();
headImage.src = "head.png"; // Replace with an actual image of a head

const gameOverScreen = document.getElementById("gameOverScreen");
const finalScore = document.getElementById("finalScore");

document.addEventListener("keydown", moveBasket);

function moveBasket(e) {
    if (!gameOver) {
        if (e.key === "ArrowLeft" && basket.x > 0) basket.x -= 30;
        if (e.key === "ArrowRight" && basket.x < canvas.width - basket.width) basket.x += 30;
    }
}

function stopGame() {
    gameOver = true;
    finalScore.innerText = score;
    gameOverScreen.style.display = "block"; // Show Game Over Screen
}

function restartGame() {
    gameOver = false;
    score = 0;
    ball.y = 0;
    ball.x = Math.random() * 340;
    ball.speed = 2.5; // Reset speed
    basket.x = 160;
    gameOverScreen.style.display = "none";
    gameLoop(); // Restart the game
}

function update() {
    if (gameOver) return;

    ball.y += ball.speed;

    // Increase speed as score gets higher
    if (score > 5) ball.speed = 3;
    if (score > 10) ball.speed = 3.5;
    if (score > 15) ball.speed = 4;
    if (score > 20) ball.speed = 4.5; // Max speed increase

    if (ball.y > canvas.height) {
        stopGame(); // Stop game when the player misses
    }

    if (ball.y + ball.height >= basket.y &&
        ball.x > basket.x && ball.x < basket.x + basket.width) {
        score++;
        ball.y = 0;
        ball.x = Math.random() * 340;
    }
}

function draw() {
    if (gameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.drawImage(headImage, ball.x, ball.y, ball.width, ball.height);

    ctx.fillStyle = "black";
    ctx.fillRect(basket.x, basket.y, basket.width, basket.height);

    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 10, 20);
}

function gameLoop() {
    update();
    draw();
    if (!gameOver) {
        requestAnimationFrame(gameLoop);
    }
}

gameLoop();
