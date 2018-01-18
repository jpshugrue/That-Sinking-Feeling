import Player from './player';
import Map from './map';

class Game {

  constructor() {
    const canvas = document.getElementById('gameCanvas');
    this.context = canvas.getContext('2d');

    this.TILE_SIZE = 10;
    this.BOARD_DIM = 500;
    this.MAX_HORIZONTAL_VEL = 20;
    this.MAX_JUMP_VEL = -3;
    this.MAX_FALL_VEL = 7;
    this.FRICTION = 10;
    this.GRAVITY = 5;

    this.gameOver = false;

    this.map = new Map;
    this.map.generateMap();

    this.player = new Player([100,200], this.TILE_SIZE);

    document.addEventListener('keydown', (event) => (this.keyPress(event, true)));
    document.addEventListener('keyup', (event) => (this.keyPress(event, false)));

    this.now = Date.now();

    this.main = this.main.bind(this);
  }

  main() {
    let then = this.now;
    this.now = Date.now();
    let timeDiff = (this.now - then) / 1000.0;
    if (this.gameOver) {
      this.endGame();
    } else {
      this.update(timeDiff, this.player, this.map);

      this.context.clearRect(0, 0, this.BOARD_DIM, this.BOARD_DIM);
      this.map.render(this.context);
      this.player.render(this.context);
    }

    window.requestAnimationFrame(this.main);
  }

  endGame() {
    this.context.font = "30px Arial";
    this.context.fillText("Game Over",200,200);
  }

  update(timeDiff, player, map) {
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
    this.checkForBoundaries(player);
    if (!this.gameOver) {
      this.checkForCollisions(player, map);
      if (player.left || player.right) {
        player.x += player.xVel;
      }
      player.y += player.yVel;
      this.handleFriction(timeDiff);
      this.handleGravity(timeDiff, player);
    }
  }

  getTilePos(x, y) {
    const column = Math.floor(x / this.TILE_SIZE);
    const row = Math.floor(y / this.TILE_SIZE);
    return [row, column];
  }

  checkForBoundaries(player) {
    const nextY = player.y + player.yVel;
    if (nextY > this.BOARD_DIM - this.TILE_SIZE) {
      this.gameOver = true;
    }
  }

  checkForCollisions(player, map) {
    const nextX = player.x + player.xVel;
    const nextY = player.y + player.yVel;
    const tilePos = this.getTilePos(nextX, nextY);
    let nextRow = tilePos[0];
    let nextCol = tilePos[1];

    if (nextRow < 0) {
      nextRow = 0;
      player.yVel = 0.01;
      player.y = 0;
    }
    if (player.xVel < 0) {
      if ((nextY % this.TILE_SIZE < 1 && map.tile(nextRow, nextCol).collides) ||
        (nextY % this.TILE_SIZE >= 1 && (map.tile(nextRow, nextCol).collides || map.tile(nextRow+1, nextCol).collides))) {
          player.xVel = 0;
          player.x = map.tile(nextRow, nextCol).x + this.TILE_SIZE;
          nextCol += 1;
      }
    } else if (player.xVel > 0) {
      if ((nextY % this.TILE_SIZE < 1 && map.tile(nextRow, nextCol+1).collides) ||
        (nextY % this.TILE_SIZE >= 1 && (map.tile(nextRow, nextCol+1).collides || map.tile(nextRow+1, nextCol+1).collides))) {
          player.xVel = 0;
          player.x = map.tile(nextRow, nextCol+1).x - this.TILE_SIZE;
      }
    }
    if (player.yVel < 0) {
      if ((player.x % this.TILE_SIZE < 1 && map.tile(nextRow, nextCol).collides) ||
        (player.x % this.TILE_SIZE >= 1 && (map.tile(nextRow, nextCol).collides || map.tile(nextRow, nextCol+1).collides))) {
          player.yVel = 0;
          player.y = map.tile(nextRow, nextCol).y + this.TILE_SIZE;
      }
    } else if (player.yVel > 0) {
      if ((player.x % this.TILE_SIZE < 1 && map.tile(nextRow+1, nextCol).collides) ||
        (player.x % this.TILE_SIZE >= 1 && (map.tile(nextRow+1, nextCol).collides || map.tile(nextRow+1, nextCol+1).collides))) {
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

  isStanding(player) {
    const thisPos = this.getTilePos(this.player.x, this.player.y);
    return ((player.x % this.TILE_SIZE < 1 && this.map.tile(thisPos[0]+1, thisPos[1]).collides) ||
      (player.x % this.TILE_SIZE >= 1 && (this.map.tile(thisPos[0]+1, thisPos[1]).collides || this.map.tile(thisPos[0]+1, thisPos[1]+1).collides)));
  }

  handleGravity(timeDiff, player) {
    if (this.isStanding(player)) {
      player.yVel = 0;
    } else {
      player.yVel += this.GRAVITY * timeDiff;
      if (player.yVel > this.MAX_FALL_VEL) {
        player.yVel = this.MAX_FALL_VEL;
      }
    }
  }

  keyPress(event, pressed) {
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
      case " ":
        event.preventDefault();
        this.player.jump = pressed;
    }
  }

}

export default Game;
