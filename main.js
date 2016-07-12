//---------Audio Player mute/play toggle--------//
(function() {
document.getElementById('mute').addEventListener('click', toggleAudio);
var playing = true;

function toggleAudio() {
  var audio = document.getElementsByTagName("audio")[0];
  if (playing) {
    audio.pause(); 
    document.getElementById('mute').innerHTML = "&#128263";
  } else {
    audio.play();
    document.getElementById('mute').innerHTML = "&#128266;";
  }
  playing = !playing;
}

//--------Begin Canvas Game Content--------//
var canvas = document.getElementById('fox-game');
var ctx = canvas.getContext('2d');

window.onload = draw;
  canvas.width = 1600;
  canvas.height = 800;

canvas.style.width = '800px';
canvas.style.height = '400px';

var rightArrowPress = false;
var leftArrowPress = false;
var upArrowPress = false;
var downArrowPress = false;
var spaceBarPress = false;
var aKeyPressFunction = null;
var fKeyPressFunction = null;
var touchActive = false;
var shouldDraw = true;

var screenCount = 0;
var playerScore = 100;

var hasCollided = false;


//------Sprites and image assets defined here------//
var foxImage = new Image();
foxImage.src = 'assets/fox-night.png';
var fox = {
    x: 0,
    y: 600,
    vx: 2,
    vy: 2,
    draw: function() {
      ctx.drawImage(foxImage, this.x, this.y, 320, 200);
    }
};


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

var mouseImage = new Image();              
mouseImage.src = 'assets/mouse.png';  
var mouse = new Sprite(1600,750,-2, 0);

var dogImage = new Image();              
dogImage.src = 'assets/dog.png';  
var dog = new Sprite(1200,450,-1,0);

var owlFlyingImage = new Image();              
owlFlyingImage.src = 'assets/owl-flying.png';  
var owlFlying = new Sprite(0,0,3,.5);

var owlImage = new Image();              
owlImage.src = 'assets/owl.png';  
var owl = new Sprite(1100,420,.5,0);

var puddleImage = new Image();              
puddleImage.src = 'assets/puddle.png';  
var puddle = new Sprite(1340,720,.5,0);

var trashImage = new Image();              
trashImage.src = 'assets/trash.png';  
var trash = new Sprite(1280,680,.5,0);

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

//-------Progress Bar---------//

var progressBar = function(screenCount) {
  ctx.beginPath();
  ctx.rect(0,0,1600,20);
  ctx.fillStyle = 'rgba(255,255,255,.3)';
  ctx.fill();
  ctx.beginPath();
  ctx.rect(0,0,((screenCount*160)+(fox.x*.1)), 20);
  ctx.fillStyle = 'rgba(0,0,0,.4)';
  ctx.fill();
}

//-------Construct a streetlamp---------//
function StreetLamp(x, y, vx) {
  this.x = x;
  this.y = y;
  this.vx = vx;
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

var winAlertDisplay = function(textToDisplay,x,y) {
  ctx.font = '50px "Taviraj", sans-serif';
  ctx.fillStyle = 'rgba(191,63,191,.8)';
  ctx.fillText (textToDisplay, x, y);
}

//----Main animation loop function----//

function draw() {
  // console.log("Drawing...");
  ctx.clearRect(0,0, canvas.width, canvas.height);
  keyPadControls();
  progressBar(screenCount);
  lamp.draw();
  fox.draw();


  //Starting screen
  if (screenCount === 0) {
    var openingBox = new DialogueBox(400,50,800,100);
    if (screenCount === 0 && fox.x<1600 && fox.x>700) {
      openingBox.display('Where are you off to at this time of night?',400,65);
    } else if (screenCount === 0 && fox.x<700 && fox.x>100) {
      openingBox.display("Good evening, Fox... It's getting late.",400,65);
    }
  }
  if (screenCount === 1) {
    owlFlying.draw(owlFlyingImage);
    owlFlying.x += owlFlying.vx;
    owlFlying.y += owlFlying.vy;
  };

  if (screenCount === 1) {
    var oneBox = new DialogueBox(400,50,800,100);
    if (screenCount === 1 && fox.x<1600 && fox.x>700) {
      oneBox.display("But then... this isn't really a regular night, is it?" ,400,65);
    } else if (screenCount === 1 && fox.x<700 && fox.x>100) {
      oneBox.display("This isn't even your regular neighbourhood.",400,65);
    }
  }

  if (screenCount === 2) {
    mouse.draw(mouseImage);
    collisionCheck(mouse, 220, 170);
    if ((hasCollided === true) && (screenCount === 2)) {
        mouseChat();
        shouldDraw = false;
    }
  };

  if (screenCount === 3) {
    var thirdBox = new DialogueBox(400,50,800,100);
    if (fox.x<600 && fox.x>100) {
      thirdBox.display("Now, what could that be up ahead?",400,65);
    };
    trash.draw(trashImage);
    fixedObstacleShift(trash);
    staticCollision(trash,230,170);
    if ((hasCollided === true) && (screenCount === 3)) {
      trashChat();
      shouldDraw = false;
    }
  };

  if (screenCount === 4) {
    owlFlying.draw(owlFlyingImage);
    owlFlying.x += owlFlying.vx;
    owlFlying.y += owlFlying.vy;
    var fourBox = new DialogueBox(400,50,800,100);
    if (screenCount === 4 && fox.x<1400 && fox.x>700) {
      fourBox.display("It's looking awfully lonely out here.",400,65);
    } else if (screenCount === 4 && fox.x<550 && fox.x>100) {
      fourBox.display("By the way, where are all your friends tonight, Fox?",400,65);
    };
  };

  if (screenCount === 5) {
    puddle.draw(puddleImage);
    fixedObstacleShift(puddle);
    staticCollision(puddle,220, 170);
    if ((hasCollided === true) && (screenCount === 5)) {
      puddleChat();
      shouldDraw = false;
    }
  };

  if (screenCount === 6) {
    owl.draw(owlImage);
    fixedObstacleShift(owl);
    staticCollision(owl, 220, 170);
    if ((hasCollided === true) && (screenCount === 6)) {
      owlChat();
      shouldDraw = false;
    }
  };

  if (screenCount === 7) {
    dog.draw(dogImage);
    collisionCheck(dog, 220, 170);
    if ((hasCollided === true) && (screenCount === 7)) {
      dogChat();
      shouldDraw = false;
    }
  };
  
  if (screenCount === 8) {
    cat.draw(catImage);
    var eightBox = new DialogueBox(400,50,800,100);
    if (fox.x<600 && fox.x>100) {
      eightBox.display("Finally, a familiar face...I think. Look familiar to you?",400,65);
    };
    staticCollision(cat, 350, 170);
    if ((hasCollided === true) && (screenCount === 8)) {
      catChat();
      shouldDraw = false;
    }
  };

  if (screenCount === 9) {
    var nineBox = new DialogueBox(400,50,800,100);
    if (screenCount === 9 && fox.x<1600 && fox.x>700) {
      nineBox.display("This is starting to smell like home, isn't it?",400,65);
    } else if (screenCount === 9 && fox.x<700 && fox.x>100) {
      nineBox.display("Hmm... maybe we're on the right track after all.",400,65);
    }
  }
 
  if (screenCount === 10) {
    if (fox.x >= 500){
      fox.vx = 0;
      if (playerScore > 0) {
        winAlertDisplay('You made it! Well done, you.', 500, 150);
        winAlertDisplay('Your score is ' + playerScore, 500, 200);
        house.draw(houseImage);
        food.draw(foodImage);
        fireworksp.draw(fireworkspImage);
        fireworks.draw(fireworksImage);
      } else if (playerScore <= 0) {
        var loseBox = new DialogueBox(350,200,900,100);
        loseBox.display("Sorry, you won't find it tonight. Score: " + playerScore, 500, 50);
      }
    }
  }


  if(shouldDraw) { window.requestAnimationFrame(draw); }
} // end of draw loop

//----------Functions (outside animation loop)-----------//

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
  if (rightArrowPress || touchActive) {
    fox.x += fox.vx;
    lamp.x -= lamp.vx;
  } else if (leftArrowPress) {
      fox.x -= fox.vx;
      lamp.x += lamp.vx;
  };

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
    lamp.x = 1600;
  };
}

document.addEventListener('keydown', keyDown, false);
document.addEventListener('keyup', keyUp, false);
canvas.addEventListener('touchstart', touchStart, false);
canvas.addEventListener('touchend', touchEnd, false);

function keyDown(e) {
  var code = e.keyCode;
  switch (code) {
    case 32: spaceBarPress = true;
      break;
    case 37: leftArrowPress = true; 
      break;
    case 38: upArrowPress = true;
      e.preventDefault();
      break;
    case 39: rightArrowPress = true;
      break;
    case 40: downArrowPress = true;
      e.preventDefault();
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
    case 65: 
      console.log(aKeyPressFunction)
      if(aKeyPressFunction) {
        console.log("Calling aKeyPressFunction");
        aKeyPressFunction();
      }
      break;
    case 70:
      if(fKeyPressFunction) {
        console.log("Calling fKeyPressFunction");
        fKeyPressFunction();
      }
      break;
  }
}

function touchStart(e) {
  touchActive = true;
  e.preventDefault();
}

function touchEnd(e) {
  touchActive = false;
}

function collisionCheck(sprite, xOffset, yOffset) {
    var ox = sprite.x += sprite.vx;
    var oy = sprite.y += sprite.vy;
    var fx = fox.x;
    var fy = fox.y+yOffset;
    if (((fx+xOffset) >= ox) && ((fx-22) <= ox) && (fy >= oy)) {
      hasCollided = true;
      shouldDraw = false;
    } else {
      hasCollided = false;
      shouldDraw = true;
    }
  }

function staticCollision(sprite, xOffset, yOffset) {
    var fy = fox.y+yOffset;
    if (((fox.x+xOffset) >= sprite.x) && ((fox.x-22) <= sprite.x)) {
      hasCollided = true;
    } else {
      hasCollided = false;
    }
  }



//--------Obstacle dialogue flow and content----------//
function mouseChat() {
  rightArrowPress = false;
  var mouseA = new DialogueBox(300,100,1000,100);
  mouseA.display("You've found a mouse. Are you feeling hungry? A for yes; F for no.", 500, 50);

  aKeyPressFunction = function() {
    mouseA.display("Oh dear. Are you going to eat this mouse? A for yes; F for no.", 500, 50);

    aKeyPressFunction = function() {
      mouseA.display("You're slightly less hungry. Move on now.", 500, 50);
      playerScore -= 5;
      screenCount = 3;
      setTimeout(reset, 1200);
    };

    fKeyPressFunction = function() {
      mouseA.display("Well, that's a relief! He's heading home to the heath.", 500, 50);
      collisionAvoid(mouse, 300);
      setTimeout(reset, 1200);

    };
  };

  fKeyPressFunction = function() {
    mouseA.display("Well, that's a relief! Off you pop, then.", 500, 50);
    collisionAvoid(mouse, 300);
    setTimeout(reset, 1200);
  };
}

function trashChat() {
  rightArrowPress = false;
  var trashA = new DialogueBox(300,100,1000,100);
  trashA.display("Ooh, lovely a pile of rubbish! Smells good, right? A for yes; F for no.", 500, 50);
  aKeyPressFunction = function() {
    trashA.display("Press A if you want to take the time to dig through. Otherwise, press F.", 500, 50);

    aKeyPressFunction = function() {
      trashA.display("You found some edible scraps, but got your paws dirty.", 500, 50);
      collisionAvoid(trash, 350);
      playerScore -= 5;
      setTimeout(reset, 1200);
    };

    fKeyPressFunction = function() {
      trashA.display("Yeah, you're right. Let's skip it. Best be on our way, I think.", 500, 50);
      collisionAvoid(trash, 350);
      setTimeout(reset, 1200);
    };
  }

  fKeyPressFunction = function() {
    trashA.display("Yeah, you're right. Let's skip it. Best be on our way, I think.", 500, 50);
    collisionAvoid(trash, 350);
    setTimeout(reset, 1200);
  };
}

function puddleChat() {
  rightArrowPress = false;
  //Add additional branch and fox meeting to this, time permitting
  var puddleA = new DialogueBox(300,100,1000,100);
  puddleA.display("*sniff* Smells like someone's territory. Have a look? A for yes; F for no.", 500, 50);
  aKeyPressFunction = function() {
    puddleA.display("Okay. We'll keep an eye out. Might be another fox around.", 500, 75);
    playerScore -= 5;
    collisionAvoid(puddle, 450);
    setTimeout(reset, 1200);
  }

  fKeyPressFunction = function() {
    puddleA.display("That's probably for the best. We have things to do. No time for a fight.", 500, 50);
    collisionAvoid(puddle, 450);
    setTimeout(reset, 1200);
  }
}

function owlChat() {
  rightArrowPress = false;
  var owlA = new DialogueBox(300,100,1000,100);
  var owlB = new DialogueBox(300,200,1000,100);
  owlA.display("'Hello there, Fox. Had my eye on you. Seen any mice around?'", 500, 75);
  owlB.display("Press A to help the owl. Press F if you'd rather not.", 500, 50);
  aKeyPressFunction = function() {
    owlA.display("'OOoo really?' Press A if he's heading for the Relay Building.", 500, 75);
    owlB.display('Press F if you think the mouse is at the heath.',500,50);
    aKeyPressFunction  = function() {
      owlA.display("Well, I'll have a look around there. Thanks, Fox.", 500, 75);
      owlB.display("By the way, I saw your friend. She moved house.",500,50);
      playerScore -= 30;
      collisionAvoid(owl, 1600);
      setTimeout(reset, 1200);
    };

    fKeyPressFunction = function() {
      owlA.display("Thanks for the help, Fox! Say, you're looking a bit lost.", 500, 75);
      owlB.display('Say hi to the cat for me, okay? She might help you find the way."', 500,50);
      playerScore += 60;
      screenCount = 8;
      setTimeout(reset, 1200);
    };
  };

  fKeyPressFunction = function() {
    owlA.display("'What a shame. I really am hungry. Oh well.'", 500, 75);
    owlB.display("See you around, Fox. Are you going the right way?",500,50);
    collisionAvoid(owl, 1600);
    playerScore -= 50;
    setTimeout(reset, 1200);
  };
}

function dogChat() {
  rightArrowPress = false;
  var dogA = new DialogueBox(300,100,1000,100);
  dogA.display("'Grrrrr. Arf! Arf!' Oh, this one looks mean. Press A to flee.", 500, 50);
  aKeyPressFunction = function() {
    playerScore -= 15;
    collisionAvoid(dog, 550);
    setTimeout(reset, 1200);
  };
}


function catChat() {
  rightArrowPress = false;
  var catA = new DialogueBox(300,100,1000,100);
  catA.display("Cat: friend or food? F for friend. A for food. Choose wisely.", 500, 50);
  fKeyPressFunction = function() {
    catA.display("'Nice to see you again, Fox. You're almost there.'" , 500, 50);
    collisionAvoid(cat, 400);
    playerScore += 40;
    setTimeout(reset, 1200);
  };
  aKeyPressFunction = function() {
    catA.display("Wow. You must really be hungry. Didn't recognise me?", 500, 50);
    collisionAvoid(cat, 400);
    playerScore -= 90;
    setTimeout(reset, 1200);
  };
}

//need to allow collided obstacles to continue movement after dialogue
// obstacle.x += obstacle.vx; ??
function collisionAvoid(sprite, offset) {
  sprite.x = sprite.x - offset;
  sprite.x += sprite.vx;
  hasCollided = false;
}

function reset() {
  shouldDraw = true;
  window.requestAnimationFrame(draw);
}


window.requestAnimationFrame(draw);

}());