import React from 'react'
import '../style/Loading.css'

const Loading = () => {
  return (
    <div className='bg-loading'>
        <div className='loading'>
            <div>waiting for opponent...</div>
            <div class="spinner">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
        
    </div>
  )
}

export default Loading