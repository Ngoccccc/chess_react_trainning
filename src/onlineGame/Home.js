import React, { useState } from 'react'
import { auth, db } from './firebase'
import { ref, set, push } from "firebase/database";
import { useNavigate } from 'react-router-dom'

export default function Home() {
    const [showModal, setShowModal] = useState(false)
    const { currentUser } = auth
    const navigate = useNavigate()

    const newGameOptions = [
        { label: 'Black pieces', value: 'b' },
        { label: 'White pieces', value: 'w' },
        { label: 'Random', value: 'r' },
    ]
    const handleOnline = () => {
        setShowModal(true)
    }

    async function startOnlineGame(startingPiece) {
        const member = {
            uid: currentUser.uid,
            piece: startingPiece === 'r' ? ['b', 'w'][Math.round(Math.random())] : startingPiece,
            name: localStorage.getItem('username'),
            creator: true
        }
        const game = {
            status: 'waiting',
            members: [member],
            gameId: `${Math.random().toString(36).substring(2, 9)}_${Date.now()}`
        }

        await set(ref(db, 'games/' + game.gameId), game)
        navigate(`/game/${game.gameId}`)
    }
    return (
        <>

            <div className="home">
                <div className="columns is-flex is-vcentered has-text-centered has-background-primary home-column is-overlay">
                    <div className="column is-half">
                        <button className="button is-link ">
                            Play Locally
                        </button>
                    </div>
                    <div className="column ">
                        <button className="button is-link" onClick={handleOnline}
                        >
                            Play Online
                        </button>
                    </div>
                </div>
            </div>

            <div className={`modal ${showModal ? 'is-active' : ''}`}>
                <div className="modal-background"></div>
                <div className="modal-content">
                    <div className="card">
                        <div className="card-content">
                            <div className="content">
                                Please Select the piece you want to start
                            </div>

                        </div>
                        <footer className="card-footer">
                            {newGameOptions.map(({ label, value }) => (
                                <span className="card-footer-item pointer" key={value}
                                    onClick={() => startOnlineGame(value)}
                                >
                                    {label}
                                </span>
                            ))}
                        </footer>
                    </div>
                </div>
                <button className="modal-close is-large" onClick={() => setShowModal(false)} ></button>
            </div>
        </>
    )
}
