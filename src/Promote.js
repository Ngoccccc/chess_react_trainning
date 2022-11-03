import React from 'react'
import { move } from './Game'
const promotionPieces = ['r', 'n', 'b', 'q']
export default function Promote({ promotion: { from, to, color } }) {
    return (
        <div className="board">{promotionPieces.map((p, i) => (
            <div key={i} className='promote-square'>
                <div className='piece-container' onClick={() => move(from, to, p)}>
                    <img src={require(`./assets/${p}_${color}.png`)}
                        className='piece' />
                </div>
            </div>
        ))}</div>
    )
}
