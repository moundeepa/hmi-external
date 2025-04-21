import { Component } from '@angular/core';
import sudoku from 'sudoku-umd';

type SudokuCell = number | null;
type SudokuBoard = SudokuCell[][];

@Component({
  selector: 'simple',
  template: `
    <div style="color: green;">
      <h2>Sudoku Game</h2>
      <table>
        <tr *ngFor="let row of board; let i = index">
          <td *ngFor="let cell of row; let j = index">
            <input 
              [value]="cell === null ? '' : cell" 
              [readonly]="initialBoard[i][j] !== null"
              maxlength="1"
              pattern="[1-9]"
              (input)="onInput(i, j, $event.target.value)"
              style="width: 30px; height: 30px; text-align: center;"
              type="text"
              autocomplete="off"
            />
          </td>
        </tr>
      </table>
      <button (click)="reset()">Reset</button>
      <button (click)="checkSolution()">Check Solution</button>
      <div *ngIf="message">{{ message }}</div>
    </div>
  `,
  styles: [
    `table { border-collapse: collapse; margin-top: 10px; }
     td { border: 1px solid #333; padding: 0; }
     input { font-size: 18px; }`
  ]
})
export class SimpleComponent {
  board: SudokuBoard;
  initialBoard: SudokuBoard;
  message: string = '';

  constructor() {
    this.board = [];
    this.initialBoard = [];
    this.generateNewPuzzle();
  }

  generateNewPuzzle(): void {
    const rawPuzzle: string = sudoku.generate('easy');
    this.board = [];
    this.initialBoard = [];

    for (let i = 0; i < 9; i++) {
      const boardRow: SudokuCell[] = [];
      const initialRow: SudokuCell[] = [];
      for (let j = 0; j < 9; j++) {
        const idx = i * 9 + j;
        const val: SudokuCell = rawPuzzle[idx] === '.' ? null : Number(rawPuzzle[idx]);
        boardRow.push(val);
        initialRow.push(val);
      }
      this.board.push(boardRow);
      this.initialBoard.push(initialRow);
    }
    this.message = '';
  }

  onInput(i: number, j: number, value: string): void {
    if (!/^[1-9]$/.test(value)) {
      this.board[i][j] = null;
    } else {
      this.board[i][j] = Number(value);
    }
  }

  reset(): void {
    // Deep copy to avoid mutation
    this.board = this.initialBoard.map(row => row.slice());
    this.message = '';
  }

  checkSolution(): void {
    const userSolution: string = this.board
      .flat()
      .map(cell => (cell === null ? '.' : cell.toString()))
      .join('');
    const solved: string | false = sudoku.solve(userSolution);

    if (solved && solved === userSolution) {
      this.message = 'Congratulations! Correct Solution!';
    } else {
      this.message = 'Incorrect solution. Please try again!';
    }
  }
}