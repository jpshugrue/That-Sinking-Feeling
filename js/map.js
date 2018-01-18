import Tile from './tile';

class Map {

  constructor(boardDim, tileSize, context) {
    this.boardDim = boardDim;
    this.tileSize = tileSize;
    this.context = context;
    this.map = [];
    this.rowsWoPlatform = 0;
  }

  tile(row, col) {
    return this.map[row][col];
  }

  nextRow() {
    this.map.forEach((row, idx) => {
      if (idx === this.map.length - 1) {
        this.map[idx] = this.generateRow();
      } else {
        row.forEach((tile) => {
          tile.y = tile.y + this.tileSize;
        });
        this.map[idx] = this.map[idx + 1];
      }
    });
  }

  generateRow() {
    let newRow = [];
    const numTiles = this.boardDim / this.tileSize;
    let platform, platformPos;
    if (this.rowsWoPlatform > 4 || Math.random() < 0.2) {
      platform = this.generatePlatform();
      platformPos = Math.floor(Math.random() * numTiles) - platform.length;
      // This way may result in left biased placement of platforms
      if (platformPos < 0) { platformPos = 0; }
      this.rowsWoPlatform = 0;
    } else {
      this.rowsWoPlatform += 1;
    }
    for(let i = 0; i < numTiles; i++) {
      newRow.push(new Tile([i * this.tileSize, 0], false, this.tileSize, "blue"));
    }
    if (platform) {
      for(let i = 0; i < platform.length; i++) {
        platform[i].x = this.tileSize * (platformPos + i);
        newRow[platformPos + i] = platform[i];
      }
    }
  }

  generatePlatform() {
    const length = Math.floor(Math.random() * (this.numTiles / 2 - 2)) + 3;
    let platform = [];
    for (let i = 0; i < length; i++) {
      platform.push(new Tile([0, 0], true, this.tileSize, "green"));
    }
    return platform;
  }

  render() {
    this.map.forEach((row) => {
      row.forEach((tile) => {
        tile.render(this.context);
      });
    });
  }

  generateMap(boardDim, tileSize) {
    const numTiles = this.boardDim / this.tileSize;
    this.map = [];
    for(let i = 0; i < numTiles; i++) {
      this.map.push([]);
      for(let j = 0; j < numTiles; j++) {
        if (j === 0 || j === numTiles-1) {
          this.map[i].push(new Tile([j*this.tileSize, i*this.tileSize], true, this.tileSize, "red"));
        } else {
          this.map[i].push(new Tile([j*this.tileSize, i*this.tileSize], false, this.tileSize, "blue"));
        }
      }
    }
    this.map[26][25] = new Tile([250,260], true, 10, "green");
    this.map[19][26] = new Tile([260,190], true, 10, "green");
    this.map[26][5] = new Tile([50,260], true, 10, "green");
    // this.map[22][10] = new Tile([100,220], true, 10, "green");
    // this.map[22][11] = new Tile([110,220], true, 10, "green");
    // this.map[21][6] = new Tile([60,210], true, 10, "green");
    // this.map[21][7] = new Tile([70,210], true, 10, "green");
    // this.map[21][8] = new Tile([80,210], true, 10, "green");
    // this.map[20][16] = new Tile([160,200], true, 10, "green");
    // this.map[20][17] = new Tile([170,200], true, 10, "green");
    // this.map[20][18] = new Tile([180,200], true, 10, "green");
    // this.map[15][22] = new Tile([220,150], true, 10, "green");
    // this.map[15][23] = new Tile([230,150], true, 10, "green");
  }

}

export default Map;
