import * as ChessJS from 'chess.js'
import { BehaviorSubject } from 'rxjs'
const Chess = typeof ChessJS === "function" ? ChessJS : ChessJS.Chess;
const chess = new Chess()
console.log(chess.board())
export const gameSubject = new BehaviorSubject({
    board: chess.board()
})

export const initGame = () => {
    updateGame()
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
    console.log(legalMove);
    if (legalMove) {
        updateGame()
    }
}

export const handleMove = (from, to) => {
    const promotions = chess.moves({ verbose: true }).filter(m => m.promotion)
    console.log(promotions)
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
    const isGameIsOver = chess.isGameOver()
    console.log(isGameIsOver)
    const newGame = {
        board: chess.board(),
        pendingPromotion,
        isGameIsOver,
        result: isGameIsOver ? getGameResult() : null
    }
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