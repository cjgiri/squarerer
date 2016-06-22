# Squarerer

[Squarerer live][squarerer]

[squarerer]: http://chrisgiri.com/squarerer

*Squarerer* is a geometric meditative puzzler based on the popular mobile game *1010!*. It is built on the HTML5 Canvas and written in pure JavaScript, with some HTML modals used for interface.

## Features & Implementation

### Drag and Drop

While drag and drop piece placement seems like a surprisingly intuitive feature to implement, it in fact turned out to be one of the biggest hurdles in building *Squarerer*. Though it appears as though the pieces are physically placed within the grid, this isn't really the case. Each piece is a representation of a 3x3 array with color and fullness properties for each tile.

![drag-drop]



[drag-drop]: ./docs/dragdrop.png

When a user attempts to drop a piece into the grid, the game checks if it is a `validMove` based on the mouse position, the fullness status of each tile, and whether or not the corresponding grid tiles are full. If the tiles can all be filled, they're filled with the appropriate color and have their `full` status set to true.


### Endgame

One of the features that I always thought was great in *1010!* was the way it knew that there were no more valid moves. To compute this, I used a method similar to some code I wrote to check for check and checkmate in a chess program I wrote. Basically, every time a piece is played, the game attempts a move for each piece, in each board position. If none are valid moves, the player has lost.


## Future Improvements

I think the core functionality of this game is really great, and it definitely sets up a great base upon which a ton of features can be added.

### Improved Animation

To make the game feel more tactile, I'd like rows and columns to 'pop off' tile by tile rather than all at once. It would also be nice if invalid moves animated a tile moving back to the user pieces 'drawer'.

### Different Gametypes

It would be great to add timed modes, different ways to distribute pieces, and different grid sizes.

### Balancing

Balancing this game proved to be one of the trickiest parts. While I generally think it makes sense to randomize the pieces (this is how the game currently works), it seems a little strange that this allows the game to occasionally give you three of the same piece.
