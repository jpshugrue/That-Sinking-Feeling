export const splashScreen = () => {

};

export const endGame = (context, score, boardDim) => {
  // debugger
  context.font = "42px press_start_2pregular";
  context.strokeStyle = "black";
  context.lineWidth = 6;
  context.textAlign = "center";
  context.strokeText("Game Over",boardDim/2,100);
  context.fillText("Game Over",boardDim/2,100);
  context.font = "24px press_start_2pregular";
  context.strokeText(`Your score was: ${Math.floor(score.currentScore)}`,boardDim/2,140);
  context.fillText(`Your score was: ${Math.floor(score.currentScore)}`,boardDim/2,140);
  context.font = "18px press_start_2pregular";
  if (score.checkIfHighScore()) {
    context.strokeText(`You Have A New High Score!`,boardDim/2,200);
    context.fillText(`You Have A New High Score!`,boardDim/2,200);
    context.strokeText(`Enter Your Name`,boardDim/2,230);
    context.fillText(`Enter Your Name`,boardDim/2,230);
    context.strokeText(`Then Press Enter`,boardDim/2,260);
    context.fillText(`Then Press Enter`,boardDim/2,260);
    context.strokeText(`${score.name}`,boardDim/2,290);
    context.fillText(`${score.name}`,boardDim/2,290);
  } else {
    context.strokeText(`To Start A New Game`,boardDim/2,180);
    context.fillText(`To Start A New Game`,boardDim/2,180);
    context.strokeText(`Press The Space Bar`,boardDim/2,210);
    context.fillText(`Press The Space Bar`,boardDim/2,210);
    context.strokeText(`Current High Scores`,boardDim/2,270);
    context.fillText(`Current High Scores`,boardDim/2,270);
    context.font = "14px press_start_2pregular";
    score.highscores.slice().reverse().forEach((highscore, idx) => {
      context.strokeText(`${highscore.name} - ${Math.floor(highscore.score)}`,boardDim/2,310 + (idx * 30));
      context.fillText(`${highscore.name} - ${Math.floor(highscore.score)}`,boardDim/2,310 + (idx * 30));
    });
  }
};
