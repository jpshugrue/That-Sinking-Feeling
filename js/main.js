$(() => {
  const canvas = document.getElementById('gameCanvas');
  const context = canvas.getContext('2d');
  const board = new Board(context);
});



class Player {

}

class Board {

  constructor(context) {
    this.TILE_SIZE = 10;
    this.BOARD_DIM = 500;

    this.map = this.generateMap();
    this.render(context);
  }

  generateMap() {
    let map = [];
    for(let i = 0; i < 50; i++) {
      map.push([]);
      for(let j = 0; j < 50; j++) {
        map[i][j] = new Tile([i*10, j*10], false, 10, "blue");
      }
    }
    return map;
  }

  render(context) {
    for(let i = 0; i < 50; i++) {
      for(let j = 0; j < 50; j++) {
        context.fillStyle = this.map[i, j];
        context.fillRect(i * 10, j * 10, 10, 10);
      }
    }
    // render player
    context.fillStyle = "yellow";
    context.fillRect(100, 100, 10, 10);
  }

}

class Tile {

  constructor(position, collides, size, color) {
    this.color = color;
    this.size = size;
    this.x = position[0];
    this.y = position[1];
    this.collides = collides;
  }

  inCollision(tile) {
    return (this.x + this.size <= tile.x || this.x >= tile.x + tile.size
      || this.y + this.size <= tile.y || this.y >= tile.y + tile.size);
  }

}
