import Player from './player';
import Map from './map';
import Water from './water';
import Background from './background';
import Score from './score';
import Sound from './sound';
import { displaySplashScreen, displayGameOver, displayScore, displayPauseScreen } from './display';

class Game {

  constructor() {
    this.TILE_SIZE = 16;
    this.BOARD_DIM = 608;
    this.MAX_HORIZONTAL_VEL = 22;
    this.MAX_JUMP_VEL = -8;
    this.MAX_FALL_VEL = 32;
    this.FRICTION = 16;
    this.GRAVITY = 16;
    this.FRAME = 1/60;

    this.splashScreen = true;
    this.paused = false;

    const canvas = document.getElementById('gameCanvas');
    this.context = canvas.getContext('2d');

    document.addEventListener('keydown', (event) => (this.keyPress(event, true)));
    document.addEventListener('keyup', (event) => (this.keyPress(event, false)));

    this.sound = new Sound();

    this.main = this.main.bind(this);
  }

  newGame() {
    this.timeDiff = 0;
    this.keyDown = false;
    this.gameOver = false;

    if (this.map) {
      this.reset_objects();
    } else {
      this.buildGame();
    }
    this.now = Date.now();
    this.main();
  }

  main() {
    let then = this.now;
    this.now = Date.now();
    if (!this.splashScreen && !this.paused) {
      this.timeDiff = this.timeDiff + Math.min(1, (this.now - then) / 1000.0);
      while(this.timeDiff > this.FRAME) {
        this.timeDiff = this.timeDiff - this.FRAME;
        if (!this.gameOver) {
          this.update(this.FRAME, this.player, this.map);
        }
        this.water.update(this.FRAME);
      }
    }
    this.render();
    window.requestAnimationFrame(this.main);
    if (this.splashScreen) {
      displaySplashScreen(this.context, this.BOARD_DIM);
    }
  }

  update(timeDiff, player, map) {
    this.score.currentScore += timeDiff * 10;
    if (player.left) {
      if (player.xVel > 0 ) { player.xVel = 0; }
      player.xVel = (player.xVel - (this.MAX_HORIZONTAL_VEL * timeDiff));
      if (Math.abs(player.xVel) > this.MAX_HORIZONTAL_VEL) { player.xVel = -(this.MAX_HORIZONTAL_VEL); }
    }
    if (player.right) {
      if (player.xVel < 0 ) { player.xVel = 0; }
      player.xVel = (player.xVel + (this.MAX_HORIZONTAL_VEL * timeDiff));
      if (player.xVel > this.MAX_HORIZONTAL_VEL) { player.xVel = this.MAX_HORIZONTAL_VEL; }
    }
    if (player.jump) {
      if (player.yVel === 0) {
        player.yVel = this.MAX_JUMP_VEL;
        this.sound.jump();
      }
    }
    this.checkForGameOver(player);
    if (!this.gameOver) {
      this.checkForCollisions(player, map);
      if (player.left || player.right) {
        player.x += player.xVel;
      }
      player.y += player.yVel;
      this.handleFriction(timeDiff, player);
      this.handleGravity(timeDiff, player, map);
    } else {
      this.sound.gameOver();
    }
    if (this.player.y < this.BOARD_DIM / 2) {
      this.map.nextPixel();
      this.water.nextPixel();
      this.background.panBackground();
      this.player.y += 1;
    }
  }

  render() {
    this.context.clearRect(0, 0, this.BOARD_DIM, this.BOARD_DIM);
    this.background.render();
    this.map.render(this.context);
    this.player.render(this.context);
    this.water.render();
    if (this.paused) {
      displayPauseScreen(this.context, this.BOARD_DIM);
    }
    if (this.gameOver) {
      displayGameOver(this.context, this.score, this.BOARD_DIM);
    } else {
      displayScore(this.context, this.score, this.TILE_SIZE, this.BOARD_DIM);
    }
  }

  checkForCollisions(player, map) {
    const nextX = player.x + player.xVel;
    const nextY = player.y + player.yVel;
    const nextPlayer = {x:nextX, y:nextY, size:this.TILE_SIZE};
    const tilePos = this.getTilePos(nextX, nextY - map.offSet);
    let nextRow = tilePos[0];
    let nextCol = tilePos[1];

    if (nextRow < 0) {
      nextRow = 0;
      player.yVel = 0.01;
      player.y = 0;
    }
    if (player.xVel < 0) {
      if(map.tile(nextRow, nextCol).inCollision(nextPlayer) || map.tile(nextRow+1, nextCol).inCollision(nextPlayer)) {
        player.xVel = 0;
        player.x = map.tile(nextRow, nextCol).x + this.TILE_SIZE;
        nextCol += 1;
      }
    } else if (player.xVel > 0) {
      if(map.tile(nextRow, nextCol+1).inCollision(nextPlayer) || map.tile(nextRow+1, nextCol+1).inCollision(nextPlayer)) {
        player.xVel = 0;
        player.x = map.tile(nextRow, nextCol+1).x - this.TILE_SIZE;
        nextCol -= 1;
      }
    }
    if (player.yVel < 0) {
      if(map.tile(nextRow, nextCol).inCollision(nextPlayer) || map.tile(nextRow, nextCol+1).inCollision(nextPlayer)) {
        player.yVel = 0;
        player.y = map.tile(nextRow, nextCol).y + this.TILE_SIZE;
      }
    } else if (player.yVel > 0) {
      if(map.tile(nextRow+1, nextCol).inCollision(nextPlayer) || map.tile(nextRow+1, nextCol+1).inCollision(nextPlayer)) {
        player.yVel = 0;
        player.y = map.tile(nextRow+1, nextCol).y - this.TILE_SIZE;
      }
    }
  }

  checkForGameOver(player) {
    const nextY = player.y + player.yVel;
    if (nextY > this.BOARD_DIM - this.TILE_SIZE || nextY > this.water.level) {
      this.gameOver = true;
    }
  }

  handleFriction(timeDiff, player) {
    if (player.xVel > 0) {
      player.xVel -= this.FRICTION * timeDiff;
      if (player.xVel < 0) { player.xVel = 0; }
    } else if (player.xVel < 0) {
      player.xVel += this.FRICTION * timeDiff;
      if (player.xVel > 0) { player.xVel = 0; }
    }
  }

  handleGravity(timeDiff, player, map) {
    if (this.isStanding(player, map)) {
      player.yVel = 0;
    } else {
      player.yVel += this.GRAVITY * timeDiff;
      if (player.yVel > this.MAX_FALL_VEL) { player.yVel = this.MAX_FALL_VEL; }
    }
  }

  isStanding(player, map) {
    const tilePos = this.getTilePos(player.x, player.y - map.offSet);
    return (map.tile(tilePos[0]+1, tilePos[1]).collides ||
      (player.x % this.TILE_SIZE !== 0 && map.tile(tilePos[0]+1, tilePos[1]+1).collides));
  }

  getTilePos(x, y) {
    const column = Math.floor(x / this.TILE_SIZE);
    const row = Math.floor(y / this.TILE_SIZE);
    return [row + 1, column];
  }

  buildGame() {
    this.map = new Map(this.BOARD_DIM, this.TILE_SIZE, this.context);
    this.map.generateMap(this.BOARD_DIM, this.TILE_SIZE);
    this.player = new Player([330,500], this.TILE_SIZE);
    this.background = new Background(this.context, this.BOARD_DIM);
    this.water = new Water(this.TILE_SIZE, this.BOARD_DIM, this.context);
    this.score = new Score();
  }

  resetGame() {
    this.map.reset();
    this.player.reset([330,500]);
    this.background.reset();
    this.water.reset();
    this.score.reset();
  }

  keyPress(event, pressed) {
    this.keyDown = pressed ? true : false;
    switch(event.key) {
      case "ArrowLeft":
        this.player.left = pressed;
        break;
      case "ArrowRight":
        this.player.right = pressed;
        break;
      case "ArrowUp":
        event.preventDefault();
        break;
      case "ArrowDown":
        event.preventDefault();
        break;
      case "Enter":
        if (this.splashScreen) {
          this.now = Date.now();
          this.splashScreen = false;
        } else if (this.keyDown && this.gameOver && !this.score.checkIfHighScore()) {
          this.newGame();
        } else if (this.score.checkIfHighScore()) {
          this.keyDown = false;
          this.score.submitHighScore();
        }
        break;
      case "Shift":
        if(this.keyDown && !this.splashScreen && !this.gameOver) {
          this.paused = this.paused ? false : true;
        }
        break;
      case "Backspace":
        if (this.score.checkIfHighScore() && this.keyDown) {
          this.score.name = this.score.name.slice(0, -1);
        }
        break;
      case " ":
        event.preventDefault();
        if (this.gameOver && this.score.checkIfHighScore() && this.keyDown) {
          this.score.name += " ";
        } else if (!this.gameOver){
          this.player.jump = pressed;
        }
        break;
      default:
        if (this.score.checkIfHighScore() && this.keyDown && event.key.length === 1) {
          this.score.name += event.key;
        }
    }
  }
}

export default Game;
