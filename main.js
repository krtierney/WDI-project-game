var canvas = document.getElementById('fox-game');
var ctx = canvas.getContext('2d');
window.onload = draw;
// if (window.devicePixelRatio === 2) {
  canvas.width = 1600;
  canvas.height = 800;
// } else {
//   canvas.width = 800;
//   canvas.height = 400;
// }

canvas.style.width = '800px';
canvas.style.height = '400px';

var rightArrowPress = false;
var leftArrowPress = false;
var upArrowPress = false;
var downArrowPress = false;
var spaceBarPress = false;

var screenCount = 0;
var playerScore = 100;

var collided = false;


//------Sprites and image assets defined here------//
var foxImage = new Image();
foxImage.src = 'assets/fox-night.png';
var fox = {
    x: 0,
    y: 600,
    vx: 2, //reset to .5 after testing
    vy: 2,
    draw: function() {
      ctx.drawImage(foxImage, this.x, this.y, 320, 200);
    }
};

// var rectangle = {
//  x: 1600,
//  y: 720,
//  vx: -2,
//  vy: 0,
//  draw: function() {
//    ctx.fillRect (this.x,this.y,50,50);
//  }
// };

//-------Construct sprites----------//
function Sprite(x, y, vx, vy) {
  this.x = x;
  this.y = y;
  this.vx = vx;
  this.vy = vy;
}

Sprite.prototype.draw = function(image) {
  ctx.drawImage(image, this.x, this.y);
}

var catImage = new Image();              
catImage.src = 'assets/cat.png'; 
var cat = new Sprite(1260, 600, 0, 0);

// var mouseChatImage = new Image();              
// mouseChatImage.src = 'assets/mouse-chat.png';  
// var mouseChat = new Sprite(1320,750,-2,0)

var mouseImage = new Image();              
mouseImage.src = 'assets/mouse.png';  
var mouse = new Sprite(1600,750,-2, 0);

var dogImage = new Image();              
dogImage.src = 'assets/dog.png';  
var dog = new Sprite(1200,500,-1,0);

var owlFlyingImage = new Image();              
owlFlyingImage.src = 'assets/owl-flying.png';  
var owlFlying = new Sprite(0,0,3,.5);

var owlImage = new Image();              
owlImage.src = 'assets/owl.png';  
var owl = new Sprite(1100,420,.1,0);

var puddleImage = new Image();              
puddleImage.src = 'assets/puddle.png';  
var puddle = new Sprite(1340,720,.1,0);

var trashImage = new Image();              
trashImage.src = 'assets/trash.png';  
var trash = new Sprite(1280,660,.5,0);

var shardsImage = new Image();              
shardsImage.src = 'assets/shards.png';  
var shards = new Sprite(1200,700,.5,0);

var houseImage = new Image();
houseImage.src = 'assets/house.png';
var house = new Sprite(1100,100,0,0);

var foodImage = new Image();
foodImage.src = 'assets/food.png';
var food = new Sprite(1000,700,0,0);

var fireworkspImage = new Image();
fireworkspImage.src = 'assets/fireworksp.png';
var fireworksp = new Sprite(50,150,0,0);

var fireworksImage = new Image();
fireworksImage.src = 'assets/fireworks.png';
var fireworks = new Sprite(800,75,0,0);



//-------Construct a streetlamp---------//
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
  ctx.fillStyle = 'black';
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
  ctx.fillStyle = 'yellow'; 
  ctx.fill(); 
  ctx.fillStyle = 'rgba(255,255,0,.1)';
  ctx.beginPath(); 
  ctx.arc (this.x-52,this.y+68, 140, 0, 2 * Math.PI, false);
  ctx.fill();
}

var lamp = new StreetLamp(1096, 197, 1);



//-------Dialogue box constructor-------//
function DialogueBox(x, y, w, h) {
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h
}

DialogueBox.prototype.display = function(textToDisplay,xOff,yOff) {
  ctx.fillStyle = 'rgba(255,255,255,1)';
  ctx.fillRect (this.x, this.y, this.w, this.h);
  ctx.textAlign = 'center';
  ctx.font = '30px Arial';
  ctx.fillStyle = 'black';
  ctx.fillText (textToDisplay, this.x+xOff, this.y+yOff);
}





function draw() {
  ctx.clearRect(0,0, canvas.width, canvas.height);
  fox.draw();
  document.addEventListener('keydown', keyDown, false);
  document.addEventListener('keyup', keyUp, false);
  keyPadControls();






  //Starting screen
  if (screenCount === 0) {
    var openingBox = new DialogueBox(400,50,800,100);
    if (screenCount === 0 && fox.x<1600 && fox.x>700) {
      ctx.clearRect(0,0, canvas.width, canvas.height);
      openingBox.display('Where are you off to?',400,65);
    } else if (screenCount === 0 && fox.x<700 && fox.x>100) {
      openingBox.display('Good evening, Fox.',400,65);
    }
  }


  lamp.draw();
  fox.draw();
  document.addEventListener('keydown', keyDown, false);
  document.addEventListener('keyup', keyUp, false);
  keyPadControls();

  if (screenCount === 1) {
    spawnSprite(mouse,mouseImage);
    collisionCheck(mouse);
    if ((collided === true) && (screenCount === 1)) {
      document.addEventListener('keydown', mouseChat, false);
      mouseChat();
    }
  };
  
  if (screenCount === 2 || screenCount === 4) {
    spawnSprite(owlFlying,owlFlyingImage);
    owlFlying.x += owlFlying.vx;
    owlFlying.y += owlFlying.vy;
  };

  if (screenCount === 3) {
    spawnSprite(trash,trashImage);
    // fixedObstacleShift(trash);
    staticCollision(trash);
    if ((collided === true) && (screenCount === 3)) {
      document.addEventListener('keydown', trashChat, false);
      trashChat();
    }
  };

  if (screenCount === 5) {
    spawnSprite(puddle,puddleImage);
    // fixedObstacleShift(puddle);
    staticCollision(puddle);
    if ((collided === true) && (screenCount === 5)) {
      document.addEventListener('keydown', puddleChat, false);
      puddleChat();
    }
  };

  if (screenCount === 7) {
    spawnSprite(owl,owlImage);
    // fixedObstacleShift(owl);
    staticCollision(owl);
    if ((collided === true) && (screenCount === 7)) {
      document.addEventListener('keydown', owlChat, false);
      owlChat();
    }
  };

  
  if (screenCount === 9) {
    spawnSprite(dog,dogImage);
    collisionCheck(dog);
    if ((collided === true) && (screenCount === 9)) {
      dogChat();
      playerScore -= 15;
    };
  }

  
  if (screenCount === 10) {
    spawnSprite(cat,catImage);
    staticCollision(cat);
    if ((collided === true) && (screenCount === 10)) {
      document.addEventListener('keydown', catChat, false);
      catChat();
    }
  };


  
  if (screenCount === 11) {
    spawnSprite(shards,shardsImage);
    // fixedObstacleShift(shards);
    staticCollision(shards);
    if ((collided === true) && (screenCount === 11)) {    
      // fox.vx = .1;
    };
  }

  
  if (screenCount === 13) {

    if (fox.x >= 600){
      fox.vx = 0;
      if (playerScore > 0) {
        winAlert.display('You made it! Well done, you.', 500, 150);
        winAlert.display('Your score is ' + playerScore, 500, 200);
        spawnSprite(house, houseImage);
        spawnSprite(food, foodImage);
        spawnSprite(fireworksp, fireworkspImage);
        spawnSprite(fireworks, fireworksImage);
      } else if (playerScore <= 0) {
        var loseBox = new DialogueBox(300,200,1000,100);
        //Not sure what broke this display, but figure out.
        loseBox.display("Sorry, you won't find it tonight. Score: " + playerScore);
      }
    }
  };







function fixedObstacleShift(sprite) {
  if (rightArrowPress) {
    fox.x += fox.vx;
    sprite.x -= sprite.vx;
  } else if (leftArrowPress) {
     fox.x -= fox.vx;
     sprite.x += sprite.vx;
   };  
}

function keyPadControls() {
  if (rightArrowPress) {
    fox.x += fox.vx;
    lamp.x -= lamp.vx;
  } else if (leftArrowPress) {
      fox.x -= fox.vx;
      lamp.x += lamp.vx;
  };

  // else if (spaceBarPress) {
  //       fox.x += (3 * fox.vx);
  //     }

  if (downArrowPress && fox.y<600) {
    fox.y += fox.vy;
  } else if (upArrowPress && fox.y>520) {
    fox.y -= fox.vy;
  };
  if (fox.x > canvas.width) {
    fox.x = 0;
//Edit this line to fine-tune timing of lamp placement
    lamp.x = lamp.x+.5*canvas.width;
    screenCount++;
  };

  if (lamp.x < -40) {
    lamp.x = 1610;
  };
}
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
}




//----------Functions (outside animation loop)-----------//
//---------chronological in order of appearance---------//

function spawnSprite(sprite, image) {
  sprite.draw(image);
}

function collisionCheck(sprite) {
    var ox = sprite.x += sprite.vx;
    var oy = sprite.y += sprite.vy;
    var fx = fox.x;
    var fy = fox.y+170;
    if (((fx+220) >= ox) && ((fx-22) <= ox) && (fy >= oy)) {
      collided = true;
    } else {
      collided = false;
    };
    if (collided) {
      sprite.vx = 0;
    };
  }

function staticCollision(sprite) {
    var fy = fox.y+170;
    if (((fox.x+220) >= sprite.x) && ((fox.x-22) <= sprite.x)) {
      collided = true;
    };
  }



//--------Obstacle dialogue flow and content----------//
function mouseChat(e) {
  rightArrowPress = false;
  var mouseA = new DialogueBox(300,100,1000,100);
  mouseA.display("You've found a mouse. Are you feeling hungry? A for yes; F for no", 500, 50);
  var response = '';
  response = e.keyCode;
  switch(response) {
    case 70: 
      mouseA.display("Well, that's a relief! Off you pop, then.", 500, 50);
      collisionAvoid(mouse);
      setTimeout(reset, 600);
        break;
    case 65:
      mouseA.display("Oh dear. Are you going to eat this mouse? Q for yes; R for no.", 500, 50);
      document.addEventListener('keydown', function(e) {
        mouseA.display("Oh dear. Are you going to eat this mouse? Q for yes; R for no.", 500, 50);
        var response = e.keyCode;
        switch(response) {
          case 81: 
            mouseA.display("You're slightly less hungry. Move on now.", 500, 50);
            playerScore = playerScore - 5;
            collisionAvoid(mouse);
            screenCount = 2;
            setTimeout(reset, 500);
            break;
          case 82:
            mouseA.display("Well, that's a relief! He's heading home to the heath.", 500, 50);
            collisionAvoid(mouse);
            setTimeout(reset, 500);
              break;
        }
      }, false)();

      collisionAvoid(mouse);
      setTimeout(reset, 500);
        break;
  }
  mouseA = '';
}


function trashChat(e) {
  rightArrowPress = false;
  var trashA = new DialogueBox(300,100,1000,100);
  trashA.display("Mmm, a pile of rubbish! Smell tasty? A for yes; F for no.", 500, 50);
  var response = '';
  response = e.keyCode;
  switch(response) {
    case 65: 
      trashA.display("You found some edible scraps, but got your paws dirty.", 500, 50);
      collisionAvoid(trash);
      playerScore -= 5;
      setTimeout(reset, 700);
        break;
    case 70:
      trashA.display("Yeah, you're right. Let's skip it.", 500, 50);
      collisionAvoid(trash);
      setTimeout(reset, 700);
        break;
  }
  trashA = '';
}


function puddleChat(e) {
  //Add additional branch and fox meeting to this, time permitting
  var puddleA = new DialogueBox(300,100,1000,100);
  puddleA.display("*sniff* Smells like another fox. Look for him? A for yes; F for no.", 500, 50);
  var response = '';
  response = e.keyCode;
  switch(response) {
    case 65: 
      puddleA.display("You know, I don't think that's a good idea right now.", 500, 50);
      playerScore -= 5;
      collisionAvoid(puddle);
      setTimeout(reset, 800);
        break;
    case 70:
      puddleA.display("That's probably for the best. We have things to do.", 500, 50);
      collisionAvoid(puddle);
      setTimeout(reset, 800);
        break;
  }
  puddleA = '';
}


function owlChat(e) {
  var owlA = new DialogueBox(300,100,1000,100);
  var owlB = new DialogueBox(300,200,1000,100);
  owlA.display("'Hello there, Fox. Have you seen any mice?'", 500, 50);
  owlB.display("Press A to help the owl. Press F if you'd rather not.", 500, 50);
  var response = '';
  response = e.keyCode;
  switch(response) {
    case 70: 
      owlA.display("'What a shame. See you around, Fox.'", 500, 50);
      collisionAvoid(owl);
      playerScore -= 50;
      setTimeout(reset, 800);
        break;
    //This is nearly identical to the mouseChat function, but doesn't work properly for some reason.
    case 65:
      owlB.display("'You have? Where?' Press Q for Relay Building. Press R for the heath.", 500, 50);
      document.addEventListener('keydown', function(e) {
        owlB.display("'You have? Where?' Press Q for Relay Building. Press R for the heath.", 500, 50);
        var response = e.keyCode;
        switch(response) {
          case 81: 
            owlA.display("Well, I'll have a look. Thanks, Fox.", 500, 50);
            playerScore -= 30;
            collisionAvoid(owl);
            setTimeout(reset, 800);
            break;
          case 82:
            owlA.display("Thanks for the help! Say hi to the cat for me, okay?", 500, 50);
            collisionAvoid(owl);
            setTimeout(reset, 1200);
              break;
        }
      }, false)();
      collisionAvoid(owl);
      setTimeout(reset, 500);
      owlA = '';
      owlB = '';
  }

}

function dogChat(e) {
  rightArrowPress = false;
  var dogA = new DialogueBox(300,100,1000,100);
  dogA.display("Grrrrr. Arf! Arf!", 500, 50);
  collisionAvoid(dog);
  setTimeout(reset, 1000);
  dogA = '';
}



function catChat(e) {
  var catA = new DialogueBox(300,100,1000,100);
  catA.display("Cat! Friend or Food? F for friend. A for food. Choose wisely.", 500, 50);
  var response = '';
  response = e.keyCode;
  switch(response) {
    case 70: 
      catA.display("'Nice to see you again, Fox. You're almost there.'" , 500, 50);
      collisionAvoid(cat);
      playerScore -= 90;
      setTimeout(reset, 500);
        break;
    case 65:
      catA.display("Wow. You must really be hungry.", 500, 50);
      collisionAvoid(cat);
      playerScore += 40;
      setTimeout(reset, 500);
        break;
  }
  catA = '';
}

//need to allow collided obstacles to continue movement after dialogue
// obstacle.x += obstacle.vx;
function collisionAvoid(sprite) {
  sprite.x = sprite.x - 250;
  collided = false;
}

function reset() {
  window.requestAnimationFrame(draw);
}

var winAlert = {
  display: function(textToDisplay,x,y) {
    ctx.font = '50px "Taviraj", sans-serif';
    ctx.fillStyle = 'rgba(191,63,191,.8)';
    ctx.fillText (textToDisplay, x, y);
  }
};


window.requestAnimationFrame(draw);

