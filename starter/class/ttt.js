const Screen = require("./screen");
const Cursor = require("./cursor");
const ComputerPlayer = require("./computer-player");

class TTT {
  constructor() {
    this.playerTurn = "O";
    this.grid = [
      [" ", " ", " "],
      [" ", " ", " "],
      [" ", " ", " "],
    ];
    this.cursor = new Cursor(3, 3);
    this.isComputerPlayer = false;

    Screen.initialize(3, 3);
    Screen.setGridlines(true);

    Screen.addCommand("up", "move cursor up", this.cursor.up.bind(this.cursor));
    Screen.addCommand(
      "down",
      "move cursor down",
      this.cursor.down.bind(this.cursor)
    );
    Screen.addCommand(
      "left",
      "move cursor left",
      this.cursor.left.bind(this.cursor)
    );
    Screen.addCommand(
      "right",
      "move cursor right",
      this.cursor.right.bind(this.cursor)
    );
    Screen.addCommand("return", "place move", this.makeMove.bind(this));
    Screen.addCommand(
      "c",
      "toggle computer player",
      this.toggleComputerPlayer.bind(this)
    );
    Screen.addCommand(
      "h",
      "play against human",
      this.setHumanPlayer.bind(this)
    );

    this.promptComputerPlayerChoice();
  }

  promptComputerPlayerChoice() {
    Screen.setMessage(
      "Press 'c' to play against the computer, or 'h' to play two-player"
    );
    Screen.render();
  }

  toggleComputerPlayer() {
    this.isComputerPlayer = !this.isComputerPlayer;
    const message = this.isComputerPlayer
      ? "Playing against AI (you are O)"
      : "Two-player mode";
    Screen.setMessage(message);
    Screen.render();

    if (this.isComputerPlayer && this.playerTurn === "X") {
      this.makeComputerMove();
    }
  }

  setHumanPlayer() {
    this.isComputerPlayer = false;
    Screen.setMessage("Two-player mode");
    Screen.render();
  }

  makeMove() {
    if (this.isComputerPlayer && this.playerTurn === "X") {
      return; // Don't allow player to make a move for the computer
    }

    const row = this.cursor.row;
    const col = this.cursor.col;

    if (this.grid[row][col] === " ") {
      this.grid[row][col] = this.playerTurn;
      Screen.setGrid(row, col, this.playerTurn);
      Screen.render();

      const winner = TTT.checkWin(this.grid);
      if (winner) {
        TTT.endGame(winner);
      } else {
        this.playerTurn = this.playerTurn === "O" ? "X" : "O";
        Screen.setMessage(`It's ${this.playerTurn}'s turn`);
        Screen.render();

        if (this.isComputerPlayer && this.playerTurn === "X") {
          setTimeout(() => this.makeComputerMove(), 1000); // Delay for better UX
        }
      }
    }
  }

  makeComputerMove() {
    const move = ComputerPlayer.getSmartMove(this.grid, "X");
    this.grid[move.row][move.col] = "X";
    Screen.setGrid(move.row, move.col, "X");
    Screen.render();

    const winner = TTT.checkWin(this.grid);
    if (winner) {
      TTT.endGame(winner);
    } else {
      this.playerTurn = "O";
      Screen.setMessage("It's your turn (O)");
      Screen.render();
    }
  }

  static checkWin(grid) {
    // Check rows, columns, and diagonals
    for (let i = 0; i < 3; i++) {
      if (
        grid[i][0] !== " " &&
        grid[i][0] === grid[i][1] &&
        grid[i][1] === grid[i][2]
      )
        return grid[i][0];
      if (
        grid[0][i] !== " " &&
        grid[0][i] === grid[1][i] &&
        grid[1][i] === grid[2][i]
      )
        return grid[0][i];
    }
    if (
      grid[0][0] !== " " &&
      grid[0][0] === grid[1][1] &&
      grid[1][1] === grid[2][2]
    )
      return grid[0][0];
    if (
      grid[0][2] !== " " &&
      grid[0][2] === grid[1][1] &&
      grid[1][1] === grid[2][0]
    )
      return grid[0][2];

    // Check for tie
    if (grid.every((row) => row.every((cell) => cell !== " "))) return "T";

    return false;
  }

  static endGame(winner) {
    if (winner === "O" || winner === "X") {
      Screen.setMessage(`Player ${winner} wins!`);
    } else if (winner === "T") {
      Screen.setMessage(`Tie game!`);
    } else {
      Screen.setMessage(`Game Over`);
    }
    Screen.render();
    Screen.quit();
  }
}

module.exports = TTT;
