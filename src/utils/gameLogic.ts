// utils/gameLogic.ts

export const initBoard = (size: number): number[][] => {
    const board: number[][] = Array.from({ length: size }, () => Array(size).fill(0));
    addRandomTile(board);
    addRandomTile(board);
    return board;
  };
  
  export const addRandomTile = (board: number[][]): void => {
    const empty: [number, number][] = [];
    for (let r = 0; r < board.length; r++) {
      for (let c = 0; c < board[r].length; c++) {
        if (board[r][c] === 0) empty.push([r, c]);
      }
    }
    if (empty.length > 0) {
      const [r, c] = empty[Math.floor(Math.random() * empty.length)];
      board[r][c] = Math.random() < 0.9 ? 2 : 4;
    }
  };
  
  const rotateClockwise = (matrix: number[][]): number[][] =>
    matrix[0].map((_, i) => matrix.map(row => row[i]).reverse());
  
  const rotateCounterClockwise = (matrix: number[][]): number[][] =>
    rotateClockwise(rotateClockwise(rotateClockwise(matrix)));
  
  const flipHorizontally = (matrix: number[][]): number[][] =>
    matrix.map(row => [...row].reverse());
  
  const slideAndMergeRow = (row: number[]): { newRow: number[]; score: number } => {
    const filtered = row.filter(v => v !== 0);
    const result: number[] = [];
    let score = 0;
  
    for (let i = 0; i < filtered.length; i++) {
      if (i < filtered.length - 1 && filtered[i] === filtered[i + 1]) {
        result.push(filtered[i] * 2);
        score += filtered[i] * 2;
        i++; // skip next
      } else {
        result.push(filtered[i]);
      }
    }
  
    while (result.length < row.length) {
      result.push(0);
    }
  
    return { newRow: result, score };
  };
  
  export const moveBoard = (
    board: number[][],
    direction: string
  ): { newBoard: number[][]; score: number; changed: boolean } => {
    //const size = board.length;
    let newBoard = board.map(row => [...row]);
    let score = 0;
  
    //const original = JSON.stringify(newBoard); // for change detection
  
    if (direction === 'ArrowUp') {
        newBoard = rotateCounterClockwise(newBoard); // 위는 반시계 방향
    } else if (direction === 'ArrowDown') {
        newBoard = rotateClockwise(newBoard); // 아래는 시계 방향
    } else if (direction === 'ArrowRight') {
      newBoard = flipHorizontally(newBoard);
    }
  
    newBoard = newBoard.map(row => {
      const { newRow, score: rowScore } = slideAndMergeRow(row);
      score += rowScore;
      return newRow;
    });
  
    if (direction === 'ArrowUp') {
        newBoard = rotateClockwise(newBoard);
    } else if (direction === 'ArrowDown') {
        newBoard = rotateCounterClockwise(newBoard);
    } else if (direction === 'ArrowRight') {
      newBoard = flipHorizontally(newBoard);
    }
  
    const changed = JSON.stringify(board) !== JSON.stringify(newBoard);
    if (changed) addRandomTile(newBoard);
  
    return { newBoard, score, changed };
  };
  
  export const isGameOver = (board: number[][]): boolean => {
    for (let r = 0; r < board.length; r++) {
      for (let c = 0; c < board[r].length; c++) {
        if (board[r][c] === 0) return false;
        if (c < board[r].length - 1 && board[r][c] === board[r][c + 1]) return false;
        if (r < board.length - 1 && board[r][c] === board[r + 1][c]) return false;
      }
    }
    return true;
  };
  