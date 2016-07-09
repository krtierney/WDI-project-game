var canvas = document.getElementById('fox-game');
var ctx = canvas.getContext('2d');
window.onload = draw;


var foxImage = new Image();
foxImage.src = "assets/fox-night.png";

var rightArrowPress = false;
var leftArrowPress = false;
var upArrowPress = false;
var downArrowPress = false;

var screenCount = 0;

var fox = {
    x: 0,
    y: 300,
    vx: 1, //reset to .5 after testing
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
  status: true,
  draw: function() {
    if (status === false) {
    console.log('status is false')
    } else {
      ctx.fillRect (this.x,this.y,25,25);
    }
  }
};

//Draw a streetlamp constructor
function StreetLamp(x, y, vx) {
  this.x = x; //448
  this.y = y; //196;
  this.vx = vx //.5;
  this.vy = 0;
}

StreetLamp.prototype.draw = function() {
  ctx.beginPath();
  ctx.rect (this.x-30,this.y+54,10,140);
  ctx.lineTo (this.x-48,this.y+14);
  ctx.lineTo (this.x-24,this.y-10);
  ctx.lineTo (this.x,this.y+14);
  ctx.lineTo (this.x-20, this.y+54); 
  ctx.fillStyle = "black";
  ctx.fill(); 
  ctx.beginPath();  
  ctx.moveTo (this.x-26,this.y+44);
  ctx.lineTo (this.x-22,this.y);
  ctx.lineTo (this.x-44,this.y+15);
  ctx.lineTo (this.x-29,this.y+46);  
  ctx.lineTo (this.x-26,this.y+44);  
  ctx.moveTo (this.x-23,this.y+44);
  ctx.lineTo (this.x-20,this.y+2);
  ctx.lineTo (this.x-4,this.y+14);
  ctx.lineTo (this.x-20,this.y+46);  
  ctx.lineTo (this.x-23,this.y+44);  
  ctx.fillStyle = "yellow"; 
  ctx.fill(); 
  ctx.fillStyle = "rgba(255,255,0,.1)";
  ctx.beginPath(); 
  ctx.arc (this.x-26,this.y+34, 70, 0, 2 * Math.PI, false);
  ctx.fill();
}

var newLamp = new StreetLamp(448, 196, .5);

//Alert box for dialogue
// var interactionAlert = {
//   x: 150,
//   y: 50,
//   display: function(fillText) {
//     ctx.fillStyle = 'rgba(255,255,255,.8)';
//     ctx.textAlign = 'center';
//     ctx.font = '20px Arial';
//     ctx.fillText (fillText, 400, 150);
//     ctx.fillRect (this.x, this.y, 500, 150);
//   }
// }

//Dialogue box constructor
function DialogueBox(x, y) {
  this.x = x;
  this.y = y;
}

  DialogueBox.prototype.display = function(textToDisplay) {
    ctx.fillStyle = 'rgba(255,255,255,.8)';
    ctx.textAlign = 'center';
    ctx.font = '20px Arial';
    ctx.fillText (textToDisplay, 400, 150);
    ctx.fillRect (this.x, this.y, 500, 150);
  }

var first = new DialogueBox(150,150);


//Main animation function
function draw() {
  ctx.clearRect(0,0, canvas.width, canvas.height);

  //use screenCount to track how far the fox has gone and control when obstacles are presented
  if (screenCount <= 0) {
    meetAnObstacle(rectangle);
  };
  newLamp.draw();
  fox.draw();
  keyPadControls();
  window.requestAnimationFrame(draw); 

}

function keyPadControls() {
  if (rightArrowPress) {
    fox.x += fox.vx;
    newLamp.x -= newLamp.vx;
  } else if (leftArrowPress) {
    fox.x -= fox.vx;
    newLamp.x += newLamp.vx;
  };

  if (downArrowPress && fox.y<300) {
    fox.y += fox.vy;
  } else if (upArrowPress) {
    fox.y -= fox.vy;
  };

  if (fox.x > canvas.width) {
    fox.x = 0;
//Edit this line to fine-tune timing of lamp placement
    newLamp.x = newLamp.x+.5*canvas.width;
    screenCount++;
  };

  if (newLamp.x < -20) {
    newLamp.x = 805;
  };
}

//Logic for creating obstacles, including collision detection conditions
function meetAnObstacle(obstacle) {
  if (obstacle.status === true) {
    obstacle.draw();
  }
  var ox = obstacle.x += obstacle.vx;
  var oy = obstacle.y += obstacle.vy;
  var fx = fox.x;
  var fy = fox.y+85;
  if (((fx+110) >= ox) && ((fx-11) <= ox) && (fy >= oy)) {
    first.display("Hello world!");
    obstacle.vx = 0;
  };
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

