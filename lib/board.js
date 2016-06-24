var Tile = require('./tile');

var Board = function() {
  this.updating = false;
  this.grid = new Array(12);
  for (var i = 0; i < this.grid.length; i++) {
    this.grid[i] = new Array(12);
  }
  for (var i = 0; i < 12; i++) {
    for (var k = 0; k < 12; k++) {
      if( i > 10 || k > 10 || i < 1 || k < 1 ) {
        this.grid[i][k] = new Tile(false, "none", true, false);
      }else{
        this.grid[i][k] = new Tile(false, "none", true, true);
      }
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
        relativeTile.color = pieceTile.color;
        relativeTile.full = true;
      }
    }
  }
};

Board.transposeBoard = function(board){
  return Object.keys(board[0]).map(
    function (c) { return board.map(function (r) { return r[c]; }); }
  );
},

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
Board.prototype.clearRows = function (rows) {
  this.grid = Board.transposeBoard(this.grid);
  this.clearColumns(rows, true);
  this.grid = Board.transposeBoard(this.grid);
};

Board.prototype.setColor = function (coords, color) {
  this.grid[coords[0]][coords[1]].color = color;
};

Board.prototype.setFull = function (coords, fullStatus) {
  this.grid[coords[0]][coords[1]].full = fullStatus;
};

Board.prototype.clearCell= function(coords, color) {
  this.setColor(coords, color);
  this.setFull(coords, false);
};

Board.prototype.clearColumns = function (cols, swap) {
  this.updating = true;
  setTimeout(function(){this.updating = false;}.bind(this), 25 * 12)
  for (var c = 0; c < cols.length; c++){
    var timeoutDuration = 1;
    for (var i = 0; i < 12; i++) {
      var coords = [cols[c], i];
      if (swap) coords = [i, cols[c]];;
      setTimeout(this.clearCell.bind(this, coords, "none"), timeoutDuration * 25);
      timeoutDuration += 1;
    }
  };
};



module.exports = Board;
