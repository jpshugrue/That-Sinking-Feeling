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
  game.start();
});


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__board__ = __webpack_require__(4);


class Game {

  constructor() {
    const canvas = document.getElementById('gameCanvas');
    this.context = canvas.getContext('2d');
    // this.context.translate(0, canvas.height);
    // this.context.scale(1, -1);
  }

  start() {
    const board = new __WEBPACK_IMPORTED_MODULE_0__board__["a" /* default */](this.context);
    board.main();
  }

}

/* harmony default export */ __webpack_exports__["a"] = (Game);


/***/ }),
/* 2 */,
/* 3 */,
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__player__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__tile__ = __webpack_require__(6);



class Board {

  constructor(context) {
    this.context = context;

    this.TILE_SIZE = 10;
    this.BOARD_DIM = 500;
    this.MAX_HORIZONTAL_VEL = 20;
    this.MAX_VERTICAL_VEL = -3;
    this.FRICTION = 10;
    this.GRAVITY = 3;

    this.gameOver = false;

    this.map = this.generateMap();
    this.player = new __WEBPACK_IMPORTED_MODULE_0__player__["a" /* default */]([100,200], this.TILE_SIZE);

    document.addEventListener('keydown', (event) => (this.keyPress(event, true)));
    document.addEventListener('keyup', (event) => (this.keyPress(event, false)));

    this.now = Date.now();

    this.main = this.main.bind(this);
    this.main();
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

  endGame() {
    this.context.font = "30px Arial";
    this.context.fillText("Game Over",200,200);
  }

  update(timeDiff, player, map) {
    if (player.left) {
      player.xVel = (player.xVel - (this.MAX_HORIZONTAL_VEL * timeDiff));
      if (Math.abs(player.xVel) > this.MAX_HORIZONTAL_VEL) { player.xVel = -(this.MAX_HORIZONTAL_VEL); }
    }
    if (player.right) {
      player.xVel = (player.xVel + (this.MAX_HORIZONTAL_VEL * timeDiff));
      if (player.xVel > this.MAX_HORIZONTAL_VEL) { player.xVel = this.MAX_HORIZONTAL_VEL; }
    }
    if (player.jump) {
      if (player.yVel === 0) { player.yVel = this.MAX_VERTICAL_VEL; }
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
      if ((nextY % this.TILE_SIZE < 1 && map[nextRow][nextCol].collides) ||
        (nextY % this.TILE_SIZE >= 1 && (map[nextRow][nextCol].collides || map[nextRow+1][nextCol].collides))) {
          player.xVel = 0;
          player.x = map[nextRow][nextCol].x + this.TILE_SIZE;
          nextCol += 1;
      }
    } else if (player.xVel > 0) {
      if ((nextY % this.TILE_SIZE < 1 && map[nextRow][nextCol+1].collides) ||
        (nextY % this.TILE_SIZE >= 1 && (map[nextRow][nextCol+1].collides || map[nextRow+1][nextCol+1].collides))) {
          player.xVel = 0;
          player.x = map[nextRow][nextCol+1].x - this.TILE_SIZE;
      }
    }
    if (player.yVel < 0) {
      if ((player.x % this.TILE_SIZE < 1 && map[nextRow][nextCol].collides) ||
        (player.x % this.TILE_SIZE >= 1 && (map[nextRow][nextCol].collides || map[nextRow][nextCol+1].collides))) {
          player.yVel = 0;
          player.y = map[nextRow][nextCol].y + this.TILE_SIZE;
      }
    } else if (player.yVel > 0) {
      if ((player.x % this.TILE_SIZE < 1 && map[nextRow+1][nextCol].collides) ||
        (player.x % this.TILE_SIZE >= 1 && (map[nextRow+1][nextCol].collides || map[nextRow+1][nextCol+1].collides))) {
          player.yVel = 0;
          player.y = map[nextRow+1][nextCol].y - this.TILE_SIZE;
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
    const thisPos = this.getTilePos(this.player.x, this.player.y);
    return ((player.x % this.TILE_SIZE < 1 && this.map[thisPos[0]+1][thisPos[1]].collides) ||
      (player.x % this.TILE_SIZE >= 1 && (this.map[thisPos[0]+1][thisPos[1]].collides || this.map[thisPos[0]+1][thisPos[1]+1].collides)));
  }

  handleGravity(timeDiff, player) {
    if (this.isStanding(player)) {
      player.yVel = 0;
    } else {
      player.yVel += this.GRAVITY * timeDiff;
      if (player.yVel > 3) {
        player.yVel = 3;
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

  render() {
    this.map.forEach((row, vertical) => {
      row.forEach((tile, horizontal) => {
        this.context.fillStyle = tile.color;
        this.context.fillRect(horizontal * this.TILE_SIZE, vertical * this.TILE_SIZE, this.TILE_SIZE, this.TILE_SIZE);
      });
    });
    this.context.fillStyle = "yellow";
    this.context.fillRect(this.player.x, this.player.y, this.TILE_SIZE, this.TILE_SIZE);
  }

  generateMap() {
    let map = [];
    for(let i = 0; i < 50; i++) {
      map.push([]);
      for(let j = 0; j < 50; j++) {
        if (j === 0 || j === 49) {
          map[i].push(new __WEBPACK_IMPORTED_MODULE_1__tile__["a" /* default */]([j*10, i*10], true, 10, "red"));
        } else {
          map[i].push(new __WEBPACK_IMPORTED_MODULE_1__tile__["a" /* default */]([j*10, i*10], false, 10, "blue"));
        }
      }
    }
    map[22][9] = new __WEBPACK_IMPORTED_MODULE_1__tile__["a" /* default */]([90,220], true, 10, "green");
    map[22][10] = new __WEBPACK_IMPORTED_MODULE_1__tile__["a" /* default */]([100,220], true, 10, "green");
    map[22][11] = new __WEBPACK_IMPORTED_MODULE_1__tile__["a" /* default */]([110,220], true, 10, "green");
    map[21][6] = new __WEBPACK_IMPORTED_MODULE_1__tile__["a" /* default */]([60,210], true, 10, "green");
    map[21][7] = new __WEBPACK_IMPORTED_MODULE_1__tile__["a" /* default */]([70,210], true, 10, "green");
    map[21][8] = new __WEBPACK_IMPORTED_MODULE_1__tile__["a" /* default */]([80,210], true, 10, "green");
    map[20][16] = new __WEBPACK_IMPORTED_MODULE_1__tile__["a" /* default */]([160,200], true, 10, "green");
    map[20][17] = new __WEBPACK_IMPORTED_MODULE_1__tile__["a" /* default */]([170,200], true, 10, "green");
    map[20][18] = new __WEBPACK_IMPORTED_MODULE_1__tile__["a" /* default */]([180,200], true, 10, "green");
    map[15][22] = new __WEBPACK_IMPORTED_MODULE_1__tile__["a" /* default */]([220,150], true, 10, "green");
    map[15][23] = new __WEBPACK_IMPORTED_MODULE_1__tile__["a" /* default */]([230,150], true, 10, "green");
    return map;
  }
}

/* harmony default export */ __webpack_exports__["a"] = (Board);


/***/ }),
/* 5 */
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
}

/* harmony default export */ __webpack_exports__["a"] = (Player);


/***/ }),
/* 6 */
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

  inCollision(tile) {
    return (this.x + this.size <= tile.x || this.x >= tile.x + tile.size
      || this.y + this.size <= tile.y || this.y >= tile.y + tile.size);
  }

}

/* harmony default export */ __webpack_exports__["a"] = (Tile);


/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map