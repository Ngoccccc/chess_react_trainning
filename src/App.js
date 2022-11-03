import React, { useEffect, useState } from 'react';
import './App.css'
import { gameSubject, initGame, resetGame } from './Game'
import Board from './Board'

function App() {
  const [board, setBoard] = useState([])
  const [isGameOver, setIsGameOver] = useState()
  const [result, setResult] = useState()
  useEffect(() => {
    initGame()
    console.log(gameSubject)
    const subscribe = gameSubject.subscribe(game => {
      setIsGameOver(game.isGameOver)
      setResult(game.result)
      setBoard(game.board)
    })
    return () => subscribe.unsubscribe()
  }, [])

  return (
    <div className="container">
      {isGameOver && (<h1 className="vertical-text">Game Over
        <button onClick={resetGame}><span className="vertical-text">New Game</span></button>
      </h1>
      )}
      <div className="board-container">
        <Board board={board} />
      </div>
    </div>
  );
}

export default App;
