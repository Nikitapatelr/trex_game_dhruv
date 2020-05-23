var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var cloudsGroup, cloudImage, obstacles, rand, obstaclesImage1, obstaclesImage2, obstaclesImage3, obstaclesImage4, obstaclesImage5, obstaclesImage6, obstaclesGroup;
var gameState, score;
var gameOver, gameOver_image, restart, resartImage;
var checkPoint, die, jump;

function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadImage("trex_collided.png");
  cloudImage = loadImage("cloud.png");
  groundImage = loadImage("ground2.png")
  obstaclesImage1 = loadImage("obstacle1.png");
  obstaclesImage2 = loadImage("obstacle2.png");
  obstaclesImage3 = loadImage("obstacle3.png");
  obstaclesImage4 = loadImage("obstacle4.png");
  obstaclesImage5 = loadImage("obstacle5.png");
  obstaclesImage6 = loadImage("obstacle6.png");
  gameOver_image = loadImage("gameOver.png");
  restartImage = loadImage("restart.png");
  checkPoint = loadSound('checkPoint.mp3');
  die = loadSound('die.mp3');
  jump = loadSound('jump.mp3');
}

function setup() {
  createCanvas(600, 200);
  
  trex = createSprite(50,180,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.5;
  
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -6;
  cloudsGroup = new Group();
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  obstaclesGroup = createGroup();
  score = 0;
  gameState = "play";
  gameOver = createSprite(300, 100);
  gameOver.scale = 0.5
  restart = createSprite(300, 140);
  restart.scale = 0.5;
  gameOver.addImage(gameOver_image);
  restart.addImage(restartImage);
}

function draw() {
  background(255);
  
  if (gameState == "play"){
    
    trex.changeAnimation("running", trex_running);
    
    ground.velocityX = -(6 + score*3/100);
    
    gameOver.visible = false;
    restart.visible = false;
    
    if(keyDown("space")&&trex.isTouching(ground)) {
      trex.velocityY = -13;
      jump.play();
    }
  
    trex.velocityY = trex.velocityY + 0.8
  
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    if (frameCount % 4 == 0){
      score = score + 1;
    }
    
    if (score%100 == 0&&score>0){
      checkPoint.play();
    }
    
    if (trex.isTouching(obstaclesGroup)){
      gameState = "end"
      die.play();
    }
    
  trex.collide(invisibleGround);
  spawnClouds();
  spawnObstacles();
  }
  else if (gameState == "end"){
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    ground.velocityX = 0;
    gameOver.visible = true;
    restart.visible = true;
    trex.changeAnimation("collided", trex_collided);
    if (mousePressedOver(restart)){
      reset();
    }
    
  }
  
  drawSprites();
  textSize(20);
  fill("black");
  text("score: "+score, 50, 50);
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -(6 + score*3/100);
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if (frameCount % 100 == 0){
    obstacles = createSprite(600, 160);
    obstacles.velocityX = -(6 + score*3/100);
    obstacles.scale = 0.5;
    rand = Math.round(random(1, 6));
    switch (rand){
      case 1: obstacles.addImage(obstaclesImage1);
            break;
      case 2 : obstacles.addImage(obstaclesImage2);
             break;
      case 3 : obstacles.addImage(obstaclesImage3);
            break;
            
      case 4 : obstacles.addImage(obstaclesImage4);
            break;
      case 5 : obstacles.addImage(obstaclesImage5);
             break;
      case 6 : obstacles.addImage(obstaclesImage6);
             break;
             
      default : break;
    }
    if (obstacles.x < -10){
      obstacles.destroy();
    }
    obstaclesGroup.add(obstacles);
  }
}

function reset(){
  gameState = "play";
  score = 0;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
}