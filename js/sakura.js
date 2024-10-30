// 樱花开花效果相关代码
var canvas = document.getElementById('c');

var context = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    clearCanvas();
}

function clearCanvas() {
    context.fillStyle = '#f0e6f6';
    context.fillRect(0, 0, canvas.width, canvas.height);
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function bloom() {
    createSakuraBloom(window.innerWidth / 2, window.innerHeight / 2);

    function tick() {
        // 注意新加入的这4行代码
        context.globalCompositeOperation = 'destination-out';
        context.fillStyle = 'rgba(240, 230, 246, ' + 10 / 100 + ')';
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.globalCompositeOperation = 'lighter';

        drawSakuraBloom();
        rid = requestAnimationFrame(tick);
    }
    cancelAnimationFrame(rid);
    tick();
}

var petals = [];

function createSakuraBloom(sx, sy) {
    var hue = 330; // 樱花花瓣的颜色
    var hueVariance = 10;
    var count = 100;

    for (var i = 0; i < count; i++) {
        var p = {};

        var angle = Math.floor(Math.random() * 360);
        p.radians = angle * Math.PI / 180;

        p.x = sx;
        p.y = sy;

        p.speed = (Math.random() * 2) + .2;
        p.radius = p.speed;

        p.size = Math.floor(Math.random() * 3) + 1;

        p.hue = Math.floor(Math.random() * ((hue + hueVariance) - (hue - hueVariance))) + (hue - hueVariance);
        p.brightness = Math.floor(Math.random() * 31) + 50;
        p.alpha = (Math.floor(Math.random() * 61) + 40) / 100;

        petals.push(p);
    }
}

function drawSakuraBloom() {
    clearCanvas();

    for (var i = 0; i < petals.length; i++) {
        var p = petals[i];

        var vx = Math.cos(p.radians) * p.radius;
        var vy = Math.sin(p.radians) * p.radius + 0.2;

        p.x += vx;
        p.y += vy;

        p.radius *= 1 - p.speed / 100;

        p.alpha -= 0.005;

        if (p.alpha <= 0) {
            petals.splice(i, 1);
            continue;
        }

        context.beginPath();
        context.arc(p.x, p.y, p.size, 0, Math.PI * 2, false);
        context.closePath();

        context.fillStyle = 'hsla(' + p.hue + ', 100%, ' + p.brightness + '%, ' + p.alpha + ')';
        context.fill();
    }
}