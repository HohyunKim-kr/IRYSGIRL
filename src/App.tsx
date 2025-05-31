import { useState, useRef, useEffect } from 'react';
import GameBoard from './components/GameBoard';
import './App.css';

export default function App() {
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [key, setKey] = useState(0);
  const [soundOn, setSoundOn] = useState(true);

  const audioRef = useRef(new Audio('/sounds/default.mp3'));

  useEffect(() => {
    audioRef.current.loop = true;

    // 페이지 로드 시 사운드 재생 시도
    if (soundOn) {
      audioRef.current.play().catch((err) => {
        console.warn('자동 재생 차단됨:', err);
        // 브라우저가 재생 차단 시 사용자 상호작용 대기
        const handleFirstInteraction = () => {
          if (soundOn) {
            audioRef.current.play().catch((err) => {
              console.warn('재생 오류:', err);
            });
          }
          window.removeEventListener('click', handleFirstInteraction);
          window.removeEventListener('keydown', handleFirstInteraction);
        };

        // 클릭 또는 키보드 입력 감지
        window.addEventListener('click', handleFirstInteraction);
        window.addEventListener('keydown', handleFirstInteraction);

        return () => {
          window.removeEventListener('click', handleFirstInteraction);
          window.removeEventListener('keydown', handleFirstInteraction);
        };
      });
    }

    // 컴포넌트 언마운트 시 오디오 정리
    return () => {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    };
  }, [soundOn]);

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
      audioRef.current.play().catch((err) => {
        console.warn('재생 오류:', err);
      });
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