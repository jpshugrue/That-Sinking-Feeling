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
/***/ (function(module, exports) {

$(() => {
  const canvas = document.getElementById('gameCanvas');
  const context = canvas.getContext('2d');
  const board = new Board(context);
});



class Player {

}

class Board {

  constructor(context) {
    this.TILE_SIZE = 10;
    this.BOARD_DIM = 500;

    this.map = this.generateMap();
    this.render(context);
  }

  generateMap() {
    let map = [];
    for(let i = 0; i < 50; i++) {
      map.push([]);
      for(let j = 0; j < 50; j++) {
        map[i][j] = new Tile([i*10, j*10], false, 10, "blue");
      }
    }
    return map;
  }

  render(context) {
    for(let i = 0; i < 50; i++) {
      for(let j = 0; j < 50; j++) {
        context.fillStyle = this.map[i, j];
        context.fillRect(i * 10, j * 10, 10, 10);
      }
    }
    // render player
    context.fillStyle = "yellow";
    context.fillRect(100, 100, 10, 10);
  }

}

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


/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map