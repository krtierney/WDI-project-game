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

canvas.style.width = "800px";
canvas.style.height = "400px";

var rightArrowPress = false;
var leftArrowPress = false;
var upArrowPress = false;
var downArrowPress = false;
var spaceBarPress = false;
var aPress = false;
var fPress = false;

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

// var mouseChatImage = new Image();              
// mouseChatImage.src = "assets/mouse-chat.png";  
// var mouseChat = new Obstacle(1320,750,-2,0)

var mouseImage = new Image();              
mouseImage.src = "assets/mouse.png";  
var mouse = new Obstacle(1600,750,-2, 0);

var dogImage = new Image();              
dogImage.src = "assets/dog.png";  
var dog = new Obstacle(1200,500,-1,0);

var owlFlyingImage = new Image();              
owlFlyingImage.src = "assets/owl-flying.png";  
var owlFlying = new Obstacle(0,0,3,.5);

var owlImage = new Image();              
owlImage.src = "assets/owl.png";  
var owl = new Obstacle(1100,420,.1,0);

var puddleImage = new Image();              
puddleImage.src = "assets/puddle.png";  
var puddle = new Obstacle(1340,720,.1,0);

var trashImage = new Image();              
trashImage.src = "assets/trash.png";  
var trash = new Obstacle(1280,660,.5,0);

var shardsImage = new Image();              
shardsImage.src = "assets/shards.png";  
var shards = new Obstacle(1200,700,.5,0);

var houseImage = new Image();
houseImage.src = "assets/house.png";
var house = new Obstacle(1100,100,0,0);

var foodImage = new Image();
foodImage.src = "assets/food.png";
var food = new Obstacle(1000,700,0,0);

var fireworkspImage = new Image();
fireworkspImage.src = "assets/fireworksp.png";
var fireworksp = new Obstacle(50,150,0,0);

var fireworksImage = new Image();
fireworksImage.src = "assets/fireworks.png";
var fireworks = new Obstacle(800,75,0,0);



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

var winAlert = {
  display: function(textToDisplay,x,y) {
    ctx.font = "50px 'Taviraj', sans-serif";
    ctx.fillStyle = 'rgba(191,63,191,.8)';
    ctx.fillText (textToDisplay, x, y);
  }
};






function draw() {
  ctx.clearRect(0,0, canvas.width, canvas.height);
  fox.draw();
  newLamp.draw();

  keyPadControls();

  var first = new DialogueBox(300,100,1000,100);
  var second = new DialogueBox(300,200,1000,100);



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



  //Starting screen
  if (screenCount === 0 && fox.x<1600 && fox.x>700) {
    ctx.clearRect(0,0, canvas.width, canvas.height);
    first.display("Where are you off to in such a hurry?");
  } else if (screenCount === 0 && fox.x<700 && fox.x>100) {
    first.display("Good evening, Fox");
  }


  newLamp.draw();
  fox.draw();

  if (screenCount === 1) {
    meetAnObstacle(mouse,mouseImage);
    collisionCheck(mouse);
    if ((collided === true) && (screenCount === 1)) {
      document.addEventListener("keydown", mouseChat, false);
      mouseChat();
    }
  };
  
  if (screenCount === 2 || screenCount === 4) {
    //owl flies wrong direction: fix
    meetAnObstacle(owlFlying,owlFlyingImage);
    owlFlying.x += owlFlying.vx;
    owlFlying.y += owlFlying.vy;
  };
  newLamp.draw();
  fox.draw();

  
  if (screenCount === 3) {
    meetAnObstacle(trash,trashImage);
    fixedObstacleShift(trash);
    staticCollision(trash);
    if ((collided === true) && (screenCount === 3)) {
      document.addEventListener("keydown", trashChat, false);
      trashChat();
    }
  };

  
  if (screenCount === 5) {
    meetAnObstacle(puddle,puddleImage);
    fixedObstacleShift(puddle);
    staticCollision(puddle);
    if ((collided === true) && (screenCount === 5)) {
      document.addEventListener("keydown", puddleChat, false);
      puddleChat();
    }
  };

  
  if (screenCount === 7) {
    meetAnObstacle(owl,owlImage);
    fixedObstacleShift(owl);
    staticCollision(owl);
    if ((collided === true) && (screenCount === 7)) {
      document.addEventListener("keydown", owlChat, false);
      owlChat();
    }
  };

  
  if (screenCount === 9) {
    meetAnObstacle(dog,dogImage);
    collisionCheck(dog);
    if ((collided === true) && (screenCount === 9)) {
      first.display("'Grrr! Arf!'");
      playerScore -= 15;
    };
  }

  
  if (screenCount === 10) {
    meetAnObstacle(cat,catImage);
    staticCollision(cat);
    if ((collided === true) && (screenCount === 10)) {
      document.addEventListener("keydown", catChat, false);
      catChat();
    }
  };


  
  if (screenCount === 11) {
    meetAnObstacle(shards,shardsImage);
    fixedObstacleShift(shards);
    staticCollision(shards);
    if ((collided === true) && (screenCount === 11)) {    
      // fox.vx = .1;
    };
  }

  
  if (screenCount === 13) {

    if (fox.x >= 600){
      fox.vx = 0;
      if (playerScore > 0) {
        winAlert.display("You made it! Well done, you.", 500, 150);
        winAlert.display("Your score is " + playerScore, 500, 200);
        meetAnObstacle(house, houseImage);
        meetAnObstacle(food, foodImage);
        meetAnObstacle(fireworksp, fireworkspImage);
        meetAnObstacle(fireworks, fireworksImage);
      } else if (playerScore <= 0) {
        var loseBox = new DialogueBox(300,200,1000,100);
        loseBox.display("Sorry, you won't find it tonight. Score: " + playerScore);
      }
    }
  };





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
    // case 65: aPress = true;
    //   break;
    // case 70: fPress = true;
    //   break;
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
    // case 65: aPress = false;
    //   break;
    // case 70: fPress = false;
    //   break;
  }
}



  window.requestAnimationFrame(draw); 



}

var first = new DialogueBox(300,100,1000,100);
var second = new DialogueBox(300,200,1000,100);

//Obstacle dialogue flow and content
function mouseChat(e) {
  first.display("You've found a mouse. Are you feeling hungry? A for yes; F for no");
  var response = '';
  response = e.keyCode;
  switch(response) {
    case 70: 
      first.display("Well, that's a relief! Off you pop, then.");
      collisionAvoid(mouse);
      reset();
        break;
    case 65:
      first.display("Oh dear. Are you going to eat this mouse? Q for yes; R for no.");
      document.addEventListener("keydown", function(e) {
        first.display("Oh dear. Are you going to eat this mouse? Q for yes; R for no.");
        var response = e.keyCode;
        switch(response) {
          case 81: 
            first.display("You're slightly less hungry. Move on now.");
            playerScore = playerScore - 5;
            collisionAvoid(mouse);
            setTimeout(reset, 500);
            break;
          case 82:
            first.display("Well, that's a relief! He's heading home to the heath.");
            collisionAvoid(mouse);
            reset();
              break;
        }
      }, false)();

      collisionAvoid(mouse);
      reset();
        break;
  }
}




function trashChat(e) {
  first.display("Mmm, a pile of rubbish! Smell tasty? A for yes; F for no.");
  var response = '';
  response = e.keyCode;
  switch(response) {
    case 65: 
      first.display("You found some edible scraps, but got your paws dirty.");
      collisionAvoid(trash);
      playerScore -= 5;
      setTimeout(reset, 500);
        break;
    case 70:
      first.display("Yeah, you're right. Let's skip it.");
      collisionAvoid(trash);
      reset();
        break;
  }
}



function puddleChat(e) {
    first.display("*sniff* Smells like another fox. Look for him? A for yes; F for no.");
  var response = '';
  response = e.keyCode;
  switch(response) {
    case 65: 
      first.display("You know, I don't think that's a good idea right now.");
      playerScore -= 5;
      collisionAvoid(puddle);
      reset();
        break;
    case 70:
      first.display("That's probably for the best. We have things to do.");
      collisionAvoid(puddle);
      reset();
        break;
  }
}

function owlChat(e) {
  first.display("'Hello there, Fox. I've been following you. Have you seen any mice?'");
  second.display("Press A to help the owl. Press F if you'd rather not.");
  var response = '';
  response = e.keyCode;
  switch(response) {
    case 70: 
      first.display("'What a shame. See you around, Fox.'");
      collisionAvoid(owl);
      playerScore = playerScore - 50;
      reset();
        break;
    case 65:
      first.display("'You have? Where?' Press Q for Relay Building; R for the heath.");
        second.display('');
      document.addEventListener("keydown", function(e) {
        var response = e.keyCode;
        switch(response) {
          case 81: 
            first.display("Well, I'll have a look. Thanks, Fox.");
            playerScore = playerScore - 30;
            collisionAvoid(owl);
            setTimeout(reset, 500);
            break;
          case 82:
            first.display("Thanks for the help! Say hi to the cat for me, okay?");
            collisionAvoid(owl);
            reset();
              break;
        }
      }, false)();

      collisionAvoid(owl);
      reset();
        break;
  }
}

function catChat(e) {
  first.display("Cat! Friend or Food? F for friend. A for food.");
  var response = '';
  response = e.keyCode;
  switch(response) {
    case 70: 
      first.display("Wow. You must really be hungry.");
      collisionAvoid(cat);
      playerScore -= 100;
      setTimeout(reset, 500);
        break;
    case 65:
      first.display("'Nice to see you again, Fox. You're almost there.'");
      collisionAvoid(cat);
      playerScore += 40;
      setTimeout(reset, 500);
        break;
  }
}

function reset() {
  setTimeout(function() {
    window.requestAnimationFrame(draw);
    first.display('');
    second.display('');
  }, 1000);
  response = '';
}

function collisionAvoid(obstacle) {
  obstacle.x = obstacle.x - 250;
  collided = false;
}

window.requestAnimationFrame(draw);

