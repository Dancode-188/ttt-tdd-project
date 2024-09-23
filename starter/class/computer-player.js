
class ComputerPlayer {
  static getValidMoves(grid) {
    const validMoves = [];
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        if (grid[row][col] === " ") {
          validMoves.push({ row, col });
        }
      }
    }
    return validMoves;
  }

  static randomMove(grid) {
    const validMoves = this.getValidMoves(grid);
    return validMoves[Math.floor(Math.random() * validMoves.length)];
  }

  static getSmartMove(grid, symbol) {
    // Check for winning move
    const winningMove = this.findWinningMove(grid, symbol);
    if (winningMove) return winningMove;

    // Check for blocking opponent's winning move
    const opponentSymbol = symbol === "X" ? "O" : "X";
    const blockingMove = this.findWinningMove(grid, opponentSymbol);
    if (blockingMove) return blockingMove;

    // Check for fork opportunity
    const forkMove = this.findForkMove(grid, symbol);
    if (forkMove) return forkMove;

    // Block opponent's fork
    const blockForkMove = this.findForkMove(grid, opponentSymbol);
    if (blockForkMove) return blockForkMove;

    // Play center
    if (grid[1][1] === " ") return { row: 1, col: 1 };

    // Play opposite corner
    const oppositeCornerMove = this.playOppositeCorner(grid, opponentSymbol);
    if (oppositeCornerMove) return oppositeCornerMove;

    // Play empty corner
    const cornerMove = this.playEmptyCorner(grid);
    if (cornerMove) return cornerMove;

    // Play empty side
    const sideMove = this.playEmptySide(grid);
    if (sideMove) return sideMove;

    // If no strategic move, make a random move (shouldn't happen with this strategy)
    return this.randomMove(grid);
  }

  static findWinningMove(grid, symbol) {
    const validMoves = this.getValidMoves(grid);
    for (const move of validMoves) {
      const newGrid = this.makeMove(grid, move, symbol);
      if (this.checkWin(newGrid) === symbol) {
        return move;
      }
    }
    return null;
  }

  static findForkMove(grid, symbol) {
    const validMoves = this.getValidMoves(grid);
    for (const move of validMoves) {
      const newGrid = this.makeMove(grid, move, symbol);
      const winningMoves = this.getValidMoves(newGrid).filter((nextMove) => {
        const nextGrid = this.makeMove(newGrid, nextMove, symbol);
        return this.checkWin(nextGrid) === symbol;
      });
      if (winningMoves.length >= 2) {
        return move;
      }
    }
    return null;
  }

  static playOppositeCorner(grid, opponentSymbol) {
    const corners = [
      { row: 0, col: 0 },
      { row: 0, col: 2 },
      { row: 2, col: 0 },
      { row: 2, col: 2 },
    ];
    for (const corner of corners) {
      if (grid[corner.row][corner.col] === opponentSymbol) {
        const oppositeCorner = {
          row: 2 - corner.row,
          col: 2 - corner.col,
        };
        if (grid[oppositeCorner.row][oppositeCorner.col] === " ") {
          return oppositeCorner;
        }
      }
    }
    return null;
  }

  static playEmptyCorner(grid) {
    const corners = [
      { row: 0, col: 0 },
      { row: 0, col: 2 },
      { row: 2, col: 0 },
      { row: 2, col: 2 },
    ];
    for (const corner of corners) {
      if (grid[corner.row][corner.col] === " ") {
        return corner;
      }
    }
    return null;
  }

  static playEmptySide(grid) {
    const sides = [
      { row: 0, col: 1 },
      { row: 1, col: 0 },
      { row: 1, col: 2 },
      { row: 2, col: 1 },
    ];
    for (const side of sides) {
      if (grid[side.row][side.col] === " ") {
        return side;
      }
    }
    return null;
  }

  static makeMove(grid, move, symbol) {
    const newGrid = grid.map((row) => [...row]);
    newGrid[move.row][move.col] = symbol;
    return newGrid;
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
    return null;
  }
}

module.exports = ComputerPlayer;