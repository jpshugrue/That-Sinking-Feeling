import Board from './board';

class Game {

  constructor() {
    const canvas = document.getElementById('gameCanvas');
    this.context = canvas.getContext('2d');
  }

  start() {
    const board = new Board(this.context);
    board.main();
  }

}

export default Game;
