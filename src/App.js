import React from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useAuthState } from 'react-firebase-hooks/auth'
import UserForm from './onlineGame/UserForm'
import { auth } from './onlineGame/firebase'
import Home from './onlineGame/Home'
import GameApp from './logic/GameApp'
export default function App() {

    const [user, loading, error] = useAuthState(auth)


    if (loading) {
        return <h1>Loading</h1>
    }

    if (!user) {
        return <UserForm />
    }
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/game/:id" element={<GameApp />} />
        </Routes>
    )

}
