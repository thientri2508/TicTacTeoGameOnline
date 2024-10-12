import React, { useState } from 'react'
import '../style/Login.css'

const Login = ({socket, setIslongin}) => {

    const [username, setUsername] = useState('')

    const handleChangeUsername = (event) => {
        setUsername(event.target.value)
    };

    const JoinGame = () =>{
        if (username.trim() !== '') {
            socket.emit('join', username);  // Gửi username lên server
            setIslongin(true)
        }
    }

  return (
    <div className='wrapper'>
        <form onSubmit={JoinGame}>
        <div className='login-form'>
            <input type="text" 
                className="input-field" 
                placeholder="Enter your name" 
                onChange={handleChangeUsername} 
                value={username} required ></input>
            
            <input className='btn-join' type='submit' value='Join'></input>
        </div>
        </form>
    </div>
  )
}

export default Login