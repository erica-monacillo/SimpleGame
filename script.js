const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const gameContainer = document.querySelector(".game-container");
const controls = document.querySelector(".controls");
const leftBtn = document.getElementById("leftBtn");
const rightBtn = document.getElementById("rightBtn");

// Function to check if user is on mobile
function isMobileDevice() {
    return /Mobi|Android|iPhone/i.test(navigator.userAgent);
}

// Adjust game size for mobile
function adjustScreen() {
    if (isMobileDevice()) {
        canvas.width = window.innerWidth * 0.9;
        canvas.height = window.innerHeight * 0.7;
        controls.style.display = "flex";
    } else {
        canvas.width = 400;
        canvas.height = 500;
        controls.style.display = "none";
    }
    basket.y = canvas.height - 50;
    basket.x = canvas.width / 2 - basket.width / 2;
}

window.addEventListener("load", adjustScreen);
window.addEventListener("resize", adjustScreen);

// Game Variables
let basket = { x: canvas.width / 2 - 45, y: canvas.height - 50, width: 90, height: 15 };
let score = 0;
let gameOver = false;

const headImagesSrc = [
    "head.png", "head1.png", "head2.png", "head3.png",
    "head4.png", "head5.png", "head6.png", "head7.png",
    "head8.png", "head9.png", "head10.png", "head11.png",
    "head12.png", "head13.png"
];

// Preload images
const headImages = headImagesSrc.map((src) => {
    const img = new Image();
    img.src = src;
    return img;
});

// Single falling head
let head = {
    x: Math.random() * (canvas.width - 60),
    y: 0,
    width: 60,
    height: 60,
    speed: 2.5,
    image: headImages[Math.floor(Math.random() * headImages.length)]
};

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

// Mobile Button movement
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
    head.y = 0;
    head.x = Math.random() * (canvas.width - 60);
    head.image = headImages[Math.floor(Math.random() * headImages.length)];
    head.speed = 2.5;
    basket.x = canvas.width / 2 - basket.width / 2;
    gameOverScreen.style.display = "none";
    gameLoop();
}

function update() {
    if (gameOver) return;

    moveBasket();

    head.y += head.speed;

    // Increase speed as score increases
    if (score > 5) head.speed = 3;
    if (score > 10) head.speed = 3.5;
    if (score > 15) head.speed = 4;
    if (score > 20) head.speed = 4.5;

    // If head falls without being caught
    if (head.y > canvas.height) {
        stopGame();
    }

    // If head is caught by basket
    if (
        head.y + head.height >= basket.y &&
        head.x > basket.x &&
        head.x < basket.x + basket.width
    ) {
        score++;

        // Reset the head position and pick a new random image
        head.y = 0;
        head.x = Math.random() * (canvas.width - 60);
        head.image = headImages[Math.floor(Math.random() * headImages.length)];
    }
}

function draw() {
    if (gameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw falling head
    ctx.drawImage(head.image, head.x, head.y, head.width, head.height);

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
