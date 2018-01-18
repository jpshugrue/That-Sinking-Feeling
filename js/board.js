import Player from './player';
import Tile from './tile';

class Board {

  constructor(context) {
    this.context = context;

    this.TILE_SIZE = 10;
    this.BOARD_DIM = 500;
    this.MAX_HORIZONTAL_VEL = 20;
    this.MAX_VERTICAL_VEL = -2;
    this.FRICTION = 10;
    this.GRAVITY = 3;

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
    if (this.player.left) {
      this.player.xVel = (this.player.xVel - (this.MAX_HORIZONTAL_VEL * timeDiff));
      this.checkForCollisions(player, map);
      if (Math.abs(this.player.xVel) > this.MAX_HORIZONTAL_VEL) { this.player.xVel = -(this.MAX_HORIZONTAL_VEL); }
      this.player.x += this.player.xVel;
    }
    if (this.player.right) {
      this.player.xVel = (this.player.xVel + (this.MAX_HORIZONTAL_VEL * timeDiff));
      this.checkForCollisions(player, map);
      if (this.player.xVel > this.MAX_HORIZONTAL_VEL) { this.player.xVel = this.MAX_HORIZONTAL_VEL; }
      this.player.x += this.player.xVel;
    }
    if (this.player.jump) {
     if (this.player.yVel === 0) { this.player.yVel = this.MAX_VERTICAL_VEL; }
    }
    this.checkForCollisions(player, map);
    this.player.y += this.player.yVel;

    this.handleFriction(timeDiff);
    this.handleGravity(timeDiff);
  }

  getTilePos(x, y) {
    const column = Math.floor(x / this.TILE_SIZE);
    const row = Math.floor(y / this.TILE_SIZE);
    return [row, column];
  }

  checkForCollisions(player, map) {
    const nextX = player.x + player.xVel;
    const nextY = player.y + player.yVel;
    const tilePos = this.getTilePos(nextX, nextY);
    const nextRow = tilePos[0];
    const nextCol = tilePos[1];

    if (player.xVel < 0) {
      if ((player.y % this.TILE_SIZE < 1 && map[nextRow][nextCol].collides) ||
        (player.y % this.TILE_SIZE >= 1 && (map[nextRow][nextCol].collides || map[nextRow+1][nextCol].collides))) {
          player.xVel = 0;
          player.x = map[nextRow][nextCol].x + this.TILE_SIZE;
      }
    } else if (player.xVel > 0) {
      if ((player.y % this.TILE_SIZE < 1 && map[nextRow][nextCol+1].collides) ||
        (player.y % this.TILE_SIZE >= 1 && (map[nextRow][nextCol+1].collides || map[nextRow+1][nextCol+1].collides))) {
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

  isStanding() {
    const thisPos = this.getTilePos(this.player.x, this.player.y);
    return this.map[thisPos[0]+1][thisPos[1]].collides;
  }

  handleGravity(timeDiff) {
    if (this.isStanding()) {
      this.player.yVel = 0;
    } else {
      this.player.yVel += this.GRAVITY * timeDiff;
      if (this.player.yVel > 3) {
        this.player.yVel = 3;
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
        map[i].push(new Tile([j*10, i*10], false, 10, "blue"));
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
