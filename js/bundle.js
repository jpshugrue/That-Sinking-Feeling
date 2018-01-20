/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/js/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__game__ = __webpack_require__(1);


$(() => {
  const game = new __WEBPACK_IMPORTED_MODULE_0__game__["a" /* default */]();
  game.main();
});


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__player__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__map__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__water__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__background__ = __webpack_require__(7);





class Game {

  constructor() {
    const canvas = document.getElementById('gameCanvas');
    this.context = canvas.getContext('2d');

    this.TILE_SIZE = 16;
    this.BOARD_DIM = 608;
    this.MAX_HORIZONTAL_VEL = 22;
    this.MAX_JUMP_VEL = -8;
    this.MAX_FALL_VEL = 32;
    this.FRICTION = 16;
    this.GRAVITY = 16;

    this.gameOver = false;

    this.map = new __WEBPACK_IMPORTED_MODULE_1__map__["a" /* default */](this.BOARD_DIM, this.TILE_SIZE, this.context);
    this.map.generateMap(this.BOARD_DIM, this.TILE_SIZE);
    this.player = new __WEBPACK_IMPORTED_MODULE_0__player__["a" /* default */]([330,500], this.TILE_SIZE);

    document.addEventListener('keydown', (event) => (this.keyPress(event, true)));
    document.addEventListener('keyup', (event) => (this.keyPress(event, false)));

    this.now = Date.now();

    this.main = this.main.bind(this);

    this.background = new __WEBPACK_IMPORTED_MODULE_3__background__["a" /* default */](this.context, this.BOARD_DIM);

    this.water = new __WEBPACK_IMPORTED_MODULE_2__water__["a" /* default */](this.TILE_SIZE, this.BOARD_DIM, this.context);
  }

  main() {
    let then = this.now;
    this.now = Date.now();
    let timeDiff = (this.now - then) / 1000.0;
    if (this.gameOver) {
      this.endGame();
    } else {
      this.update(timeDiff, this.player, this.map);

      this.render();
    }

    window.requestAnimationFrame(this.main);
  }

  render() {
    this.context.clearRect(0, 0, this.BOARD_DIM, this.BOARD_DIM);
    this.background.render();
    this.map.render(this.context);
    this.player.render(this.context);
    this.water.render();
  }

  endGame() {
    this.context.font = "30px Arial";
    this.context.fillText("Game Over",200,200);
  }

  update(timeDiff, player, map) {
    if (player.left) {
      if (player.xVel > 0 ) { player.xVel = 0; }
      player.xVel = (player.xVel - (this.MAX_HORIZONTAL_VEL * timeDiff));
      if (Math.abs(player.xVel) > this.MAX_HORIZONTAL_VEL) { player.xVel = -(this.MAX_HORIZONTAL_VEL); }
    }
    if (player.right) {
      if (player.xVel < 0 ) { player.xVel = 0; }
      player.xVel = (player.xVel + (this.MAX_HORIZONTAL_VEL * timeDiff));
      if (player.xVel > this.MAX_HORIZONTAL_VEL) { player.xVel = this.MAX_HORIZONTAL_VEL; }
    }
    if (player.jump) {
      if (player.yVel === 0) { player.yVel = this.MAX_JUMP_VEL; }
    }
    this.checkForGameOver(player);
    if (!this.gameOver) {
      this.checkForCollisions(player, map);
      if (player.left || player.right) {
        player.x += player.xVel;
      }
      player.y += player.yVel;
      this.handleFriction(timeDiff);
      this.handleGravity(timeDiff, player, map);
    }
    if (this.player.y < this.BOARD_DIM / 2) {
      this.map.nextPixel();
      this.water.nextPixel();
      this.background.panBackground();
      this.player.y += 1;
    }
    this.water.update(timeDiff);
  }

  getTilePos(x, y) {
    const column = Math.floor(x / this.TILE_SIZE);
    const row = Math.floor(y / this.TILE_SIZE);
    return [row + 1, column];
  }

  checkForGameOver(player) {
    const nextY = player.y + player.yVel;
    if (nextY > this.BOARD_DIM - this.TILE_SIZE || nextY > this.water.level) {
      this.gameOver = true;
    }
  }

  checkForCollisions(player, map) {
    const nextX = player.x + player.xVel;
    const nextY = player.y + player.yVel;
    const nextPlayer = new __WEBPACK_IMPORTED_MODULE_0__player__["a" /* default */]([nextX, nextY], this.TILE_SIZE);
    const tilePos = this.getTilePos(nextX, nextY - map.offSet);
    let nextRow = tilePos[0];
    let nextCol = tilePos[1];

    if (nextRow < 0) {
      nextRow = 0;
      player.yVel = 0.01;
      player.y = 0;
    }
    if (player.xVel < 0) {
      if(map.tile(nextRow, nextCol).inCollision(nextPlayer) || map.tile(nextRow+1, nextCol).inCollision(nextPlayer)) {
        // debugger
        player.xVel = 0;
        player.x = map.tile(nextRow, nextCol).x + this.TILE_SIZE;
        nextCol += 1;
      }
    } else if (player.xVel > 0) {
      if(map.tile(nextRow, nextCol+1).inCollision(nextPlayer) || map.tile(nextRow+1, nextCol+1).inCollision(nextPlayer)) {
        player.xVel = 0;
        player.x = map.tile(nextRow, nextCol+1).x - this.TILE_SIZE;
      }
    }
    if (player.yVel < 0) {
      if(map.tile(nextRow, nextCol).inCollision(nextPlayer) || map.tile(nextRow, nextCol+1).inCollision(nextPlayer)) {
        player.yVel = 0;
        player.y = map.tile(nextRow, nextCol).y + this.TILE_SIZE;
      }
    } else if (player.yVel > 0) {
      if(map.tile(nextRow+1, nextCol).inCollision(nextPlayer) || map.tile(nextRow+1, nextCol+1).inCollision(nextPlayer)) {
        player.yVel = 0;
        player.y = map.tile(nextRow+1, nextCol).y - this.TILE_SIZE;
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
    const tilePos = this.getTilePos(this.player.x, this.player.y - this.map.offSet);
    return (this.map.tile(tilePos[0]+1, tilePos[1]).collides || this.map.tile(tilePos[0]+1, tilePos[1]+1).collides);
  }

  handleGravity(timeDiff, player, map) {
    if (this.isStanding(player, map)) {
      player.yVel = 0;
    } else {
      player.yVel += this.GRAVITY * timeDiff;
      if (player.yVel > this.MAX_FALL_VEL) {
        player.yVel = this.MAX_FALL_VEL;
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

}

/* harmony default export */ __webpack_exports__["a"] = (Game);


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Player {

  constructor(startingPos, size) {
    this.x = startingPos[0];
    this.y = startingPos[1];
    this.xVel = 0;
    this.yVel = 0;
    this.size = size;
    this.left = false;
    this.right = false;
    this.jump = false;
  }

  render(context) {
    context.fillStyle = "white";
    context.fillRect(this.x, this.y, this.size, this.size);
  }
}

/* harmony default export */ __webpack_exports__["a"] = (Player);


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__tile__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__mapSet__ = __webpack_require__(6);



class Map {

  constructor(boardDim, tileSize, context) {
    this.boardDim = boardDim;
    this.tileSize = tileSize;
    this.context = context;
    this.map = [];
    this.mapSet = new __WEBPACK_IMPORTED_MODULE_1__mapSet__["a" /* default */](this.tileSize, this.boardDim);
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

/* harmony default export */ __webpack_exports__["a"] = (Map);


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Tile {

  constructor(position, collides, size, image) {
    this.image = image;
    this.size = size;
    this.x = position[0];
    this.y = position[1];
    this.collides = collides;
  }

  render(context) {
    if (this.collides) {
      context.drawImage(this.image, this.x, this.y);
    }
  }

  inCollision(player) {
    return (this.collides && !(this.x >= player.x + player.size || this.x + this.size <= player.x
      || this.y >= player.y + player.size || this.y + this.size <= player.y));
  }

}

/* harmony default export */ __webpack_exports__["a"] = (Tile);


/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Water {

  constructor(tileSize, boardDim, context) {
    this.tileSize = tileSize;
    this.boardDim = boardDim;
    this.context = context;

    this.waterImg1 = new Image(boardDim-this.tileSize, boardDim);
    this.waterImg1.src = 'images/sprites/water1.png';

    this.waterImg2 = new Image(boardDim-this.tileSize, boardDim);
    this.waterImg2.src = 'images/sprites/water2.png';

    this.waterImg = this.waterImg1;

    this.level = boardDim - (tileSize);
    this.speed = 60;
    this.animCounter = 0;
  }

  update(timeDiff) {
    this.level -= timeDiff * this.speed;
    this.animCounter += timeDiff;
    if (this.animCounter > 1) {
      this.animCounter = 0;
      this.animate();
    }
  }

  nextPixel() {
    this.level += 1;
  }

  animate() {
    if (this.waterImg === this.waterImg1) {
      this.waterImg = this.waterImg2;
    } else {
      this.waterImg = this.waterImg1;
    }
  }

  render() {
    this.context.save();
    this.context.globalAlpha = 0.7;
    this.context.drawImage(this.waterImg, this.tileSize, this.level);
    this.context.restore();
  }

}

/* harmony default export */ __webpack_exports__["a"] = (Water);


/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__tile__ = __webpack_require__(4);


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
        blankRow.push(new __WEBPACK_IMPORTED_MODULE_0__tile__["a" /* default */]([i * this.tileSize, 0], true, this.tileSize, this.leftWallImg));
      } else if(i === this.numTiles - 1) {
        blankRow.push(new __WEBPACK_IMPORTED_MODULE_0__tile__["a" /* default */]([i * this.tileSize, 0], true, this.tileSize, this.rightWallImg));
      } else {
        blankRow.push(new __WEBPACK_IMPORTED_MODULE_0__tile__["a" /* default */]([i * this.tileSize, 0], false, this.tileSize, this.platformImg));
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

/* harmony default export */ __webpack_exports__["a"] = (MapSet);


/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Background {

  constructor(context, boardDim) {
    this.context = context;
    this.boardDim = boardDim;

    this.bg1 = new Image(this.boardDim, this.boardDim);
    this.bg1.src = 'images/sprites/bg_orig.gif';
    this.bg1y = 0;

    this.bg2 = new Image(this.boardDim, this.boardDim);
    this.bg2.src = 'images/sprites/bg_orig.gif';
    this.bg2y = -this.boardDim;

    this.pixelCount = 0;
  }

  render() {
    this.context.drawImage(this.bg1, 0, this.bg1y);
    this.context.drawImage(this.bg2, 0, this.bg2y);
  }

  panBackground() {
    this.pixelCount += 1;
    if (this.pixelCount > 3) {
      this.pixelCount = 0;
      this.bg1y += 1;
      this.bg2y += 1;
      if (this.bg1y >= this.boardDim) {
        this.bg1y = -this.boardDim;
      } else if(this.bg2y >= this.boardDim) {
        this.bg2y = -this.boardDim;
      }
    }
  }

}

/* harmony default export */ __webpack_exports__["a"] = (Background);


/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map