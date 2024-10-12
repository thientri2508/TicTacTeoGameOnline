import React from 'react'
import '../style/Notification.css'

const Ready = ({CountDown, animationClass}) => {
  return (
    <div className='bg-count'>
        <div className={`count-down ${animationClass}`}>{CountDown}</div>
    </div>
  )
}

export default Ready