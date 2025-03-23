const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const gameContainer = document.querySelector(".game-container");
const controls = document.querySelector(".controls"); // Mobile controls
const leftBtn = document.getElementById("leftBtn");
const rightBtn = document.getElementById("rightBtn");

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

    // Ensure basket is always at the bottom after resizing
    basket.y = canvas.height - 50; 
    basket.x = canvas.width / 2 - basket.width / 2;
}


// Call adjustScreen on page load
window.addEventListener("load", adjustScreen);
window.addEventListener("resize", adjustScreen); // Adjust when resizing

// Game Variables
let basket = { x: canvas.width / 2 - 45, y: canvas.height - 50, width: 90, height: 15 };
let ball = { x: Math.random() * (canvas.width - 60), y: 0, width: 60, height: 60, speed: 2.5 };
let score = 0;
let gameOver = false;

const headImage = new Image();
headImage.src = "head.png"; // Replace with actual image

const gameOverScreen = document.getElementById("gameOverScreen");
const finalScore = document.getElementById("finalScore");

// Movement Controls
let moveLeft = false;
let moveRight = false;

// Keyboard movement
document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") moveLeft = true;
    if (e.key === "ArrowRight") moveRight = true;
});
document.addEventListener("keyup", (e) => {
    if (e.key === "ArrowLeft") moveLeft = false;
    if (e.key === "ArrowRight") moveRight = false;
});

// Mobile Button movement (Improved)
leftBtn.addEventListener("touchstart", (e) => {
    e.preventDefault();
    moveLeft = true;
});
rightBtn.addEventListener("touchstart", (e) => {
    e.preventDefault();
    moveRight = true;
});
leftBtn.addEventListener("touchend", () => (moveLeft = false));
rightBtn.addEventListener("touchend", () => (moveRight = false));

function moveBasket() {
    if (!gameOver) {
        if (moveLeft && basket.x > 0) basket.x -= 6;
        if (moveRight && basket.x < canvas.width - basket.width) basket.x += 6;
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
    basket.x = canvas.width / 2 - basket.width / 2;
    gameOverScreen.style.display = "none";
    gameLoop();
}

function update() {
    if (gameOver) return;

    moveBasket(); // Smooth movement

    ball.y += ball.speed;

    // Increase speed as score increases
    if (score > 5) ball.speed = 3;
    if (score > 10) ball.speed = 3.5;
    if (score > 15) ball.speed = 4;
    if (score > 20) ball.speed = 4.5;
    if (score > 30) ball.speed = 5;

    // If ball falls without being caught
    if (ball.y > canvas.height) {
        stopGame();
    }

    // Ball caught by basket
    if (
        ball.y + ball.height >= basket.y &&
        ball.x > basket.x &&
        ball.x < basket.x + basket.width
    ) {
        score++;
        ball.y = 0;
        ball.x = Math.random() * (canvas.width - 60);
    }
}

function draw() {
    if (gameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(headImage, ball.x, ball.y, ball.width, ball.height);

    // Draw basket
    ctx.fillStyle = "black";
    ctx.fillRect(basket.x, basket.y, basket.width, basket.height);

    // Draw score
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
