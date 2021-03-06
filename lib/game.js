var Piece = require('./piece'),
    Board = require('./board'),
    PiecesArr = require('./piecesArr');

var Game = function () {
  this.userInits = "ABC";
  this.score = 0;
  this.userPieces = [];
  this.pieceTray = this.initializePieceTray();
  this.board = new Board();
  this.getHighScores();
  for (var i = 0; i < 3 ; i++) {
    this.pushUserPiece(i);
  }
  this.gridImg = new Image();
  this.gridImg.src = "./assets/art/grid.png";

};

Game.BG_COLOR = "#E0E0E0";
Game.DIM_X = 1200;
Game.DIM_Y = 800;


Game.prototype.getHighScores = function () {
  var http = new XMLHttpRequest();
  var url = "http://immense-reaches-61976.herokuapp.com/scores";
  http.open("GET", url, true);

  //Send the proper header information along with the request
  http.setRequestHeader("Content-type", "application/json");

  http.onreadystatechange = function() {//Call a function when the state changes.
      if(http.readyState == 4 && http.status == 200) {
        this.hiScores = JSON.parse(http.responseText);
        // this.updateScoresView();
      }
  }.bind(this)
  http.send();
};

Game.prototype.submitScore = function (inits) {
  if (inits.length > 3) inits = "CJG";
  var http = new XMLHttpRequest();
  var url = "http://immense-reaches-61976.herokuapp.com/scores";
  var params = JSON.stringify({inits:inits, score: this.score.toString()})
  http.open("POST", url, true);

  //Send the proper header information along with the request
  http.setRequestHeader("Content-type", "application/json");

  http.onreadystatechange = function() {//Call a function when the state changes.
      if(http.readyState == 4 && http.status == 200) {
          this.getHighScores();
      }
  }.bind(this);
  http.send(params);

};

Game.prototype.updateScoresView = function () {
  var scoresTable = document.getElementsByClassName('score-list')[0];
  scoresTable.innerHTML="";
  var userShown = false;
  var scoreCount = 10;
  for (var i = 0; i < scoreCount; i++) {
    var thisScore = this.hiScores[i];
    if (this.score > thisScore.score && userShown === false) {
      scoreCount -= 1;
      userShown = true;
      Game.pushScore(scoresTable, "YOU", this.score, true);
    }
    Game.pushScore(scoresTable, thisScore.inits, thisScore.score, false)
  }
};

Game.pushScore = function(el, newInits, newScore, currentScore){
  var tr = document.createElement('tr');
  var inits = document.createElement('td');
  var score = document.createElement('td');
  if(currentScore){
    inits.style.color="#FF5722"
    score.style.color="#FF5722"
  }
  inits.appendChild(document.createTextNode(newInits));
  score.appendChild(document.createTextNode(newScore));
  tr.appendChild(inits);
  tr.appendChild(score);
  el.appendChild(tr);
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

    this.userPieces.push(new Piece({pos: this.pieceTray[num].pos, piece: Game.randomPiece()}));
    // this.userPieces.push(new Piece({pos: this.pieceTray[num].pos, piece: PiecesArr[14]}));

};

Game.randomPiece = function(){
  return PiecesArr[Math.floor(Math.random() * (PiecesArr.length))];
};

Game.prototype.draw = function(ctx) {
  var scoreDisplay = document.getElementById('running-score');
  scoreDisplay.innerHTML = this.score;
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

Game.prototype.validMoveExists = function () {
  for (var j = 0; j < this.userPieces.length; j++) {
    for (var i = 1; i < 11; i++) {
      for (var k = 1; k < 11; k++) {
        if(this.validMove(i,k,this.userPieces[j],this.board)){
          return true
        }
      }
    }
  }
  return false;
};

Game.prototype.makeMove = function (piece, pieceMiddleX, pieceMiddleY) {
  this.board.fillPiece(piece, pieceMiddleX, pieceMiddleY);
  //remove piece from user pieces
  this.score += piece.points;
  var clearCols = [];
  var clearRows = [];
  this.userPieces.splice(this.userPieces.indexOf(piece),1);

  // refactor this
  this.board.grid.forEach(function (col, ind){
    for (var i = 1; i < 11; i++) {
      if (col[i].color === "none"){
        break
      }
      if (i === 10){
        clearCols.push(ind);
      }
    }
  })

  var transposed = Board.transposeBoard(this.board.grid);

  transposed.forEach(function (row, ind){
    for (var i = 1; i < 11; i++) {
      if (row[i].color === "none"){
        break
      }
      if (i === 10){
        clearRows.push(ind);
      }
    }
  })

  if(clearCols.length > 0) {this.board.clearColumns(clearCols)};
  if(clearRows.length > 0) this.board.clearRows(clearRows);

  if(this.userPieces.length === 0){
    //break this code out at some point
    this.pieceTray = this.initializePieceTray();
    for (var i = 0; i < 3 ; i++) {
      this.pushUserPiece(i);
    }
  }
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
