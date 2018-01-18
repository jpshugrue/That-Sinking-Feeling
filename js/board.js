import Player from './player';
import Tile from './tile';

class Board {

  constructor(context) {
    this.context = context;

    this.TILE_SIZE = 10;
    this.BOARD_DIM = 500;
    this.MAX_HORIZONTAL_VEL = 20;
    this.MAX_VERTICAL_VEL = -3;
    this.FRICTION = 10;
    this.GRAVITY = 3;

    this.gameOver = false;

    this.map = this.generateMap();
    this.player = new Player([100,200], this.TILE_SIZE);

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
    this.update(timeDiff, this.player, this.map);
    this.render();
    window.requestAnimationFrame(this.main);
  }

  update(timeDiff, player, map) {
    if (player.left) {
      player.xVel = (player.xVel - (this.MAX_HORIZONTAL_VEL * timeDiff));
      if (Math.abs(player.xVel) > this.MAX_HORIZONTAL_VEL) { player.xVel = -(this.MAX_HORIZONTAL_VEL); }
    }
    if (player.right) {
      player.xVel = (player.xVel + (this.MAX_HORIZONTAL_VEL * timeDiff));
      if (player.xVel > this.MAX_HORIZONTAL_VEL) { player.xVel = this.MAX_HORIZONTAL_VEL; }
    }
    if (player.jump) {
      if (player.yVel === 0) { player.yVel = this.MAX_VERTICAL_VEL; }
    }
    this.checkForBoundaries(player);
    if (!this.gameOver) {

    }
    this.checkForCollisions(player, map);
    if (player.left || player.right) {
      player.x += player.xVel;
    }
    player.y += player.yVel;

    this.handleFriction(timeDiff);
    this.handleGravity(timeDiff, player);
  }

  getTilePos(x, y) {
    const column = Math.floor(x / this.TILE_SIZE);
    const row = Math.floor(y / this.TILE_SIZE);
    return [row, column];
  }

  checkForBoundaries(player) {
    const nextX = player.x + player.xVel;
    const nextY = player.y + player.yVel;
    if (nextY > this.BOARD_DIM) {
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
      if ((nextY % this.TILE_SIZE < 1 && map[nextRow][nextCol].collides) ||
        (nextY % this.TILE_SIZE >= 1 && (map[nextRow][nextCol].collides || map[nextRow+1][nextCol].collides))) {
          player.xVel = 0;
          player.x = map[nextRow][nextCol].x + this.TILE_SIZE;
          nextCol += 1;
      }
    } else if (player.xVel > 0) {
      if ((nextY % this.TILE_SIZE < 1 && map[nextRow][nextCol+1].collides) ||
        (nextY % this.TILE_SIZE >= 1 && (map[nextRow][nextCol+1].collides || map[nextRow+1][nextCol+1].collides))) {
          player.xVel = 0;
          player.x = map[nextRow][nextCol+1].x - this.TILE_SIZE;
      }
    }
    if (player.yVel < 0) {
      if ((player.x % this.TILE_SIZE < 1 && map[nextRow][nextCol].collides) ||
        (player.x % this.TILE_SIZE >= 1 && (map[nextRow][nextCol].collides || map[nextRow][nextCol+1].collides))) {
          player.yVel = 0;
          player.y = map[nextRow][nextCol].y + this.TILE_SIZE;
      }
    } else if (player.yVel > 0) {
      if ((player.x % this.TILE_SIZE < 1 && map[nextRow+1][nextCol].collides) ||
        (player.x % this.TILE_SIZE >= 1 && (map[nextRow+1][nextCol].collides || map[nextRow+1][nextCol+1].collides))) {
          player.yVel = 0;
          player.y = map[nextRow+1][nextCol].y - this.TILE_SIZE;
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

  isStanding(player, map) {
    const thisPos = this.getTilePos(this.player.x, this.player.y);
    return ((player.x % this.TILE_SIZE < 1 && this.map[thisPos[0]+1][thisPos[1]].collides) ||
      (player.x % this.TILE_SIZE >= 1 && (this.map[thisPos[0]+1][thisPos[1]].collides || this.map[thisPos[0]+1][thisPos[1]+1].collides)));
  }

  handleGravity(timeDiff, player) {
    if (this.isStanding(player)) {
      player.yVel = 0;
    } else {
      player.yVel += this.GRAVITY * timeDiff;
      if (player.yVel > 3) {
        player.yVel = 3;
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

  generateMap() {
    let map = [];
    for(let i = 0; i < 50; i++) {
      map.push([]);
      for(let j = 0; j < 50; j++) {
        if (j === 0 || j === 49) {
          map[i].push(new Tile([j*10, i*10], true, 10, "red"));
        } else {
          map[i].push(new Tile([j*10, i*10], false, 10, "blue"));
        }
      }
    }
    map[22][9] = new Tile([90,220], true, 10, "green");
    map[22][10] = new Tile([100,220], true, 10, "green");
    map[22][11] = new Tile([110,220], true, 10, "green");
    map[21][6] = new Tile([60,210], true, 10, "green");
    map[21][7] = new Tile([70,210], true, 10, "green");
    map[21][8] = new Tile([80,210], true, 10, "green");
    map[20][16] = new Tile([160,200], true, 10, "green");
    map[20][17] = new Tile([170,200], true, 10, "green");
    map[20][18] = new Tile([180,200], true, 10, "green");
    map[15][22] = new Tile([220,150], true, 10, "green");
    map[15][23] = new Tile([230,150], true, 10, "green");
    return map;
  }
}

export default Board;
