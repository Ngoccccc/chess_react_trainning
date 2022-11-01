import * as ChessJS from 'chess.js'
import { BehaviorSubject } from 'rxjs'
const Chess = typeof ChessJS === "function" ? ChessJS : ChessJS.Chess;
const chess = new Chess()

export const gameSubject = new BehaviorSubject({
    board: chess.board()
})

