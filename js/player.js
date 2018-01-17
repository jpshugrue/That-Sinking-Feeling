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

  getTilePos() {
    const column = Math.floor(this.x / this.size);
    const row = Math.floor(this.y / this.size);
    return [column, row];
  }

}

export default Player;
