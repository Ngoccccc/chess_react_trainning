import React from 'react'
import BoardSquare from './BoardSquare'
export default function Board({ board }) {
    const getXYPosition = (i) => {
        const x = i % 8;
        const y = Math.abs(Math.floor(i / 8 - 7))
        return { x, y }
    }
    const isBlack = (i) => {
        const { x, y } = getXYPosition(i)
        return (x + y) % 2 === 1
    }

    const getPosition = (i) => {
        const { x, y } = getXYPosition(i)
        const letter = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
        const letter2 = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'][x]
        return `${letter[x]}${y + 1}`
    }
    return (
        <div className='board'>
            {board.flat().map((piece, i) => (
                <div key={i} className='square'>
                    <BoardSquare
                        piece={piece}
                        black={isBlack(i)}
                        position={getPosition(i)} />
                </div>
            ))}
        </div>
    )
}
