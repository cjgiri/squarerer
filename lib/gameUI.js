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

  //start the animation
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
    restartModal.classList.remove('hidden');
    score.innerHTML = this.game.score;
    restartButton.onclick = function(){
      this.game = new Game();
      this.start();
      restartModal.classList.add('hidden');
    }.bind(this)

  }
  //every call to animate requests causes another call to animate

};

GameUI.prototype.endGameScreen = function () {

  this.ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
  this.ctx.fillStyle = Game.BG_COLOR;
  this.ctx.fillRect(0, 0, Game.DIM_X, Game.DIM_Y);

};



module.exports = GameUI;
