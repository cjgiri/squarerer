var DEFAULTS = {
	COLOR: "#FF5722",
	dim: 125
};

var Piece = function (options = {}) {
  this.color = DEFAULTS.COLOR;
  this.pos = options.pos || [100,100];
  this.dim = DEFAULTS.dim;

};

Piece.prototype.draw = function (ctx) {
  ctx.fillStyle = this.color;

  ctx.fillRect(this.pos[0], this.pos[1], this.dim, this.dim);

};

Piece.prototype.includesPos = function (mouseX, mouseY) {
  if(mouseX > this.pos[0] && mouseX < (this.pos[0] + this.dim)){
    if(mouseY > this.pos[1] && mouseY < (this.pos[1] + this.dim)){
      return true;
    }
  }
  return false;
};

Piece.prototype.drawOnMouse = function (mouseX, mouseY) {
  this.pos[0] = mouseX - (this.dim / 2);
  this.pos[1] = mouseY - (this.dim / 2);
};

module.exports = Piece;
