var Tile = require('./tile');

var DEFAULTS = {
	COLOR: "#FF5722",
	dim: 50
};


var Piece = function (options = {}) {
  this.color = options.piece.color || DEFAULTS.COLOR;
	this.grid = this.initializePieceGrid(options.piece);
  this.initialpos = options.pos.slice();
  this.pos = options.pos;
  this.dim = DEFAULTS.dim;

};

Piece.prototype.initializePieceGrid = function(piece){
	// ultimately, this will only draw the grid tiles based on which piece it is
	var grid = new Array(3);
  for (var i = 0; i < grid.length; i++) {
    grid[i] = new Array(3);
  }
	for (var i = 0; i < 3; i++) {
		for (var k = 0; k < 3; k++) {
			if (piece.tiles[i][k]){
				grid[i][k] = new Tile(true, piece.color, false, false);
			}else{
				grid[i][k] = new Tile(false, "none", false, false);
			}
		}
	}

	return grid
};

Piece.prototype.draw = function (ctx) {
	for (var i = 0; i < 3; i++) {
		for (var k = 0; k < 3; k++) {
			if(this.grid[i][k].full){
				ctx.fillStyle = this.grid[i][k].color;
				var xCorner = this.pos[0] + (this.dim * i);
				var yCorner = this.pos[1] + (this.dim * k);
				ctx.fillRect(xCorner, yCorner, this.dim-2, this.dim-2);
			}
		}
	}

};

Piece.prototype.includesPos = function (mouseX, mouseY) {
  if(mouseX > this.pos[0] && mouseX < (this.pos[0] + (this.dim * 3))){
    if(mouseY > this.pos[1] && mouseY < (this.pos[1] + (this.dim * 3))){
      return true;
    }
  }
  return false;
};

Piece.prototype.drawOnMouse = function (mouseX, mouseY) {
  this.pos[0] = mouseX - ((this.dim * 3) / 2);
  this.pos[1] = mouseY - ((this.dim * 3) / 2);
};

module.exports = Piece;
