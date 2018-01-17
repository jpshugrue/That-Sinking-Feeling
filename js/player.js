class Player {

  constructor(startingPos, size) {
    this.x = startingPos[0];
    this.y = startingPos[1];
    this.size = size;
    this.left = false;
    this.right = false;
    this.jump = false;
  }

}

export default Player;
