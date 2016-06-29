var Game = require('./game');
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

GameUI.prototype.animate = function(){
  //refactor
  if(this.game.board.updating || this.game.validMoveExists()){
    this.game.draw(this.ctx);
    requestAnimationFrame(this.animate.bind(this));
  } else {
    this.endGameScreen();

  }
};

GameUI.prototype.endGameScreen = function () {
  this.ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
  this.ctx.fillStyle = Game.BG_COLOR;
  this.ctx.fillRect(0, 0, Game.DIM_X, Game.DIM_Y);

  var restartModal = document.getElementById('restart-modal')
  var score = document.getElementById('score');
  var restartButton = document.getElementById('restart');
  var submitButton = document.getElementsByClassName('small')[0];
  var scoreZone = document.getElementById('score-zone');
  restartModal.classList.remove('hidden');
  scoreZone.classList.add('hidden');
  score.innerHTML = this.game.score;
  this.game.updateScoresView();

  submitButton.onclick = function(){
    var inits = document.getElementById('inits').value.toUpperCase();
    this.game.submitScore(inits);
    this.restartGame(restartModal, scoreZone);
  }.bind(this);

  restartButton.onclick = function(){
    this.restartGame(restartModal, scoreZone);
  }.bind(this)

};

GameUI.prototype.restartGame = function (restartModal, scoreZone) {
  this.game = new Game();
  this.start();
  restartModal.classList.add('hidden');
  scoreZone.classList.remove('hidden');
};



module.exports = GameUI;
