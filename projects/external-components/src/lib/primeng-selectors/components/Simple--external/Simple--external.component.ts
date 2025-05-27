// SimpleComponent: Sudoku game UI with background color customization.
// Features:
// - No external libraries or APIs used
// - Inline HTML & CSS, Angular 18 compatible
// - Extends CommonExternalComponent
// - Strict typing for variables
// - Generates a fixed valid puzzle and checks solution

import { Component } from '@angular/core';
import { CommonExternalComponent } from '../common-external/common-external.component';

type SudokuCell = number | null;
type SudokuBoard = SudokuCell[][];

const FIXED_PUZZLE: SudokuBoard = [
  [5, 3, null, null, 7, null, null, null, null],
  [6, null, null, 1, 9, 5, null, null, null],
  [null, 9, 8, null, null, null, null, 6, null],
  [8, null, null, null, 6, null, null, null, 3],
  [4, null, null, 8, null, 3, null, null, 1],
  [7, null, null, null, 2, null, null, null, 6],
  [null, 6, null, null, null, null, 2, 8, null],
  [null, null, null, 4, 1, 9, null, null, 5],
  [null, null, null, null, 8, null, null, 7, 9]
];

const FIXED_SOLUTION: number[][] = [
  [5,3,4,6,7,8,9,1,2],
  [6,7,2,1,9,5,3,4,8],
  [1,9,8,3,4,2,5,6,7],
  [8,5,9,7,6,1,4,2,3],
  [4,2,6,8,5,3,7,9,1],
  [7,1,3,9,2,4,8,5,6],
  [9,6,1,5,3,7,2,8,4],
  [2,8,7,4,1,9,6,3,5],
  [3,4,5,2,8,6,1,7,9]
];

@Component({
  selector: 'simple',
  template: `
    <div style="color: green; background-color: #f0f4ff; padding: 20px;">
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
     input { font-size: 18px; }
     div { border-radius: 8px; }`
  ]
})
export class SimpleComponent extends CommonExternalComponent {
  board: SudokuBoard;
  initialBoard: SudokuBoard;
  message: string = '';

  constructor() {
    super();
    this.board = [];
    this.initialBoard = [];
    this.generateNewPuzzle();
  }

  generateNewPuzzle(): void {
    // Deep copy to avoid mutation
    this.board = FIXED_PUZZLE.map((row: SudokuCell[]) => row.slice());
    this.initialBoard = FIXED_PUZZLE.map((row: SudokuCell[]) => row.slice());
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
    this.board = this.initialBoard.map((row: SudokuCell[]) => row.slice());
    this.message = '';
  }

  checkSolution(): void {
    let correct: boolean = true;
    for (let i = 0; i < 9 && correct; i++) {
      for (let j = 0; j < 9 && correct; j++) {
        if ((this.board[i][j] ?? 0) !== FIXED_SOLUTION[i][j]) {
          correct = false;
        }
      }
    }
    if (correct) {
      this.message = 'Congratulations! Correct Solution!';
    } else {
      this.message = 'Incorrect solution. Please try again!';
    }
  }
}