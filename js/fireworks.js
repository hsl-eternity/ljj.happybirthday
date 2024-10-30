
!(function () {
    var canvasMain = document.getElementById('fireworks');
    // document.body.appendChild(canvasMain);
    var contextMain = canvasMain.getContext('2d');

    function resizeCanvas() {
        canvasMain.width = window.innerWidth;
        canvasMain.height = window.innerHeight;

        clearCanvas();
    }

    function clearCanvas(){
        contextMain.fillStyle = 'rgba(0,0,0,0)';
        contextMain.fillRect(0,0,canvasMain.width, canvasMain.height);
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);


    function mouseDownHandler(e) {
        var x = e.clientX;
        var y = e.clientY;
        fire(x,y)
    }

    setInterval(function (){
        fire(Math.random()*canvasMain.width,Math.random()*canvasMain.height);
    },500)

    setInterval(function (){
        fire(Math.random()*canvasMain.width,Math.random()*canvasMain.height);
    },600)

    setInterval(function (){
        fire(Math.random()*canvasMain.width,Math.random()*canvasMain.height);
    },100)
    document.addEventListener('mousedown', mouseDownHandler, false);
    var rid;
    function fire(x,y){
        createFireworks(x,y);

        function tick() {
            //tips:注意新加入的这4行代码
            contextMain.globalCompositeOperation = 'destination-out';
            contextMain.fillStyle = 'rgba(0,0,0,'+10/100+')';
            contextMain.fillRect(0,0,canvasMain.width,canvasMain.height);
            contextMain.globalCompositeOperation = 'lighter';


            drawFireworks();
            rid=requestAnimationFrame(tick);
        }
        cancelAnimationFrame(rid);
        tick();
    }

    var particles=[];
    function createFireworks(sx,sy){
        // particles=[];

        var hue = Math.floor(Math.random()*51)+150;
        var hueVariance = 30;
        var count = 100;

        for(var i = 0 ;i<count;i++){
            var p = {};

            var angle = Math.floor(Math.random()*360);
            p.radians = angle * Math.PI / 180;


            p.x = sx;
            p.y = sy;

            p.speed = (Math.random()*5)+.4;
            p.radius = p.speed;

            p.size = Math.floor(Math.random()*3)+1;

            p.hue = Math.floor(Math.random()*((hue+hueVariance)-(hue-hueVariance)))+(hue-hueVariance);
            p.brightness = Math.floor(Math.random()*31)+50;
            p.alpha = (Math.floor(Math.random()*61)+40)/100;

            particles.push(p);
        }
    }

    function drawFireworks() {
        clearCanvas();

        for(var i = 0 ;i<particles.length;i++){
            var p = particles[i];

            var vx = Math.cos(p.radians) * p.radius;
            var vy = Math.sin(p.radians) * p.radius + 0.4;

            p.x += vx;
            p.y += vy;

            p.radius *= 1 - p.speed/100;

            p.alpha -= 0.005;

            if (p.alpha <= 0){
                particles.splice(i,1)
                continue;
            }

            contextMain.beginPath();
            contextMain.arc(p.x, p.y, p.size, 0, Math.PI*2, false);
            contextMain.closePath();

            contextMain.fillStyle = 'hsla('+p.hue+', 100%, '+p.brightness+'%, '+100+')';
            contextMain.fill();
        }
    }


})();