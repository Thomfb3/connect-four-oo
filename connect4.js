/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

/** Game Class **/
class Game {
  constructor(players, width, height) {
    //Width must be a number
    if (!Number.isFinite(width) && width <= 0) {
      throw new Error("width must be a positive number");
    }
    //Height must be a number
    if (!Number.isFinite(height) && height <= 0) {
      throw new Error("height must be a positive number");
    }
    //Playesr must be an array
    if (!Array.isArray(players) || players.length === 0) {
      throw new Error("Players must be an array cannot be empty");
    }

    this.players = players;
    this.width = width;
    this.height = height;
    this.currPlayer = players[0];
    this.playerState = 0;
    this.makeBoard();
    this.makeHtmlBoard();
    this.gameOver = false;
  }


  /** makeBoard: create in-JS board structure: **/
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
    //remove the event listener
    const top = document.querySelector("#column-top");
    top.removeEventListener("click", this.handleGameClick);
   
   //slow down alert so the final piece can drop 
    setTimeout(function () {
      alert(msg);
    }, 700);
  }


  /** makeComputerMove: Computer's play */
  makeComputerMove() {
    //Remove Event Listener to block play while it's the computer's turn
    const top = document.querySelector("#column-top");
    top.removeEventListener("click", this.handleGameClick);

    //Create random number to select x (column) for computer's move
    const topX = document.getElementById(Math.floor(Math.random() * this.width));

    //setTimeout to pause before computers play
    setTimeout(() => {
      //call the event to make player move for the computer
      this.handleGameClick(topX);
      //Add the event listener back to the top column
      top.addEventListener("click", this.handleGameClick);
    }, 800);
  }


  /** handleClick: handle click of column top to play piece */
  handleClick(evt) {
    //valid the game is not over
    if(this.gameOver === true) return;
    // get x from ID of clicked cell 
    //or get random id number from computer play in makeComputerMove()
    const x = (evt.tagName === "TD") ? evt.id : +evt.target.id;

    // get next spot in column (if none, ignore click)
    const y = this.findSpotForCol(x);
    if (y === null) {
      //If it's computer turn keep the computer guessing until it hits available column
      if (this.players[this.playerState]['isComputer']) {
        this.makeComputerMove();
      } else {
        //Let the player try again
        return;
      }
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

    //If the players property for isComputer is true - call makeComputerMove()
    if (this.players[this.playerState]['isComputer']) {
      this.makeComputerMove();
    }
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


/** Player Class **/
class Player {
  constructor(id, color, isComputer) {
    //ID must be a string
    if (typeof (id) !== 'string') {
      throw new Error("ID must be a string");
    }

    //color must be a valid color
    if (typeof (color) !== 'string') {
      throw new Error("Invalid Color");
    }
    //isComputer must be a boolean
    if (typeof (isComputer) !== 'boolean') {
      throw new Error("isComputer must be a boolean");
    }

    this.id = id;
    this.color = color;
    this.isComputer = isComputer;
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
    input.setAttribute('data-player', `player`);
    input.setAttribute('placeholder', `Player ${i + 1} color`);
    //Append player inputs block on the DOM
    document.getElementById('player-inputs').append(input);
  }

  //If computer player is selected, create a computer color input
  if (selectPlayers.value === "1") {
    const computer = document.createElement("input");
    //Add input attributes
    computer.setAttribute('id', `p2-color`);
    computer.setAttribute('data-player', `computer`);
    computer.setAttribute('placeholder', `Computer color`);
    //Append player inputs block on the DOM
    document.getElementById('player-inputs').append(computer);
  }
});


//function to check for valid color
const isColor = (colorInput) => {
  const s = new Option().style;
  s.color = colorInput;
  return s.color !== '';
}

//New Game button event listener
document.getElementById('new-game').addEventListener('click', () => {

  //create array with all input values
  const playerColors = Array.from(document.querySelectorAll('input')).filter((input) => {
    return input.getAttribute('data-player') === 'player';
  });

  //create an array of player objects
  const players = playerColors.map((color) => {
    return new Player(`p${playerColors.indexOf(color) + 1}`, color.value, false);
  })

  //If there's a computer input, push it to the players array
  if (computer = document.querySelector('input[data-player="computer"]')) {
    players.push(new Player(`p2`, computer.value, true));
  }

  //Check if any inputs are empty
  if (Array.from(document.querySelectorAll('input')).some((inputValue) => inputValue.value === "")) {
    alert("Please select colors for all players");
  } else if (Array.from(document.querySelectorAll('input')).some((inputValue) => !isColor(inputValue.value))) {
    alert("Invalid Color");
  } else {
    //Create new game object with players object array
    new Game(players, 7, 6);
  }
});


