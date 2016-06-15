var GameUI = function (canvas, ctx, game){
  this.ctx = ctx;
  this.canvas = canvas;
  this.game = game;
  this.moving = false;
};

GameUI.prototype.movePiece = function (e) {
  if (this.moving) {
    var bRect = this.canvas.getBoundingClientRect();
    mouseX = (e.clientX - bRect.left);
    mouseY = (e.clientY - bRect.top);
    this.game.attemptMove(mouseX, mouseY);
  }
};
GameUI.prototype.startMove = function (e) {
  this.moving = true;
};
GameUI.prototype.stopMove = function (e) {
  this.moving = false;
};

GameUI.prototype.start = function () {

  this.canvas.addEventListener("mousedown", this.startMove.bind(this), false);
  this.canvas.addEventListener('mousemove',this.movePiece.bind(this),false);
  this.canvas.addEventListener('mouseup',this.stopMove.bind(this),false);

  this.lastTime = 0;
  //start the animation
  requestAnimationFrame(this.animate.bind(this));
};

GameUI.prototype.animate = function(time){
  var timeDelta = time - this.lastTime;

  this.game.draw(this.ctx);
  this.lastTime = time;

  //every call to animate requests causes another call to animate
  requestAnimationFrame(this.animate.bind(this));
};



module.exports = GameUI;
