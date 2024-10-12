import React, { useEffect, useState } from 'react'
import '../style/Main.css'
import Match from './Match'
import Loading from '../components/Loading'

const Main = ({socket, userID}) => {
    const [onlineUsers, setOnlineUsers] = useState([])
    const [Isplaying, setIsplaying] = useState(false)
    const [isLoading, setIsloading] = useState(false)
    const [room, setRoom] = useState([])
    const [me, setMe] = useState({ id: '', username: '', total: 0, win: 0, lose: 0})
    const [flag, setFlag] = useState(true)

    const winRate = me.total > 0 ? (me.win / me.total) * 100 : 0
    const formattedWinRate = `${winRate.toFixed(2)}%`

    useEffect(() => {

      // Nhận danh sách người dùng trực tuyến từ server
      socket.on('updateUserList', (users) => {
        setOnlineUsers(users)
      });

      socket.on('roomCreated', (roomName) => {
            const arr = roomName.split("/")
            setRoom(arr)
            setIsplaying(true)
            setIsloading(false)
      });
  
    }, []);

    useEffect(() => {

        if(onlineUsers.length>0 && flag){
            getUser()
            setFlag(false)
        }
    
    }, [onlineUsers]);

    const getUser = () => {
        const user = onlineUsers.find(item => item.id==userID)
        setMe(user)
    }

    const FindMatch = () => {
        if (userID) {
            socket.emit('FindMatch', userID)
            setIsloading(true)
        }
    }

    if(Isplaying) {return (<Match room={room} me={me} setMe={setMe} userID={userID} socket={socket} onlineUsers={onlineUsers} setIsplaying={setIsplaying} FindMatch={FindMatch}></Match>)}
    else {
        return (
        <div className='main'>
             { isLoading ? (<Loading></Loading>) : (<></>) }
            <div className='main-left'>
                <h1 className='text-title'>Online Tictactoe</h1>
                <p className='text-name'>Wassup, {me.username}!</p>
                <button className='find-match' onClick={FindMatch}><span className="glow-text">Find Match</span></button>
            </div>
            <div className='main-right'>
                <div className='online-player'>{onlineUsers.length} Online Players</div>
                <div className='statistical'>
                    <div className='statistical-item'>
                        <div className='statistical-item-title'>Total Match</div>
                        <div className='statistical-item-count'>{me.total}</div>
                    </div>
                    <div className='statistical-item'>
                        <div className='statistical-item-title'>Win Rate</div>
                        <div className='statistical-item-count'>{formattedWinRate}</div>
                    </div>
                    <div className='statistical-item'>
                        <div className='statistical-item-title'>Win</div>
                        <div className='statistical-item-count'>{me.win}</div>
                    </div>
                    <div className='statistical-item'>
                        <div className='statistical-item-title'>Lose</div>
                        <div className='statistical-item-count'>{me.lose}</div>
                    </div>
                </div>
            </div>
        </div>
        )
    }
}

export default Main