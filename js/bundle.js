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
    this.MAX_VERTICAL_VEL = -10;
    this.FRICTION = 10;
    this.GRAVITY = 1;

    this.map = this.generateMap();
    this.player = new __WEBPACK_IMPORTED_MODULE_0__player__["a" /* default */]([100,200], this.TILE_SIZE);
    // this.player = new Player([100, 200], this.TILE_SIZE);

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
    this.update(timeDiff);
    this.render();
    window.requestAnimationFrame(this.main);
  }

  update(timeDiff) {
    if (this.player.left) {
      this.player.xVel = (this.player.xVel - (this.MAX_HORIZONTAL_VEL * timeDiff));
      this.checkForCollisions();
      if (this.player.xVel > this.MAX_HORIZONTAL_VEL) { this.player.xVel = this.MAX_HORIZONTAL_VEL; }
      this.player.x += this.player.xVel;
    }
    if (this.player.right) {
      this.player.xVel = (this.player.xVel + (this.MAX_HORIZONTAL_VEL * timeDiff));
      this.checkForCollisions();
      if (Math.abs(this.player.xVel) > this.MAX_HORIZONTAL_VEL) { this.player.xVel = -(this.MAX_HORIZONTAL_VEL); }
      this.player.x += this.player.xVel;
    }
    if (this.player.jump) {
      if (this.player.yVel === 0) { this.player.yVel = this.MAX_VERTICAL_VEL; }
    }
    this.checkForCollisions();
    this.player.y += this.player.yVel;

    this.handleFriction(timeDiff);
    this.handleGravity(timeDiff);
  }

  getTilePos(x, y) {
    const column = Math.floor(x / this.TILE_SIZE);
    const row = Math.floor(y / this.TILE_SIZE);
    return [column, row];
  }

  // getVertTiles(startPos, endPos) {
  //   if(startPos[1] % this.TILE_SIZE === 0) {
  //
  //   } else {
  //
  //   }
  // }

  checkForCollisions() {
    const nextX = this.player.x + this.player.xVel;
    const nextY = this.player.y + this.player.yVel;
    let tilePos = this.getTilePos(nextX, nextY);


    // debugger
    if (this.player.xVel < 0) {
      if (this.player.x % this.TILE_SIZE === 0 && this.map[tilePos[0]][tilePos[1]].collides) {
        this.player.xVel = 0;
        this.player.x = this.map[tilePos[0]][tilePos[1]].x + this.TILE_SIZE;
      } else if (this.map[tilePos[0]][tilePos[1]].collides || this.map[tilePos[0]][tilePos[1]+1].collides) {
        this.player.xVel = 0;
        this.player.x = this.map[tilePos[0]][tilePos[1]].x + this.TILE_SIZE;
      }
    } else if (this.player.xVel > 0) {
      if (this.player.x % this.TILE_SIZE === 0 && this.map[tilePos[0]+1][tilePos[1]].collides) {
        this.player.xVel = 0;
        this.player.x = this.map[tilePos[0]+1][tilePos[1]].x - this.TILE_SIZE;
      } else if (this.map[tilePos[0]+1][tilePos[1]].collides || this.map[tilePos[0]+1][tilePos[1]+1].collides) {
        this.player.xVel = 0;
        this.player.x = this.map[tilePos[0]+1][tilePos[1]].x - this.TILE_SIZE;
      }
    }
    if (this.player.yVel < 0) {
      // debugger
      if (this.player.yVel > 0) {
        if (this.player.y % this.TILE_SIZE === 0 && this.map[tilePos[0]][tilePos[1]].collides) {
          this.player.yVel = 0;
          this.player.y = this.map[tilePos[0]][tilePos[1]].y + this.TILE_SIZE;
        } else if (this.map[tilePos[0]][tilePos[1]].collides || this.map[tilePos[0]+1][tilePos[1]].collides) {
          this.player.yVel = 0;
          this.player.y = this.map[tilePos[0]][tilePos[1]].y + this.TILE_SIZE;
        }
      }
    } else if (this.player.yVel > 0) {
      debugger
      if (this.player.y % this.TILE_SIZE === 0 && this.map[tilePos[0]][tilePos[1]+1].collides) {
        // debugger
        this.player.yVel = 0;
        this.player.y = this.map[tilePos[0]][tilePos[1]+1].y - this.TILE_SIZE;
      } else if (this.map[tilePos[0]][tilePos[1]+1].collides || this.map[tilePos[0]+1][tilePos[1]+1].collides) {
        // debugger
        this.player.yVel = 0;
        this.player.y = this.map[tilePos[0]][tilePos[1]+1].y - this.TILE_SIZE;
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

  handleGravity(timeDiff) {
    // debugger
    this.player.yVel += this.GRAVITY * timeDiff;
    if (this.player.yVel > 5) {
      this.player.yVel = 5;
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
      case " ":
        event.preventDefault();
        this.player.jump = pressed;
    }
  }

  generateMap() {
    let map = [];
    for(let i = 0; i < 50; i++) {
      map.push([]);
      for(let j = 0; j < 50; j++) {
        map[i][j] = new __WEBPACK_IMPORTED_MODULE_1__tile__["a" /* default */]([i*10, j*10], false, 10, "blue");
      }
    }
    map[10][10] = new __WEBPACK_IMPORTED_MODULE_1__tile__["a" /* default */]([100,100], true, 10, "green");

    map[22][9] = new __WEBPACK_IMPORTED_MODULE_1__tile__["a" /* default */]([90,220], true, 10, "green");
    map[22][10] = new __WEBPACK_IMPORTED_MODULE_1__tile__["a" /* default */]([100,220], true, 10, "green");
    map[22][11] = new __WEBPACK_IMPORTED_MODULE_1__tile__["a" /* default */]([110,220], true, 10, "green");
    return map;
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