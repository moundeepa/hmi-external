// SimpleComponent: Sudoku game UI with background color customization.
// Features:
// - Inline HTML & CSS, Angular 18 compatible
// - Extends CommonExternalComponent
// - Strict typing for variables
// - Uses sudoku-gen for puzzle logic (no 'sudoku-umd' dependency)

import { Component } from '@angular/core';
import { CommonExternalComponent } from '../common-external/common-external.component';
import * as sudokuGen from 'sudoku-gen';

type SudokuCell = number | null;
type SudokuBoard = SudokuCell[][];

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
  private solution: number[][] = [];

  constructor() {
    super();
    this.board = [];
    this.initialBoard = [];
    this.generateNewPuzzle();
  }

  generateNewPuzzle(): void {
    const { puzzle, solution } = sudokuGen.generate('easy');
    this.solution = solution;
    this.board = [];
    this.initialBoard = [];

    for (let i = 0; i < 9; i++) {
      const boardRow: SudokuCell[] = [];
      const initialRow: SudokuCell[] = [];
      for (let j = 0; j < 9; j++) {
        const val: SudokuCell = puzzle[i][j] === 0 ? null : puzzle[i][j];
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
    this.board = this.initialBoard.map((row: SudokuCell[]) => row.slice());
    this.message = '';
  }

  checkSolution(): void {
    let correct: boolean = true;
    for (let i = 0; i < 9 && correct; i++) {
      for (let j = 0; j < 9 && correct; j++) {
        if ((this.board[i][j] ?? 0) !== this.solution[i][j]) {
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