var Piece = require('./piece');

var Game = function () {
  this.userPieces = [];
  this.pushUserPiece();
};

Game.BG_COLOR = "#000000";
Game.DIM_X = 1000;
Game.DIM_Y = 600;

Game.prototype.pushUserPiece = function() {
  this.userPieces.push(new Piece());
};

Game.prototype.draw = function(ctx) {

  ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
  ctx.fillStyle = Game.BG_COLOR;
  ctx.fillRect(0, 0, Game.DIM_X, Game.DIM_Y);
  this.userPieces.forEach(function(piece){
    piece.draw(ctx);
  });
};

Game.prototype.attemptMove = function(mouseX, mouseY){

  this.userPieces.forEach(function(piece){
    if (piece.includesPos(mouseX, mouseY)){
      piece.drawOnMouse(mouseX, mouseY);
    }
  });
};



module.exports = Game;
