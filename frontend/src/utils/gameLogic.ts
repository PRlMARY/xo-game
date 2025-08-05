import { Board, Player } from '../types/game';

export const checkWinner = (board: Board, row: number, col: number, player: Player): boolean => {
    const numRows = board.length;
    const numCols = board[0].length;

    let count = 1;
    for (let i = col - 1; i >= 0 && board[row][i] === player; i--) count++;
    for (let i = col + 1; i < numCols && board[row][i] === player; i++) count++;
    if (count >= 3) return true;

    count = 1;
    for (let i = row - 1; i >= 0 && board[i][col] === player; i--) count++;
    for (let i = row + 1; i < numRows && board[i][col] === player; i++) count++;
    if (count >= 3) return true;

    count = 1;
    for (let i = 1; row - i >= 0 && col - i >= 0 && board[row - i][col - i] === player; i++) count++;
    for (let i = 1; row + i < numRows && col + i < numCols && board[row + i][col + i] === player; i++) count++;
    if (count >= 3) return true;
    
    count = 1;
    for (let i = 1; row - i >= 0 && col + i < numCols && board[row - i][col + i] === player; i++) count++;
    for (let i = 1; row + i < numRows && col - i >= 0 && board[row + i][col - i] === player; i++) count++;
    if (count >= 3) return true;

    return false;
};

export const isBoardFull = (board: Board): boolean => {
    return board.every(row => row.every(cell => cell !== null));
};

export const createEmptyBoard = (rows: number, columns: number): Board => {
    return Array(rows).fill(null).map(() => Array(columns).fill(null));
};

export const getEmptyCells = (board: Board): [number, number][] => {
    const emptyCells: [number, number][] = [];
    const rows = board.length;
    const columns = board[0].length;
    
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < columns; col++) {
            if (board[row][col] === null) {
                emptyCells.push([row, col]);
            }
        }
    }
    return emptyCells;
};

export const applyMove = (board: Board, row: number, col: number, player: Player): Board => {
    const newBoard = board.map(r => [...r]);
    newBoard[row][col] = player;
    return newBoard;
};

export const getOpponentPlayer = (player: Player): Player => {
    return player === 'X' ? 'O' : 'X';
};
