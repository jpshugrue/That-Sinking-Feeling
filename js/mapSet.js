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
    // debugger


    // this.generateBlankRow = this.generateBlankRow.bind(this);
  }

  getRow() {
    // debugger
    if (this.set.length === 0) {
      this.set = this.generateSet();
    }
    return this.set.pop();
  }

  generateSet() {
    //select randomly from allSets and return picked set
  }

  translate(set) {
    const translation = [];
    for(let i = 0; i <= this.numTiles; i++) {
      const tempRow = this.generateBlankRow();
      if (Object.keys(set).includes(`${i}`)) {
        // debugger
        set[`${i}`].forEach((col) => {
          tempRow[col].collides = true;
        });
      }
      translation.push(tempRow);
    }
    // debugger
    return translation;
  }

  generateBlankRow() {
    // debugger
    const blankRow = [];
    for(let i = 0; i < this.numTiles; i++) {
      // debugger
      if (i === 0) {
        blankRow.push(new Tile([i * this.tileSize, 0], true, this.tileSize, this.leftWallImg));
      } else if(i === this.numTiles - 1) {
        blankRow.push(new Tile([i * this.tileSize, 0], true, this.tileSize, this.rightWallImg));
      } else {
        blankRow.push(new Tile([i * this.tileSize, 0], false, this.tileSize, this.platformImg));
      }
    }
    // debugger
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
    return translatedSet;
  }

  populateSets() {

  }

}

export default MapSet;
