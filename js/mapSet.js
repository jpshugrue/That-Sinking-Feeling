import Tile from './tile';

class MapSet {

  constructor(tileSize, boardDim) {
    this.tileSize = tileSize;
    this.boardDim = boardDim;
    this.numTiles = this.boardDim / this.tileSize;

    this.leftWallImg = new Image(this.tileSize, this.tileSize);
    this.leftWallImg.src = 'images/sprites/left_wall.gif';
    this.rightWallImg = new Image(this.tileSize, this.tileSize);
    this.rightWallImg.src = 'images/sprites/right_wall.gif';
    this.platformImg = new Image(this.tileSize, this.tileSize);
    this.platformImg.src = 'images/sprites/platform.gif';

    this.allSets = this.populateSets();
    this.set = this.generateFirstSet();
  }

  getRow() {
    if (this.set.length === 0) {
      this.set = this.generateSet().slice();
    }
    return this.set.shift();
  }

  generateSet() {
    const randIdx = Math.floor(Math.random() * this.allSets.length);
    return this.allSets[randIdx];
  }

  translate(set) {
    const translation = [];
    for(let i = 0; i <= this.numTiles; i++) {
      const tempRow = this.generateBlankRow();
      if (Object.keys(set).includes(`${i}`)) {
        set[`${i}`].forEach((col) => {
          tempRow[col].collides = true;
        });
      }
      translation.push(tempRow);
    }
    return translation;
  }

  generateBlankRow() {
    const blankRow = [];
    for(let i = 0; i < this.numTiles; i++) {
      if (i === 0) {
        blankRow.push(new Tile([i * this.tileSize, 0], true, this.tileSize, this.leftWallImg));
      } else if(i === this.numTiles - 1) {
        blankRow.push(new Tile([i * this.tileSize, 0], true, this.tileSize, this.rightWallImg));
      } else {
        blankRow.push(new Tile([i * this.tileSize, 0], false, this.tileSize, this.platformImg));
      }
    }
    return blankRow;
  }

  generateFirstSet() {
    const set =
      {34: [29,30,31,32,33,34,35,36],
       29: [22,23,24,25],
       24: [1,2,3,4,5,6],
       23: [1,2,3,4,5,6,7,8,9,10],
       22: [1,2,3,4,5,6,7,8,9,10,30,31,32,33,34,35,36],
       16: [15,16,17,18,19,20],
       10: [1,2,3,4,5,6,7,8,9,26,27,28,29,30,31,32,33,34,35,36],
       4: [16,17,18,19,20,21,22],
       3: [15,16,17,18,19,20,21,22],
       2: [14,15,16,17,18,19,20,21,22],
       1: [13,14,15,16,17,18,19,20,21,22],
       0: [12,13,14,15,16,17,18,19,20,21,22]
    };
    const translatedSet = this.translate(set);
    // debugger
    return translatedSet;
  }

  populateSets() {
    let sets = [];
    sets.push({
      35: [28,29,30,31,32],
      30: [1,2,3,4,5,6,7],
      29: [21,22,23,24],
      22: [27,28,29,30,31],
      21: [1,2,3,4,5,6,7],
      14: [22,23,24,25,26],
      12: [1,2,3,4,5,6,7],
      7: [15,16,17,18,19],
      0: [13,14,15,16,17,18,19,20,21,22,23]
    });
    sets = sets.map(this.translate.bind(this));
    return sets;
  }

}

export default MapSet;
