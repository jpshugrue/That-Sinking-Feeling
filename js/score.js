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
    firebase.auth().signInAnonymously().then((success) => {
      this.database = firebase.database();
      this.loadHighScore(this.database);
    });
  }

  loadHighScore(database) {
    const dbref = database.ref().child('highscores');
    dbref.once('value').then((snapshot) => {
      this.sortHighScores(snapshot.val());
    });
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
    return (!this.submittedScore && this.highscores && (this.highscores.length < 10 ||
      this.highscores[0].score < this.currentScore));
  }

  submitHighScore() {
    const dateTime = Date.now();
    if (this.highscores.length >= 10) {
      this.database.ref('highscores/' + this.highscores[0].date).remove();
    }
    if (this.name.length > 35) {
      this.name = this.name.slice(0, 35);
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
