import Tile from './tile';

class Map {

  constructor() {
    this.map = [];
  }

  tile(row, col) {
    return this.map[row][col];
  }

  nextRow() {

  }

  render(context) {
    this.map.forEach((row) => {
      row.forEach((tile) => {
        tile.render(context);
      });
    });
  }

  generateMap() {
    this.map = [];
    for(let i = 0; i < 50; i++) {
      this.map.push([]);
      for(let j = 0; j < 50; j++) {
        if (j === 0 || j === 49) {
          this.map[i].push(new Tile([j*10, i*10], true, 10, "red"));
        } else {
          this.map[i].push(new Tile([j*10, i*10], false, 10, "blue"));
        }
      }
    }
    this.map[22][9] = new Tile([90,220], true, 10, "green");
    this.map[22][10] = new Tile([100,220], true, 10, "green");
    this.map[22][11] = new Tile([110,220], true, 10, "green");
    this.map[21][6] = new Tile([60,210], true, 10, "green");
    this.map[21][7] = new Tile([70,210], true, 10, "green");
    this.map[21][8] = new Tile([80,210], true, 10, "green");
    this.map[20][16] = new Tile([160,200], true, 10, "green");
    this.map[20][17] = new Tile([170,200], true, 10, "green");
    this.map[20][18] = new Tile([180,200], true, 10, "green");
    this.map[15][22] = new Tile([220,150], true, 10, "green");
    this.map[15][23] = new Tile([230,150], true, 10, "green");
  }

}

export default Map;
