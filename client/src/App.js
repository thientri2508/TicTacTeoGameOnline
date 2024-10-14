import React, { useState, useEffect } from 'react'
import io from 'socket.io-client'
import Login from './views/Login';
import Main from './views/Main';

const socket = io('https://tictactoegameonline.onrender.com');
const App = () => {

    const [isLongin, setIslongin] = useState(false)
    const [userID, setUserID] = useState('')

    useEffect(() => {
        socket.on("connect", () => {
            setUserID(socket.id)
        })
      }, []);
    
    if(!isLongin) {
        return (
            <Login socket={socket} setIslongin={setIslongin}></Login>
        )
    } else{
        return (
            <Main socket={socket} userID={userID}></Main>
        )
    }
    
  
}

export default App