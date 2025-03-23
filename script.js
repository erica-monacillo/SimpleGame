const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const gameContainer = document.querySelector(".game-container");
const controls = document.querySelector(".controls"); // Mobile controls

// Function to check if user is on mobile
function isMobileDevice() {
    return /Mobi|Android|iPhone/i.test(navigator.userAgent);
}

// Adjust game size for mobile
function adjustScreen() {
    if (isMobileDevice()) {
        canvas.width = window.innerWidth * 0.9; // 90% of screen width
        canvas.height = window.innerHeight * 0.7; // 70% of screen height
        controls.style.display = "flex"; // Show mobile buttons
    } else {
        canvas.width = 400; // Default for desktop
        canvas.height = 500;
        controls.style.display = "none"; // Hide mobile buttons
    }
}

// Call adjustScreen on page load
window.addEventListener("load", adjustScreen);
window.addEventListener("resize", adjustScreen); // Adjust when resizing

let basket = { x: canvas.width / 2 - 45, y: canvas.height - 50, width: 90, height: 15 };
let ball = { x: Math.random() * (canvas.width - 60), y: 0, width: 60, height: 60, speed: 2.5 };
let score = 0;
let gameOver = false;

const headImage = new Image();
headImage.src = "head.png"; // Replace with actual image

const gameOverScreen = document.getElementById("gameOverScreen");
const finalScore = document.getElementById("finalScore");

// Get buttons for mobile
const leftBtn = document.getElementById("leftBtn");
const rightBtn = document.getElementById("rightBtn");

// Keyboard movement
document.addEventListener("keydown", moveBasket);

// Touch button movement
leftBtn.addEventListener("touchstart", () => moveBasket({ key: "ArrowLeft" }));
rightBtn.addEventListener("touchstart", () => moveBasket({ key: "ArrowRight" }));

function moveBasket(e) {
    if (!gameOver) {
        if (e.key === "ArrowLeft" && basket.x > 0) basket.x -= 30;
        if (e.key === "ArrowRight" && basket.x < canvas.width - basket.width) basket.x += 30;
    }
}

function stopGame() {
    gameOver = true;
    finalScore.innerText = score;
    gameOverScreen.style.display = "block";
}

function restartGame() {
    gameOver = false;
    score = 0;
    ball.y = 0;
    ball.x = Math.random() * (canvas.width - 60);
    ball.speed = 2.5;
    basket.x = canvas.width / 2 - 45;
    gameOverScreen.style.display = "none";
    gameLoop();
}

function update() {
    if (gameOver) return;

    ball.y += ball.speed;

    if (score > 5) ball.speed = 3;
    if (score > 10) ball.speed = 3.5;
    if (score > 15) ball.speed = 4;
    if (score > 20) ball.speed = 4.5;

    if (ball.y > canvas.height) {
        stopGame();
    }

    if (ball.y + ball.height >= basket.y &&
        ball.x > basket.x && ball.x < basket.x + basket.width) {
        score++;
        ball.y = 0;
        ball.x = Math.random() * (canvas.width - 60);
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
