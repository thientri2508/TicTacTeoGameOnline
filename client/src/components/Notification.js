import React from 'react'
import '../style/Notification.css'
import retry from '../assets/retry.png'
import win from '../assets/win.png'
import lose from '../assets/lose.png'
import draw from '../assets/draw.png'

const Notification = ({message, LeaveRoom, PlayAgain}) => {

  return (
    <div className='bg'>
        <div className='notification'>
            <div className='ms'>
                <div className='outline'>{ message == 'You Win!' ? (<img src={win}></img>) : 
                        message == 'You Lose!' ? <img src={lose}></img> 
                        : <img src={draw} className='draw-icon'></img>}</div>
                <div className='message'>{message}</div>
            </div>
            <div className='option'>
                <div className='exit' onClick={LeaveRoom}>
                    <div className='exit-shape'></div>
                </div>
                <div className='again' onClick={PlayAgain}>
                    <img src={retry} className='again-icon'></img>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Notification