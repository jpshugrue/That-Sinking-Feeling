import Player from './player';
import Map from './map';
import Water from './water';
import Background from './background';
import * as firebase from 'firebase';
import 'firebase/database';

class Game {

  constructor() {
    this.TILE_SIZE = 16;
    this.BOARD_DIM = 608;
    this.MAX_HORIZONTAL_VEL = 22;
    this.MAX_JUMP_VEL = -8;
    this.MAX_FALL_VEL = 32;
    this.FRICTION = 16;
    this.GRAVITY = 16;
    this.FRAME = 1/60;
    this.splashScreen = true;
    this.leftArrowImg = new Image(46, 46);
    this.leftArrowImg.src = 'images/sprites/left-arrow.png';
    this.rightArrowImg = new Image(46, 46);
    this.rightArrowImg.src = 'images/sprites/right-arrow.png';
    this.spacebarImg = new Image(274, 40);
    this.spacebarImg.src = 'images/sprites/spacebar.png';

    const canvas = document.getElementById('gameCanvas');
    this.context = canvas.getContext('2d');

    document.addEventListener('keydown', (event) => (this.keyPress(event, true)));
    document.addEventListener('keyup', (event) => (this.keyPress(event, false)));

    const config = {
      apiKey: "AIzaSyCMiP-QRvxlqRzhay6gmuQTJNgGWinwOuM",
      authDomain: "that-sinking-feeling.firebaseapp.com",
      databaseURL: "https://that-sinking-feeling.firebaseio.com",
      projectId: "that-sinking-feeling",
      storageBucket: "that-sinking-feeling.appspot.com",
      messagingSenderId: "676176501519"
    };
    firebase.initializeApp(config);
    this.database = firebase.database();
    const dbref = this.database.ref().child('highscores');
    dbref.on('value', (snapshot) => {
      this.sortHighScores(snapshot.val());
    });

    this.main = this.main.bind(this);
    this.displaySplashScreen = this.displaySplashScreen.bind(this);
  }

  newGame() {
    this.keyDown = false;
    this.score = 0;
    this.timeDiff = 0;
    this.gameOver = false;
    this.highScoreStored = false;
    this.newHighScore = false;
    this.highScoreName = "";
    if (this.map) {
      this.map.reset();
      this.player.reset([330,500]);
      this.background.reset();
      this.water.reset();
    } else {
      this.map = new Map(this.BOARD_DIM, this.TILE_SIZE, this.context);
      this.map.generateMap(this.BOARD_DIM, this.TILE_SIZE);
      this.player = new Player([330,500], this.TILE_SIZE);
      this.background = new Background(this.context, this.BOARD_DIM);
      this.water = new Water(this.TILE_SIZE, this.BOARD_DIM, this.context);
    }
    this.now = Date.now();
    if (this.splashScreen) {
      this.displaySplashScreen();
    } else {
      this.main();
    }
  }

  main() {
    let then = this.now;
    this.now = Date.now();
    this.timeDiff = this.timeDiff + Math.min(1, (this.now - then) / 1000.0);
    while(this.timeDiff > this.FRAME) {
      this.timeDiff = this.timeDiff - this.FRAME;
      if (!this.gameOver) {
        this.update(this.FRAME, this.player, this.map);
        if (this.gameOver && !this.highScoreStored) {
          firebase.auth().signInAnonymously();
          this.checkHighScore();
          this.highScoreStored = true;
        }
      }
      this.water.update(this.FRAME);
    }
    this.render();
    window.requestAnimationFrame(this.main);
  }

  displaySplashScreen() {
    this.render();
    window.requestAnimationFrame(this.displaySplashScreen);
    this.context.save();
    this.context.globalAlpha = 0.7;
    this.context.rect(0, 0, this.BOARD_DIM, this.BOARD_DIM);
    this.context.fill();
    this.context.restore();

    this.context.strokeStyle = "white";
    this.context.lineWidth = 3;
    this.context.beginPath();
    this.context.moveTo(this.BOARD_DIM/3, 80);
    this.context.lineTo((this.BOARD_DIM/3) * 2, 80);
    this.context.stroke();

    this.context.beginPath();
    this.context.moveTo(this.BOARD_DIM/3, 255);
    this.context.lineTo((this.BOARD_DIM/3) * 2, 255);
    this.context.stroke();

    this.context.beginPath();
    this.context.moveTo(this.BOARD_DIM/3, 440);
    this.context.lineTo((this.BOARD_DIM/3) * 2, 440);
    this.context.stroke();

    this.context.font = "18px press_start_2pregular";
    this.context.strokeStyle = "black";
    this.context.lineWidth = 6;
    this.context.textAlign = "center";
    this.context.fillStyle = "white";
    this.context.strokeText(`To Start A New Game`,this.BOARD_DIM/2,30);
    this.context.fillText(`To Start A New Game`,this.BOARD_DIM/2,30);
    this.context.strokeText(`Press The Space Bar`,this.BOARD_DIM/2,60);
    this.context.fillText(`Press The Space Bar`,this.BOARD_DIM/2,60);

    this.context.strokeText(`How To Play`,this.BOARD_DIM/2,120);
    this.context.fillText(`How To Play`,this.BOARD_DIM/2,120);

    this.context.strokeText(`The Story So Far`,this.BOARD_DIM/2,295);
    this.context.fillText(`The Story So Far`,this.BOARD_DIM/2,295);

    this.context.strokeText(`Our Intrepid`,this.BOARD_DIM/3*2,500);
    this.context.fillText(`Our Intrepid`,this.BOARD_DIM/3*2,500);
    this.context.strokeText(`Protagonist`,this.BOARD_DIM/3*2,530);
    this.context.fillText(`Protagonist`,this.BOARD_DIM/3*2,530);

    this.context.font = "12px press_start_2pregular";
    this.context.strokeText(`Use The Arrow Keys`,this.BOARD_DIM/4,150);
    this.context.fillText(`Use The Arrow Keys`,this.BOARD_DIM/4,150);
    this.context.strokeText(`To Move`,this.BOARD_DIM/4,175);
    this.context.fillText(`To Move`,this.BOARD_DIM/4,175);
    this.context.drawImage(this.leftArrowImg, this.BOARD_DIM/4 - 69, 190);
    this.context.drawImage(this.rightArrowImg, this.BOARD_DIM/4 + 23, 190);

    this.context.strokeText(`Use The Space Bar`,this.BOARD_DIM/4*3,150);
    this.context.fillText(`Use The Space Bar`,this.BOARD_DIM/4*3,150);
    this.context.strokeText(`To Jump`,this.BOARD_DIM/4*3,175);
    this.context.fillText(`To Jump`,this.BOARD_DIM/4*3,175);
    this.context.drawImage(this.spacebarImg, this.BOARD_DIM/4*3-137, 190);

    this.context.strokeText(`Your ship, the S.S. Blocktanic, has struck`,this.BOARD_DIM/2,320);
    this.context.fillText(`Your ship, the S.S. Blocktanic, has struck`,this.BOARD_DIM/2,320);
    this.context.strokeText(`a cubeberg and is sinking fast`,this.BOARD_DIM/2,345);
    this.context.fillText(`a cubeberg and is sinking fast`,this.BOARD_DIM/2,345);
    this.context.strokeText(`Bad time to be taking a nap in the engine room!`,this.BOARD_DIM/2,370);
    this.context.fillText(`Bad time to be taking a nap in the engine room!`,this.BOARD_DIM/2,370);
    this.context.strokeText(`Outrun the rising water to make it`,this.BOARD_DIM/2,395);
    this.context.fillText(`Outrun the rising water to make it`,this.BOARD_DIM/2,395);
    this.context.strokeText(`to the surface`,this.BOARD_DIM/2,420);
    this.context.fillText(`to the surface`,this.BOARD_DIM/2,420);

    this.context.rect(this.BOARD_DIM/4, 480, 50, 50);
    this.context.fill();
  }

  update(timeDiff, player, map) {
    this.score += timeDiff * 10;
    if (player.left) {
      if (player.xVel > 0 ) { player.xVel = 0; }
      player.xVel = (player.xVel - (this.MAX_HORIZONTAL_VEL * timeDiff));
      if (Math.abs(player.xVel) > this.MAX_HORIZONTAL_VEL) { player.xVel = -(this.MAX_HORIZONTAL_VEL); }
    }
    if (player.right) {
      if (player.xVel < 0 ) { player.xVel = 0; }
      player.xVel = (player.xVel + (this.MAX_HORIZONTAL_VEL * timeDiff));
      if (player.xVel > this.MAX_HORIZONTAL_VEL) { player.xVel = this.MAX_HORIZONTAL_VEL; }
    }
    if (player.jump) {
      if (player.yVel === 0) { player.yVel = this.MAX_JUMP_VEL; }
    }
    this.checkForGameOver(player);
    if (!this.gameOver) {
      this.checkForCollisions(player, map);
      if (player.left || player.right) {
        player.x += player.xVel;
      }
      player.y += player.yVel;
      this.handleFriction(timeDiff);
      this.handleGravity(timeDiff, player, map);
    }
    if (this.player.y < this.BOARD_DIM / 2) {
      this.map.nextPixel();
      this.water.nextPixel();
      this.background.panBackground();
      this.player.y += 1;
    }
  }

  render() {
    this.context.clearRect(0, 0, this.BOARD_DIM, this.BOARD_DIM);
    this.background.render();
    this.map.render(this.context);
    this.player.render(this.context);
    this.water.render();
    if (this.gameOver) {
      this.endGame();
    } else {
      this.context.textAlign = "left";
      this.context.font = '16px fippsregular';
      this.context.fillStyle = "#1e2a3d";
      this.context.fillText(`Score: ${Math.floor(this.score)}`, this.TILE_SIZE + 5, this.BOARD_DIM - 5);
    }
  }

  getTilePos(x, y) {
    const column = Math.floor(x / this.TILE_SIZE);
    const row = Math.floor(y / this.TILE_SIZE);
    return [row + 1, column];
  }

  checkForGameOver(player) {
    const nextY = player.y + player.yVel;
    if (nextY > this.BOARD_DIM - this.TILE_SIZE || nextY > this.water.level) {
      this.gameOver = true;
    }
  }

  checkForCollisions(player, map) {
    const nextX = player.x + player.xVel;
    const nextY = player.y + player.yVel;
    const nextPlayer = new Player([nextX, nextY], this.TILE_SIZE);
    const tilePos = this.getTilePos(nextX, nextY - map.offSet);
    let nextRow = tilePos[0];
    let nextCol = tilePos[1];

    if (nextRow < 0) {
      nextRow = 0;
      player.yVel = 0.01;
      player.y = 0;
    }
    if (player.xVel < 0) {
      if(map.tile(nextRow, nextCol).inCollision(nextPlayer) || map.tile(nextRow+1, nextCol).inCollision(nextPlayer)) {
        player.xVel = 0;
        player.x = map.tile(nextRow, nextCol).x + this.TILE_SIZE;
        nextCol += 1;
      }
    } else if (player.xVel > 0) {
      if(map.tile(nextRow, nextCol+1).inCollision(nextPlayer) || map.tile(nextRow+1, nextCol+1).inCollision(nextPlayer)) {
        player.xVel = 0;
        player.x = map.tile(nextRow, nextCol+1).x - this.TILE_SIZE;
      }
    }
    if (player.yVel < 0) {
      if(map.tile(nextRow, nextCol).inCollision(nextPlayer) || map.tile(nextRow, nextCol+1).inCollision(nextPlayer)) {
        player.yVel = 0;
        player.y = map.tile(nextRow, nextCol).y + this.TILE_SIZE;
      }
    } else if (player.yVel > 0) {
      if(map.tile(nextRow+1, nextCol).inCollision(nextPlayer) || map.tile(nextRow+1, nextCol+1).inCollision(nextPlayer)) {
        player.yVel = 0;
        player.y = map.tile(nextRow+1, nextCol).y - this.TILE_SIZE;
      }
    }
  }

  handleFriction(timeDiff) {
    if (this.player.xVel > 0) {
      this.player.xVel -= this.FRICTION * timeDiff;
      if (this.player.xVel < 0) { this.player.xVel = 0; }
    } else if (this.player.xVel < 0) {
      this.player.xVel += this.FRICTION * timeDiff;
      if (this.player.xVel > 0) { this.player.xVel = 0; }
    }
  }

  handleGravity(timeDiff, player, map) {
    if (this.isStanding(player, map)) {
      player.yVel = 0;
    } else {
      player.yVel += this.GRAVITY * timeDiff;
      if (player.yVel > this.MAX_FALL_VEL) {
        player.yVel = this.MAX_FALL_VEL;
      }
    }
  }

  isStanding(player, map) {
    const tilePos = this.getTilePos(this.player.x, this.player.y - this.map.offSet);
    return (this.map.tile(tilePos[0]+1, tilePos[1]).collides || this.map.tile(tilePos[0]+1, tilePos[1]+1).collides);
  }

  endGame() {
    this.context.font = "42px press_start_2pregular";
    this.context.strokeStyle = "black";
    this.context.lineWidth = 6;
    this.context.textAlign = "center";
    this.context.strokeText("Game Over",this.BOARD_DIM/2,100);
    this.context.fillText("Game Over",this.BOARD_DIM/2,100);
    this.context.font = "24px press_start_2pregular";
    this.context.strokeText(`Your score was: ${Math.floor(this.score)}`,this.BOARD_DIM/2,140);
    this.context.fillText(`Your score was: ${Math.floor(this.score)}`,this.BOARD_DIM/2,140);
    this.context.font = "18px press_start_2pregular";
    if (this.newHighScore) {
      this.context.strokeText(`You Have A New High Score!`,this.BOARD_DIM/2,200);
      this.context.fillText(`You Have A New High Score!`,this.BOARD_DIM/2,200);
      this.context.strokeText(`Enter Your Name`,this.BOARD_DIM/2,230);
      this.context.fillText(`Enter Your Name`,this.BOARD_DIM/2,230);
      this.context.strokeText(`Then Press Enter`,this.BOARD_DIM/2,260);
      this.context.fillText(`Then Press Enter`,this.BOARD_DIM/2,260);
      this.context.strokeText(`${this.highScoreName}`,this.BOARD_DIM/2,290);
      this.context.fillText(`${this.highScoreName}`,this.BOARD_DIM/2,290);
    } else {
      this.context.strokeText(`To Start A New Game`,this.BOARD_DIM/2,180);
      this.context.fillText(`To Start A New Game`,this.BOARD_DIM/2,180);
      this.context.strokeText(`Press The Space Bar`,this.BOARD_DIM/2,210);
      this.context.fillText(`Press The Space Bar`,this.BOARD_DIM/2,210);
      this.context.strokeText(`Current High Scores`,this.BOARD_DIM/2,270);
      this.context.fillText(`Current High Scores`,this.BOARD_DIM/2,270);
      this.context.font = "14px press_start_2pregular";
      this.highscores.slice().reverse().forEach((highscore, idx) => {
        this.context.strokeText(`${highscore.name} - ${Math.floor(highscore.score)}`,this.BOARD_DIM/2,310 + (idx * 30));
        this.context.fillText(`${highscore.name} - ${Math.floor(highscore.score)}`,this.BOARD_DIM/2,310 + (idx * 30));
      });
    }
  }

  checkHighScore() {
    if (this.highscores.length < 10 || this.highscores[0].score < this.score) {
      this.newHighScore = true;

    }
  }

  enterHighScore(name) {
    const dateTime = Date.now();
          // debugger
    if (this.highscores.length >= 10 && this.highscores[0]) {
      this.database.ref('highscores/' + this.highscores[0].date).remove();
    }
    this.database.ref('highscores/' + dateTime).set({
      score: this.score,
      date: dateTime,
      name: name
    });
  }

  sortHighScores(snapshot) {
    if (snapshot) {
      this.highscores = Object.keys(snapshot).sort((a,b) => {
        return snapshot[a].score - snapshot[b].score;
      });
      this.highscores.forEach((id, idx) => {
        this.highscores[idx] = snapshot[id];
      });
    } else {
      this.highscores = [];
    }
  }

  keyPress(event, pressed) {
    if (pressed) {
      this.keyDown = true;
    } else {
      this.keyDown = false;
    }
    switch(event.key) {
      case "ArrowLeft":
        this.player.left = pressed;
        break;
      case "ArrowRight":
        this.player.right = pressed;
        break;
      case "ArrowUp":
        event.preventDefault();
        break;
      case "ArrowDown":
        event.preventDefault();
        break;
      case "Enter":
        if (this.newHighScore) {
          this.newHighScore = false;
          this.enterHighScore(this.highScoreName);
        }
        break;
      case "Backspace":
        if (this.newHighScore && this.keyDown) {
          this.highScoreName = this.highScoreName.slice(0, -1);
        }
        break;
      case " ":
        event.preventDefault();
        if (this.splashScreen) {
          this.now = Date.now();
          this.splashScreen = false;
          this.main();
        } else if(this.newHighScore && this.keyDown) {
          this.highScoreName += " ";
        } else if (!this.newHighScore && this.gameOver) {
          this.newGame();
        } else if (!this.newHighScore){
          this.player.jump = pressed;
        }
        break;
      default:
        if (this.newHighScore && this.keyDown && event.key.length === 1) {
          this.highScoreName += event.key;
        }
    }
  }

}

export default Game;
