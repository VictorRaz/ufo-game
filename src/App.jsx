import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { motion, AnimatePresence } from 'framer-motion'
import './App.css'

// Import assets
import ufoImage from './assets/7jkNfLelu3Qx.jpg' // UFO with tractor beam
import spaceBackground from './assets/X9ZWEKEG5z6j.jpg' // Dark space background

function App() {
  const [codeword] = useState("codecademy")
  const [answer, setAnswer] = useState("-".repeat("codecademy".length))
  const [misses, setMisses] = useState(0)
  const [incorrectGuesses, setIncorrectGuesses] = useState([])
  const [currentGuess, setCurrentGuess] = useState("")
  const [gameState, setGameState] = useState("playing") // playing, won, lost
  const [message, setMessage] = useState("")
  const [revealedLetters, setRevealedLetters] = useState(new Set())

  const maxMisses = 7

  // Check for win/lose conditions
  useEffect(() => {
    if (answer === codeword) {
      setGameState("won")
      setMessage("🎉 Hooray! You saved the person and earned a medal of honor!")
    } else if (misses >= maxMisses) {
      setGameState("lost")
      setMessage("💀 Oh no! The UFO just flew away with another person!")
    }
  }, [answer, codeword, misses])

  const handleGuess = () => {
    if (!currentGuess || currentGuess.length !== 1 || gameState !== "playing") {
      return
    }

    const letter = currentGuess.toLowerCase()
    
    // Check if letter already guessed
    if (incorrectGuesses.includes(letter) || answer.includes(letter)) {
      setMessage("⚠️ You already guessed that letter!")
      setCurrentGuess("")
      return
    }

    let found = false
    let newAnswer = answer
    const newRevealed = new Set(revealedLetters)

    // Check if letter is in codeword
    for (let i = 0; i < codeword.length; i++) {
      if (letter === codeword[i]) {
        newAnswer = newAnswer.substring(0, i) + letter + newAnswer.substring(i + 1)
        newRevealed.add(i)
        found = true
      }
    }

    if (found) {
      setAnswer(newAnswer)
      setRevealedLetters(newRevealed)
      setMessage("✅ Correct! You're closer to cracking the codeword.")
    } else {
      setIncorrectGuesses([...incorrectGuesses, letter])
      setMisses(misses + 1)
      setMessage("❌ Incorrect! The tractor beam pulls the person in further.")
    }

    setCurrentGuess("")
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleGuess()
    }
  }

  const resetGame = () => {
    setAnswer("-".repeat(codeword.length))
    setMisses(0)
    setIncorrectGuesses([])
    setCurrentGuess("")
    setGameState("playing")
    setMessage("")
    setRevealedLetters(new Set())
  }

  const getAbductionLevel = () => {
    return Math.min(misses / maxMisses, 1)
  }

  // Particle component for visual effects
  const Particle = ({ delay = 0 }) => (
    <motion.div
      className="absolute w-1 h-1 bg-green-400 rounded-full"
      initial={{ opacity: 0, scale: 0 }}
      animate={{ 
        opacity: [0, 1, 0],
        scale: [0, 1, 0],
        y: [0, -50, -100],
        x: [0, Math.random() * 20 - 10, Math.random() * 40 - 20]
      }}
      transition={{ 
        duration: 2,
        delay,
        repeat: Infinity,
        repeatDelay: 1
      }}
    />
  )

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated space background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat stars-bg"
        style={{ backgroundImage: `url(${spaceBackground})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/20 via-purple-900/30 to-black/50" />
      
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-6xl mx-auto">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="game-title text-4xl md:text-6xl font-bold text-white mb-4 tracking-wider neon-text">
              UFO: THE GAME
            </h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto"
            >
              Save your friend from alien abduction by guessing the letters in the codeword.
            </motion.p>
          </motion.div>

          {/* UFO and Abduction Scene */}
          <motion.div 
            className="ufo-scene relative mb-8 h-64 md:h-80 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {/* UFO */}
            <motion.div className="absolute top-0 z-20 ufo-float">
              <img 
                src={ufoImage}
                alt="UFO"
                className="w-32 md:w-48 h-20 md:h-32 object-contain pulse-glow rounded-full"
              />
              {/* UFO lights */}
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 bg-blue-400 rounded-full"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ 
                      duration: 1,
                      delay: i * 0.2,
                      repeat: Infinity
                    }}
                  />
                ))}
              </div>
            </motion.div>

            {/* Enhanced Tractor Beam */}
            <motion.div 
              className="absolute top-16 md:top-20 w-24 md:w-32 h-32 md:h-48 z-10 tractor-beam"
              style={{
                background: `linear-gradient(to bottom, 
                  rgba(16, 185, 129, 0.4) 0%,
                  rgba(16, 185, 129, 0.2) 50%,
                  rgba(16, 185, 129, 0.1) 100%)`,
                clipPath: "polygon(40% 0%, 60% 0%, 80% 100%, 20% 100%)",
                filter: "blur(1px)"
              }}
            >
              {/* Particle effects in beam */}
              {[...Array(8)].map((_, i) => (
                <Particle key={i} delay={i * 0.3} />
              ))}
            </motion.div>

            {/* Person being abducted */}
            <motion.div 
              className="absolute bottom-0 z-15"
              animate={{ 
                y: -getAbductionLevel() * 120,
                rotate: getAbductionLevel() * 180,
                scale: 1 - getAbductionLevel() * 0.3
              }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              {/* Enhanced person figure */}
              <div className="relative">
                <div className="w-3 md:w-4 h-3 md:h-4 bg-orange-300 rounded-full mx-auto mb-1"></div>
                <div className="w-4 md:w-6 h-4 md:h-6 bg-orange-400 mx-auto mb-1 rounded"></div>
                <div className="w-1 md:w-2 h-2 md:h-3 bg-orange-500 mx-auto"></div>
                {/* Arms */}
                <div className="absolute top-4 -left-1 w-2 h-1 bg-orange-400 rounded transform -rotate-45"></div>
                <div className="absolute top-4 -right-1 w-2 h-1 bg-orange-400 rounded transform rotate-45"></div>
                {/* Legs */}
                <div className="absolute bottom-0 left-0 w-1 h-2 bg-orange-500 rounded"></div>
                <div className="absolute bottom-0 right-0 w-1 h-2 bg-orange-500 rounded"></div>
              </div>
            </motion.div>

            {/* Danger indicator */}
            <motion.div 
              className="absolute bottom-4 left-1/2 transform -translate-x-1/2"
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                misses < 3 ? 'bg-green-500/20 text-green-400' :
                misses < 5 ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-red-500/20 text-red-400'
              }`}>
                Danger Level: {Math.round(getAbductionLevel() * 100)}%
              </div>
            </motion.div>
          </motion.div>

          {/* Game Interface */}
          <div className="grid lg:grid-cols-2 gap-6 md:gap-8">
            {/* Word Display */}
            <Card className="game-card gradient-border">
              <CardHeader>
                <CardTitle className="text-white text-center text-xl md:text-2xl neon-text">
                  Codeword
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center flex-wrap gap-2 mb-4">
                  {answer.split('').map((letter, index) => (
                    <motion.div
                      key={index}
                      className={`letter-slot w-8 md:w-12 h-8 md:h-12 border-2 border-gray-400 rounded flex items-center justify-center bg-gray-800/50 ${
                        revealedLetters.has(index) ? 'letter-revealed border-green-400' : ''
                      }`}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <AnimatePresence>
                        {letter !== '-' && (
                          <motion.span
                            initial={{ scale: 0, rotate: 180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            className="text-lg md:text-2xl font-bold text-green-400 neon-text"
                          >
                            {letter.toUpperCase()}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Game Status */}
            <Card className="game-card gradient-border">
              <CardHeader>
                <CardTitle className="text-white text-center text-xl md:text-2xl neon-text">
                  Mission Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-gray-300 mb-2 font-semibold">
                    Failed Attempts ({misses}/{maxMisses}):
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <AnimatePresence>
                      {incorrectGuesses.map((letter, index) => (
                        <motion.span
                          key={letter}
                          initial={{ opacity: 0, scale: 0, x: -20 }}
                          animate={{ opacity: 1, scale: 1, x: 0 }}
                          exit={{ opacity: 0, scale: 0 }}
                          className="px-2 py-1 bg-red-600/80 text-white rounded text-sm font-bold border border-red-400"
                        >
                          {letter.toUpperCase()}
                        </motion.span>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Enhanced Progress Bar */}
                <div>
                  <p className="text-gray-300 mb-2 font-semibold">Abduction Progress:</p>
                  <div className="relative w-full bg-gray-700/50 rounded-full h-4 overflow-hidden">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-green-400 via-yellow-400 to-red-500 rounded-full relative"
                      initial={{ width: 0 }}
                      animate={{ width: `${(misses / maxMisses) * 100}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                      <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                    </motion.div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>Safe</span>
                    <span>Critical</span>
                    <span>Lost</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">{answer.split('').filter(l => l !== '-').length}</div>
                    <div className="text-xs text-gray-400">Letters Found</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">{codeword.length - answer.split('').filter(l => l !== '-').length}</div>
                    <div className="text-xs text-gray-400">Remaining</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Input Section */}
          <motion.div 
            className="mt-6 md:mt-8 text-center"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            {gameState === "playing" ? (
              <div className="space-y-4">
                <div className="flex justify-center items-center space-x-4">
                  <Input
                    type="text"
                    value={currentGuess}
                    onChange={(e) => setCurrentGuess(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Letter"
                    maxLength={1}
                    className="w-16 md:w-20 h-12 md:h-14 text-center text-xl md:text-2xl font-bold bg-gray-800/70 border-gray-600 text-white focus:border-green-400 focus:ring-green-400"
                  />
                  <Button 
                    onClick={handleGuess}
                    className="h-12 md:h-14 px-6 md:px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold text-lg transition-all duration-300 transform hover:scale-105"
                    disabled={!currentGuess}
                  >
                    Guess
                  </Button>
                </div>
                <AnimatePresence>
                  {message && (
                    <motion.p 
                      key={message}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="text-lg md:text-xl text-gray-300 font-medium"
                    >
                      {message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <motion.div 
                className="space-y-6"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <motion.div
                  className={`text-3xl md:text-4xl font-bold ${gameState === "won" ? "text-green-400" : "text-red-400"} neon-text`}
                  animate={{ 
                    scale: [1, 1.05, 1],
                    textShadow: gameState === "won" ? 
                      ["0 0 20px #10b981", "0 0 30px #10b981", "0 0 20px #10b981"] :
                      ["0 0 20px #ef4444", "0 0 30px #ef4444", "0 0 20px #ef4444"]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {message}
                </motion.div>
                <Button 
                  onClick={resetGame}
                  className="h-14 px-8 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-lg transition-all duration-300 transform hover:scale-105"
                >
                  🚀 Play Again
                </Button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default App

