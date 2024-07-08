import './style.css'

var origBoard;
const PLAYER = '0';
const AI = 'X';
const winCombos = [
	[0, 1, 2], [3, 4, 5], [6, 7, 8],
	[0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [6, 4, 2], 
]

var MINIMAX = false

function startGame() {
	document.querySelector(".endgame").style.display = "none";
	origBoard = Array.from(Array(9).keys());
	for (var i = 0; i < cells.length; i++) {
		cells[i].innerText = '';
		cells[i].style.removeProperty('background-color');
		cells[i].addEventListener('click', turnClick, false);
	}
}

document.querySelector('#app').innerHTML = `
  <div>
    <h1> Tic Tac Toe </h1>
    <table>
    <tbody>
		<tr>
			<td class="cell" id="0"></td>
			<td class="cell" id="1"></td>
			<td class="cell" id="2"></td>
		</tr>
		<tr>
			<td class="cell" id="3"></td>
			<td class="cell" id="4"></td>
			<td class="cell" id="5"></td>
		</tr>
		<tr>
			<td class="cell" id="6"></td>
			<td class="cell" id="7"></td>
			<td class="cell" id="8"></td>
		</tr>
    </tbody>
    </table>
    <div class="endgame" id="endgame">
      <div class="text"></div>
      <p id="judgetxt" class="judgetxt"></p>
    </div>
    <div class="btnContainer" id="btnContainer"></div>
    <footer id="footer" class="footer">Built by Azmayen Murshid</footer>
  </div>
`
const restartBtn = document.createElement('button');
restartBtn.textContent = 'Replay';
restartBtn.addEventListener('click', startGame);
document.getElementById('btnContainer').appendChild(restartBtn)

const minimaxBtn = document.createElement('button')
minimaxBtn.textContent = 'HARD'
minimaxBtn.addEventListener('click', () => {
  minimaxBtn.textContent = MINIMAX ? 'HARD' : 'EASY'
  MINIMAX = !MINIMAX;
  console.log(MINIMAX)
})
document.getElementById('btnContainer').appendChild(minimaxBtn)

const replayBtn = document.createElement('button');
replayBtn.textContent = 'Play Again';
replayBtn.addEventListener('click', startGame);
document.getElementById('endgame').appendChild(replayBtn);

const cells = document.querySelectorAll('.cell');
startGame()

function turnClick(square) {
  if(typeof origBoard[square.target.id] == 'number'){
    turn(square.target.id, PLAYER);
    if(!checkTie()) turn(bestSpot(), AI);
  }
}

function turn(squareId, player) {
	origBoard[squareId] = player;
	document.getElementById(squareId).innerText = player;
  let gameWon = checkWin(origBoard, player)
  if (gameWon) gameOver(gameWon)
}

function checkWin(board, player){
  let plays = board.reduce((a, e, i) => 
    (e === player) ? a.concat(i) : a, []);

  let gameWon = null;
  for (let [index, win] of winCombos.entries()){
    if (win.every(elem => plays.indexOf(elem) > -1)){
      gameWon = {index: index, player: player};
      break;
    }
  }
  return gameWon;
}

function gameOver(gameWon){
  for (let index of winCombos[gameWon.index]) {
    document.getElementById(index).style.backgroundColor =
    gameWon.player == PLAYER ? "#5a9964" : "#995a5b"; // change colors
  }
  for(var i = 0; i < cells.length; i++){
    cells[i].removeEventListener('click', turnClick, false);
  }
  declareWinner(gameWon.player == PLAYER ? "You win!" : "You lose.");
}

function declareWinner(pl){
  document.querySelector(".endgame").style.display = "block";
  document.querySelector(".endgame .text").innerText = pl
}

function emptySquares(){
  return origBoard.filter(s => typeof s == 'number');
}

function bestSpot(){
  if (MINIMAX == false){
    return emptySquares()[0];
  }
  else{
    return minimax(origBoard, AI).index
  }
}

function checkTie(){
  if(emptySquares().length == 0) {
    declareWinner("Technical Win!")
    for (let i = 0; i < cells.length; i++){
      cells.removeEventListener('click', turnClick, false);
    }
    return true;
  }
  return false;
}

function minimax(newBoard, player){
  var availSpots = emptySquares(newBoard);

  if(checkWin(newBoard, player)){
    return {score: -10};
  } else if (checkWin(newBoard, AI)){
    return {score: 20};
  } else if (availSpots.length === 0){
    return {score: 0};
  }

  var moves = [];
  for (var i = 0; i < availSpots.length; i++){
    var move = {};
    move.index = newBoard[availSpots[i]];
    newBoard[availSpots[i]] = player;

    if(player == AI){
      var result = minimax(newBoard, PLAYER);
      move.score = result.score;
    } else {
      var result = minimax(newBoard, AI);
      move.score = result.score;
    }
    newBoard[availSpots[i]] = move.index;

    moves.push(move);
  }

  var bestMove;
  if(player === AI){
    var bestScore = -10000;
    for(let i = 0; i < moves.length; i++){
      if(moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
      var bestScore = 10000;
      for(let i = 0; i < moves.length; i++){
        if(moves[i].score < bestScore) {
          bestScore = moves[i].score;
          bestMove = i;
      }
    }
  }
  return moves[bestMove];
}