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

    this.level = boardDim - (tileSize * 3);
    this.speed = 40;
    this.animCounter = 0;
  }

  update(timeDiff) {
    this.level -= timeDiff * this.speed;
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
    if (this.waterImg === this.waterImg1) {
      this.waterImg = this.waterImg2;
    } else {
      this.waterImg = this.waterImg1;
    }
  }

  render() {
    this.context.save();
    this.context.globalAlpha = 0.7;
    this.context.drawImage(this.waterImg, this.tileSize, this.level);
    this.context.restore();
  }

}

export default Water;
