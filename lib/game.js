var Piece = require('./piece'),
    Board = require('./board');

var Game = function () {
  this.score = 0;
  this.userPieces = [];
  this.pieceTray = this.initializePieceTray();
  this.board = new Board();
  for (var i = 0; i < 3 ; i++) {
    this.pushUserPiece(i);
  }
  this.gridImg = new Image();
  this.gridImg.src = "./assets/art/grid.png";

};

Game.BG_COLOR = "#E0E0E0";
Game.DIM_X = 1200;
Game.DIM_Y = 800;


//todo figure out why the hell these are sideways
var wideLine = {
	color: "#FF5722",
  tiles: [[false, true, false],
          [false, true, false],
          [false, true, false]]
};

var tallLine = {
	color: "#9C27B0",
  tiles: [[false, false, false],
          [true, true, true],
          [false, false, false]]
};

var bigBox = {
	color: "#009688",
  tiles: [[true, true, true],
          [true, true, true],
          [true, true, true],]
};
var littleBox = {
	color: "#FFEB3B",
  tiles: [[false, true, true],
          [false, true, true],
          [false, false, false],]
};

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
  //test hardcoding, should be fixed
  if (num % 2 === 0){
    this.userPieces.push(new Piece({pos: this.pieceTray[num].pos, piece: tallLine}));
  } else {
    this.userPieces.push(new Piece({pos: this.pieceTray[num].pos, piece: littleBox}));
  }
};

Game.prototype.draw = function(ctx) {

  ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
  ctx.fillStyle = Game.BG_COLOR;
  ctx.fillRect(0, 0, Game.DIM_X, Game.DIM_Y);
  this.board.draw(ctx);
  ctx.drawImage(this.gridImg, 150, 150, 500, 500);
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

Game.prototype.validMove = function(middleX, middleY, piece, board) {
  // grid top left is 150
  // each tile is 45 px
  if(middleY > 10 || middleX > 10 ||
     middleY < 1 || middleX < 1 ) return false;
  for (var i = 0; i < 3; i++) {
		for (var k = 0; k < 3; k++) {
			// grid[i][k] = new Tile(true, color, false);
      if (piece.grid[i][k].full){
        //check if the relative position on the board is real and empty
        var relativeX = middleX + (i-1);
        var relativeY = middleY + (k-1);
        var relativePiece = this.board.grid[relativeX][relativeY];
        if (!relativePiece.gridPos || !relativePiece.validGrid || relativePiece.full){
          return false;
        }
      }
		}
	}
  return true;
};

Game.prototype.makeMove = function (piece, pieceMiddleX, pieceMiddleY) {
  this.board.fillPiece(piece, pieceMiddleX, pieceMiddleY);
  //remove piece from user pieces
  this.userPieces.splice(this.userPieces.indexOf(piece),1);

  if(this.userPieces.length === 0){
    //break this code out at some point
    this.pieceTray = this.initializePieceTray();
    for (var i = 0; i < 3 ; i++) {
      this.pushUserPiece(i);
    }
  }
  //add to score
};

Game.prototype.toggleMoving = function(mouseX, mouseY, bool){
  this.userPieces.forEach(function(piece){
    if (piece.includesPos(mouseX, mouseY)){
      if (bool === false){
        var pieceMiddleX = Math.ceil((mouseX-150) / 49);
        var pieceMiddleY = Math.ceil((mouseY-150) / 49);
        if (!this.validMove(pieceMiddleX, pieceMiddleY, piece, this.board)){
          piece.pos = piece.initialpos.slice();
        } else {
          this.makeMove(piece, pieceMiddleX, pieceMiddleY);
        }
      }
      piece.moving = bool;
    }
  }.bind(this));
};



module.exports = Game;
