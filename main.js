const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 600;

let keys = {};
let mouse = {
    x: 0,
    y: 0,
    isDown: false,
    startX: 0,
    startY: 0
};
let player = {
    x: canvas.width / 2,
    y: canvas.height - 50,
    width: 50,
    height: 50,
    speed: 5,
    img: new Image()
};
player.img.src = 'https://i.imgur.com/nAfb4VE.png';

let arrows = [];
const arrowImgSrc = 'https://i.imgur.com/YPSISPf.png';

// Arrow Class
class Arrow {
    constructor(x, y, angle, power) {
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.power = power;
        this.speed = 10 * power;
        this.vx = this.speed * Math.cos(this.angle);
        this.vy = this.speed * Math.sin(this.angle);
        this.img = new Image();
        this.img.src = arrowImgSrc;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.drawImage(this.img, -this.img.width / 2, -this.img.height / 2);
        ctx.restore();
    }
}

function drawPlayer() {
    ctx.drawImage(player.img, player.x - player.width / 2, player.y - player.height / 2, player.width, player.height);
}

function drawAimLine() {
    if (mouse.isDown) {
        ctx.beginPath();
        ctx.moveTo(player.x, player.y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.stroke();
    }
}

function update() {
    if (keys['ArrowLeft'] && player.x > player.width / 2) {
        player.x -= player.speed;
    }
    if (keys['ArrowRight'] && player.x < canvas.width - player.width / 2) {
        player.x += player.speed;
    }

    arrows.forEach((arrow, index) => {
        arrow.update();
        if (arrow.x < 0 || arrow.x > canvas.width || arrow.y < 0 || arrow.y > canvas.height) {
            arrows.splice(index, 1);
        }
    });
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer();
    drawAimLine();
    arrows.forEach(arrow => arrow.draw());
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Input Handling
window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});

window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

canvas.addEventListener('mousedown', (e) => {
    mouse.isDown = true;
    mouse.startX = e.offsetX;
    mouse.startY = e.offsetY;
});

canvas.addEventListener('mouseup', (e) => {
    mouse.isDown = false;
    let dx = e.offsetX - player.x;
    let dy = e.offsetY - player.y;
    let angle = Math.atan2(dy, dx);
    let distance = Math.sqrt(dx * dx + dy * dy);
    let power = Math.min(distance / 100, 1);
    arrows.push(new Arrow(player.x, player.y, angle, power));
});

canvas.addEventListener('mousemove', (e) => {
    mouse.x = e.offsetX;
    mouse.y = e.offsetY;
});

// Start the game loop
gameLoop();
