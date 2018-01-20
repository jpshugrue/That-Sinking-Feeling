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

  reset() {
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
    const set = {
       36: [1,2,3],
       34: [29,30,31,32,33,34,35,36],
       29: [1,2,3,4,5,22,23,24,25],
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
    sets.push(
    {
      33: [28,29,30,31,32],
      32: [1,2,3,4,5,6,7],
      27: [21,22,23,24],
      26: [1,2,3,4,5,6,7],
      20: [27,28,29,30,31],
      19: [1,2,3,4,5,6,7],
      13: [22,23,24,25,26],
      12: [1,2,3,4,5,6,7],
      7: [15,16,17,18,19],
      0: [13,14,15,16,17,18,19,20,21,22,23]
    },
    {
      35: [3,4,5,32,33,34],
      34: [3,34],
      33: [3,34],
      32: [3,34],
      31: [3,4,5,6,31,32,33,34],
      30: [17,18,19],
      24: [7,8,9,10,11,25,26,27,28,29],
      20: [18],
      19: [17,18,19],
      18: [16,17,18,19,20],
      17: [15,16,17,18,19,20,21],
      16: [16,17,18,19,20],
      15: [17,18,19],
      14: [18],
      13: [1,2,3,4,33,34,35,36],
      12: [1,2,3,4,5,32,33,34,35,36],
      11: [1,2,3,4,5,6,31,32,33,34,35,36],
      10: [1,2,3,4,5,6,7,30,31,32,33,34,35,36],
      9: [1,2,3,4,5,6,7,8,29,30,31,32,33,34,35,36],
      8: [1,2,3,4,5,6,7,8,9,28,29,30,31,32,33,34,35,36],
      7: [1,2,3,4,5,6,7,8,9,10,27,28,29,30,31,32,33,34,35,36],
      6: [1,2,3,4,5,6,7,8,9,10,11,26,27,28,29,30,31,32,33,34,35,36],
      0: [13,14,15,16,17,18,19,20,21,22,23]
    },
    {
      35: [9,10,11,12,13,14,23,24,25,26,27,28],
      29: [16,17,18,19,20,21,22],
      22: [23,24,25,26,27,28],
      21: [9,10,11,12,13,14],
      14: [16,17,18,19,20,21,22],
      7: [9,10,11,12,13,14,15],
      0: [13,14,15,16,17,18,19,20,21,22,23]
    },
    {
      35: [1,2,3,4,33,34,35,36],
      29: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36],
      23: [7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31],
      16: [1,2,3,4,5,6,7,30,31,32,33,34,35,36],
      15: [7,8,29,30],
      14: [8,9,28,29],
      13: [9,10,27,28],
      12: [10,11,26,27],
      11: [11,12,25,26],
      10: [12,13,24,25],
      9: [13,14,23,24],
      8: [14,15,22,23],
      7: [15,16,21,22],
      6: [16,17,20,21],
      0: [13,14,15,16,17,18,19,20,21,22,23]
    },
      {
        33: [7,8,9,29,30,31],
        28: [1,2,35,36],
        21: [10,11,28,29],
        14: [1,2,3,18,19,20,34,35,36],
        7: [13,14,15,22,23,24],
        0: [13,14,15,16,17,18,19,20,21,22,23]
      }
    );
    sets = sets.map(this.translate.bind(this));
    return sets;
  }

}

export default MapSet;
