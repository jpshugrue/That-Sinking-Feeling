import Tile from './tile';
import MapSet from './mapSet';

class Map {

  constructor(boardDim, tileSize, context) {
    this.boardDim = boardDim;
    this.tileSize = tileSize;
    this.context = context;
    this.map = [];
    this.mapSet = new MapSet(this.tileSize, this.boardDim);
    this.numTiles = this.boardDim / this.tileSize;
    this.offSet = 0;
  }

  tile(row, col) {
    return this.map[row][col];
  }

  nextRow() {
    for(let idx = this.map.length - 1; idx >= 0; idx--) {
      if (idx === 0) {
        this.map[idx] = this.mapSet.getRow();
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
      this.map.unshift(this.mapSet.getRow());
      this.map[0].forEach((tile) => {
        tile.y = this.boardDim - ((i+1) * this.tileSize);
      });
    }
  }

}

export default Map;
