class Sound {

  constructor() {
    this.bgMusic = new Audio('./sounds/bg_music.mp3');
    this.jumpSound = new Audio('./sounds/jump.mp3');
    this.gameOverSound = new Audio('./sounds/game_over.mp3');

    $(".audioControl").on('click', this.audioSwitch.bind(this));
  }

  audioSwitch() {
    if (this.bgMusic.paused) {
      $(".audioControl").html("Click<br>To<br>Mute<br><i class='fa fa-volume-off' aria-hidden='true'></i>");
      this.bgMusic.play();
    } else {
      $(".audioControl").html("Click<br>For<br>Sound<br><i class='fa fa-volume-up' aria-hidden='true'></i>");
      this.bgMusic.pause();
    }
  }

  jump() {
    if (!this.bgMusic.paused) {
      this.jumpSound.play();
    }
  }

  gameOver() {
    if (!this.bgMusic.paused) {
      this.gameOverSound.play();
    }
  }

}

export default Sound;
