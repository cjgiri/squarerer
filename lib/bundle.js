/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var GameUI = __webpack_require__(1),
	    Game = __webpack_require__(2);
	
	document.addEventListener("DOMContentLoaded", function(){
	  var canvasEl = document.getElementsByTagName("canvas")[0];
	
	  canvasEl.width = Game.DIM_X;
	  canvasEl.height = Game.DIM_Y;
	
	
	  var ctx = canvasEl.getContext("2d");
	  ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
	  ctx.fillStyle = Game.BG_COLOR;
	  ctx.fillRect(0, 0, Game.DIM_X, Game.DIM_Y);
	  var start = document.getElementById('start');
	  var scoreZone = document.getElementById('score-zone');
	  var modal = document.getElementsByClassName('modal-box')[0];
	  start.onclick = function(){
	    var game = new Game();
	    start.classList.add("hidden");
	    scoreZone.classList.remove("hidden");
	    modal.classList.add("hidden");
	    new GameUI(canvasEl, ctx, game).start();
	  };
	})


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var Game = __webpack_require__(2);
	var GameUI = function (canvas, ctx, game){
	  this.ctx = ctx;
	  this.canvas = canvas;
	  this.game = game;
	  this.moving = false;
	};
	
	GameUI.prototype.movePiece = function (e) {
	  if (this.moving) {
	    var relativeMouse = this.relativeMouse(e);
	    this.game.attemptMove(relativeMouse[0], relativeMouse[1]);
	  }
	};
	GameUI.prototype.startMove = function (e) {
	  var relativeMouse = this.relativeMouse(e);
	  this.game.toggleMoving(relativeMouse[0], relativeMouse[1], true);
	  this.moving = true;
	};
	GameUI.prototype.stopMove = function (e) {
	  var relativeMouse = this.relativeMouse(e);
	  this.game.toggleMoving(relativeMouse[0], relativeMouse[1], false);
	  this.moving = false;
	};
	
	GameUI.prototype.start = function () {
	    this.canvas.addEventListener("mousedown", this.startMove.bind(this), false);
	    this.canvas.addEventListener('mousemove',this.movePiece.bind(this),false);
	    this.canvas.addEventListener('mouseup',this.stopMove.bind(this),false);
	    requestAnimationFrame(this.animate.bind(this));
	};
	
	GameUI.prototype.relativeMouse = function(e){
	  var bRect = this.canvas.getBoundingClientRect();
	  mouseX = (e.clientX - bRect.left);
	  mouseY = (e.clientY - bRect.top);
	  return [mouseX, mouseY];
	};
	
	GameUI.prototype.animate = function(time){
	  if(this.game.validMoveExists()){
	    this.game.draw(this.ctx);
	    requestAnimationFrame(this.animate.bind(this));
	  } else {
	    this.endGameScreen();
	    var restartModal = document.getElementById('restart-modal')
	    var score = document.getElementById('score');
	    var restartButton = document.getElementById('restart');
	    var scoreZone = document.getElementById('score-zone');
	    restartModal.classList.remove('hidden');
	    scoreZone.classList.add('hidden');
	    score.innerHTML = this.game.score;
	    restartButton.onclick = function(){
	      this.game = new Game();
	      this.start();
	      restartModal.classList.add('hidden');
	      scoreZone.classList.remove('hidden');
	    }.bind(this)
	
	  }
	};
	
	GameUI.prototype.endGameScreen = function () {
	
	  this.ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
	  this.ctx.fillStyle = Game.BG_COLOR;
	  this.ctx.fillRect(0, 0, Game.DIM_X, Game.DIM_Y);
	
	};
	
	
	
	module.exports = GameUI;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var Piece = __webpack_require__(3),
	    Board = __webpack_require__(5);
	
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
	// #FF5722
	Game.piecesArr = [
	  {
	  	color: "#9C27B0",
	    points: 3,
	    tiles: [[false, true, false],
	            [false, true, false],
	            [false, true, false]]
	  },
	
	  {
	  	color: "#9C27B0",
	    points: 3,
	    tiles: [[false, false, false],
	            [true, true, true],
	            [false, false, false]]
	  },
	  {
	  	color: "#FF5722",
	    points: 2,
	    tiles: [[false, true, false],
	            [false, true, false],
	            [false, false, false]]
	  },
	
	  {
	  	color: "#FF5722",
	    points: 2,
	    tiles: [[false, false, false],
	            [true, true, false],
	            [false, false, false]]
	  },
	
	  {
	  	color: "#D32F2F",
	    points: 5,
	    tiles: [[true, true, true],
	            [true, false, false],
	            [true, false, false]]
	  },
	
	  {
	  	color: "#D32F2F",
	    points: 5,
	    tiles: [[false, false, true],
	            [false, false, true],
	            [true, true, true]]
	  },
	  {
	  	color: "#D32F2F",
	    points: 5,
	    tiles: [[true, true, true],
	            [false, false, true],
	            [false, false, true]]
	  },
	
	  {
	  	color: "#D32F2F",
	    points: 5,
	    tiles: [[true, false, false],
	            [true, false, false],
	            [true, true, true]]
	  },
	
	  {
	  	color: "#009688",
	    points: 9,
	    tiles: [[true, true, true],
	            [true, true, true],
	            [true, true, true],]
	  },
	  {
	  	color: "#00C853",
	    points: 1,
	    tiles: [[false, false, false],
	            [false, true, false],
	            [false, false, false],]
	  },
	  {
	  	color: "#EC407A",
	    points: 3,
	    tiles: [[false, true, true],
	            [false, false, true],
	            [false, false, false],]
	  },
	  {
	  	color: "#EC407A",
	    points: 3,
	    tiles: [[false, false, false],
	            [true, false, false],
	            [true, true, false],]
	  },
	  {
	  	color: "#EC407A",
	    points: 3,
	    tiles: [[true, true, false],
	            [true, false, false],
	            [false, false, false],]
	  },
	  {
	  	color: "#EC407A",
	    points: 3,
	    tiles: [[false, false, false],
	            [false, false, true],
	            [false, true, true],]
	  },
	  {
	  	color: "#FFC107",
	    points: 4,
	    tiles: [[false, true, true],
	            [false, true, true],
	            [false, false, false],]
	  },
	  {
	  	color: "#FFC107",
	    points: 4,
	    tiles: [[false, true, true],
	            [false, true, true],
	            [false, false, false],]
	  }
	]
	
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
	    // this.userPieces.push(new Piece({pos: this.pieceTray[num].pos, piece: Game.piecesArr[8]}));
	
	};
	
	Game.randomPiece = function(){
	  return Game.piecesArr[Math.floor(Math.random() * (Game.piecesArr.length))];
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


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var Tile = __webpack_require__(4);
	
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
		this.points = options.piece.points;
	
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


/***/ },
/* 4 */
/***/ function(module, exports) {

	var Tile = function(full, color, gridPos, validGrid){
	  this.full = full;
	  this.color = color;
	  this.gridPos = gridPos || false;
	  this.validGrid = validGrid || false;
	};
	
	module.exports = Tile;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var Tile = __webpack_require__(4);
	
	var Board = function() {
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


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map