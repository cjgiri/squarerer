var Board = function() {
  this.grid = new Array(10);
  this.grid.fill(new Array(10).fill({
    color: "none"
  }));
  console.log(this.grid);
}


module.exports = Board;
