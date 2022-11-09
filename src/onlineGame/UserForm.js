import React, { useState } from 'react'
import { auth } from './firebase'
import { signInAnonymously } from 'firebase/auth'
export default function UserForm() {

    const [name, setName] = useState('')
    async function handleSubmit(e) {
        e.preventDefault()
        localStorage.setItem('userName', name)
        await signInAnonymously(auth)
    }
    return (
        <section class="hero is-info is-fullheight">
            <div class="hero-head">
                <nav class="navbar">
                    <div class="container">
                        <div class="navbar-brand">
                            <div class="navbar-item">
                                <h1>CHESS ONLINE</h1>
                            </div>

                        </div>

                    </div>
                </nav>
            </div>

            <div class="hero-body">
                <div class="container has-text-centered">
                    <div class="column is-6 is-offset-3">
                        <h1 class="title">
                            WELCOME TO CHESS ONLINE
                        </h1>
                        <h2 class="subtitle">
                            Thank you for playing the game, now enter your name to get started
                        </h2>
                        <form class="box" onSubmit={handleSubmit}>
                            <div class="field is-grouped">
                                <p class="control is-expanded">
                                    <input class="input" type="text" placeholder="Enter your name" value={name} onChange={e => setName(e.target.value)} />
                                </p>
                                <p class="control">
                                    <button class="button is-info " type="submit">
                                        Start
                                    </button>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

        </section>
    )
}
