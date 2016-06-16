var Tile = function(full, color, gridPos, validGrid){
  this.full = full;
  this.color = color;
  this.gridPos = gridPos || false;
  this.validGrid = validGrid || false;
};

module.exports = Tile;
