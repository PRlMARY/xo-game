import { Board, Player } from '../types/game';
import { checkWinner, getEmptyCells, applyMove } from './gameLogic';
export class BotAI {
    private rows: number;
    private columns: number;

    constructor(rows: number, columns: number) {
        this.rows = rows;
        this.columns = columns;
    }

    getBestMove(board: Board): [number, number] | null {
        const emptyCells = getEmptyCells(board);
        
        if (emptyCells.length === 0) return null;
        const winningMove = this.findWinningMove(board, emptyCells, 'O');
        if (winningMove) return winningMove;

        const blockingMove = this.findWinningMove(board, emptyCells, 'X');
        if (blockingMove) return blockingMove;

        const strategicMove = this.findStrategicMove(board, emptyCells);
        if (strategicMove) return strategicMove;

        const randomIndex = Math.floor(Math.random() * emptyCells.length);
        return emptyCells[randomIndex];
    }

    private findWinningMove(board: Board, emptyCells: [number, number][], player: Player): [number, number] | null {
        for (const [row, col] of emptyCells) {
            const testBoard = applyMove(board, row, col, player);
            if (checkWinner(testBoard, row, col, player)) {
                return [row, col];
            }
        }
        return null;
    }

    private findStrategicMove(board: Board, emptyCells: [number, number][]): [number, number] | null {
        const strategicMoves: { move: [number, number], score: number }[] = [];
        
        for (const [row, col] of emptyCells) {
            const score = this.evaluatePosition(board, row, col);
            strategicMoves.push({ move: [row, col], score });
        }

        if (strategicMoves.length === 0) return null;

        strategicMoves.sort((a, b) => b.score - a.score);
        const bestMoves = strategicMoves.filter(move => move.score === strategicMoves[0].score);
        const randomIndex = Math.floor(Math.random() * bestMoves.length);
        
        return bestMoves[randomIndex].move;
    }

    private evaluatePosition(board: Board, row: number, col: number): number {
        let score = 0;
        const testBoard = applyMove(board, row, col, 'O');

        const directions = [
            [0, 1], [1, 0], [1, 1], [1, -1]
        ];

        for (const [dx, dy] of directions) {
            let count = 1;
            
            for (let i = 1; i < 3; i++) {
                const newRow = row + dx * i;
                const newCol = col + dy * i;
                if (this.isValidPosition(newRow, newCol)) {
                    if (testBoard[newRow][newCol] === 'O') count++;
                    else break;
                } else break;
            }
            
            for (let i = 1; i < 3; i++) {
                const newRow = row - dx * i;
                const newCol = col - dy * i;
                if (this.isValidPosition(newRow, newCol)) {
                    if (testBoard[newRow][newCol] === 'O') count++;
                    else break;
                } else break;
            }
            
            score += count * count;
        }

        const centerRow = Math.floor(this.rows / 2);
        const centerCol = Math.floor(this.columns / 2);
        const distanceFromCenter = Math.abs(row - centerRow) + Math.abs(col - centerCol);
        score += Math.max(0, 5 - distanceFromCenter);

        return score;
    }

    private isValidPosition(row: number, col: number): boolean {
        return row >= 0 && row < this.rows && col >= 0 && col < this.columns;
    }
}
