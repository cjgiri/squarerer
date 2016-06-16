var Tile = require('./tile');

var Board = function() {
  this.grid = new Array(12);
  for (var i = 0; i < this.grid.length; i++) {
    this.grid[i] = new Array(12);
  }
  for (var i = 0; i < 12; i++) {
    for (var k = 0; k < 12; k++) {
      var valid = true;
      if( i > 10 || k > 10 || i < 1 || k < 1 ) {
        this.grid[i][k] = new Tile(false, "none", true, false);
      };
      this.grid[i][k] = new Tile(false, "none", true, true);
    }
  }
}

Board.prototype.fillPiece = function (piece, middleX, middleY) {

  for (var i = 0; i < 3; i++) {
    for (var k = 0; k < 3; k++) {
      //check if the relative position on the board is real and empty
      var pieceTile = piece.grid[i][k];
      if (pieceTile.full){
        var relativeX = middleX + (i-1);
        var relativeY = middleY + (k-1);
        var relativeTile = this.grid[relativeX][relativeY];
        //this might require a slice
        // debugger
        relativeTile.color = pieceTile.color;
        relativeTile.full = true;
      }
    }
  }
  // debugger
};

Board.prototype.draw = function (ctx) {
  for (var i = 1; i < 11; i++) {
    for (var k = 1; k < 11; k++) {
      var currentTile = this.grid[i][k];

      if(currentTile.color !== "none"){
        ctx.fillStyle = currentTile.color;
        var xCorner = 150 + (50 * (i-1));
				var yCorner = 150 + (50 * (k-1));
				ctx.fillRect(xCorner, yCorner, 50, 50);
      }
    }
  }
};


module.exports = Board;
