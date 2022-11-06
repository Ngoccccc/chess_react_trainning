import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'
import { set, ref, get } from 'firebase/database'
import { doc, getDoc } from "firebase/firestore";

import { gameSubject, initGame, resetGame } from './Game'
import Board from './Board'
import { db } from '../onlineGame/firebase'

function GameApp() {
  const [board, setBoard] = useState([])
  const [isGameOver, setIsGameOver] = useState()
  const [result, setResult] = useState()
  const [turn, setTurn] = useState()
  const { id } = useParams()

  useEffect(() => {
    initGame()

    const subscribe = gameSubject.subscribe(game => {
      setIsGameOver(game.isGameOver)
      setResult(game.result)
      setTurn(game.turn)
      setBoard(game.board)
    })
    return () => subscribe.unsubscribe()
  }, [])


  return (
    <div className="app-container">
      {isGameOver && (<h1 className="vertical-text">GAME OVER
        <button onClick={resetGame}><span className="vertical-text">NEW GAME</span></button>
      </h1>
      )}
      <div className="board-app-container">
        <Board board={board} turn={turn} />
      </div>
      {result && <p className="vertical-text">{result}</p>}
    </div>
  );
}

export default GameApp;
