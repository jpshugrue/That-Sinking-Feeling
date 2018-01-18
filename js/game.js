import Board from './board';

class Game {

  constructor() {
    const canvas = document.getElementById('gameCanvas');
    this.context = canvas.getContext('2d');
    // this.context.translate(0, canvas.height);
    // this.context.scale(1, -1);
  }

  start() {
    const board = new Board(this.context);
    board.main();
  }

}

export default Game;
