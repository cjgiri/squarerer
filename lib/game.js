var Piece = require('./piece');

var Game = function () {
  this.userPieces = [];
  this.pieceTray = this.initializePieceTray();
  for (var i = 0; i < 3 ; i++) {
    this.pushUserPiece(i);
  }
};

Game.BG_COLOR = "#E0E0E0";
Game.DIM_X = 1200;
Game.DIM_Y = 800;

Game.prototype.initializePieceTray = function () {
  //consider a refactor once positions are finalized
  return {
    0: {
      occupied: false,
      pos: [1000, 540]
    },
    1: {
      occupied: false,
      pos: [1000, 340]
    },
    2:{
      occupied: false,
      pos: [1000, 140]
    }
  };
};

Game.prototype.pushUserPiece = function(num) {
  this.pieceTray[num].occupied = true;
  this.userPieces.push(new Piece({pos: this.pieceTray[num].pos}));
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
    if (piece.moving){
      piece.drawOnMouse(mouseX, mouseY);
    }
  });
};

Game.prototype.toggleMoving = function(mouseX, mouseY, bool){

  this.userPieces.forEach(function(piece){
    if (piece.includesPos(mouseX, mouseY)){
      piece.moving = bool;
    }
  });
};



module.exports = Game;
