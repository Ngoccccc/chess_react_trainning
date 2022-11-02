import React from 'react'
import Square from './Square'
import Piece from './Piece'
import { useDrop } from 'react-dnd'
import { handleMove } from './Game'

export default function BoardSquare({ piece, black, position }) {
    const [, drop] = useDrop(() => {
        return {
            accept: 'piece',
            drop: (item) => {
                const [fromPosition] = item.id.split('_')
                console.log(item.id.split('_'));
                handleMove(fromPosition, position)
            }
        }
    })

    return (
        <div className="board-square" ref={drop}>
            <Square black={black} >
                {piece && <Piece piece={piece} position={position} />}
            </Square>
        </div>
    )
}
