window.onload = function() {

  var canvasWidth = 900;
  var canvasHeight = 600;
  var blockSize = 30;
  var ctx;
  var delay = 100;
  var snakee;
  var applee;
  var widthInBlocks = canvasWidth/blockSize;
  var heightInBlocks = canvasHeight/blockSize;
  var score;

  init();

  function init() {
      var canvas = document.createElement('canvas');
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      canvas.style.border = "1px solid";
      document.body.appendChild(canvas);
        ctx = canvas.getContext('2d');
        snakee = new Snake([[6, 4],[5, 4], [4, 4] ], "right");
        applee = new Apple([10,10]);
        score = 0;
        refreshCanvas();
    }

    function refreshCanvas() {
      snakee.advance();
      if(snakee.checkCollision()) {
        gameOver();
      } else {
        if(snakee.isEatingApple(applee)){
          score++;
          snakee.eatApple = true;
          do{
            applee.setNewPosition();
          } while(applee.isPositionOnSnake(snakee))
          
        }
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        snakee.draw();
        applee.draw();
        displayScore();
        setTimeout(refreshCanvas, delay);
      }
    }

    function gameOver() {
      ctx.save();
      ctx.fillText("GAME OVER", 5, 15);
      ctx.fillText("YOU LOSE", 5, 30);
      ctx.fillText("Appuyer sur la touche Espace pour rejouer ...", 5, 45);
      ctx.restore();
    }

    function reStart() {
      snakee = new Snake([[6, 4],[5, 4], [4, 4] ], "right");
      applee = new Apple([10,10]);
      score = 0;
      refreshCanvas();
    }

    function displayScore() {
      ctx.save();
      ctx.fillText(score.toString(), 5, canvasHeight -5);
      ctx.restore();
    }

    function drawBlock(ctx, position) {
      var x = position[0] * blockSize;
      var y = position[1] * blockSize;
      ctx.fillRect(x,y,blockSize,blockSize)
    }

    function Snake(body, direction) {
      this.body = body;
      this.direction = direction;
      this.eatApple = false;
      this.draw = function() { 
        ctx.save();
        ctx.fillStyle = "#B06660";
        for(var i = 0; i < this.body.length; i++) {
          drawBlock(ctx, this.body[i]);
        };
        ctx.restore();
    };
    this.advance = () => {
      var nextPosition = this.body[0].slice();
      switch (this.direction) {
        case "left":
          nextPosition[0] -= 1;
          break;
        case "right":
          nextPosition[0] += 1;
          break;
        case "down":
          nextPosition[1] += 1;
          break;
        case "up":
          nextPosition[1] -= 1;
          break;
      
        default:
          throw("invalide direction");
      }
      this.body.unshift(nextPosition)
      if(!this.eatApple){
        this.body.pop();
      }else {
        this.eatApple = false;
      }
        
    };
    this.setDirection = function(newDirection) {
      var alloweDirections;
      switch (this.direction) {
        case "left":
        case "right":
          alloweDirections = ["up", "down"];
          break;
        case "down":
        case "up":
          alloweDirections = ["left", "right"];
          break;
        default: throw("invalide direction");
      }
      if(alloweDirections.indexOf(newDirection) > -1) {
        this.direction = newDirection;
      }
    };
    this.checkCollision = function() {
      var wallCollision = false;
      var snakeCollision = false;
      var head = this.body[0];
      var rest = this.body.slice(1);
      var snakeX = head[0];
      var snakeY = head[1];
      var minX = 0;
      var minY = 0;
      var maxX = widthInBlocks - 1;
      var maxY = heightInBlocks - 1;
      var isNotBetweenHorizontalWalls = snakeX < minX || snakeX > maxX;
      var isNotBetweenVerticalWalls = snakeX < minY || snakeY > maxY;

      if(isNotBetweenHorizontalWalls || isNotBetweenVerticalWalls){
        wallCollision = true;
      }

      for (let i = 0; i < rest.length; i++) {
        if(snakeX === rest[i][0] && snakeY === rest[i][1]){
          snakeCollision = true;
        }
        
      }
      return wallCollision || snakeCollision;

    };
    this.isEatingApple = function(appleToEat){
      var head = this.body[0];
      if(head[0] === appleToEat.position[0] && head[1] === appleToEat.position[1]){
        return true;
      }else {
        return false;
      }
    };
  }

  function Apple(position) {  
    this.position = position;
    this.draw = function() {
      ctx.save();
      ctx.fillStyle = "#FEABB9"
      ctx.beginPath();
      var radius = blockSize/2;
      var x = this.position[0]* blockSize + radius;
      var y = this.position[1]* blockSize + radius;
      ctx.arc(x,y, radius, 0, Math.PI*2, true);
      ctx.fill();
      ctx.restore();
    };
    this.setNewPosition = function(){
      var newX = Math.round(Math.random() * (widthInBlocks - 1));
      var newY = Math.round(Math.random() * (heightInBlocks - 1));
      this.position = [newX, newY];
    };
    this.isPositionOnSnake = function(snakeToCheck) {
      var isPositionOnSnake = false;
      for (let i = 0; i< snakeToCheck.body.length; i++) {
        if(this.position[0] === snakeToCheck.body[i][0] && this.position[0] === snakeToCheck.body[i][1]){
          isPositionOnSnake = true;
        }
      }
      return isPositionOnSnake;
    }
  }


  document.onkeydown = function handleKeyDown(e) {
    var key = e.keyCode;
    var newDirection;
    switch (key) {
      case 37:
        newDirection = "left";
        break;
      case 38:
        newDirection = "up";
        break;
      case 39:
        newDirection = "right";
        break;
      case 40:
        newDirection = "down";
        break;
      case 32:
        reStart();
        return;
    
      default: return;
    }
    snakee.setDirection(newDirection);
  }

}
