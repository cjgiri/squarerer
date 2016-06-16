var Tile = require('./tile');

var Board = function() {
  this.grid = new Array(12).fill(new Array(12));
  for (var i = 0; i < 12; i++) {
    for (var k = 0; k < 12; k++) {
      var valid = true;
      if( i > 10 || k > 10 || i < 1 || k < 1 ) {
        this.grid[i][k] = new Tile(false, "none", true, false);
      };
      this.grid[i][k] = new Tile(false, "none", true, true);
    }
  }
}


module.exports = Board;
