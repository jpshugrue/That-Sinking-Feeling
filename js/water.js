class Water {

  constructor(tileSize, boardDim, context) {
    this.tileSize = tileSize;
    this.boardDim = boardDim;
    this.context = context;

    this.waterImg1 = new Image(boardDim-this.tileSize, boardDim);
    this.waterImg1.src = 'images/sprites/water1.png';

    this.waterImg2 = new Image(boardDim-this.tileSize, boardDim);
    this.waterImg2.src = 'images/sprites/water2.png';

    this.waterImg = this.waterImg1;

    this.level = boardDim - (tileSize);
    this.speed = 58;
    this.animCounter = 0;
  }

  reset() {
    this.level = this.boardDim - (this.tileSize);
    this.animCounter = 0;
    this.waterImg = this.waterImg1;
  }

  update(timeDiff) {
    if (this.level <= -10) {
      this.level = -10;
    } else {
      this.level -= timeDiff * this.speed;
    }
    this.animCounter += timeDiff;
    if (this.animCounter > 1) {
      this.animCounter = 0;
      this.animate();
    }
  }

  nextPixel() {
    this.level += 1;
  }

  animate() {
    this.waterImg = this.waterImg === this.waterImg1 ? this.waterImg2 : this.waterImg1;
  }

  render() {
    this.context.save();
    this.context.globalAlpha = 0.7;
    this.context.drawImage(this.waterImg, this.tileSize, this.level);
    this.context.restore();
  }

}

export default Water;
