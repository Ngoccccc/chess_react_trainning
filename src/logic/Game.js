import * as ChessJS from 'chess.js'
import { BehaviorSubject } from 'rxjs'
import { auth } from '../onlineGame/firebase'
import { doc, getDoc } from "firebase/firestore";
const Chess = typeof ChessJS === "function" ? ChessJS : ChessJS.Chess;
const chess = new Chess()

export let gameSubject

export async function initGame(gameRefFb) {
    if (gameRefFb) {
        const initializeGame = await getDoc(gameRefFb)
    }
    else {
        gameSubject = new BehaviorSubject()
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
    const legalMove = chess.move(tempMove)

    if (legalMove) {
        updateGame()
    }

}

export const handleMove = (from, to) => {
    const promotions = chess.moves({ verbose: true }).filter(m => m.promotion)

    if (promotions.some(p => `${p.from}:${p.to}` === `${from}:${to}`)) {
        const pendingPromotion = { from, to, color: promotions[0].color }
        updateGame(pendingPromotion)
    }
    const { pendingPromotion } = gameSubject.getValue()
    if (!pendingPromotion) {
        move(from, to)
    }


}


const updateGame = (pendingPromotion) => {
    console.log(chess)
    const isGameOver = chess.isGameOver()

    const newGame = {
        board: chess.board(),
        pendingPromotion,
        isGameOver,
        turn: chess.turn(),
        result: isGameOver ? getGameResult() : null
    }
    localStorage.setItem('savedGame', chess.fen())
    gameSubject.next(newGame)
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