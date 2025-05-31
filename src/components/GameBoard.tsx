import React, { useEffect, useState } from 'react';
import { initBoard, moveBoard, isGameOver } from '../utils/gameLogic';
import { getTileImage } from '../utils/imageMap';
import './GameBoard.css';

const size = 4;

interface GameBoardProps {
  setScore: React.Dispatch<React.SetStateAction<number>>;
  setGameOver: React.Dispatch<React.SetStateAction<boolean>>;
}

const GameBoard: React.FC<GameBoardProps> = ({ setScore, setGameOver }) => {
  const [board, setBoard] = useState<number[][]>(initBoard(size));

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const directions = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
      if (directions.includes(e.key)) {
        const { newBoard, score, changed } = moveBoard(board, e.key);
        if (changed) {
          setScore(s => s + score);
          setBoard(newBoard);
          if (isGameOver(newBoard)) setGameOver(true);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [board, setScore, setGameOver]);

  return (
    <div className="board">
      {board.flatMap((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <div key={`${rowIndex}-${colIndex}`} className={`tile ${cell ? `tile-${cell}` : ''}`}>
            {cell !== 0 && (
              <img
                src={getTileImage(cell)}
                alt={cell.toString()}
                className="tile-image"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const sibling = e.currentTarget.nextElementSibling as HTMLElement | null;
                  if (sibling) sibling.hidden = false;
                }}
              />
            )}
            <span hidden={cell !== 0}>{cell !== 0 ? cell : ''}</span>
          </div>
        ))
      )}
    </div>
  );
};

export default GameBoard;