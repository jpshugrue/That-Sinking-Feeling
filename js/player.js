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

export default Player;
