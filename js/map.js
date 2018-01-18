import Tile from './tile';

class Map {

  constructor(boardDim, tileSize, context) {
    this.boardDim = boardDim;
    this.tileSize = tileSize;
    this.context = context;
    this.map = [];
    this.rowsWoPlatform = 0;
    this.numTiles = this.boardDim / this.tileSize;
    this.offSet = 0;
  }

  tile(row, col) {
    return this.map[row][col];
  }

  nextRow() {
    for(let idx = this.map.length - 1; idx >= 0; idx--) {
      if (idx === 0) {
        this.map[idx] = this.generateRow();
        this.map[idx].forEach((tile) => {
          tile.y = -this.tileSize;
        });
      } else {
        this.map[idx] = this.map[idx - 1];
      }
    }
  }

  nextPixel() {
    this.offSet += 1;
    this.map.forEach((row) => {
      row.forEach((tile) => {
          tile.y += 1;
      });
    });
    if (this.map[0][0].y === 0 ) {
      this.offSet = 0;
      this.nextRow();
    }
    // debugger
  }

  generateRow() {
    let newRow = [];
    let platform, platformPos;
    if (this.rowsWoPlatform > 4 || Math.random() < 0.2) {
      platform = this.generatePlatform();
      platformPos = Math.floor(Math.random() * (this.numTiles - platform.length));
      if (platformPos < 0) { platformPos = 0; }
      this.rowsWoPlatform = 0;
    } else {
      this.rowsWoPlatform += 1;
    }
    for(let i = 0; i < this.numTiles; i++) {
      if (i === 0 || i === this.numTiles - 1) {
        newRow.push(new Tile([i * this.tileSize, 0], true, this.tileSize, "red"));
      } else {
        newRow.push(new Tile([i * this.tileSize, 0], false, this.tileSize, "blue"));
      }
    }
    if (platform) {
      for(let i = 0; i < platform.length; i++) {
        platform[i].x = this.tileSize * (platformPos + i);
        newRow[platformPos + i] = platform[i];
      }
    }
    return newRow;
  }

  generatePlatform() {
    const length = Math.floor(Math.random() * (this.numTiles / 2 - 4)) + 3;
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
    this.map = [];
    for(let i = 0; i <= this.numTiles; i++) {
      this.map.push(this.generateRow());
      this.map[i].forEach((tile) => {
        tile.y = (i-1)*this.tileSize;
      });
    }
    this.map[41][25] = new Tile([250,400], false, 10, "blue");
    this.map[42][25] = new Tile([250,410], true, 10, "green");
  }

}

export default Map;
