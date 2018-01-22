const leftArrowImg = new Image(46, 46);
leftArrowImg.src = 'images/sprites/left-arrow.png';
const rightArrowImg = new Image(46, 46);
rightArrowImg.src = 'images/sprites/right-arrow.png';
const spacebarImg = new Image(274, 40);
spacebarImg.src = 'images/sprites/spacebar.png';

export const splashScreen = (context, boardDim) => {
  context.save();
  context.globalAlpha = 0.7;
  context.rect(0, 0, boardDim, boardDim);
  context.fill();
  context.restore();

  context.strokeStyle = "white";
  context.lineWidth = 3;
  context.beginPath();
  context.moveTo(boardDim/3, 100);
  context.lineTo((boardDim/3) * 2, 100);
  context.stroke();

  context.beginPath();
  context.moveTo(boardDim/3, 275);
  context.lineTo((boardDim/3) * 2, 275);
  context.stroke();

  context.beginPath();
  context.moveTo(boardDim/3, 460);
  context.lineTo((boardDim/3) * 2, 460);
  context.stroke();

  context.font = "18px press_start_2pregular";
  context.strokeStyle = "black";
  context.lineWidth = 6;
  context.textAlign = "center";
  context.fillStyle = "white";
  strokeAndFill(context,`To Start A New Game`,boardDim/2,50);
  strokeAndFill(context,`Press The Space Bar`,boardDim/2,80);

  strokeAndFill(context,`How To Play`,boardDim/2,140);

  strokeAndFill(context,`The Story So Far`,boardDim/2,315);

  strokeAndFill(context,`Our Intrepid`,boardDim/3*2,520);
  strokeAndFill(context,`Protagonist`,boardDim/3*2,550);

  context.font = "12px press_start_2pregular";
  strokeAndFill(context,`Use The Arrow Keys`,boardDim/4,170);
  strokeAndFill(context,`To Move`,boardDim/4,195);
  context.drawImage(leftArrowImg, boardDim/4 - 69, 210);
  context.drawImage(rightArrowImg, boardDim/4 + 23, 210);

  strokeAndFill(context,`Use The Space Bar`,boardDim/4*3,170);
  strokeAndFill(context,`To Jump`,boardDim/4*3,195);
  context.drawImage(spacebarImg, boardDim/4*3-137, 210);

  strokeAndFill(context,`Your ship, the S.S. Blocktanic, has struck`,boardDim/2,340);
  strokeAndFill(context,`a cubeberg and is sinking fast`,boardDim/2,365);
  strokeAndFill(context,`Bad time to be taking a nap in the engine room!`,boardDim/2,390);
  strokeAndFill(context,`Outrun the rising water to make it`,boardDim/2,415);
  strokeAndFill(context,`to the surface`,boardDim/2,440);

  context.rect(boardDim/4, 500, 50, 50);
  context.fill();
};

export const endGame = (context, score, boardDim) => {
  context.font = "42px press_start_2pregular";
  context.strokeStyle = "black";
  context.lineWidth = 6;
  context.textAlign = "center";
  strokeAndFill(context, "Game Over", boardDim/2, 100);
  context.font = "24px press_start_2pregular";
  strokeAndFill(context, `Your score was: ${Math.floor(score.currentScore)}`,boardDim/2,140);
  context.font = "18px press_start_2pregular";
  if (score.checkIfHighScore()) {
    strokeAndFill(context, `You Have A New High Score!`, boardDim/2, 200);
    strokeAndFill(context, `Enter Your Name`, boardDim/2, 230);
    strokeAndFill(context, `Then Press Enter`, boardDim/2, 260);
    strokeAndFill(context, `${score.name}`, boardDim/2, 290);
  } else {
    strokeAndFill(context, `To Start A New Game`, boardDim/2, 180);
    strokeAndFill(context, `Press The Space Bar`, boardDim/2, 210);
    strokeAndFill(context, `Current High Scores`, boardDim/2, 270);
    context.font = "14px press_start_2pregular";
    score.highscores.slice().reverse().forEach((highscore, idx) => {
      strokeAndFill(context, `${highscore.name} - ${Math.floor(highscore.score)}`, boardDim/2,310 + (idx * 30));
    });
  }
};

const strokeAndFill = (context, text, x, y) => {
  context.strokeText(text, x, y);
  context.fillText(text, x, y);
};
