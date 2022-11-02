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

export const move = (from, to) => {
    const legalMove = chess.move({ from, to })
    console.log(legalMove);
    if (legalMove) {
        console.log(chess.board())
        gameSubject.next({ board: chess.board() })
    }
}

export const handleMove = (from, to) => {
    const promotions = chess.moves({ verbose: true }).filter(m => m.promotion)
    console.log(promotions)
    if (promotions.some(p => `${p.from}:${p.to}` === `${from}:${to}`)) {
        console.log("the user going to promot")
    }
    move(from, to)
}


const updateGame = () => {
    const newGame = {
        board: chess.board()
    }
    gameSubject.next(newGame)
}