var canvas = document.getElementById('fox-game');
var ctx = canvas.getContext('2d');
window.onload = draw;


var foxImage = new Image();
foxImage.src = "assets/fox-night.png";

var rightArrowPress = false;
var leftArrowPress = false;
var upArrowPress = false;
var downArrowPress = false;

var fox = {
    x: 0,
    y: 300,
    vx: .5,
    vy: 1,
    draw: function() {
      ctx.drawImage(foxImage, this.x, this.y, 160, 100);
    }
};

var rectangle = {
  x: 800,
  y: 360,
  vx: -1,
  vy: 0,
  create: function() {
    ctx.fillRect (this.x,this.y,25,25);
  }
};

//Draw a streetlamp
var streetLamp = {
  x: 448,
  y: 196,
  vx: .5,
  vy: 0,
  draw: function() {
    ctx.beginPath();
    ctx.rect (this.x-30,this.y+54,10,140);
    ctx.lineTo (this.x-48,this.y+14);
    ctx.lineTo (this.x-24,this.y-10);
    ctx.lineTo (this.x,this.y+14);
    ctx.lineTo (this.x-20, this.y+54); 
    ctx.strokeStyle = "black";
    ctx.lineWidth = 5.0;
    ctx.fillStyle = "black";
    ctx.fill(); 
    ctx.beginPath();  
    ctx.fillStyle = "yellow";
    ctx.moveTo (this.x-26,this.y+44);
    ctx.lineTo (this.x-22,this.y);
    ctx.lineTo (this.x-44,this.y+15);
    ctx.lineTo (this.x-29,this.y+46);  
    ctx.lineTo (this.x-26,this.y+44);  
    ctx.fill();   
    ctx.fillStyle = "yellow";
    ctx.moveTo (this.x-23,this.y+44);
    ctx.lineTo (this.x-20,this.y+2);
    ctx.lineTo (this.x-4,this.y+14);
    ctx.lineTo (this.x-20,this.y+46);  
    ctx.lineTo (this.x-23,this.y+44);   
    ctx.fill(); 
    ctx.fillStyle = "rgba(255,255,0,.1)";
    ctx.beginPath(); 
    ctx.arc (this.x-26,this.y+34, 70, 0, 2 * Math.PI, false); 
    ctx.fill();
  }
};

var interactionAlert = {
  x: 150,
  y: 50,
  display: function(fillText) {
    ctx.fillStyle = 'rgba(255,255,255,.8)';
    ctx.textAlign = 'center';
    ctx.font = '20px Arial';
    ctx.fillText (fillText, 400, 150);
    ctx.fillRect (this.x, this.y, 500, 150);
  }

}


function draw() {
  ctx.clearRect(0,0, canvas.width, canvas.height);
  fox.draw();
  rectangle.create();
  streetLamp.draw();
  collisionDetection();
  rectangle.x += rectangle.vx;
  rectangle.y += rectangle.vy;
  if (rightArrowPress) {
    fox.x += fox.vx;
    streetLamp.x -= streetLamp.vx;
  } else if (leftArrowPress) {
    fox.x -= fox.vx;
    streetLamp.x += streetLamp.vx;
  };

  if (downArrowPress && fox.y<300) {
    fox.y += fox.vy;
  } else if (upArrowPress) {
    fox.y -= fox.vy;
  };

  if (fox.x > canvas.width) {
    fox.x = 0;
  };
  window.requestAnimationFrame(draw); 

}

function collisionDetection() {
  var rx = rectangle.x;
  var ry = rectangle.y;
  var fx = fox.x+110;
  var fy = fox.y+85;
  if (fx >= rx && fy >= ry) {
    interactionAlert.display("Hello world!");
    rectangle.vx = 0;
  }
}


function interactWithSomething() {
  if (aKeyPress) {
    //do something;
  } else if (fKeyPress) {
    //ignore something;
  };
}


document.addEventListener("keydown", keyDown, false);
document.addEventListener("keyup", keyUp, false);


function keyDown(e) {
  if(e.keyCode === 39) {
    rightArrowPress = true;
  } else if(e.keyCode === 37) {
    leftArrowPress = true;
  } else if (e.keyCode === 38) {
    upArrowPress = true;
  } else if (e.keyCode === 40) {
    downArrowPress = true;
  } else if (e.keyCode === 65) {
    aKeyPress = true;
  } else if (e.keyCode === 70) {
    fKeyPress = true;
  } 
}

function keyUp(e) {
  if(e.keyCode === 39) {
    rightArrowPress = false;
  } else if(e.keyCode === 37) {
    leftArrowPress = false;
  } else if (e.keyCode === 38) {
    upArrowPress = false;
  } else if (e.keyCode === 40) {
    downArrowPress = false;
  } else if (e.keyCode === 65) {
    aKeyPress = true;
  } else if (e.keyCode === 70) {
    fKeyPress = true;
  } 
}

window.requestAnimationFrame(draw); 

