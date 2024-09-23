const Screen = require("./screen");

class Cursor {
  constructor(numRows, numCols) {
    this.numRows = numRows;
    this.numCols = numCols;

    this.row = 0;
    this.col = 0;

    this.gridColor = "black";
    this.cursorColor = "yellow";
  }

  resetBackgroundColor() {
    Screen.setBackgroundColor(this.row, this.col, this.gridColor);
  }

  setBackgroundColor() {
    Screen.setBackgroundColor(this.row, this.col, this.cursorColor);
  }

  up() {
    this.resetBackgroundColor();
    this.row = Math.max(0, this.row - 1);
    this.setBackgroundColor();
  }

  down() {
    this.resetBackgroundColor();
    this.row = Math.min(this.numRows - 1, this.row + 1);
    this.setBackgroundColor();
  }

  left() {
    this.resetBackgroundColor();
    this.col = Math.max(0, this.col - 1);
    this.setBackgroundColor();
  }

  right() {
    this.resetBackgroundColor();
    this.col = Math.min(this.numCols - 1, this.col + 1);
    this.setBackgroundColor();
  }
}

module.exports = Cursor;
