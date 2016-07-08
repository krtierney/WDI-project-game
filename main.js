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

function draw() {
  ctx.clearRect(0,0, canvas.width, canvas.height);
  fox.draw();
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
  }
}


setInterval(draw, 10);

