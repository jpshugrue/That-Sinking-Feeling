class Background {

  constructor(context, boardDim) {
    this.context = context;
    this.boardDim = boardDim;

    this.bg1 = new Image(this.boardDim, this.boardDim);
    this.bg1.src = 'images/sprites/bg_expan.gif';
    this.bg1y = 0;

    this.bg2 = new Image(this.boardDim, this.boardDim);
    this.bg2.src = 'images/sprites/bg_expan.gif';
    this.bg2y = -800;

    this.pixelCount = 0;
  }

  render() {
    this.context.drawImage(this.bg1, -16, this.bg1y);
    this.context.drawImage(this.bg2, -16, this.bg2y);
  }

  reset() {
    this.pixelCount = 0;
    this.bg1y = 0;
    this.bg2y = -800;
  }

  panBackground() {
    this.pixelCount += 1;
    if (this.pixelCount > 3) {
      this.pixelCount = 0;
      this.bg1y += 1;
      this.bg2y += 1;
      if (this.bg1y >= 800) {
        this.bg1y = -this.boardDim;
      } else if(this.bg2y >= 800) {
        this.bg2y = -this.boardDim;
      }
    }
  }

}

export default Background;
