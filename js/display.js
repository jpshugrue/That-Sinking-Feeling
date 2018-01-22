export const splashScreen = () => {

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
