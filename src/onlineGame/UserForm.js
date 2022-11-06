import React, { useState } from 'react'
import { auth } from './firebase'
import { signInAnonymously } from 'firebase/auth'
export default function UserForm() {

    const [name, setName] = useState('')
    async function handleSubmit(e) {
        e.preventDefault()
        localStorage.setItem('username', name)
        await signInAnonymously(auth)

    }
    return (
        <form className="user-form" onSubmit={handleSubmit}>
            <h1>Enter username</h1>
            <br />
            <div className="field">
                <p className="control">
                    <input type="text" className="input" value={name} onChange={e => setName(e.target.value)} />
                </p>
                <p>
                    <button type="submit" className="button is-success">Start</button>
                </p>
            </div>
        </form>
    )
}
