var canvas = document.getElementById('fox-game');
var ctx = canvas.getContext('2d');


var foxImage = new Image();
foxImage.src = "fox.png";

var rightArrowPress = false;
var leftArrowPress = false;
var upArrowPress = false;
var downArrowPress = false;

var fox = {
    x: 0,
    y: 300,
    vx: 1,
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

var interactionAlert = {
  x: 150,
  y: 50,
  display: function(fillText) {
    ctx.fillStyle = 'rgba(0,0,255,.4)';
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
  collisionDetection();
  rectangle.x += rectangle.vx;
  rectangle.y += rectangle.vy;
  if (rightArrowPress) {
    fox.x += fox.vx;
  } else if (leftArrowPress) {
    fox.x -= fox.vx;
  };

  if (upArrowPress) {
    fox.y += fox.vy;
  } else if (downArrowPress) {
    fox.y -= fox.vy;
  };

  if (fox.x > canvas.width) {
    fox.x = 0;
  };


}

function collisionDetection() {
  var r = rectangle.x;
  var f = fox.x+110;
  if (f >= r) {
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
  } else if (e.keyCode === 40) {
    upArrowPress = true;
  } else if (e.keyCode === 38) {
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
  } else if (e.keyCode === 40) {
    upArrowPress = false;
  } else if (e.keyCode === 38) {
    downArrowPress = false;
  } else if (e.keyCode === 65) {
    aKeyPress = true;
  } else if (e.keyCode === 70) {
    fKeyPress = true;
  } 
}


setInterval(draw, 10);

