var GameUI = require('./gameUI'),
    Game = require('./game');

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
