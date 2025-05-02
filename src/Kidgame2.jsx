import React, { useState, useEffect } from "react";
import { 
  Heart, 
  Star, 
  Circle, 
  Square, 
  Zap, 
  Moon, 
  Cat, 
  Cloud, 
  Trophy, 
  Music, 
  Sun, 
  Gift,
  Trees,
  Undo,
  RefreshCw
} from "lucide-react";

const KidsMemoryGame = () => {
  // Game icons with colorful themes
  const iconSet = {
    heart: { Icon: Heart, color: "text-pink-500" },
    star: { Icon: Star, color: "text-yellow-500" },
    circle: { Icon: Circle, color: "text-blue-500" },
    square: { Icon: Square, color: "text-purple-500" },
    zap: { Icon: Zap, color: "text-yellow-500" },
    moon: { Icon: Moon, color: "text-indigo-400" },
    cat: { Icon: Cat, color: "text-orange-400" },
    cloud: { Icon: Cloud, color: "text-sky-300" },
    trophy: { Icon: Trophy, color: "text-amber-500" },
    music: { Icon: Music, color: "text-green-500" },
    sun: { Icon: Sun, color: "text-yellow-600" },
    gift: { Icon: Gift, color: "text-red-500" }
  };

  // Game state
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [difficulty, setDifficulty] = useState("medium"); // easy, medium, hard
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [showInstructions, setShowInstructions] = useState(false);
  const [timerActive, setTimerActive] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [confetti, setConfetti] = useState(false);
  const [initialReveal, setInitialReveal] = useState(false);
  
  // Initialize game
  useEffect(() => {
    startNewGame();
    
    // Load best score from localStorage if available
    const savedBestScore = localStorage.getItem('memoryGameBestScore');
    if (savedBestScore) {
      setBestScore(parseInt(savedBestScore));
    }
  }, [difficulty]);

  // Timer effect
  useEffect(() => {
    let interval;
    if (timerActive) {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive]);

  // Check for game completion
  useEffect(() => {
    if (gameStarted && matchedPairs.length > 0 && matchedPairs.length === (difficulty === "easy" ? 6 : difficulty === "medium" ? 8 : 12)) {
      setGameCompleted(true);
      setTimerActive(false);
      setConfetti(true);
      
      // Calculate score based on moves and time
      const newScore = Math.round(1000 * (matchedPairs.length / moves) * (matchedPairs.length / timeElapsed));
      setScore(newScore);
      
      // Update best score if current score is higher
      if (newScore > bestScore) {
        setBestScore(newScore);
        localStorage.setItem('memoryGameBestScore', newScore.toString());
      }
      
      // Hide confetti after 5 seconds
      setTimeout(() => {
        setConfetti(false);
      }, 5000);
    }
  }, [matchedPairs, difficulty, gameStarted, moves, timeElapsed, bestScore]);

  // Start a new game with the current difficulty
  const startNewGame = () => {
    // Create pairs based on difficulty level
    const pairCount = difficulty === "easy" ? 6 : difficulty === "medium" ? 8 : 12;
    
    // Select icons for this game
    const iconKeys = Object.keys(iconSet);
    const shuffledIconKeys = [...iconKeys].sort(() => Math.random() - 0.5);
    const selectedIconKeys = shuffledIconKeys.slice(0, pairCount);
    
    // Create pairs and shuffle
    const cardPairs = selectedIconKeys.flatMap(key => [
      { id: `${key}-1`, iconKey: key, isFlipped: false, isMatched: false },
      { id: `${key}-2`, iconKey: key, isFlipped: false, isMatched: false }
    ]);
    
    // Shuffle cards
    const shuffledCards = [...cardPairs].sort(() => Math.random() - 0.5);
    
    // Reset game state
    setCards(shuffledCards);
    setFlippedCards([]);
    setMatchedPairs([]);
    setMoves(0);
    setGameStarted(false);
    setGameCompleted(false);
    setTimeElapsed(0);
    setTimerActive(false);
    
    // Show all cards for a few seconds
    setInitialReveal(true);
    setTimeout(() => {
      setInitialReveal(false);
    }, 3000);
  };

  // Handle card click
  const handleCardClick = (clickedCardId) => {
    // Don't allow clicks during initial reveal
    if (initialReveal) return;
    
    // Start game and timer on first card click
    if (!gameStarted) {
      setGameStarted(true);
      setTimerActive(true);
    }
    
    // Don't allow clicks if game is completed or if clicking already matched/flipped cards
    const clickedCard = cards.find(card => card.id === clickedCardId);
    if (gameCompleted || clickedCard.isMatched || flippedCards.includes(clickedCardId) || flippedCards.length >= 2) {
      return;
    }
    
    // Update flipped cards
    const newFlippedCards = [...flippedCards, clickedCardId];
    setFlippedCards(newFlippedCards);
    
    // If two cards are flipped, check for match
    if (newFlippedCards.length === 2) {
      setMoves(prev => prev + 1);
      
      const [firstCardId, secondCardId] = newFlippedCards;
      const firstCard = cards.find(card => card.id === firstCardId);
      const secondCard = cards.find(card => card.id === secondCardId);
      
      // Check if cards match
      if (firstCard.iconKey === secondCard.iconKey) {
        // Add to matched pairs
        setMatchedPairs(prev => [...prev, firstCard.iconKey]);
        
        // Reset flipped cards after a short delay
        setTimeout(() => {
          setFlippedCards([]);
        }, 500);
      } else {
        // Cards don't match, flip them back after 1 second
        setTimeout(() => {
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  // Get card state (flipped, matched, or face down)
  const getCardState = (card) => {
    if (initialReveal) {
      return "flipped";
    }
    if (card.isMatched || matchedPairs.includes(card.iconKey)) {
      return "matched";
    }
    if (flippedCards.includes(card.id)) {
      return "flipped";
    }
    return "faceDown";
  };

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Confetti component for winning animation
  const Confetti = () => {
    return (
      <div className="fixed inset-0 pointer-events-none z-50">
        {Array.from({ length: 100 }).map((_, i) => (
          <div
            key={i}
            className={`absolute animate-fall rounded-sm w-2 h-2 ${
              ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500'][Math.floor(Math.random() * 6)]
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `-20px`,
              animationDuration: `${Math.random() * 3 + 2}s`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>
    );
  };

  // Calculate grid columns based on difficulty and screen size
  const getGridCols = () => {
    if (difficulty === "easy") {
      return "grid-cols-4 sm:grid-cols-4";
    } else if (difficulty === "medium") {
      return "grid-cols-4 sm:grid-cols-4 md:grid-cols-4";
    } else {
      return "grid-cols-5 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-6";
    }
  };

  return (
    <div className="flex flex-col items-center justify-center mt-10 mb-10 rounded-lg min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 p-2 sm:p-4">
      {/* Game Header */}
      <div className="w-full max-w-2xl flex flex-col sm:flex-row justify-between items-center mb-4">
        <div className="flex items-center mb-2 sm:mb-0">
          <Trees className="text-green-600 mr-2" size={28} />
          <h1 className="text-2xl sm:text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
            Kids Memory Game
          </h1>
        </div>
        
        <div className="flex space-x-2">
          <button 
            onClick={() => setShowInstructions(true)}
            className="bg-blue-200 hover:bg-blue-300 hover:shadow-md text-blue-800 font-medium py-1 px-3 rounded-lg transition-colors text-sm"
          >
            How to Play
          </button>
          <button 
            onClick={startNewGame}
            className="bg-gradient-to-r from-purple-500 hover:shadow-md to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-medium py-1 px-3 rounded-lg flex items-center transition-all text-sm"
          >
            <RefreshCw className="mr-1" size={14} />
            New Game
          </button>
        </div>
      </div>

      {/* Initial Reveal Countdown */}
      {initialReveal && (
        <div className="fixed inset-0 pointer-events-none z-40 flex items-center justify-center">
          <div className="bg-black shadow-md shadow-blue-600  bg-opacity-30 text-white text-6xl font-bold rounded-full w-24 h-24 flex items-center justify-center animate-pulse">
            <span className="animate-count-down"></span>
          </div>
        </div>
      )}

      {/* Game Info */}
      <div className="w-full max-w-3xl flex flex-wrap justify-center sm:justify-between gap-2 mb-3">
        <div className="flex flex-wrap gap-2 justify-center">
          {/* Difficulty Selector */}
          <div className="bg-white rounded-xl shadow-md p-1 flex items-center text-sm">
            <span className="text-gray-700 font-medium mr-1">Difficulty:</span>
            <div className="flex space-x-1">
              {["easy", "medium", "hard"].map((level) => (
                <button
                  key={level}
                  onClick={() => !gameStarted && setDifficulty(level)}
                  className={`px-2 py-1 rounded-lg font-medium capitalize transition-colors ${
                    difficulty === level 
                      ? "bg-blue-500 text-white" 
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  } ${gameStarted ? "opacity-70 cursor-not-allowed" : ""}`}
                  disabled={gameStarted}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
          
          {/* Move Counter */}
          <div className="bg-white rounded-xl shadow-md p-1 flex items-center px-3 text-sm">
            <span className="text-gray-700 font-medium mr-1">Moves:</span>
            <span className="text-blue-600 font-bold">{moves}</span>
          </div>
          
          {/* Timer */}
          <div className="bg-white rounded-xl shadow-md p-1 flex items-center px-3 text-sm">
            <span className="text-gray-700 font-medium mr-1">Time:</span>
            <span className="text-blue-600 font-bold">{formatTime(timeElapsed)}</span>
          </div>
        </div>
        
        {/* Score Display */}
        <div className="flex gap-2 text-sm">
          <div className="bg-white rounded-xl shadow-md p-1 flex items-center px-3">
            <Trophy size={16} className="text-amber-500 mr-1" />
            <span className="text-gray-700 font-medium mr-1">Score:</span>
            <span className="text-blue-600 font-bold">{score}</span>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-1 flex items-center px-3">
            <Star size={16} className="text-yellow-500 mr-1" />
            <span className="text-gray-700 font-medium mr-1">Best:</span>
            <span className="text-blue-600 font-bold">{bestScore}</span>
          </div>
        </div>
      </div>

      {/* Game Board */}
      <div className={`w-full  max-w-xl grid ${getGridCols()} gap-1 sm:gap-2 md:gap-3 mx-auto`}>
        {cards.map((card) => {
          const cardState = getCardState(card);
          const { Icon, color } = iconSet[card.iconKey];
          
          return (
            <button
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              disabled={cardState === "matched" || initialReveal}
              className={`
                aspect-square flex items-center justify-center rounded-lg transition-all duration-300 shadow-md
                transform hover:scale-105 active:scale-95
                ${cardState === "faceDown" ? "bg-gradient-to-br from-blue-500 to-purple-500" : "bg-white shadow-md shadow-blue-700"}
                ${cardState === "matched" ? "opacity-70" : ""}
              `}
            >
              {cardState !== "faceDown" ? (
                <Icon 
                  size={difficulty === "hard" ? 30 : 40} 
                  className={`${color} ${cardState === "matched" ? "animate-bounce" : "animate-reveal"}`} 
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                  <span className="text-xl text-white opacity-50">?</span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Game Completed Modal */}
      {gameCompleted && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40">
          <div className="bg-white rounded-2xl shadow-lg p-4 max-w-xs sm:max-w-sm w-full mx-4 animate-pop-in">
            <h2 className="text-xl font-bold text-center text-purple-600 mb-3">
              Congratulations! 🎉
            </h2>
            <div className="space-y-2 mb-4">
              <p className="text-center text-gray-700 text-sm">You completed the memory game!</p>
              
              <div className="flex justify-between items-center p-2 bg-blue-50 rounded-lg text-sm">
                <span className="font-medium text-gray-700">Time:</span>
                <span className="font-bold text-blue-600">{formatTime(timeElapsed)}</span>
              </div>
              
              <div className="flex justify-between items-center p-2 bg-purple-50 rounded-lg text-sm">
                <span className="font-medium text-gray-700">Moves:</span>
                <span className="font-bold text-purple-600">{moves}</span>
              </div>
              
              <div className="flex justify-between items-center p-2 bg-yellow-50 rounded-lg text-sm">
                <span className="font-medium text-gray-700">Score:</span>
                <span className="font-bold text-yellow-600">{score}</span>
              </div>
              
              {score > bestScore && (
                <div className="bg-green-50 p-2 rounded-lg text-center text-sm">
                  <Trophy className="inline-block text-amber-500 mr-1" size={14} />
                  <span className="font-bold text-green-600">New Best Score!</span>
                </div>
              )}
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={startNewGame}
                className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white py-2 rounded-lg font-medium hover:from-purple-600 hover:to-blue-600 transition-colors flex items-center justify-center text-sm"
              >
                <RefreshCw className="mr-2" size={14} />
                Play Again
              </button>
            </div>
          </div>

        </div>
      )}

      {/* Instructions Modal */}
      {showInstructions && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40">
          <div className="bg-white rounded-2xl shadow-lg p-4 max-w-xs sm:max-w-sm w-full mx-4">
            <h2 className="text-xl font-bold text-center text-purple-600 mb-3">
              How to Play
            </h2>
            <div className="space-y-2 mb-4 text-gray-700 text-sm">
              <p><span className="font-bold">1.</span> Cards will be revealed for 3 seconds at the start.</p>
              <p><span className="font-bold">2.</span> Flip cards by clicking on them to find matching pairs.</p>
              <p><span className="font-bold">3.</span> Remember card positions to make matches in fewer moves.</p>
              <p><span className="font-bold">4.</span> Match all pairs to complete the game.</p>
              <p className="pt-1 font-medium">Choose difficulty level:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><span className="font-medium text-green-600">Easy:</span> 6 pairs (12 cards)</li>
                <li><span className="font-medium text-blue-600">Medium:</span> 8 pairs (16 cards)</li>
                <li><span className="font-medium text-red-600">Hard:</span> 12 pairs (24 cards)</li>
              </ul>
            </div>
            <button
              onClick={() => setShowInstructions(false)}
              className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-2 rounded-lg font-medium hover:from-purple-600 hover:to-blue-600 transition-colors text-sm"
            >
              Got it!
            </button>
          </div>
          
        </div>
      )}

      {/* Confetti Animation */}
      {confetti && <Confetti />}

      {/* Custom CSS Animations */}
      <style jsx>{`
        @keyframes reveal {
          0% { transform: scale(0); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        
        @keyframes fall {
          0% { transform: translateY(-10px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
        }
        
        @keyframes pop-in {
          0% { transform: scale(0.9); opacity: 0; }
          70% { transform: scale(1.05); }
          100% { transform: scale(1); opacity: 1; }
        }
        
        @keyframes countdown {
          0% { content: "3"; }
          33% { content: "2"; }
          66% { content: "1"; }
          100% { content: "Go!"; }
        }
        
        .animate-reveal {
          animation: reveal 0.3s ease-out forwards;
        }
        
        .animate-fall {
          animation: fall linear forwards;
        }
        
        .animate-pop-in {
          animation: pop-in 0.5s ease-out forwards;
        }
        
        .animate-count-down::after {
          content: "3";
          animation: countdown 3s steps(3, end) forwards;
        }
      `}</style>
                <p className=" mt-2 flex font-semibold text-sm text-gray-700 justify-end">Powered by @dikie.dev</p>
    </div>
  );
};

export default KidsMemoryGame;