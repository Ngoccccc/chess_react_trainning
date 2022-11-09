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
  const [status, setStatus] = useState('')
  const [game, setGame] = useState({})
  const { id } = useParams()
  const shareLink = window.location.href
  useEffect(() => {
    let subscribe
    async function init() {
      const res = await initGame(id !== 'local' ? get(ref(db, 'games/' + id)) : null)
      setInitResult(res)

      setLoading(false)

      if (!res) {
        subscribe = gameSubject.subscribe(game => {
          setBoard(game.board)
          setIsGameOver(game.isGameOver)
          setResult(game.result)
          setPosition(game.position)
          setStatus(game.status)
          setGame(game)
        })
      }
    }

    init()
    return () => subscribe && subscribe.unsubscribe()
  }, [id])

  async function copyToClipboard() {
    await navigator.clipboard.writeText(shareLink)
  }
  return (
    <div className="columns app-container ">

      {status === 'waiting' &&
        <div className="column is-one-third">
          <div className="notification is-link share-game">
            <strong>Share this game to continue</strong>
            <br />
            <br />
            <div className="field has-addons">
              <div className="control is-expanded">
                <input type="text" name="" id="" className="input" readOnly value={shareLink} />
              </div>
              <div className="control">
                <button className="button is-info" onClick={copyToClipboard} >Copy</button>
              </div>
            </div>
          </div>
        </div>}
      {isGameOver && <div className="">
        <div class="pyro"><div class="before"></div><div class="after"></div></div></div>}
      <div className={`column ${status !== 'waiting' ? 'is-three-fifths is-offset-one-fifth' : null}`}>
        <div className="columns">
          {isGameOver && <div className="">
            <div class="pyro"><div class="before"></div><div class="after"></div></div></div>}
          <div className={`board-app-container ${isGameOver && 'column is-three-fifths'}`}>
            {game.opponent && game.opponent.name && <span className="tag is-link">{game.opponent.name}</span>}
            <Board board={board} position={position} />
            {game.member && game.member.name && <span className="tag is-link">{game.member.name}</span>}
          </div>
          {isGameOver && <div className="">
            <div class="pyro"><div class="before"></div><div class="after"></div></div></div>}
          <div className={`modal ${isGameOver ? 'is-active' : ''}`}>
            <div className="modal-background"></div>
            <div className="modal-content">
              <div className="card">
                <div className="card-content">
                  <div className="content is-centered">
                    <h1>GAME OVER</h1>
                    <h2>{result}</h2>
                  </div>
                  <span className="card-footer-item pointer"
                    onClick={resetGame}
                  >
                    NEW GAME
                  </span>
                </div>

                <footer className="card-footer">
                </footer>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default GameApp;
