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

  this.lastTime = 0;
  //start the animation
  requestAnimationFrame(this.animate.bind(this));
};

GameUI.prototype.relativeMouse = function(e){
  var bRect = this.canvas.getBoundingClientRect();
  mouseX = (e.clientX - bRect.left);
  mouseY = (e.clientY - bRect.top);
  return [mouseX, mouseY];
};

GameUI.prototype.animate = function(time){
  var timeDelta = time - this.lastTime;

  this.game.draw(this.ctx);
  this.lastTime = time;

  //every call to animate requests causes another call to animate
  requestAnimationFrame(this.animate.bind(this));
};



module.exports = GameUI;
