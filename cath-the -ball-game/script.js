const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 500;

let basket = { x: 170, y: 450, width: 60, height: 10 };
let ball = { x: Math.random() * 400, y: 0, radius: 10, speed: 2 };
let score = 0;

document.addEventListener("keydown", moveBasket);

function moveBasket(e) {
    if (e.key === "ArrowLeft" && basket.x > 0) basket.x -= 30;
    if (e.key === "ArrowRight" && basket.x < canvas.width - basket.width) basket.x += 30;
}

function update() {
    ball.y += ball.speed;
    if (ball.y > canvas.height) {
        ball.y = 0;
        ball.x = Math.random() * 400;
    }

    if (ball.y + ball.radius >= basket.y &&
        ball.x > basket.x && ball.x < basket.x + basket.width) {
        score++;
        ball.y = 0;
        ball.x = Math.random() * 400;
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "black";
    ctx.fillRect(basket.x, basket.y, basket.width, basket.height);

    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 10, 20);
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();
