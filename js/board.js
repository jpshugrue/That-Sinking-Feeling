import Player from './player';
import Tile from './tile';

class Board {

  constructor(context) {
    this.context = context;

    this.TILE_SIZE = 10;
    this.BOARD_DIM = 500;
    this.MAX_HORIZONTAL_VEL = 20;
    this.MAX_VERTICAL_VEL = 50;
    this.FRICTION = 10;
    this.GRAVITY = 100;

    this.map = this.generateMap();
    this.player = new Player([100,200], this.TILE_SIZE);
    // this.player = new Player([100, 200], this.TILE_SIZE);

    document.addEventListener('keydown', (event) => (this.keyPress(event, true)));
    document.addEventListener('keyup', (event) => (this.keyPress(event, false)));

    this.now = Date.now();

    this.main = this.main.bind(this);
    this.main();
  }

  main() {
    let then = this.now;
    this.now = Date.now();
    let timeDiff = (this.now - then) / 1000.0;
    this.update(timeDiff);
    this.render();
    window.requestAnimationFrame(this.main);
  }

  update(timeDiff) {
    if (this.player.left) {
      this.player.xVel = (this.player.xVel - (this.MAX_HORIZONTAL_VEL * timeDiff));
      this.checkForCollisions();
      if (this.player.xVel > this.MAX_HORIZONTAL_VEL) { this.player.xVel = this.MAX_HORIZONTAL_VEL; }
      this.player.x += this.player.xVel;
    }
    if (this.player.right) {
      this.player.xVel = (this.player.xVel + (this.MAX_HORIZONTAL_VEL * timeDiff));
      this.checkForCollisions();
      if (Math.abs(this.player.xVel) > this.MAX_HORIZONTAL_VEL) { this.player.xVel = -(this.MAX_HORIZONTAL_VEL); }
      this.player.x += this.player.xVel;
    }
    if (this.player.jump) {
      this.player.y -= this.MAX_VERTICAL_VEL * timeDiff;
    }

    this.handleFriction(timeDiff);
    // this.handleGravity(timeDiff);
  }

  getTilePos(x, y) {
    const column = Math.floor(x / this.TILE_SIZE);
    const row = Math.floor(y / this.TILE_SIZE);
    return [column, row];
  }

  checkForCollisions() {
    const nextX = this.player.x + this.player.xVel;
    const nextY = this.player.y + this.player.yVel;
    let tilePos = this.getTilePos(nextX, nextY);
    if (this.player.xVel < 0) {
      if (this.player.x % this.TILE_SIZE === 0 && this.map[tilePos[0]][tilePos[1]].collides) {
        this.player.xVel = 0;
        this.player.x = this.map[tilePos[0]][tilePos[1]].x + this.TILE_SIZE;
      } else if (this.map[tilePos[0]][tilePos[1]].collides || this.map[tilePos[0]][tilePos[1]+1].collides) {
        this.player.xVel = 0;
        this.player.x = this.map[tilePos[0]][tilePos[1]].x + this.TILE_SIZE;
      }
    } else if (this.player.xVel > 0) {
      if (this.player.x % this.TILE_SIZE === 0 && this.map[tilePos[0]+1][tilePos[1]].collides) {
        this.player.xVel = 0;
        this.player.x = this.map[tilePos[0]+1][tilePos[1]].x - this.TILE_SIZE;
      } else if (this.map[tilePos[0]+1][tilePos[1]].collides || this.map[tilePos[0]+1][tilePos[1]+1].collides) {
        this.player.xVel = 0;
        this.player.x = this.map[tilePos[0]+1][tilePos[1]].x - this.TILE_SIZE;
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

  keyPress(event, pressed) {
    switch(event.key) {
      case "ArrowLeft":
        this.player.left = pressed;
        break;
      case "ArrowRight":
        this.player.right = pressed;
        break;
      case " ":
        event.preventDefault();
        this.player.jump = pressed;
    }
  }

  generateMap() {
    let map = [];
    for(let i = 0; i < 50; i++) {
      map.push([]);
      for(let j = 0; j < 50; j++) {
        map[i][j] = new Tile([i*10, j*10], false, 10, "blue");
      }
    }
    map[10][10] = new Tile([100,100], true, 10, "green");
    return map;
  }

  render() {
    this.map.forEach((row, vertical) => {
      row.forEach((tile, horizontal) => {
        this.context.fillStyle = tile.color;
        this.context.fillRect(horizontal * this.TILE_SIZE, vertical * this.TILE_SIZE, this.TILE_SIZE, this.TILE_SIZE);
      });
    });
    this.context.fillStyle = "yellow";
    this.context.fillRect(this.player.x, this.player.y, this.TILE_SIZE, this.TILE_SIZE);
  }
}

export default Board;
