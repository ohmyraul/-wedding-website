import React, { useState, useRef, useEffect } from 'react';
import { X, PawPrint } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CookieChaseGame = ({ isOpen: externalIsOpen, onClose }) => {
  const LANES = 4;
  const isOpen = externalIsOpen || false;
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    try {
      return parseInt(localStorage.getItem('cookieGameHighScore') || '0', 10);
    } catch {
      return 0;
    }
  });
  const [level, setLevel] = useState(1);
  const [speed, setSpeed] = useState(500);
  const [cookieLane, setCookieLane] = useState(1);
  const [cookiePosition, setCookiePosition] = useState(0); // Horizontal position: -1 (left), 0 (center), 1 (right)
  const [obstacles, setObstacles] = useState([]);
  const [showDialogue, setShowDialogue] = useState(null);
  const [groundOffset, setGroundOffset] = useState(0);
  const [isInvincible, setIsInvincible] = useState(false);
  const [invincibleUntil, setInvincibleUntil] = useState(0);
  const [buttonPressed, setButtonPressed] = useState(null);
  const gameIntervalRef = useRef(null);
  const groundIntervalRef = useRef(null);
  const obstacleIdRef = useRef(0);
  const cookieImageRef = useRef(null);
  const touchStartY = useRef(0);
  const touchEndY = useRef(0);

  // Level names
  const levelNames = {
    1: 'Beach Training',
    2: 'Market Madness',
    3: 'Wedding Day Chaos',
    4: 'Rehearsal Dinner Rush',
  };

  // Dialogue system
  const dialogues = {
    gameStart: [
      "Oh look, the humans are back. WHERE'S MY FOOD?",
      "Another guest? sigh Fine, let's do this.",
      "Susegaad? Not when I'm HUNGRY.",
      "I've been doing this for 12 years. You're new here.",
      "They see me rolling, they better be feeding.",
    ],
    collectingFood: [
      "FINALLY! Was that so hard?",
      "Now we're talking, human.",
      "This is why I tolerate you people.",
      "ONE fish? That's it? Cheap.",
      "About damn time.",
      "Nom nom... okay, MORE.",
    ],
    hittingKids: [
      "MOVE IT, tiny human!",
      "Kids these days have NO respect.",
      "Watch where you're going!",
      "This is MY beach!",
      "Seriously?? I'm WORKING here!",
    ],
    hittingScooters: [
      "DUDE. Where's my treat, not your scooter!",
      "That's not edible, genius.",
      "Wrong lane, buddy!",
      "Vroom vroom yourself outta here.",
      "Tourists. eye roll",
    ],
    losingLife: [
      "ARE YOU KIDDING ME RIGHT NOW?",
      "I'm too old for this nonsense.",
      "12 years of service and THIS is how you repay me?",
      "Unacceptable. Do better.",
      "You're lucky you're getting married.",
    ],
    gameOver: [
      "Well THAT was embarrassing for you.",
      "I've seen better from the cat. THE CAT.",
      "And they wonder why I bark at ceremonies...",
      "Maybe stick to planning weddings, yeah?",
      "I'm going back to my nap.",
    ],
    highScore: [
      "Not bad, human. Not bad.",
      "FINALLY someone who gets it.",
      "This calls for extra treats later.",
      "You may pet me. Once.",
      "Okay fine, you can stay.",
    ],
    midGame: [
      "Faster! The fish curry won't catch itself!",
      "Palolem Beach energy, let's GO!",
      "Channel your inner Goan!",
      "Susegaad is NOT an option right now!",
      "Focus! There's prawn balchão at stake!",
    ],
    weddingSpecific: [
      "Just practicing for the ceremony. I WILL bark.",
      "Hope the guests are ready for THIS energy.",
      "Bailey's better at this, don't tell Shubs.",
      "March 20th better have THIS much food.",
      "If there's no fish at the wedding, we're done.",
    ],
    easterEgg: [
      "Okay fine, I won't bark at the ceremony. JK I ABSOLUTELY WILL.",
    ],
  };

  // Better food items with points
  const foodItems = [
    { emoji: '🐟', name: 'Fish Curry', type: 'catch', points: 3, dialogue: "THE GOOD STUFF!" },
    { emoji: '🍤', name: 'Prawn Balchão', type: 'catch', points: 2, dialogue: "Spicy! I LIKE it!" },
    { emoji: '🐟', name: 'Kingfish', type: 'catch', points: 5, dialogue: "JACKPOT!" },
    { emoji: '🍰', name: 'Bebinca', type: 'catch', points: 1, dialogue: "Don't tell Alysha..." },
    { emoji: '🍷', name: 'Feni', type: 'powerup', points: 0, dialogue: "Woah, easy there!", effect: 'invincible' },
    { emoji: '🍗', name: 'Chicken Xacuti', type: 'catch', points: 2, dialogue: "About time!" },
    { emoji: '🥥', name: 'Coconut', type: 'catch', points: 1, dialogue: "Refreshing!" },
  ];

  // Better obstacles
  const obstacleItems = [
    { emoji: '👶', name: 'Goan Kid', type: 'avoid', dialogue: "MOVE IT, tiny human!" },
    { emoji: '🏍️', name: 'Scooter', type: 'avoid', dialogue: "Wrong lane, buddy!" },
    { emoji: '📸', name: 'Tourist with Selfie Stick', type: 'avoid', dialogue: "NOT NOW, KAREN!" },
    { emoji: '🛒', name: 'Beach Vendor', type: 'avoid', dialogue: "Selling what? Where's MY cut?" },
    { emoji: '🦀', name: 'Crab', type: 'avoid', dialogue: "Nope nope nope!" },
    { emoji: '🐕', name: 'Other Dog', type: 'avoid', dialogue: "This is MY territory!" },
  ];

  // Get random dialogue
  const getDialogue = (category) => {
    const arr = dialogues[category] || [];
    return arr[Math.floor(Math.random() * arr.length)];
  };

  // Haptic feedback
  const triggerHaptic = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
  };

  // Save high score
  const saveHighScore = (newScore) => {
    try {
      localStorage.setItem('cookieGameHighScore', newScore.toString());
      setHighScore(newScore);
    } catch (e) {
      console.error('Failed to save high score:', e);
    }
  };

  // Share score
  const shareScore = async () => {
    const text = `I scored ${score} points in Cookie's Goan Chase! 🐕 Can you beat my score?`;
    if (navigator.share) {
      try {
        await navigator.share({ text, url: window.location.href });
      } catch (e) {
        // User cancelled or error
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(text + ' ' + window.location.href);
        alert('Score copied to clipboard!');
      } catch (e) {
        console.error('Failed to share:', e);
      }
    }
  };

  // Reset game state when closed
  useEffect(() => {
    if (!isOpen) {
      setIsPlaying(false);
      setIsGameOver(false);
      setIsPaused(false);
      if (gameIntervalRef.current) {
        clearInterval(gameIntervalRef.current);
        gameIntervalRef.current = null;
      }
      if (groundIntervalRef.current) {
        clearInterval(groundIntervalRef.current);
        groundIntervalRef.current = null;
      }
    }
  }, [isOpen]);

  const moveCookie = (direction) => {
    if (!isPlaying || isGameOver || isPaused) return;
    triggerHaptic();
    
    if (direction === 'up' || direction === 'down') {
      // Vertical movement (lane change)
      setCookieLane(prev => {
        const newLane = direction === 'up' 
          ? Math.max(0, prev - 1)
          : Math.min(LANES - 1, prev + 1);
        return newLane;
      });
    } else if (direction === 'left' || direction === 'right') {
      // Horizontal movement
      setCookiePosition(prev => {
        const newPos = direction === 'left'
          ? Math.max(-1, prev - 1)
          : Math.min(1, prev + 1);
        return newPos;
      });
    }
  };

  const startGame = () => {
    if (gameIntervalRef.current) {
      clearInterval(gameIntervalRef.current);
      gameIntervalRef.current = null;
    }
    if (groundIntervalRef.current) {
      clearInterval(groundIntervalRef.current);
      groundIntervalRef.current = null;
    }
    setScore(0);
    setLevel(1);
    setSpeed(500);
    setCookieLane(1);
    setCookiePosition(0);
    setObstacles([]);
    setIsGameOver(false);
    setIsPlaying(true);
    setIsPaused(false);
    setShowDialogue(null);
    setGroundOffset(0);
    setIsInvincible(false);
    setInvincibleUntil(0);
    obstacleIdRef.current = 0;
    
    // Show start dialogue
    const startDialogue = getDialogue('gameStart');
    setShowDialogue(startDialogue);
    setTimeout(() => setShowDialogue(null), 2000);
  };

  // Ground animation
  useEffect(() => {
    if (!isPlaying || isGameOver || isPaused) {
      if (groundIntervalRef.current) {
        clearInterval(groundIntervalRef.current);
        groundIntervalRef.current = null;
      }
      return;
    }

    const groundSpeed = Math.max(2, 8 - level);
    groundIntervalRef.current = setInterval(() => {
      setGroundOffset(prev => (prev + groundSpeed) % 40);
    }, 16); // ~60fps

    return () => {
      if (groundIntervalRef.current) {
        clearInterval(groundIntervalRef.current);
        groundIntervalRef.current = null;
      }
    };
  }, [isPlaying, isGameOver, isPaused, level]);

  // Invincibility timer
  useEffect(() => {
    if (isInvincible && invincibleUntil > Date.now()) {
      const timer = setTimeout(() => {
        if (Date.now() >= invincibleUntil) {
          setIsInvincible(false);
        }
      }, invincibleUntil - Date.now());
      return () => clearTimeout(timer);
    }
  }, [isInvincible, invincibleUntil]);

  // Game loop
  useEffect(() => {
    if (!isPlaying || isGameOver || isPaused) {
      if (gameIntervalRef.current) {
        clearInterval(gameIntervalRef.current);
        gameIntervalRef.current = null;
      }
      return;
    }

    if (gameIntervalRef.current) {
      clearInterval(gameIntervalRef.current);
    }

    gameIntervalRef.current = setInterval(() => {
      setObstacles(prev => {
        const moveSpeed = Math.max(0.5, 2 - (level * 0.1));
        const moved = prev.map(obs => ({
          ...obs,
          position: obs.position - moveSpeed
        }));

        const toRemove = new Set();
        const processed = new Set(); // Track processed obstacles to prevent double-triggering
        let shouldEndGame = false;
        moved.forEach(obs => {
          // Only process if in collision range, same lane, same horizontal position, and not already processed
          const baseLeft = obs.position * 10;
          const obsHorizontalOffset = (obs.horizontalPos || 0) * 30;
          const obsFinalLeft = baseLeft + obsHorizontalOffset;
          const cookieLeft = 50 + cookiePosition * 30;
          const horizontalCollision = Math.abs(obsFinalLeft - cookieLeft) < 15; // 15% tolerance for collision
          if (obs.lane === cookieLane && obs.position <= 1.5 && obs.position >= -0.5 && horizontalCollision && !processed.has(obs.id)) {
            processed.add(obs.id); // Mark as processed
            if (obs.type === 'avoid' && !isInvincible) {
              // Mark obstacle for removal and flag game over
              toRemove.add(obs.id);
              shouldEndGame = true;
              const finalScore = score;
              if (finalScore > highScore) {
                saveHighScore(finalScore);
              }
              const gameOverDialogue = getDialogue('gameOver');
              setShowDialogue(gameOverDialogue);
            } else if (obs.type === 'catch' || obs.type === 'powerup') {
              toRemove.add(obs.id);
              const points = obs.points || 1;
              setScore(s => {
                const newScore = s + points;
                
                // Easter egg at 100 points
                if (newScore === 100) {
                  const easterEgg = getDialogue('easterEgg');
                  setShowDialogue(easterEgg);
                  setTimeout(() => setShowDialogue(null), 3000);
                }
                
                setLevel(prevLevel => {
                  const newLevel = Math.floor(newScore / 10) + 1;
                  if (newLevel > prevLevel) {
                    setSpeed(prevSpeed => Math.max(200, prevSpeed - 30));
                    const levelUpDialogue = `Level ${newLevel}: ${levelNames[newLevel] || 'Goan Master'}`;
                    setShowDialogue(levelUpDialogue);
                    setTimeout(() => setShowDialogue(null), 2000);
                    return newLevel;
                  }
                  return prevLevel;
                });
                return newScore;
              });
              
              // Handle power-ups
              if (obs.effect === 'invincible') {
                setIsInvincible(true);
                setInvincibleUntil(Date.now() + 5000); // 5 seconds
              }
              
              const dialogue = obs.dialogue || getDialogue('collectingFood');
              setShowDialogue(dialogue);
              setTimeout(() => setShowDialogue(null), 1500);
            }
          }
        });

        // End game if needed (do this after processing all obstacles)
        if (shouldEndGame) {
          setIsGameOver(true);
          setIsPlaying(false);
        }

        const filtered = moved.filter(obs => obs.position > -2 && !toRemove.has(obs.id));

        // Spawn rate based on level
        const spawnRate = Math.min(0.75, 0.5 + (level * 0.05));
        if (Math.random() < spawnRate) {
          const allItems = [...foodItems, ...obstacleItems];
          const randomItem = allItems[Math.floor(Math.random() * allItems.length)];
          filtered.push({
            id: obstacleIdRef.current++,
            lane: Math.floor(Math.random() * LANES),
            horizontalPos: Math.floor(Math.random() * 3) - 1, // -1, 0, or 1
            position: 10,
            type: randomItem.type,
            emoji: randomItem.emoji,
            name: randomItem.name,
            points: randomItem.points || (randomItem.type === 'catch' ? 1 : 0),
            dialogue: randomItem.dialogue,
            effect: randomItem.effect,
          });
        }

        return filtered;
      });
    }, speed);

    return () => {
      if (gameIntervalRef.current) {
        clearInterval(gameIntervalRef.current);
        gameIntervalRef.current = null;
      }
    };
  }, [speed, isPlaying, isGameOver, isPaused, cookieLane, cookiePosition, level, score, highScore, isInvincible]);

  // Keyboard controls
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowUp' || event.key === 'w' || event.key === 'W') {
        event.preventDefault();
        if (isGameOver) {
          startGame();
        } else {
          moveCookie('up');
        }
      } else if (event.key === 'ArrowDown' || event.key === 's' || event.key === 'S') {
        event.preventDefault();
        moveCookie('down');
      } else if (event.key === 'ArrowLeft' || event.key === 'a' || event.key === 'A') {
        event.preventDefault();
        moveCookie('left');
      } else if (event.key === 'ArrowRight' || event.key === 'd' || event.key === 'D') {
        event.preventDefault();
        moveCookie('right');
      } else if (event.key === ' ' || event.key === 'Enter') {
        event.preventDefault();
        if (isGameOver || (!isPlaying && !isGameOver)) {
          startGame();
        } else if (isPlaying) {
          setIsPaused(prev => !prev);
        }
      } else if (event.key === 'Escape') {
        event.preventDefault();
        if (isPaused) {
          setIsPaused(false);
        } else if (isPlaying) {
          setIsPaused(true);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isPlaying, isGameOver, isPaused]);

  // Swipe gestures
  const handleTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e) => {
    touchEndY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = () => {
    if (!touchStartY.current || !touchEndY.current) return;
    const diff = touchStartY.current - touchEndY.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        moveCookie('up');
      } else {
        moveCookie('down');
      }
    }
    touchStartY.current = 0;
    touchEndY.current = 0;
  };

  const handleButtonPress = (direction) => {
    setButtonPressed(direction);
    triggerHaptic();
    moveCookie(direction);
    setTimeout(() => setButtonPressed(null), 150);
  };

  const closeGame = () => {
    setIsPlaying(false);
    setIsGameOver(false);
    setIsPaused(false);
    if (gameIntervalRef.current) {
      clearInterval(gameIntervalRef.current);
      gameIntervalRef.current = null;
    }
    if (groundIntervalRef.current) {
      clearInterval(groundIntervalRef.current);
      groundIntervalRef.current = null;
    }
    if (onClose) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[150] flex flex-col items-center justify-center bg-gradient-to-b from-[#B8D4E8]/20 to-[#F5F0E8] px-4 py-4"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Close button - outside overflow container */}
      <button
        onClick={closeGame}
        className="absolute top-4 right-4 z-[200] w-12 h-12 rounded-full bg-white/95 hover:bg-white shadow-lg flex items-center justify-center text-navy/60 hover:text-navy transition-all sketchy-border"
        aria-label="Close game"
      >
        <X size={20} />
      </button>

      <div
        className="relative w-full max-w-2xl game-sketchy-border overflow-hidden"
        style={{ height: 'clamp(320px, 70vh, 640px)' }}
      >
        <div className="game-texture-overlay"></div>

        {/* Score Display */}
        <div className="absolute top-4 left-4 right-4 z-20 flex justify-between items-start">
          <div className="bg-white/95 backdrop-blur-sm px-4 py-2 rounded-lg shadow-md sketchy-border">
            <div className="text-2xl font-bold text-navy font-mono tabular-nums">{score.toString().padStart(4, '0')}</div>
            <div className="text-xs text-navy/60 font-hand">{levelNames[level] || `Level ${level}`}</div>
          </div>
          {highScore > 0 && (
            <div className="bg-white/95 backdrop-blur-sm px-3 py-2 rounded-lg shadow-md text-right sketchy-border">
              <div className="text-xs text-navy/50 font-hand">HI</div>
              <div className="text-lg font-bold text-navy/70 font-mono tabular-nums">{highScore.toString().padStart(4, '0')}</div>
            </div>
          )}
        </div>

        {/* Cookie Dialogue Bubble */}
        <AnimatePresence>
          {showDialogue && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.8 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="absolute top-16 md:top-20 left-1/2 -translate-x-1/2 z-40 cookie-dialogue max-w-[90%] md:max-w-none"
            >
              {showDialogue}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Invincibility indicator */}
        {isInvincible && (
          <motion.div
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ repeat: Infinity, duration: 0.5 }}
            className="absolute top-16 left-1/2 -translate-x-1/2 z-30 bg-[#D4A5A5] text-white px-3 py-1 rounded-full text-xs font-hand font-bold sketchy-border"
          >
            INVINCIBLE!
          </motion.div>
        )}

        {/* Start Screen */}
        {!isPlaying && !isGameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-[#F5F0E8] to-white z-10 p-8">
            <div className="mb-8">
              <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-white border-4 border-white shadow-2xl p-1 flex items-center justify-center overflow-hidden sketchy-border">
                <img
                  ref={cookieImageRef}
                  src="/images/cookie.png"
                  alt="Cookie"
                  className="w-full h-full object-cover rounded-full"
                  style={{ objectPosition: 'center' }}
                  onError={(e) => {
                    e.target.src = '/images/cookie.jpg';
                    e.target.style.objectPosition = 'center';
                  }}
                />
              </div>
            </div>
            <h4 className="text-4xl font-hand text-navy mb-3 font-bold">Cookie's Goan Chase</h4>
            <p className="text-sm text-navy/70 mb-2 text-center max-w-md font-hand">
              Catch Goan food • Avoid obstacles • Survive the chaos!
            </p>
            <p className="text-xs text-navy/60 mb-8 text-center font-hand">
              Use ↑↓←→ or WASD keys • Swipe on mobile
            </p>
            <button
              onClick={startGame}
              className="px-8 py-3 bg-[#1B3A57] text-white font-bold rounded-lg shadow-lg hover:bg-[#2c5378] transition-all transform hover:scale-105 sketchy-border font-hand"
            >
              Press ↑ or Space to Start
            </button>
          </div>
        )}

        {/* Game Over Screen */}
        {isGameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/95 backdrop-blur-sm z-20 p-8">
            <div className="text-center">
              <h4 className="text-5xl font-bold text-navy mb-4 font-hand">Game Over</h4>
              <div className="text-6xl font-mono font-bold text-[#D4A5A5] mb-2 tabular-nums">{score.toString().padStart(4, '0')}</div>
              <p className="text-sm text-navy/60 mb-2 font-hand">{levelNames[level] || `Level ${level}`}</p>
              {score >= highScore && score > 0 && (
                <p className="text-xs text-[#D4A5A5] font-bold mb-4 font-hand">NEW HIGH SCORE!</p>
              )}
              <div className="flex gap-3 justify-center">
                <button
                  onClick={startGame}
                  className="px-6 py-2 bg-[#1B3A57] text-white font-bold rounded-lg shadow-lg hover:bg-[#2c5378] transition-all transform hover:scale-105 sketchy-border font-hand"
                >
                  Play Again
                </button>
                {score > 0 && (
                  <button
                    onClick={shareScore}
                    className="px-6 py-2 bg-[#D4A5A5] text-white font-bold rounded-lg shadow-lg hover:bg-[#c49595] transition-all transform hover:scale-105 sketchy-border font-hand"
                  >
                    Share Score
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Pause Screen */}
        {isPaused && isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-20">
            <div className="bg-white rounded-xl px-8 py-6 shadow-2xl text-center sketchy-border">
              <h4 className="text-3xl font-bold text-navy mb-4 font-hand">Paused</h4>
              <p className="text-sm text-navy/60 mb-4 font-hand">Press Space or Esc to resume</p>
              <button
                onClick={() => setIsPaused(false)}
                className="px-6 py-2 bg-[#1B3A57] text-white font-bold rounded-lg hover:bg-[#2c5378] transition-all sketchy-border font-hand"
              >
                Resume
              </button>
            </div>
          </div>
        )}

        {/* Game Area */}
        {isPlaying && (
          <div className="relative w-full h-full game-beach-bg overflow-hidden">
            {/* Palm trees in background */}
            <div className="absolute top-10 left-10 palm-tree opacity-30"></div>
            <div className="absolute top-20 right-20 palm-tree opacity-20" style={{ transform: 'scaleX(-1)' }}></div>
            
            {/* Animated Ground */}
            <div 
              className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#8B7355] to-[#A68B6B] border-t-4 border-[#6B5A45]"
              style={{
                backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(255,255,255,0.1) 40px)`,
                backgroundPosition: `${groundOffset}px 0`
              }}
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
            </div>

            {/* Game lanes */}
            {Array.from({ length: LANES }).map((_, laneIndex) => (
              <div
                key={laneIndex}
                className="absolute left-0 right-0"
                style={{
                  top: `${(laneIndex + 1) * (100 / (LANES + 1))}%`,
                  height: `${100 / (LANES + 1)}%`,
                  borderBottom: laneIndex < LANES - 1 ? '1px dashed rgba(27, 58, 87, 0.1)' : 'none'
                }}
              >
                {/* Cookie sticker */}
                {cookieLane === laneIndex && (
                  <motion.div
                    className="absolute z-10"
                    style={{ 
                      top: '50%', 
                      left: `${50 + cookiePosition * 30}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                    animate={{ 
                      y: [0, -3, 0],
                      scale: isInvincible ? [1, 1.1, 1] : 1,
                      x: 0
                    }}
                    transition={{ 
                      y: { repeat: Infinity, duration: 0.5, ease: 'easeInOut' },
                      scale: { repeat: Infinity, duration: 0.3 },
                      left: { duration: 0.15, ease: 'easeOut' }
                    }}
                  >
                    <div className={`w-24 h-24 rounded-full bg-white border-4 border-white shadow-2xl p-0.5 flex items-center justify-center overflow-hidden sketchy-border ${isInvincible ? 'ring-4 ring-[#D4A5A5]' : ''}`}>
                      <img
                        src="/images/cookie.png"
                        alt="Cookie"
                        className="w-full h-full object-cover rounded-full"
                        style={{ objectPosition: 'center' }}
                        onError={(e) => {
                          e.target.src = '/images/cookie.jpg';
                          e.target.style.objectPosition = 'center';
                        }}
                      />
                    </div>
                  </motion.div>
                )}

                {/* Obstacles */}
                {obstacles
                  .filter(obs => obs.lane === laneIndex)
                  .map(obs => {
                    const baseLeft = obs.position * 10; // Base position from left (0-100%)
                    const horizontalOffset = (obs.horizontalPos || 0) * 30; // Horizontal offset (-30, 0, or +30)
                    const finalLeft = Math.max(0, Math.min(100, baseLeft + horizontalOffset));
                    return (
                    <motion.div
                      key={obs.id}
                      className="absolute z-5"
                      style={{
                        left: `${finalLeft}%`,
                        top: '50%',
                        transform: 'translate(-50%, -50%)'
                      }}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ 
                        opacity: 1, 
                        scale: 1,
                        rotate: obs.type === 'catch' || obs.type === 'powerup' ? [0, 5, -5, 0] : 0
                      }}
                      transition={{ 
                        rotate: { repeat: Infinity, duration: 0.5 },
                        opacity: { duration: 0.2 }
                      }}
                    >
                      <div className="w-16 h-16 rounded-full flex items-center justify-center text-4xl shadow-xl">
                        {obs.emoji}
                      </div>
                    </motion.div>
                    );
                  })}
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Mobile controls - Paw print buttons */}
      {isPlaying && (
        <div className="w-full max-w-2xl mt-6 md:hidden">
          <div className="flex flex-col items-center gap-4">
            <button
              onClick={() => handleButtonPress('up')}
              className={`paw-button ${buttonPressed === 'up' ? 'pressed' : ''}`}
              aria-label="Move up"
            >
              <span className="text-2xl text-[#D88D66] font-semibold">△</span>
            </button>
            <div className="flex items-center gap-8">
              <button
                onClick={() => handleButtonPress('left')}
                className={`paw-button ${buttonPressed === 'left' ? 'pressed' : ''}`}
                aria-label="Move left"
              >
                <span className="text-2xl text-[#3B2F2A] font-semibold">◀</span>
              </button>
              <button
                onClick={() => handleButtonPress('down')}
                className={`paw-button ${buttonPressed === 'down' ? 'pressed' : ''}`}
                aria-label="Move down"
              >
                <span className="text-2xl text-[#D88D66] font-semibold">▽</span>
              </button>
              <button
                onClick={() => handleButtonPress('right')}
                className={`paw-button ${buttonPressed === 'right' ? 'pressed' : ''}`}
                aria-label="Move right"
              >
                <span className="text-2xl text-[#EBBA9A] font-semibold">▶</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CookieChaseGame;

