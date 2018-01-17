# That Sinking Feeling
That Sinking Feeling is a vertical platform jumping game where the player has to keep moving upward to avoid a constantly rising water level

## MVP

- Hosting of the program using GitHub Pages

- Display of game world using Canvas and the EaselJS library

- Keyboard control of the player which has a concept of gravity and the ability to jump

- Automatic generation of new sets of platforms that are within jumping distance of those below as the player moves up

- A game screen which will move up as the player does but not move down and which will trigger a game over screen when the player drops below the bottom of the screen

- A steadily rising water level as represented by a level of opacity that rises independently of the game screen and will trigger a game over if the player enters it

- A score counter that increases as time passes and which is compared against a leaderboard on a game over

## Technologies, Libraries, APIs

TSF will be implemented in JavaScript using Canvas and EaselJS library.

I anticipate implementing the following will present challenges:

- Gravity and friction - The player will need to drop after a jump and slow to a stop horizontally when not pressing the movement keys. This will need to be tweaked to be not unpleasantly floaty or slippery feeling

- Collision - The player will need to be stopped by platforms and walls but not in a way that overzealously halts their movement.

- Platforms - Platforms will need to be continuously generated as the player moves upwards in such a way that the player is never left without the ability to keep going. I will implement this by determining a minimum viable jumping distance and storing a premade set of platforms that can be inserted into the game world.

- Water Level - The water level will rise independently of the bottom of the screen and will need to be tracked separately. I will need to handle a concept of negative space as the water level may be rising below the bottom of the screen.

## Wireframes

![alt text](https://github.com/jpshugrue/That-Sinking-Feeling/blob/master/images/BasicTemplate.png "Basic Wireframe")

## Backend

If time allows I will include a high score table that utilizes a database to allow scores to persist beyond the current session. This table would include the following:

- Score - Integer
- Name - Text
- Timestamp

## Implementation Timeline

### Phase 1

- Setup website hosting with GitHub pages
- Implement basic game world with player movement (but without vertical world movement), gravity and platforms with intelligent collision
- Calculate minimum jumping distances between platforms
- Build a set of pre made platforms to be populated in the game world
- Implement a rising water level that triggers a game over when in contact with the player

### Phase 2
- Implement a vertically moving game world based on player movement
- Ensure rising water level persists even if game world moves vertically above it
- Implement intelligent automatic populating of platforms
- Implement game over based on player dropping below the bottom of the screen

### Phase 3
- Implement player score and database backend
- Implement starting splash screen and game over screen
- Include nicer looking sprites for player, platforms and a scrolling image for the background
- Implement varying levels of difficulty that will adjust the speed of water level rise and spacing and frequency of platforms
