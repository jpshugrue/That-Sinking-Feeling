import * as firebase from 'firebase';
import 'firebase/database';

class Score {

  constructor() {
    this.currentScore = 0;
    this.name = "";
    this.submittedScore = false;

    const config = {
      apiKey: "AIzaSyCMiP-QRvxlqRzhay6gmuQTJNgGWinwOuM",
      authDomain: "that-sinking-feeling.firebaseapp.com",
      databaseURL: "https://that-sinking-feeling.firebaseio.com",
      projectId: "that-sinking-feeling",
      storageBucket: "that-sinking-feeling.appspot.com",
      messagingSenderId: "676176501519"
    };
    firebase.initializeApp(config);
    firebase.auth().signInAnonymously();
    this.database = firebase.database();
    const dbref = this.database.ref().child('highscores');
    dbref.on('value', (snapshot) => {
      this.sortHighScores(snapshot.val());
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

  checkIfHighScore() {
    return (!this.submittedScore && (this.highscores.length < 10 ||
      this.highscores[0].score < this.currentScore));
  }

  submitHighScore() {
    const dateTime = Date.now();
    if (this.highscores.length >= 10) {
      this.database.ref('highscores/' + this.highscores[0].date).remove();
    }
    this.database.ref('highscores/' + dateTime).set({
      score: this.currentScore,
      date: dateTime,
      name: this.name
    });
    this.submittedScore = true;
  }

  reset() {
    this.currentScore = 0;
    this.submittedScore = false;
  }
}

export default Score;
