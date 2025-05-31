import React, { useState, useRef, useEffect } from 'react';
import GameBoard from './components/GameBoard';
import './App.css';

export default function App() {
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [key, setKey] = useState(0);
  const [soundOn, setSoundOn] = useState(true); // 기본값을 true로 변경

  const audioRef = useRef(new Audio('/sounds/default.mp3'));

  // 반복 설정은 한 번만
  useEffect(() => {
    audioRef.current.loop = true;
  }, []);

  // 컴포넌트 마운트 시 자동 재생
  useEffect(() => {
    const playAudio = async () => {
      try {
        await audioRef.current.play();
      } catch (err) {
        console.warn("자동 재생이 차단되었을 수 있습니다:", err);
      }
    };

    if (soundOn) playAudio();
  }, []);

  const handleReset = () => {
    setScore(0);
    setGameOver(false);
    setKey(prev => prev + 1);
  };

  const toggleSound = () => {
    if (soundOn) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    } else {
      audioRef.current.play();
    }
    setSoundOn(!soundOn);
  };

  return (
    <div className="app">
      <h1 className="title">IRYS 2048</h1>

      <div className="controls">
        <div className="score">Score: <span>{score}</span></div>
        <button className="reset-btn" onClick={handleReset}>🔄 Reset</button>
        <button className="reset-btn" onClick={toggleSound}>
          {soundOn ? '🔇 Mute' : '🔊 Sound'}
        </button>
      </div>

      <div className="game-container">
        <GameBoard
          key={key}
          setScore={setScore}
          setGameOver={setGameOver}
        />
        {gameOver && <div className="game-over">💀 Game Over!</div>}
      </div>
    </div>
  );
}
