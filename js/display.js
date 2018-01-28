const leftArrowImg = new Image(46, 46);
leftArrowImg.src = 'images/sprites/left-arrow.png';
const rightArrowImg = new Image(46, 46);
rightArrowImg.src = 'images/sprites/right-arrow.png';
const spacebarImg = new Image(274, 40);
spacebarImg.src = 'images/sprites/spacebar.png';
const shiftImg = new Image(98, 46);
shiftImg.src = 'images/sprites/shift.png';

export const displayScore = (context, score, tileSize, boardDim) => {
  context.textAlign = "left";
  context.font = '16px fippsregular';
  context.fillStyle = "#1e2a3d";
  context.fillText(`Score: ${Math.floor(score.currentScore)}`, tileSize + 5, boardDim - 5);
};

export const displayPauseScreen = (context, boardDim) => {
  drawOpacityOverlay(context, boardDim);

  const startX = boardDim/3;
  const endX = boardDim/3 * 2;
  drawHorizonLine(context, startX, endX, boardDim/2 - 50);

  context.font = "30px press_start_2pregular";
  context.strokeStyle = "black";
  context.lineWidth = 6;
  context.textAlign = "center";
  context.fillStyle = "white";
  strokeAndFill(context,`Paused`,boardDim/2,boardDim/2 - 80);

  context.font = "18px press_start_2pregular";
  strokeAndFill(context,`To Resume`,boardDim/2,boardDim/2);
  strokeAndFill(context,`Press The Shift Key`,boardDim/2,boardDim/2 + 40);
  context.drawImage(shiftImg, boardDim/2-49, boardDim/2 + 70);
};

export const displaySplashScreen = (context, boardDim) => {
  drawOpacityOverlay(context, boardDim);

  const startX = boardDim/3;
  const endX = boardDim/3 * 2;

  drawHorizonLine(context, startX, endX, 85);
  drawHorizonLine(context, startX, endX, 315);
  drawHorizonLine(context, startX, endX, 500);

  context.font = "18px press_start_2pregular";
  context.strokeStyle = "black";
  context.lineWidth = 6;
  context.textAlign = "center";
  context.fillStyle = "white";
  strokeAndFill(context,`To Start A New Game`,boardDim/2,35);
  strokeAndFill(context,`Press The Space Bar`,boardDim/2,65);

  strokeAndFill(context,`How To Play`,boardDim/2,125);

  strokeAndFill(context,`The Story So Far`,boardDim/2,355);

  strokeAndFill(context,`Our Intrepid`,boardDim/3*2,550);
  strokeAndFill(context,`Protagonist`,boardDim/3*2,580);

  context.font = "12px press_start_2pregular";
  strokeAndFill(context,`Use The Arrow Keys`,boardDim/4,155);
  strokeAndFill(context,`To Move`,boardDim/4,180);
  context.drawImage(leftArrowImg, boardDim/4 - 69, 195);
  context.drawImage(rightArrowImg, boardDim/4 + 23, 195);


  strokeAndFill(context,`Use The Space Bar`,boardDim/4*3,155);
  strokeAndFill(context,`To Jump`,boardDim/4*3,180);
  context.drawImage(spacebarImg, boardDim/4*3-137, 195);

  strokeAndFill(context,`Use The Shift Key`,boardDim/4+40,275);
  strokeAndFill(context,`To Pause The Game`,boardDim/4+40,300);
  context.drawImage(shiftImg, boardDim/3*2-49, 255);

  strokeAndFill(context,`Your ship, the S.S. Blocktanic, has struck`,boardDim/2,380);
  strokeAndFill(context,`a cubeberg and is sinking fast`,boardDim/2,405);
  strokeAndFill(context,`Bad time to be taking a nap in the engine room!`,boardDim/2,430);
  strokeAndFill(context,`Outrun the rising water to make it`,boardDim/2,455);
  strokeAndFill(context,`to the surface`,boardDim/2,480);

  context.rect(boardDim/4, 530, 50, 50);
  context.fill();
};

export const displayGameOver = (context, score, boardDim) => {
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

const drawHorizonLine = (context, startX, endX, y) => {
  context.strokeStyle = "white";
  context.lineWidth = 3;
  context.beginPath();
  context.moveTo(startX, y);
  context.lineTo(endX, y);
  context.stroke();
};

const drawOpacityOverlay = (context, boardDim) => {
  context.fillStyle = "#1e2a3d";
  context.save();
  context.globalAlpha = 0.7;
  context.rect(0, 0, boardDim, boardDim);
  context.fill();
  context.restore();
};
