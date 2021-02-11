/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */


class Game {
  constructor(players, width, height) {
    this.players = players;
    this.width = width;
    this.height = height;
    this.currPlayer = players[0];
    this.playerState = 0;
    this.makeBoard();
    this.makeHtmlBoard();
    this.gameOver = false;
  }

  // makeBoard: create in-JS board structure:
  // board = array of rows, each row is array of cells  (board[y][x])
  makeBoard() {
    this.board = [];
    for (let i = 0; i < this.height; i++) {
      this.board.push(Array(this.width).fill(null));
    }
  }

  /** makeHtmlBoard: make HTML table and row of column tops. */
  makeHtmlBoard() {
    const board = document.getElementById('board');
    board.innerHTML = '';

    // make column tops (clickable area for adding a piece to that column)
    const top = document.createElement('tr');
    top.setAttribute('id', 'column-top');

    // store a reference to the handleClick bound function 
    // so that we can remove the event listener correctly later
    this.handleGameClick = this.handleClick.bind(this);
    top.addEventListener("click", this.handleGameClick);

    for (let x = 0; x < this.width; x++) {
      const headCell = document.createElement('td');
      headCell.setAttribute('id', x);
      top.append(headCell);
    }

    board.append(top);

    // make main part of board
    for (let y = 0; y < this.height; y++) {
      const row = document.createElement('tr');

      for (let x = 0; x < this.width; x++) {
        const cell = document.createElement('td');
        cell.setAttribute('id', `${y}-${x}`);
        row.append(cell);
      }

      board.append(row);
    }
  }


  /** findSpotForCol: given column x, return top empty y (null if filled) */
  findSpotForCol(x) {
    for (let y = this.height - 1; y >= 0; y--) {
      if (!this.board[y][x]) {
        return y;
      }
    }
    return null;
  }


  /** placeInTable: update DOM to place piece into HTML table of board */
  placeInTable(y, x) {
    const piece = document.createElement('div');
    piece.classList.add('piece');
    piece.style.backgroundColor = this.currPlayer.color;
    piece.style.top = -50 * (y + 2);

    const spot = document.getElementById(`${y}-${x}`);
    spot.append(piece);
  }


  /** endGame: announce game end */
  endGame(msg) {
    setTimeout(function () {
      alert(msg);
    }, 700);

    const top = document.querySelector("#column-top");
    top.removeEventListener("click", this.handleGameClick);
  }


  /** handleClick: handle click of column top to play piece */
  handleClick(evt) {
    // get x from ID of clicked cell
    const x = +evt.target.id;

    // get next spot in column (if none, ignore click)
    const y = this.findSpotForCol(x);
    if (y === null) {
      return;
    }

    // place piece in board and add to HTML table
    this.board[y][x] = this.currPlayer;
    this.placeInTable(y, x);

    // check for win
    if (this.checkForWin()) {
      this.gameOver = true;
      return this.endGame(`The ${this.currPlayer.color} player won!`);
    }

    // check for tie
    if (this.board.every(row => row.every(cell => cell))) {
      return this.endGame('Tie!');
    }

    //switch players by Incrementing playerState
    this.playerState = this.playerState === this.players.length - 1 ? 0 : this.playerState + 1;
    //Set current player to the plateState index of players
    this.currPlayer = this.players[this.playerState];
  }

  
  /** checkForWin: check board cell-by-cell for "does a win start here?" */
  checkForWin() {
    const _win = (cells) => {
      // Check four cells to see if they're all color of current player
      //  - cells: list of four (y, x) cells
      //  - returns true if all are legal coordinates & all match currPlayer

      return cells.every(
        ([y, x]) =>
          y >= 0 &&
          y < this.height &&
          x >= 0 &&
          x < this.width &&
          this.board[y][x] === this.currPlayer
      );
    }

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        // get "check list" of 4 cells (starting here) for each of the different
        // ways to win
        const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
        const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
        const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
        const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

        // find winner (only checking each win-possibility as needed)
        if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
          return true;
        }
      }
    }
  }
  

} //END OF GAME CLASS


class Player {
  constructor(id, color) {
    this.id = id;
    this.color = color;
  }
}//END OF PLAYER CLASS


/////////////Game Setup 
//Select number of player form
const selectPlayers = document.getElementById('number-of-players');

//Event Listener on Player Select
selectPlayers.addEventListener('change', () => {
  //Clear the inputs block on every change
  document.getElementById('player-inputs').innerText = "";

  //loop the number of players selected to create color inputs
  for (let i = 0; i < selectPlayers.value; i++) {
    //Create color input
    const input = document.createElement("input");
    //Add input attributes
    input.setAttribute('id', `p${i + 1}-color`);
    input.setAttribute('placeholder', `Player ${i + 1} color`);
    //Append player inputs block on the DOM
    document.getElementById('player-inputs').append(input);
  }
});


//New Game button event listener
document.getElementById('new-game').addEventListener('click', () => {

  //create array with all input values
  const playerArray = Array.from(document.querySelectorAll('input')).map((input) => {
    return input.value;
  });

  //create an array of player objects
  const players = playerArray.map((playerColor) => {
    return (new Player(`p${playerArray.indexOf(playerColor) + 1}`, playerColor))
  });

  //Check if any inputs are empty
  if (playerArray.some((inputValue) => inputValue === "")) {
    alert("Please select colors for all players");
  } else {
    //Create new game object with players object array
    new Game(players, 7, 6);
  }
});
