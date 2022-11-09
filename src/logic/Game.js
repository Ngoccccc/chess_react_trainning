import * as ChessJS from 'chess.js'
import { BehaviorSubject } from 'rxjs'
import { auth, db } from '../onlineGame/firebase'

import { update, ref, onValue } from 'firebase/database';
const Chess = typeof ChessJS === "function" ? ChessJS : ChessJS.Chess;

let gameRef
let member
let newGame
const chess = new Chess()
const gameSubject = new BehaviorSubject()


export async function initGame(gameRefFb) {
    const { currentUser } = auth

    if (gameRefFb) {
        gameRef = gameRefFb
        const initializeGame = await gameRefFb.then((doc) => doc.val())

        if (!initializeGame) {
            return "not found"
        }

        const creator = initializeGame.members.find(m => m.creator === true)
        if (initializeGame.status === 'waiting' && creator.uid !== currentUser.uid) {
            const currUser = {
                uid: currentUser.uid,
                name: localStorage.getItem('userName'),
                piece: creator.piece === 'w' ? 'b' : 'w'
            }
            const updatedMembers = [...initializeGame.members, currUser]
            await update(ref(db, 'games/' + initializeGame.gameId), {
                members: updatedMembers, status: 'ready'
            })
        }
        else if (!initializeGame.members.map(m => m.uid).includes(currentUser.uid)) {
            return 'intruder'
        }
        updateGame()
        const savedGame = localStorage.getItem('savedGame')
        if (savedGame) {
            chess.load(savedGame)
        }
    }


    else {
        gameRef = null

        const savedGame = localStorage.getItem('savedGame')
        if (savedGame) {
            chess.load(savedGame)
        }
        updateGame()
    }
}

export const resetGame = () => {

    chess.reset()
    updateGame()

}


export const move = (from, to, promotion) => {
    const tempMove = { from, to }
    if (promotion) {
        tempMove.promotion = promotion
    }
    if (gameRef) {
        if (member.piece === chess.turn()) {
            const legalMove = chess.move(tempMove)
            if (legalMove) {
                updateGame()
            }
        }
    }
    else {
        const legalMove = chess.move(tempMove)
        if (legalMove) {
            updateGame()
        }
    }

}

export const handleMove = (from, to) => {
    const promotions = chess.moves({ verbose: true }).filter(m => m.promotion)
    let pendingPromotion
    if (promotions.some(p => `${p.from}:${p.to}` === `${from}:${to}`)) {
        pendingPromotion = { from, to, color: promotions[0].color }
        updateGame(pendingPromotion)
    }

    if (!pendingPromotion) {
        move(from, to)
    }


}


async function updateGame(pendingPromotion) {
    const { currentUser } = auth
    const isGameOver = chess.isGameOver()

    if (gameRef) {
        const initializeGame = await gameRef.then((doc) => doc.val())
        await update(ref(db, 'games/' + initializeGame.gameId), { gameData: chess.fen(), pendingPromotion: pendingPromotion || null })

        onValue(ref(db, 'games/' + initializeGame.gameId), snapshot => {
            const game = snapshot.val()
            const { pendingPromotion, gameData, ...restOfGame } = game
            member = game.members.find(m => m.uid === currentUser.uid)
            console.log(member)
            const opponent = game.members.find(m => m.uid !== currentUser.uid)
            if (gameData) {
                chess.load(gameData)
            }
            const isGameOver = chess.isGameOver()
            newGame = {
                board: chess.board(),
                pendingPromotion,
                isGameOver,
                position: member.piece,
                member,
                opponent,
                result: isGameOver ? getGameResult() : null,
                ...restOfGame
            }
            gameSubject.next(newGame)
        }
        )
        localStorage.setItem('savedGame', chess.fen())

    }
    else {
        newGame = {
            board: chess.board(),
            pendingPromotion,
            isGameOver,
            position: chess.turn(),
            result: isGameOver ? getGameResult() : null
        }
        localStorage.setItem('savedGame', chess.fen())
        gameSubject.next(newGame)
    }
}

function getGameResult() {
    if (chess.isCheckmate()) {
        const winner = chess.turn() === "w" ? 'BLACK' : 'WHITE'
        console.log('game over')
        return `CHECKMATE - WINNER - ${winner}`
    } else if (chess.isDraw()) {
        let reason = '50 - MOVES - RULE'
        if (chess.isStalemate()) {
            reason = 'STALEMATE'
        } else if (chess.isThreefoldRepetition()) {
            reason = 'REPETITION'
        } else if (chess.isInsufficientMaterial()) {
            reason = "INSUFFICIENT MATERIAL"
        }
        return `DRAW - ${reason}`
    } else {
        return 'UNKNOWN REASON'
    }
}

export { gameSubject, newGame }