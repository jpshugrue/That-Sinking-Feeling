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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__map__ = __webpack_require__(4);



class Game {

  constructor() {
    const canvas = document.getElementById('gameCanvas');
    this.context = canvas.getContext('2d');

    this.TILE_SIZE = 10;
    this.BOARD_DIM = 500;
    this.MAX_HORIZONTAL_VEL = 14;
    this.MAX_JUMP_VEL = -5;
    this.MAX_FALL_VEL = 20;
    this.FRICTION = 10;
    this.GRAVITY = 10;

    this.gameOver = false;

    this.map = new __WEBPACK_IMPORTED_MODULE_1__map__["a" /* default */](this.BOARD_DIM, this.TILE_SIZE, this.context);
    this.map.generateMap(this.BOARD_DIM, this.TILE_SIZE);
    // debugger
    this.player = new __WEBPACK_IMPORTED_MODULE_0__player__["a" /* default */]([250,250], this.TILE_SIZE);

    document.addEventListener('keydown', (event) => (this.keyPress(event, true)));
    document.addEventListener('keyup', (event) => (this.keyPress(event, false)));

    this.now = Date.now();

    this.main = this.main.bind(this);
  }

  main() {
    let then = this.now;
    this.now = Date.now();
    let timeDiff = (this.now - then) / 1000.0;
    if (this.gameOver) {
      this.endGame();
    } else {
      this.update(timeDiff, this.player, this.map);

      this.context.clearRect(0, 0, this.BOARD_DIM, this.BOARD_DIM);
      this.map.render(this.context);
      this.player.render(this.context);
    }

    window.requestAnimationFrame(this.main);
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
    this.checkForBoundaries(player);
    if (!this.gameOver) {
      this.checkForCollisions(player, map);
      if (player.left || player.right) {
        player.x += player.xVel;
      }
      player.y += player.yVel;
      this.handleFriction(timeDiff);
      this.handleGravity(timeDiff, player);
    }
  }

  getTilePos(x, y) {
    const column = Math.floor(x / this.TILE_SIZE);
    const row = Math.floor(y / this.TILE_SIZE);
    return [row, column];
  }

  checkForBoundaries(player) {
    const nextY = player.y + player.yVel;
    if (nextY > this.BOARD_DIM - this.TILE_SIZE) {
      this.gameOver = true;
    }
  }

  checkForCollisions(player, map) {
    const nextX = player.x + player.xVel;
    const nextY = player.y + player.yVel;
    const tilePos = this.getTilePos(nextX, nextY);
    let nextRow = tilePos[0];
    let nextCol = tilePos[1];

    if (nextRow < 0) {
      nextRow = 0;
      player.yVel = 0.01;
      player.y = 0;
    }
    if (player.xVel < 0) {
      if ((nextY % this.TILE_SIZE < 1 && map.tile(nextRow, nextCol).collides) ||
        (nextY % this.TILE_SIZE >= 1 && (map.tile(nextRow, nextCol).collides || map.tile(nextRow+1, nextCol).collides))) {
          player.xVel = 0;
          player.x = map.tile(nextRow, nextCol).x + this.TILE_SIZE;
          nextCol += 1;
      }
    } else if (player.xVel > 0) {
      if ((nextY % this.TILE_SIZE < 1 && map.tile(nextRow, nextCol+1).collides) ||
        (nextY % this.TILE_SIZE >= 1 && (map.tile(nextRow, nextCol+1).collides || map.tile(nextRow+1, nextCol+1).collides))) {
          player.xVel = 0;
          player.x = map.tile(nextRow, nextCol+1).x - this.TILE_SIZE;
      }
    }
    if (player.yVel < 0) {
      if ((player.x % this.TILE_SIZE < 1 && map.tile(nextRow, nextCol).collides) ||
        (player.x % this.TILE_SIZE >= 1 && (map.tile(nextRow, nextCol).collides || map.tile(nextRow, nextCol+1).collides))) {
          player.yVel = 0;
          player.y = map.tile(nextRow, nextCol).y + this.TILE_SIZE;
      }
    } else if (player.yVel > 0) {
      if ((player.x % this.TILE_SIZE < 1 && map.tile(nextRow+1, nextCol).collides) ||
        (player.x % this.TILE_SIZE >= 1 && (map.tile(nextRow+1, nextCol).collides || map.tile(nextRow+1, nextCol+1).collides))) {
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

  isStanding(player) {
    const thisPos = this.getTilePos(this.player.x, this.player.y);
    return ((player.x % this.TILE_SIZE < 1 && this.map.tile(thisPos[0]+1, thisPos[1]).collides) ||
      (player.x % this.TILE_SIZE >= 1 && (this.map.tile(thisPos[0]+1, thisPos[1]).collides || this.map.tile(thisPos[0]+1, thisPos[1]+1).collides)));
  }

  handleGravity(timeDiff, player) {
    if (this.isStanding(player)) {
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
    context.fillStyle = "black";
    context.fillRect(this.x, this.y, this.size, this.size);
  }
}

/* harmony default export */ __webpack_exports__["a"] = (Player);


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Tile {

  constructor(position, collides, size, color) {
    this.color = color;
    this.size = size;
    this.x = position[0];
    this.y = position[1];
    this.collides = collides;
  }

  render(context) {
    if (this.collides) {
      context.fillStyle = this.color;
      context.fillRect(this.x, this.y, this.size, this.size);
    }
  }

  // inCollision(tile) {
  //   return (this.x + this.size <= tile.x || this.x >= tile.x + tile.size
  //     || this.y + this.size <= tile.y || this.y >= tile.y + tile.size);
  // }

}

/* harmony default export */ __webpack_exports__["a"] = (Tile);


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__tile__ = __webpack_require__(3);


class Map {

  constructor(boardDim, tileSize, context) {
    this.boardDim = boardDim;
    this.tileSize = tileSize;
    this.context = context;
    this.map = [];
    this.rowsWoPlatform = 0;
    this.numTiles = this.boardDim / this.tileSize;
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
    let platform, platformPos;
    if (this.rowsWoPlatform > 4 || Math.random() < 0.2) {
      platform = this.generatePlatform();
      platformPos = Math.floor(Math.random() * (this.numTiles - platform.length));
      // This way may result in left biased placement of platforms
      if (platformPos < 0) { platformPos = 0; }
      this.rowsWoPlatform = 0;
    } else {
      this.rowsWoPlatform += 1;
    }
    for(let i = 0; i < this.numTiles; i++) {
      newRow.push(new __WEBPACK_IMPORTED_MODULE_0__tile__["a" /* default */]([i * this.tileSize, 0], false, this.tileSize, "blue"));
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
    const length = Math.floor(Math.random() * (this.numTiles / 2 - 2)) + 3;
    let platform = [];
    for (let i = 0; i < length; i++) {
      platform.push(new __WEBPACK_IMPORTED_MODULE_0__tile__["a" /* default */]([0, 0], true, this.tileSize, "green"));
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
    for(let i = 0; i < this.numTiles; i++) {
      this.map.push(this.generateRow());
      this.map[i].forEach((tile) => {
        tile.y = i*this.tileSize;
      });
    }
    // const numTiles = this.boardDim / this.tileSize;
    // this.map = [];
    // for(let i = 0; i < numTiles; i++) {
    //   this.map.push([]);
    //   for(let j = 0; j < numTiles; j++) {
    //     if (j === 0 || j === numTiles-1) {
    //       this.map[i].push(new Tile([j*this.tileSize, i*this.tileSize], true, this.tileSize, "red"));
    //     } else {
    //       this.map[i].push(new Tile([j*this.tileSize, i*this.tileSize], false, this.tileSize, "blue"));
    //     }
    //   }
    // }
    this.map[25][25] = new __WEBPACK_IMPORTED_MODULE_0__tile__["a" /* default */]([250,250], false, 10, "blue");
    this.map[26][25] = new __WEBPACK_IMPORTED_MODULE_0__tile__["a" /* default */]([250,260], true, 10, "green");
    // this.map[19][26] = new Tile([260,190], true, 10, "green");
    // this.map[26][5] = new Tile([50,260], true, 10, "green");
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

/* harmony default export */ __webpack_exports__["a"] = (Map);


/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map