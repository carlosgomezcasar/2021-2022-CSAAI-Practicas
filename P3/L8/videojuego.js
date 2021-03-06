
// definimos canvas
const canvas = document.getElementById("canvas");

canvas.width = 518;
canvas.height = 450;

const ctx = canvas.getContext("2d");
izq = document.getElementById("izq");
der = document.getElementById("der");

// definir ladrillos
const LADRILLO = {
    F: 5,
    C: 13,
    w: 38,
    h: 20,
    padding: 2,
    visible: true,
};

const ladrillos = [];

for (let i = 0; i < LADRILLO.F; i++){
    ladrillos[i] = [];
    for (let j = 0; j < LADRILLO.C; j++){
        ladrillos[i][j] = {
            x: (LADRILLO.w + LADRILLO.padding) * j,
            y: 40 + (LADRILLO.h + LADRILLO.padding) * i,
            w: LADRILLO.w,
            h: LADRILLO.h,
            padding: LADRILLO.padding,
            visible: LADRILLO.visible
        };
    }
}

// dibujar ladrillos
function drawLadrillos() {
    for (let i = 0; i < LADRILLO.F; i++) {
        for (let j = 0; j < LADRILLO.C; j++){
            if (ladrillos[i][j].visible) {
                ctx.beginPath();
                ctx.rect(ladrillos[i][j].x, ladrillos[i][j].y, LADRILLO.w, LADRILLO.h);
                ctx.fillStyle = "purple";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

// colisión de bola con el ladrillo
function colisionLadrillo(){
    for(let i = 0; i < LADRILLO.F; i++){
        for (let j = 0; j < LADRILLO.C; j++){
            if(ladrillos[i][j].visible == true){
                if(ball.x >= ladrillos[i][j].x &&
                   ball.x <= ladrillos[i][j].x + LADRILLO.w &&
                   ball.y >= ladrillos[i][j].y &&
                   ball.y <= ladrillos[i][j].y + LADRILLO.h)
                   {
                       ball.dy = -ball.dy;
                       ladrillos[i][j].visible = false;
                       score = score + 1;
                    } 
                   
            }
        }
    }

}

let speed = 5; // velocidad bola
let vidas = 3; // vidas
let score = 0; // puntuación
let rightPressed = false;
let leftPressed = false;

document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);

// definimos la bola
let ball = {
    x: canvas.width /2,
    y: canvas.height -30,
    dx: 0,
    dy: 0,
    radius: 7,
    draw: function() {
        ctx.beginPath();
          ctx.fillStyle = "purple";
          ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
          ctx.closePath();
        ctx.fill();
    }
};

// pulsando espacio se mueve la bola
window.onkeydown = (e) => {
    if (e.keyCode == 32){
        ball.dx = speed;
        ball.dy = -speed +1
        
    } 
}

// definimos la raqueta
let raqueta = {
    width: 60,
    height: 10,
    x: canvas.width /2 - 30,
    draw: function(){
        ctx.beginPath();
        ctx.rect(this.x, canvas.height - this.height - 10, this.width, this.height);
        ctx.fillStyle = "purple";
        ctx.closePath();
        ctx.fill();
    }
};

// movimiento de la raqueta con las flechas
function keyDownHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
      rightPressed = true;
    }
    if (e.key == "Left" || e.key == "ArrowLeft") {
      leftPressed = true;
    }
}

  function keyUpHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
      rightPressed = false;
    }
    if (e.key == "Left" || e.key == "ArrowLeft") {
      leftPressed = false;
    }
}

  function moveRaqueta(){
      if(rightPressed){
          raqueta.x += 7
          //límite derecha
          if(raqueta.x + raqueta.width >= canvas.width){
              raqueta.x = canvas.width - raqueta.width;
        }
    }
      if(leftPressed){
          raqueta.x -= 7;
          //límite izquierda
          if(raqueta.x < 0){
              raqueta.x = 0;
        }
    }
}

// FUNCIÓN PRINCIPAL
function play(){
    document.getElementById("win").style.display = "none";
    document.getElementById("gameover").style.display = "none";
    document.getElementById("play").style.display = "none";


    // rebote de la bola
    if (ball.x <0 || ball.x >= canvas.width - 7) {
        ball.dx = -ball.dx;
        }
    
    if (ball.y <0) {
        ball.dy = -ball.dy;
        }

    // pérdida de vida
    if (ball.y >= canvas.height) {
        vidas = vidas -1;
        ball.x = canvas.width /2;
        ball.y = canvas.height -50;
        ball.dx = 0;
        ball.dy = 0;

    // game over
    }else if (vidas == 0){
        document.getElementById("canvas").style.display = "none";
        document.getElementById("gameover").style.display = "";
        document.getElementById("play").style.display = "";
        console.log("he perdido");

    // victoria   
    } else if (score == 65){
        ball.dx = 0;
        ball.dy = 0;
        speed = 0;
        document.getElementById("canvas").style.display = "none";
        document.getElementById("win").style.display = "block";
        document.getElementById("play").style.display = "";
        console.log("he ganado");
        }


    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = 'purple';
    ctx.font = "Arial";
    ctx.strokeText("VIDAS: " + vidas , 10, 20);

    ctx.strokeStyle = 'purple';
    ctx.font = "Arial";
    ctx.strokeText("SCORE: " + score , 450, 20);

    ball.draw();
    raqueta.draw();
    moveRaqueta();
    drawLadrillos();
    colisionLadrillo();

    ball.x += ball.dx;
    ball.y += ball.dy;

   // ángulo de colisión con la raqueta
    if (ball.x >= raqueta.x && ball.x <= raqueta.x + raqueta.width &&
        ball.y + ball.radius >= canvas.height - raqueta.height - 10) {
            let collidePoint = ball.x - (raqueta.x + raqueta.width/2);
            collidePoint = collidePoint / (raqueta.width/2);
            let angle = collidePoint * Math.PI/3;
            ball.dx = speed * Math.sin(angle);
            ball.dy = -speed * Math.cos(angle);
        }
    requestAnimationFrame(play);
}

play();