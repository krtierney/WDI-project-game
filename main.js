var canvas = document.getElementById('fox-game');
var ctx = canvas.getContext('2d');
window.onload = draw;

canvas.width = 1600;
canvas.height = 800;
canvas.style.width = "800px";
canvas.style.height = "400px";

var rightArrowPress = false;
var leftArrowPress = false;
var upArrowPress = false;
var downArrowPress = false;
var spaceBarPress = false;

var screenCount = 0;
var playerScore = 100;

var collided = false;


//Sprites and image assets defined here

var foxImage = new Image();
foxImage.src = "assets/fox-night.png";

var fox = {
    x: 0,
    y: 600,
    vx: 10, //reset to .5 after testing
    vy: 2,
    draw: function() {
      ctx.drawImage(foxImage, this.x, this.y, 320, 200);
    }
};

var rectangle = {
 x: 1600,
 y: 720,
 vx: -2,
 vy: 0,
 draw: function() {
   ctx.fillRect (this.x,this.y,50,50);
 }
};

//new obstacle constructor
function Obstacle(x, y, vx, vy) {
  this.x = x;
  this.y = y;
  this.vx = vx;
  this.vy = vy;
}

Obstacle.prototype.draw = function(image) {
  ctx.drawImage(image, this.x, this.y);
}

var catImage = new Image();              
catImage.src = "assets/cat.png"; 
var cat = new Obstacle(1260, 600, 0, 0);

var mouseChatImage = new Image();              
mouseChatImage.src = "assets/mouse-chat.png";  
var mouseChat = new Obstacle(1320,750,-2,0)

var mouseImage = new Image();              
mouseImage.src = "assets/mouse.png";  
var mouse = new Obstacle(1600,700,-2, 0)

var dogImage = new Image();              
dogImage.src = "assets/dog.png";  
var dog = new Obstacle(1200,500,-1,0)

var owlFlyingImage = new Image();              
owlFlyingImage.src = "assets/owl-flying.png";  
var owlFlying = new Obstacle(0,0,3,.5)

var owlImage = new Image();              
owlImage.src = "assets/owl.png";  
var owl = new Obstacle(1100,420,.1,0)

var puddleImage = new Image();              
puddleImage.src = "assets/puddle.png";  
var puddle = new Obstacle(1340,720,.1,0)

var trashImage = new Image();              
trashImage.src = "assets/trash.png";  
var trash = new Obstacle(1280,660,.5,0)

var shardsImage = new Image();              
shardsImage.src = "assets/shards.png";  
var shards = new Obstacle(1200,700,.5,0)


//Draw a streetlamp constructor
function StreetLamp(x, y, vx) {
  this.x = x; //448*2
  this.y = y; //196;*2
  this.vx = vx; //.5;*2
  this.vy = 0;
}

StreetLamp.prototype.draw = function() {
  ctx.beginPath();
  ctx.rect (this.x-60,this.y+100,20,400);
  ctx.lineTo (this.x-96,this.y+28);
  ctx.lineTo (this.x-48,this.y-10);
  ctx.lineTo (this.x,this.y+28);
  ctx.lineTo (this.x-40, this.y+108); 
  ctx.fillStyle = "black";
  ctx.fill(); 
  ctx.beginPath();  
  ctx.moveTo (this.x-52,this.y+88);
  ctx.lineTo (this.x-44,this.y);
  ctx.lineTo (this.x-88,this.y+30);
  ctx.lineTo (this.x-58,this.y+92);  
  ctx.lineTo (this.x-52,this.y+88);  
  ctx.moveTo (this.x-46,this.y+88);
  ctx.lineTo (this.x-40,this.y+4);
  ctx.lineTo (this.x-8,this.y+28);
  ctx.lineTo (this.x-40,this.y+92);  
  ctx.lineTo (this.x-46,this.y+88);  
  ctx.fillStyle = "yellow"; 
  ctx.fill(); 
  ctx.fillStyle = "rgba(255,255,0,.1)";
  ctx.beginPath(); 
  ctx.arc (this.x-52,this.y+68, 140, 0, 2 * Math.PI, false);
  ctx.fill();
}

var newLamp = new StreetLamp(1096, 197, 1);



//Dialogue box constructor
function DialogueBox(x, y, w, h) {
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h
}

DialogueBox.prototype.display = function(textToDisplay) {
  ctx.fillStyle = 'rgba(255,255,255,1)';
  ctx.fillRect (this.x, this.y, this.w, this.h);
  ctx.textAlign = 'center';
  ctx.font = '30px Arial';
  ctx.fillStyle = 'black';
  ctx.fillText (textToDisplay, this.x+500, this.y+60);

}

var first = new DialogueBox(300,100,1000,100);




//Logic for creating obstacles, including collision detection conditions
function meetAnObstacle(obstacle, image) {
  obstacle.draw(image);
}

function collisionCheck(obstacle) {
    var ox = obstacle.x += obstacle.vx;
    var oy = obstacle.y += obstacle.vy;
    var fx = fox.x;
    var fy = fox.y+170;
    if (((fx+220) >= ox) && ((fx-22) <= ox) && (fy >= oy)) {
      obstacle.vx = 0;
      collided = true;
    };
  }

function staticCollision(obstacle) {
  if (rightArrowPress) {
    var ox = obstacle.x -= obstacle.vx;
    var fx = fox.x;
    var fy = fox.y+170;
    if (((fx+220) >= ox) && ((fx-22) <= ox)) {
      collided = true;
    };
  }
}


// function interactWithSomething() {
//   if (aKeyPress) {
//     first.display("wise choice.");
//   } else if (fKeyPress) {
//     ctx.clearRect(0,0, canvas.width, canvas.height);
//     };
// }




//Main animation function
function draw() {
  ctx.clearRect(0,0, canvas.width, canvas.height);

//Starting screen
  if (screenCount === 0 && fox.x>900) {
    ctx.clearRect(0,0, canvas.width, canvas.height);
    first.display("Where are you off to in such a hurry?");
  } else if (screenCount === 0 && fox.x<800 && fox.x>500) {
      ctx.clearRect(0,0, canvas.width, canvas.height);
      first.display("Use the arrow keys to move.");
  } else if (screenCount === 0 && fox.x<200 && fox.x>100) {
      first.display("Good evening, Fox");
   }


  newLamp.draw();
  
  if (screenCount === 1) {
    meetAnObstacle(mouse,mouseImage);
    collisionCheck(mouse);
    if (collided === true) {
        first.display("You've found a mouse. Are you feeling hungry? Y/N");
        // if (nKeyPress) {
        //   first.display("That's a relief!");
        // } else if (yKeyPress) {
        //   first.display("Oh dear. Are you going to eat this mouse? Y/N");
        //     if (nKeyPress) {
        //      first.display("That's a relief!");
        //     } else {
        //       first.display("You're slightly less hungry. Move on now.");
        //       playerScore = playerScore - 5;
        //     }
        // }
    }
  }
  
  if (screenCount === 2 || screenCount === 4) {
    //owl flies wrong direction: fix
    meetAnObstacle(owlFlying,owlFlyingImage);
    owlFlying.x += owlFlying.vx;
    owlFlying.y += owlFlying.vy;
  };

  
  if (screenCount === 3) {
    meetAnObstacle(trash,trashImage);
    fixedObstacleShift(trash);
    staticCollision(trash);
    if (collided === true) {
      first.display("Looks like a nice pile of rubbish! Smell tasty? Y/N");
    }
  };

  
  if (screenCount === 5) {
    meetAnObstacle(puddle,puddleImage);
    fixedObstacleShift(puddle);
    staticCollision(puddle);
    if (collided === true) {
      first.display("*sniff* Smells like another fox. Look for him? Y/N");
    }
  };

  
  if (screenCount === 7) {
    meetAnObstacle(owl,owlImage);
    fixedObstacleShift(owl);
    staticCollision(owl);
    if (collided === true) {
      first.display("'Hello there, Fox. I've been following you.'");
    }
  };

  
  if (screenCount === 9) {
    meetAnObstacle(dog,dogImage);
    collisionCheck(dog);
    if (collided === true) {
      first.display("'Grrr! Arf!'");
    };
  }

  
  if (screenCount === 10) {
    meetAnObstacle(cat,catImage);
    staticCollision(cat);
    if (collided === true) {
      first.display("Cat: Friend or Food? Y for friend, N for food.")
    }
  };


  
  if (screenCount === 11) {
    meetAnObstacle(shards,shardsImage);
    fixedObstacleShift(shards);
    staticCollision(shards);
    if (collided === true) {    
      // fox.vx = .1;
    };
  }

  
  if (screenCount === 13) {
    meetAnObstacle(rectangle);
  };


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
  if (downArrowPress && fox.y<600) {
    fox.y += fox.vy;
  } else if (upArrowPress && fox.y>520) {
    fox.y -= fox.vy;
  };
  if (fox.x > canvas.width) {
    fox.x = 0;
//Edit this line to fine-tune timing of lamp placement
    newLamp.x = newLamp.x+.5*canvas.width;
    screenCount++;
  };

  if (newLamp.x < -40) {
    newLamp.x = 1610;
  };
}

function fixedObstacleShift(obstacle) {
  if (rightArrowPress) {
    fox.x += fox.vx;
    obstacle.x -= obstacle.vx;
  } else if (leftArrowPress) {
    fox.x -= fox.vx;
    obstacle.x += obstacle.vx;
  };  
}

document.addEventListener("keydown", keyDown, false);
document.addEventListener("keyup", keyUp, false);


function keyDown(e) {
  var code = e.keyCode;
  switch (code) {
    case 32: spaceBarPress = true;
      break;
    case 37: leftArrowPress = true; 
      break;
    case 38: upArrowPress = true;
      break;
    case 39: rightArrowPress = true;
      break;
    case 40: downArrowPress = true;
      break;
  }
}

function keyUp(e) {
  var code = e.keyCode;
  switch (code) {
    case 32: spaceBarPress = false;
      break;
    case 37: leftArrowPress = false; 
      break;
    case 38: upArrowPress = false;
      break;
    case 39: rightArrowPress = false;
      break;
    case 40: downArrowPress = false;
      break;
  }
}

window.requestAnimationFrame(draw);

