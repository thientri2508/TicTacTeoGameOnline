import React, { useState, useEffect } from 'react'
import '../style/Match.css'
import XShape from './XShape'
import OShape from './OShape'

const ItemTable = ({handleMouseEnter, 
                    handleMouseLeave, 
                    rowIndex, 
                    colIndex, 
                    value, 
                    setTable, 
                    ShapePlayer, 
                    ActivePlayer, 
                    setActivePlayer,
                    setIsRunningA,
                    setIsRunningB}) => {

    const [isClick, setIsclick] = useState(false)

    let mark
    if(ShapePlayer) mark=(<XShape></XShape>)
    else mark=(<OShape></OShape>)

    const click = () =>{
        if(!isClick&&ActivePlayer) {
            setIsclick(true)
            setActivePlayer(false)
            setIsRunningA(false)
            setIsRunningB(true)
            handleMouseLeave()

            if(ShapePlayer) setTable(rowIndex, colIndex, 1)
            else setTable(rowIndex, colIndex, 2)
        }
    }

    if(value==0){
        return (
            <div className='item-table' onClick={click} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                { isClick ? mark : <></>}
            </div>
        )
    }

    if(value==1){
        return (
            <div className='item-table'>
                <XShape></XShape>
            </div>
        )
    }

    if(value==2){
        return (
            <div className='item-table'>
                <OShape></OShape>
            </div>
        )
    }

//   return (
//     <div className='item-table' onClick={click} id={idItem}>
//         { isClick ? mark : <></>}
//     </div>
//   )
}

export default ItemTable