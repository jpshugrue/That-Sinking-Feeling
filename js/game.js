import Player from './player';
import Map from './map';
import Water from './water';
import Background from './background';
import Score from './score';
import { splashScreen, endGame } from './display';

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

    const canvas = document.getElementById('gameCanvas');
    this.context = canvas.getContext('2d');

    document.addEventListener('keydown', (event) => (this.keyPress(event, true)));
    document.addEventListener('keyup', (event) => (this.keyPress(event, false)));

    this.main = this.main.bind(this);
  }

  newGame() {
    this.timeDiff = 0;
    this.keyDown = false;
    this.gameOver = false;
    if (this.map) {
      this.map.reset();
      this.player.reset([330,500]);
      this.background.reset();
      this.water.reset();
      this.score.reset();
    } else {
      this.map = new Map(this.BOARD_DIM, this.TILE_SIZE, this.context);
      this.map.generateMap(this.BOARD_DIM, this.TILE_SIZE);
      this.player = new Player([330,500], this.TILE_SIZE);
      this.background = new Background(this.context, this.BOARD_DIM);
      this.water = new Water(this.TILE_SIZE, this.BOARD_DIM, this.context);
      this.score = new Score();
    }
    this.now = Date.now();
    this.main();
  }

  main() {
    if (!this.splashScreen) {
      let then = this.now;
      this.now = Date.now();
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
      splashScreen(this.context, this.BOARD_DIM);
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
      if (player.yVel === 0) { player.yVel = this.MAX_JUMP_VEL; }
    }
    this.checkForGameOver(player);
    if (!this.gameOver) {
      this.checkForCollisions(player, map);
      if (player.left || player.right) {
        player.x += player.xVel;
      }
      player.y += player.yVel;
      this.handleFriction(timeDiff);
      this.handleGravity(timeDiff, player, map);
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
    if (this.gameOver) {
      endGame(this.context, this.score, this.BOARD_DIM);
    } else {
      this.context.textAlign = "left";
      this.context.font = '16px fippsregular';
      this.context.fillStyle = "#1e2a3d";
      this.context.fillText(`Score: ${Math.floor(this.score.currentScore)}`, this.TILE_SIZE + 5, this.BOARD_DIM - 5);
    }
  }

  getTilePos(x, y) {
    const column = Math.floor(x / this.TILE_SIZE);
    const row = Math.floor(y / this.TILE_SIZE);
    return [row + 1, column];
  }

  checkForGameOver(player) {
    const nextY = player.y + player.yVel;
    if (nextY > this.BOARD_DIM - this.TILE_SIZE || nextY > this.water.level) {
      this.gameOver = true;
    }
  }

  checkForCollisions(player, map) {
    const nextX = player.x + player.xVel;
    const nextY = player.y + player.yVel;
    const nextPlayer = new Player([nextX, nextY], this.TILE_SIZE);
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

  handleFriction(timeDiff) {
    if (this.player.xVel > 0) {
      this.player.xVel -= this.FRICTION * timeDiff;
      if (this.player.xVel < 0) { this.player.xVel = 0; }
    } else if (this.player.xVel < 0) {
      this.player.xVel += this.FRICTION * timeDiff;
      if (this.player.xVel > 0) { this.player.xVel = 0; }
    }
  }

  handleGravity(timeDiff, player, map) {
    if (this.isStanding(player, map)) {
      player.yVel = 0;
    } else {
      player.yVel += this.GRAVITY * timeDiff;
      if (player.yVel > this.MAX_FALL_VEL) {
        player.yVel = this.MAX_FALL_VEL;
      }
    }
  }

  isStanding(player, map) {
    const tilePos = this.getTilePos(this.player.x, this.player.y - this.map.offSet);
    return (this.map.tile(tilePos[0]+1, tilePos[1]).collides || (this.player.x % this.TILE_SIZE !== 0 && this.map.tile(tilePos[0]+1, tilePos[1]+1).collides));
  }

  keyPress(event, pressed) {
    if (pressed) {
      this.keyDown = true;
    } else {
      this.keyDown = false;
    }
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
        if (this.score.checkIfHighScore()) {
          this.score.submitHighScore();
        }
        break;
      case "Backspace":
        if (this.score.checkIfHighScore() && this.keyDown) {
          this.score.name = this.score.name.slice(0, -1);
        }
        break;
      case " ":
        event.preventDefault();
        if (this.splashScreen) {
          this.now = Date.now();
          this.splashScreen = false;
        } else if(this.gameOver && this.score.checkIfHighScore() && this.keyDown) {
          this.score.name += " ";
        } else if (this.gameOver && !this.score.checkIfHighScore()) {
          this.newGame();
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
