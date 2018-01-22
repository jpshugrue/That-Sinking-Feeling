![alt text](https://raw.githubusercontent.com/jpshugrue/That-Sinking-Feeling/master/images/readme/title.png "That Sinking Feeling Logo")

[That Sinking Feeling Live](http://jpshugrue.com/That-Sinking-Feeling/)

Your ship is sinking and you've got to outrun the rising water to make it to the surface! That Sinking Feeling is a platforming game built with JavaScript, the HTML5 Canvas and utilizing Google Firebase.

![alt text](https://raw.githubusercontent.com/jpshugrue/That-Sinking-Feeling/master/images/readme/gameplay.png "That Sinking Feeling Gameplay")

## How to Play

- To start the game, press the spacebar
- Use the left and right keyboard arrow keys to control the protagonist and use the spacebar to jump
- Once at the game over screen, if you've achieved a high score enter your name with the keyboard and press enter to submit

## Implementation

### HTML5 Canvas
TSF is implemented using the HTML5 Canvas and vanilla JavaScript, without the use of other external Canvas libraries. The canvas is continually rendered using the requestAnimationFrame method, but in order to ensure a consistent frame rate and experience between different computers and browsers the rate of calls to render is limited to once every 1/60 second. Without this the calls to render could vary in frequency as requestAnimationFrame is pegged to the display refresh rate of the web browser. Early on, without this limiter, the game experience would vary widely even on the same computer and browser.

### Tile Set
Knowing early on that I wished to use image sprites for the platforms I implemented the game world as a grid of tiles of a set size. Each tile can store the image that it will display and maintains a variable to determine if it can be passed through or will cause a collision with the player. The tile structure has the added benefit of simplifying collision detection between the player and platforms. Given that the player can only possibly overlap a maximum of 4 tiles at a time we need only check a small number of tiles based on the player's position and velocity.

### High Score Table

![alt text](https://raw.githubusercontent.com/jpshugrue/That-Sinking-Feeling/master/images/readme/highscore.png "That Sinking Feeling Gameplay")

A high score table is implemented using Google Firebase, which allows scores to persist not only between game sessions, but between different users as scores are stored in a central location between all instances of the game. The scores also live update during gameplay if another user has achieved a new high score thanks to the value event listener in Firebase's database API.

### What's next for That Sinking Feeling?

The features I intend to implement in the future include:

### Varying Levels of Difficulty
Add the ability to select the desired difficulty level on the main splash page, which will affect the speed of the water level, the speed of the player character and how high they can jump and the spacing of the platforms

### Obstacles and Environmental Effects
Add environmental effects such as varying light levels, a tilted and wavering viewpoint and obstacles such as steam vents and explosions that can slow down or knock back the player

### Randomized Level Generation
Implement random generation of beatable sets of platforms rather than pulling from a know list of pre-checked map sets
