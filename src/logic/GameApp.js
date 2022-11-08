import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'
import { ref, get } from 'firebase/database'

import { gameSubject, initGame, resetGame } from './Game'
import Board from './Board'
import { db } from '../onlineGame/firebase'

function GameApp() {
  const [board, setBoard] = useState([])
  const [isGameOver, setIsGameOver] = useState()
  const [result, setResult] = useState()
  const [position, setPosition] = useState()
  const [initResult, setInitResult] = useState(null)
  const [loading, setLoading] = useState(true)
  const { id } = useParams()
  console.log(id)
  useEffect(() => {
    let subscribe
    async function init() {
      const res = await initGame(id !== 'local' ? get(ref(db, 'games/' + id)) : null)
      setInitResult(res)
      console.log(res)
      setLoading(false)
      console.log(get(ref(db, 'games/' + id)));
      if (!res) {
        subscribe = gameSubject.subscribe((game) => {
          console.log(game)
          setBoard(game.board)

          setIsGameOver(game.isGameOver)
          setResult(game.result)
          setPosition(game.position)
        })

      }
    }

    init()

    return () => subscribe && subscribe.unsubscribe()
  }, [id])
  console.log(board);
  return (
    <div className="app-container">
      {isGameOver && (<h1 className="vertical-text">GAME OVER
        <button onClick={resetGame}><span className="vertical-text">NEW GAME</span></button>
      </h1>
      )}
      <div className="board-app-container">
        <Board board={board} position={position} />

      </div>
      {result && <p className="vertical-text">{result}</p>}
    </div>
  );
}

export default GameApp;
