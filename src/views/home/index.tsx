// Next, React
import { FC, useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';


// Wallet
import { useWallet, useConnection } from '@solana/wallet-adapter-react';

// Components
import { RequestAirdrop } from '../../components/RequestAirdrop';
import pkg from '../../../package.json';

// Store
import useUserSOLBalanceStore from '../../stores/useUserSOLBalanceStore';

export const HomeView: FC = ({ }) => {
  const wallet = useWallet();
  const { connection } = useConnection();

  const balance = useUserSOLBalanceStore((s) => s.balance)
  const { getUserSOLBalance } = useUserSOLBalanceStore()

  // Add loading state
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading and ensure component mounts properly
    const timer = setTimeout(() => setIsLoading(false), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (wallet.publicKey) {
      console.log(wallet.publicKey.toBase58())
      getUserSOLBalance(wallet.publicKey, connection)
    }
  }, [wallet.publicKey, connection, getUserSOLBalance])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center bg-gray-900 min-h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-xl">Loading Ping Pong Game...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full">
      {/* Header Section */}
      <div className="md:hero mx-auto p-4 flex-shrink-0">
        <div className="md:hero-content flex flex-col">
          <div className='mt-6'>
          <div className='text-lg font-normal align-bottom text-right text-slate-600 mt-4'>v{pkg.version}</div>
          <h1 className="text-center text-5xl md:pl-12 font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 to-fuchsia-500 mb-4">
            Solana Next
          </h1>
          </div>
          <h4 className="md:w-full text-2x1 md:text-4xl text-center text-slate-300 my-2">
            <p>Unleash the full power of blockchain with Solana and Next.js 13.</p>
            <p className='text-slate-500 text-2x1 leading-relaxed'>Full-stack Solana applications made easy.</p>
          </h4>
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-indigo-500 rounded-lg blur opacity-40 animate-tilt"></div>
            <div className="max-w-md mx-auto mockup-code bg-primary border-2 border-[#5252529f] p-6 px-10 my-2">
              <pre data-prefix=">">
                <code className="truncate">{`npx create-solana-dapp <dapp-name>`} </code>
              </pre>
            </div>
          </div>
          <div className="flex flex-col mt-2">
            <RequestAirdrop />
            <h4 className="md:w-full text-2xl text-slate-300 my-2">
            {wallet &&
            <div className="flex flex-row justify-center">
              <div>
                {(balance || 0).toLocaleString()}
                </div>
                <div className='text-slate-600 ml-2'>
                  SOL
                </div>
            </div>
            }
            </h4>
          </div>
        </div>
      </div>

      {/* Full-screen Game Section */}
      <div className="flex-1 flex items-center justify-center p-4">
        {typeof window !== 'undefined' && <GameSandbox />}
      </div>
    </div>
  );
};

const GameSandbox: FC = () => {
  const [ball, setBall] = useState({ x: 50, y: 50, vx: 0.8, vy: -0.8 });
  const [ballDisplay, setBallDisplay] = useState({ x: 50, y: 50 });
  const [playerPaddle, setPlayerPaddle] = useState({ x: 50, y: 85, targetX: 50, targetY: 85 });
  const [opponentPaddle, setOpponentPaddle] = useState({ x: 50, y: 15, targetX: 50 });
  const [playerScore, setPlayerScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [lives, setLives] = useState(2);
  const [level, setLevel] = useState(1);
  const [currency, setCurrency] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [paused, setPaused] = useState(false);
  const [muted, setMuted] = useState(false);
  const [ballSpeed, setBallSpeed] = useState(0.8);
  
  // Refs to store current values for game loop
  const playerPaddleRef = useRef({ x: 50, y: 85, targetX: 50, targetY: 85 });
  const opponentPaddleRef = useRef({ x: 50, y: 15, targetX: 50 });
  const ballRef = useRef({ x: 50, y: 50, vx: 0.8, vy: -0.8 });
  const ballSpeedRef = useRef(0.8);
  const livesRef = useRef(2);
  
  // Update refs when state changes
  useEffect(() => {
    playerPaddleRef.current = playerPaddle;
  }, [playerPaddle]);
  
  useEffect(() => {
    opponentPaddleRef.current = opponentPaddle;
  }, [opponentPaddle]);
  
  useEffect(() => {
    ballRef.current = ball;
  }, [ball]);
  
  useEffect(() => {
    ballSpeedRef.current = ballSpeed;
  }, [ballSpeed]);
  
  useEffect(() => {
    livesRef.current = lives;
  }, [lives]);



  // Smooth paddle movement
  useEffect(() => {
    if (!gameStarted || gameOver || paused) return;
    const paddleEase = setInterval(() => {
      setPlayerPaddle(prev => ({
        ...prev,
        x: prev.x + (prev.targetX - prev.x) * 0.2,
        y: prev.y + (prev.targetY - prev.y) * 0.2
      }));
    }, 16);
    return () => clearInterval(paddleEase);
  }, [gameStarted, gameOver, paused]);

  // Smooth ball display interpolation
  useEffect(() => {
    if (!gameStarted || gameOver || paused) return;
    const ballDisplayLoop = setInterval(() => {
      setBallDisplay(prev => ({
        x: prev.x + (ball.x - prev.x) * 0.5,
        y: prev.y + (ball.y - prev.y) * 0.5
      }));
    }, 16);
    return () => clearInterval(ballDisplayLoop);
  }, [gameStarted, gameOver, paused, ball]);

  // Handle paddle movement (X and Y)
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!gameStarted || gameOver || paused) return;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPlayerPaddle(prev => ({ 
      ...prev, 
      targetX: Math.max(5, Math.min(95, x)),
      targetY: Math.max(70, Math.min(90, y)) // Keep paddle in playable area
    }));
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!gameStarted || gameOver || paused) return;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const touch = e.touches[0];
    const x = ((touch.clientX - rect.left) / rect.width) * 100;
    const y = ((touch.clientY - rect.top) / rect.height) * 100;
    setPlayerPaddle(prev => ({ 
      ...prev, 
      targetX: Math.max(5, Math.min(95, x)),
      targetY: Math.max(70, Math.min(90, y)) // Keep paddle in playable area
    }));
  };

  // Smooth opponent paddle movement
  useEffect(() => {
    if (!gameStarted || gameOver || paused) return;
    const opponentLoop = setInterval(() => {
      const currentBall = ballRef.current;
      const targetX = currentBall.x;
      setOpponentPaddle(prevPaddle => ({
        ...prevPaddle,
        x: prevPaddle.x + (prevPaddle.targetX - prevPaddle.x) * 0.2,
        targetX: prevPaddle.targetX + (targetX - prevPaddle.targetX) * 0.1
      }));
    }, 16);
    return () => clearInterval(opponentLoop);
  }, [gameStarted, gameOver, paused]);

  // Ping Pong game loop - slower and smoother
  useEffect(() => {
    if (!gameStarted || gameOver || paused) return;

    const gameLoop = setInterval(() => {
      // Update ball position
      setBall(prevBall => {
        let newBall = { ...prevBall };
        newBall.x += newBall.vx * 0.5;
        newBall.y += newBall.vy * 0.5;
        ballRef.current = newBall; // Update ref

        // Wall collisions - bounce off table edges (table is 80% wide, centered)
        const tableLeftEdge = 10;  // (100 - 80) / 2
        const tableRightEdge = 90; // 100 - 10
        if (newBall.x <= tableLeftEdge || newBall.x >= tableRightEdge) {
          newBall.vx *= -1;
          newBall.x = Math.max(tableLeftEdge, Math.min(tableRightEdge, newBall.x));
        }

        // Get current values from refs
        const currentPlayerPaddle = playerPaddleRef.current;
        const currentOpponentPaddle = opponentPaddleRef.current;
        const currentBallSpeed = ballSpeedRef.current;
        const currentLives = livesRef.current;

        // Player paddle collision (account for Y movement)
        if (newBall.y >= currentPlayerPaddle.y - 3 && newBall.y <= currentPlayerPaddle.y + 3 &&
            newBall.x >= currentPlayerPaddle.x - 8 && newBall.x <= currentPlayerPaddle.x + 8) {
          const hitPos = (newBall.x - currentPlayerPaddle.x) / 8;
          newBall.vy = -Math.abs(newBall.vy);
          newBall.vx += hitPos * 0.6;
          newBall.y = currentPlayerPaddle.y - 3;
        }

        // Opponent paddle collision
        if (newBall.y <= 18 && newBall.y >= 12 &&
            newBall.x >= currentOpponentPaddle.x - 8 && newBall.x <= currentOpponentPaddle.x + 8) {
          const hitPos = (newBall.x - currentOpponentPaddle.x) / 8;
          newBall.vy = Math.abs(newBall.vy);
          newBall.vx += hitPos * 0.6;
          newBall.y = 18;
        }

        // Score points
        if (newBall.y < 5) {
          setPlayerScore(prev => prev + 1);
          setCurrency(prev => prev + 5);
          setBallDisplay({ x: 50, y: 50 });
          const resetBall = { x: 50, y: 50, vx: (Math.random() > 0.5 ? 1 : -1) * currentBallSpeed, vy: currentBallSpeed };
          ballRef.current = resetBall;
          return resetBall;
        }
        if (newBall.y > 95) {
          setOpponentScore(prev => prev + 1);
          if (currentLives > 0) {
            setLives(prev => prev - 1);
            setBallDisplay({ x: 50, y: 50 });
            const resetBall = { x: 50, y: 50, vx: (Math.random() > 0.5 ? 1 : -1) * currentBallSpeed, vy: -currentBallSpeed };
            ballRef.current = resetBall;
            return resetBall;
          } else {
            setGameOver(true);
            // Stop music when game ends
            setTimeout(() => {
              const iframe = document.getElementById('background-music') as HTMLIFrameElement;
              if (iframe && iframe.contentWindow) {
                iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
              }
            }, 100);
            return newBall;
          }
        }

        return newBall;
      });

      // Level progression
      setPlayerScore(currentPlayerScore => {
        setOpponentScore(currentOpponentScore => {
          const totalScore = currentPlayerScore + currentOpponentScore;
          if (totalScore > 0 && totalScore % 5 === 0) {
            setLevel(Math.floor(totalScore / 5) + 1);
            setBallSpeed(prev => Math.min(prev + 0.1, 1.5));
          }
          return currentOpponentScore;
        });
        return currentPlayerScore;
      });

    }, 25);

    return () => clearInterval(gameLoop);
  }, [gameStarted, gameOver, paused]);

  const startGame = () => {
    setBall({ x: 50, y: 50, vx: 0.8, vy: -0.8 });
    setBallDisplay({ x: 50, y: 50 });
    setPlayerPaddle({ x: 50, y: 85, targetX: 50, targetY: 85 });
    setOpponentPaddle({ x: 50, y: 15, targetX: 50 });
    setPlayerScore(0);
    setOpponentScore(0);
    setLives(2);
    setLevel(1);
    setCurrency(0);
    setGameStarted(true);
    setGameOver(false);
    setPaused(false);
    setBallSpeed(0.8);

    // Auto-start music when game begins
    setMuted(false);
    setTimeout(() => {
      const iframe = document.getElementById('background-music') as HTMLIFrameElement;
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
      }
    }, 100);
  };

  const restartGame = () => {
    startGame();
  };

  const togglePause = () => {
    if (gameStarted && !gameOver) {
      const newPausedState = !paused;
      setPaused(newPausedState);

      // Control music based on pause state
      setTimeout(() => {
        const iframe = document.getElementById('background-music') as HTMLIFrameElement;
        if (iframe && iframe.contentWindow) {
          const action = newPausedState
            ? '{"event":"command","func":"pauseVideo","args":""}'
            : '{"event":"command","func":"playVideo","args":""}';
          iframe.contentWindow.postMessage(action, '*');
        }
      }, 100);
    }
  };

  const toggleMute = () => {
    const iframe = document.getElementById('background-music') as HTMLIFrameElement;
    if (iframe && iframe.contentWindow) {
      // Send postMessage to YouTube iframe to play/pause
      const action = muted ? '{"event":"command","func":"playVideo","args":""}' : '{"event":"command","func":"pauseVideo","args":""}';
      iframe.contentWindow.postMessage(action, '*');
    }
    setMuted(!muted);
  };

  return (
    <div className="w-full h-[700px] min-h-[700px] max-w-screen-xl mb-52 rounded-xl overflow-hidden relative shadow-2xl" style={{ backgroundImage: `url('https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/db152321-d045-41b8-a835-86af80fecc29-umbraprivacy-com/assets/images/691b860b87da59a50eecbc1f_bg-2.avif')`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
      {/* Hidden YouTube player for background music (audio only) - only render on client side */}
      {typeof window !== 'undefined' && (
        <iframe
          id="background-music"
          width="1"
          height="1"
          src="https://www.youtube.com/embed/57C13H0BnnU?autoplay=0&controls=0&disablekb=1&fs=0&iv_load_policy=3&loop=1&playlist=57C13H0BnnU&modestbranding=1&playsinline=1&rel=0&showinfo=0&enablejsapi=1"
          frameBorder="0"
          allow="autoplay; encrypted-media"
          style={{ position: 'absolute', top: '-9999px', left: '-9999px', opacity: 0, pointerEvents: 'none' }}
        ></iframe>
      )}

      {/* UI Elements - Top Center: Lives (Stars) */}
      {/* <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-20 flex gap-3">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="text-3xl"
            style={{ 
              filter: i < lives ? 'drop-shadow(2px 2px 4px rgba(0,0,0,0.6))' : 'opacity: 0.3',
              color: i < lives ? '#fbbf24' : '#6b7280',
            }}
          >
            ⭐
          </div>
        ))}
      </div> */}

      {/* UI Elements - Top Right: Pause & Sound */}
      <div className="absolute top-6 right-6 z-20 flex gap-3">
        <button
          onClick={togglePause}
          className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-2xl shadow-xl hover:bg-gray-900 active:scale-95 transition-all duration-200"
          style={{ filter: 'drop-shadow(2px 2px 6px rgba(0,0,0,0.3))' }}
        >
          {paused ? '▶️' : '⏸️'}
        </button>
        <button
          onClick={toggleMute}
          className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-2xl shadow-xl hover:bg-gray-900 active:scale-95 transition-all duration-200"
          style={{ filter: 'drop-shadow(2px 2px 6px rgba(0,0,0,0.3))' }}
        >
          {muted ? '🔇' : '🔊'}
        </button>
      </div>

      {/* UI Elements - Bottom Left: Level (Trophy) */}
      <div className="absolute bottom-6 left-6 z-20 flex items-center gap-3 text-white text-2xl font-bold" style={{ filter: 'drop-shadow(3px 3px 6px rgba(0,0,0,0.7))' }}>
        <span className="text-3xl">🏆</span>
        <span>{String(level).padStart(2, '0')}</span>
      </div>

      {/* UI Elements - Bottom Right: Currency (Diamond) */}
      <div className="absolute bottom-6 right-6 z-20 flex items-center gap-3 text-white text-2xl font-bold" style={{ filter: 'drop-shadow(3px 3px 6px rgba(0,0,0,0.7))' }}>
        <span className="text-3xl">💎</span>
        <span>{String(currency).padStart(2, '0')}</span>
      </div>

      {/* Start Screen */}
      {!gameStarted && !gameOver && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 z-30 rounded-xl backdrop-blur-sm">
          <div className="text-center space-y-6 p-8">
            <h1 className="text-6xl font-serif text-white drop-shadow-lg">
              🏓 Ping Pong Go! 🏓
            </h1>
            <div className="text-white text-xl space-y-3 bg-black rounded-sm p-6">
              <p className="font-semibold text-yellow-300 text-2xl">🎯 How to Play:</p>
              <p>• Move your mouse/touch to control the orange paddle</p>
              <p>• Hit the ball back to your opponent</p>
              <p>• Score by getting the ball past the opponent</p>
              <p>• You have 3 lives - don&apos;t let the ball pass you!</p>
            </div>
            <button
              onClick={startGame}
              className="bg-gradient-to-b from-blue-200 to-blue-500 text-white font-bold py-4 px-12 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-sm text-2xl"
            >
              🚀 Start Game
            </button>
          </div>
        </div>
      )}

      {/* Game Over Screen */}
      {gameOver && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 z-30 rounded-xl backdrop-blur-sm">
          <div className="text-center space-y-6 p-8">
            <h2 className="text-5xl font-bold text-red-100 drop-shadow-lg">💥 Game Over! 💥</h2>
            <div className="text-white space-y-3 bg-black rounded-md p-6">
              <p className="text-3xl font-bold text-yellow-400">Final Score: {playerScore} - {opponentScore}</p>
              <p className="text-xl">Level Reached: {level}</p>
              <p className="text-xl">Currency Earned: {currency} 💎</p>
            </div>
            <button
              onClick={restartGame}
              className="bg-gradient-to-b from-green-200 to-green-500 text-white font-bold py-4 px-12 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-sm text-2xl"
            >
              🔄 Play Again
            </button>
          </div>
        </div>
      )}

      {/* Pause Screen */}
      {paused && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-30">
          <div className="text-center space-y-4 p-12 bg-black backdrop-blur-sm rounded-md">
            <h3 className="text-4xl font-serif text-white">⏸️ Paused</h3>
            <button
              onClick={togglePause}
              className="bg-gradient-to-b from-blue-200 to-blue-500 text-white font-bold py-3 px-8 rounded-xl transition-colors text-xl"
            >
              ▶️ Resume
            </button>
          </div>
        </div>
      )}

      {/* Game Area */}
      <div
        className="w-full h-full relative"
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        onTouchStart={handleTouchMove}
      >
        {/* Ping Pong Table - Turquoise with isometric perspective */}
        <div
          className="absolute top-1/2 left-1/2 rounded-xl shadow-2xl z-10"
          style={{
            width: '80%',
            height: '75%',
            background: 'linear-gradient(135deg, #4dd0e1 0%, #26c6da 50%, #00bcd4 100%)',
            border: '4px solid #37474f',
            transform: 'translateX(-50%) translateY(-50%) perspective(1000px) rotateX(5deg)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3), inset 0 2px 4px rgba(255,255,255,0.2)',
          }}
        >
          {/* Table surface lines */}
          <div className="absolute top-1/2 left-0 w-full h-1 bg-white opacity-80"></div>
          <div className="absolute top-1/4 left-1/2 w-1 h-1/2 bg-white opacity-80"></div>
          <div className="absolute bottom-1/4 left-1/2 w-1 h-1/2 bg-white opacity-80"></div>
          
          {/* Net */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-full bg-gray-700 border-l-2 border-r-2 border-gray-900 z-20 rounded-sm"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-1.5 bg-gray-900 z-20 rounded-full"></div>
        </div>

        {/* Player Paddle (Orange) - Table Tennis Racket */}
        {gameStarted && !gameOver && (
          <div
            className="absolute z-30"
            style={{
              left: `${playerPaddle.x}%`,
              top: `${playerPaddle.y}%`,
              transform: 'translateX(-50%) translateY(-50%)',
              transition: 'left 0.1s ease-out, top 0.1s ease-out',
            }}
          >
            {/* Racket Head - Circular paddle */}
            <div 
              className="relative"
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 50%, #ff8c42 100%)',
                border: '3px solid #d84315',
                boxShadow: '0 4px 8px rgba(0,0,0,0.4), inset 0 2px 4px rgba(255,255,255,0.2)',
                filter: 'drop-shadow(3px 3px 6px rgba(0,0,0,0.5))',
              }}
            >
              {/* Rubber surface texture */}
              <div 
                className="absolute inset-1 rounded-full"
                style={{
                  background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3), rgba(0,0,0,0.1))',
                  border: '1px solid rgba(0,0,0,0.2)',
                }}
              />
            </div>
            {/* Handle/Grip */}
            <div 
              className="mx-auto -mt-1"
              style={{
                width: '12px',
                height: '32px',
                background: 'linear-gradient(to bottom, #8d6e63 0%, #5d4037 100%)',
                borderRadius: '6px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,255,255,0.1)',
              }}
            />
          </div>
        )}

        {/* Opponent Paddle (Blue) - Table Tennis Racket */}
        {gameStarted && !gameOver && (
          <div
            className="absolute z-30"
            style={{
              left: `${opponentPaddle.x}%`,
              top: `${opponentPaddle.y}%`,
              transform: 'translateX(-50%) translateY(-50%)',
              transition: 'left 0.1s ease-out, top 0.1s ease-out',
            }}
          >
            {/* Racket Head - Circular paddle */}
            <div 
              className="relative"
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #42a5f5 0%, #1e88e5 50%, #1565c0 100%)',
                border: '3px solid #0d47a1',
                boxShadow: '0 4px 8px rgba(0,0,0,0.4), inset 0 2px 4px rgba(255,255,255,0.2)',
                filter: 'drop-shadow(3px 3px 6px rgba(0,0,0,0.5))',
              }}
            >
              {/* Rubber surface texture */}
              <div 
                className="absolute inset-1 rounded-full"
                style={{
                  background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3), rgba(0,0,0,0.1))',
                  border: '1px solid rgba(0,0,0,0.2)',
                }}
              />
            </div>
            {/* Handle/Grip */}
            <div 
              className="mx-auto -mt-1"
              style={{
                width: '12px',
                height: '32px',
                background: 'linear-gradient(to bottom, #8d6e63 0%, #5d4037 100%)',
                borderRadius: '6px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,255,255,0.1)',
              }}
            />
          </div>
        )}

        {/* Ball with smooth animation */}
        {gameStarted && !gameOver && (
          <div
            className="absolute z-30"
            style={{
              left: `${ballDisplay.x}%`,
              top: `${ballDisplay.y}%`,
              transform: 'translateX(-50%) translateY(-50%)',
              transition: 'left 0.08s linear, top 0.08s linear',
              pointerEvents: 'none',
            }}
          >
            <div className="w-10 h-10 bg-yellow-400 rounded-full border-2 border-yellow-600 shadow-2xl" style={{ 
              filter: 'drop-shadow(4px 4px 8px rgba(0,0,0,0.5))',
              boxShadow: '0 0 10px rgba(255, 193, 7, 0.5)',
              borderWidth: '3px',
            }}></div>
          </div>
        )}

        {/* Score Display - Centered above table */}
        {gameStarted && !gameOver && (
          <div className="absolute top-[35%] left-1/2 transform -translate-x-1/2 z-25 flex items-center gap-8">
            <div className="text-7xl font-bold text-white" style={{
              filter: 'drop-shadow(4px 4px 8px rgba(0,0,0,0.8))',
              textShadow: '0 0 10px rgba(255,255,255,0.3)',
            }}>
              {playerScore}
            </div>
            <div className="text-6xl text-white opacity-80" style={{ filter: 'drop-shadow(3px 3px 6px rgba(0,0,0,0.8))' }}>
              -
            </div>
            <div className="text-7xl font-bold text-white" style={{
              filter: 'drop-shadow(4px 4px 8px rgba(0,0,0,0.8))',
              textShadow: '0 0 10px rgba(255,255,255,0.3)',
            }}>
              {opponentScore}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
