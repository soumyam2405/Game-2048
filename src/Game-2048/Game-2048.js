import React, { useState, useEffect, useCallback } from 'react';
import './Game-2048.css'

const Tile = ({ value }) => {
    return (
      <div className={`tile tile-${value}`}>
        {value !== 0 && value}
      </div>
    );
};

const Board = ({ board }) => {
  return (
    <div className="board">
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className="row">
          {row.map((value, colIndex) => (
            <Tile key={`${rowIndex}-${colIndex}`} value={value} />
          ))}
        </div>
      ))}
    </div>
  );
};

const Game2048 = () => {
    const [board, setBoard] = useState(Array.from({ length: 4 }, () => Array.from({ length: 4 }, () => 0)));
    // const [board, setBoard] = useState([[0,0,0,2],[0,0,0,4],[0,0,0,2],[0,0,0,4]]);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);

    const getRandomEmptyCell = useCallback(() => {
        const emptyCells = [];
        board.forEach((r, rowIndex) => { // Rename the parameter from 'row' to 'r'
            r.forEach((cell, colIndex) => {
                if (cell === 0) {
                    emptyCells.push({ row: rowIndex, col: colIndex });
                }
            });
        });
        return emptyCells[Math.floor(Math.random() * emptyCells.length)];
    }, [board]);

    const moveTiles = useCallback((direction) => {
        let moved = false;
        let mergedTiles = {};
        const numRows = board.length;
        const numCols = board[0].length;
        let totalScore = 0;

        const move = (row, col, dRow, dCol) => {
            let movedCurrentTile = false;
            let currentRow = row;
            let currentCol = col;
            let nextRow = currentRow + dRow;
            let nextCol = currentCol + dCol;

            while (nextRow >= 0 && nextRow < numRows && nextCol >= 0 && nextCol < numCols) {
                if (board[nextRow][nextCol] === 0) {
                    board[nextRow][nextCol] = board[currentRow][currentCol];
                    board[currentRow][currentCol] = 0;
                    currentRow = nextRow;
                    currentCol = nextCol;
                    nextRow += dRow;
                    nextCol += dCol;
                    movedCurrentTile = true;
                    moved = true;
                } else if (board[nextRow][nextCol] === board[currentRow][currentCol] && !mergedTiles[`${nextRow}-${nextCol}`]) {
                    board[nextRow][nextCol] *= 2;
                    totalScore += board[nextRow][nextCol];
                    board[currentRow][currentCol] = 0;
                    moved = true;
                    mergedTiles[`${nextRow}-${nextCol}`] = true;
                    break;
                } else {
                    break;
                }
            }

            return movedCurrentTile;
        };

        switch (direction) {
            case 'up':
                for (let col = 0; col < numCols; col++) {
                    for (let row = 1; row < numRows; row++) {
                        moved = move(row, col, -1, 0) || moved;
                    }
                }
                break;
            case 'down':
                for (let col = 0; col < numCols; col++) {
                    for (let row = numRows - 2; row >= 0; row--) {
                        moved = move(row, col, 1, 0) || moved;
                    }
                }
                break;
            case 'left':
                for (let row = 0; row < numRows; row++) {
                    for (let col = 1; col < numCols; col++) {
                        moved = move(row, col, 0, -1) || moved;
                    }
                }
                break;
            case 'right':
                for (let row = 0; row < numRows; row++) {
                    for (let col = numCols - 2; col >= 0; col--) {
                        moved = move(row, col, 0, 1) || moved;
                    }
                }
                break;
            default:
                break;
        }

        if (moved) {
            setScore(prevScore => prevScore + totalScore);
        }

        return moved;
    }, [board, setScore]);

    const isGameOver = useCallback((currentBoard) => {
        const numRows = currentBoard.length;
        const numCols = currentBoard[0].length;
    
        // Check for any empty cells
        for (let row = 0; row < numRows; row++) {
            for (let col = 0; col < numCols; col++) {
                if (currentBoard[row][col] === 0) {
                    return false; // Game is not over if there are empty cells
                }
            }
        }

        // Check for adjacent cells with the same value
        for (let row = 0; row < numRows; row++) {
            for (let col = 0; col < numCols; col++) {
                const currentValue = currentBoard[row][col];
                // Check adjacent cells (up, down, left, right)
                if (
                    (row > 0 && currentBoard[row - 1][col] === currentValue) ||
                    (row < numRows - 1 && currentBoard[row + 1][col] === currentValue) ||
                    (col > 0 && currentBoard[row][col - 1] === currentValue) ||
                    (col < numCols - 1 && currentBoard[row][col + 1] === currentValue)
                ) {
                    return false; // Game is not over if there are adjacent cells with the same value
                }
            }
        }
    
        return true;
    }, []);
    
    const addRandomTile = useCallback(() => {
        const emptyCell = getRandomEmptyCell();
        if (emptyCell && !isGameOver(board)) {
            const { row, col } = emptyCell;
            const newValue = Math.random() < 0.9 ? 2 : 4;
            const newBoard = [...board];
            newBoard[row][col] = newValue;
            setBoard(newBoard);
        } else {
            setGameOver(true);
        }
    }, [board, getRandomEmptyCell, isGameOver]);

    
    const handleKeyDown = useCallback((event) => {
        const key = event.key;
        let moved = false;

        if (key === 'ArrowUp' || key === 'w') {
            moved = moveTiles('left');
        } else if (key === 'ArrowDown' || key === 's') {
            moved = moveTiles('right');
        } else if (key === 'ArrowLeft' || key === 'a') {
            moved = moveTiles('up');
        } else if (key === 'ArrowRight' || key === 'd') {
            moved = moveTiles('down');
        }
    
        if (moved) {
            addRandomTile();
        }
    }, [moveTiles, addRandomTile]);
    
    useEffect(() => {
        // Check for game over on every board update
        if (isGameOver(board)) {
            setGameOver(true);
        }
    }, [board, isGameOver]);
    
    useEffect(() => {
        addRandomTile();
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
        // eslint-disable-next-line
    }, []);

    return (
        <div className="game2048">
            <h1>2048 Game</h1>
            <div>Score: {score} | Highest: 3952 (Vanessa)</div>
            <button onClick={() => window.location.reload()}>Reset</button>
            {gameOver && <div>Game Over!</div>}
            <Board board={board} />
        </div>
    );
};

export default Game2048;
