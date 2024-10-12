import React, { useState, useEffect } from 'react'
import '../style/Match.css'
import ItemTable from '../components/ItemTable'
import Notification from '../components/Notification'
import Ready from '../components/Ready'
import CountdownBar from '../components/CountdownBar'

const Match = ({room, me, setMe, userID, socket, onlineUsers, setIsplaying, FindMatch}) => {

  const [competitor, setCompetitor] = useState({ id: '', username: ''})
  const [ActivePlayer, setActivePlayer] = useState()
  const [ShapePlayer, setShapePlayer] = useState()
  const [openNotifi, setOpenNotifi] = useState(false)
  const [message, setMessage] = useState('')
  const [FocusPlayer1, setFocusPlayer1] = useState('light')
  const [FocusPlayer2, setFocusPlayer2] = useState('light')
  const [CountDown, setCountDown] = useState(3)
  const [isCounting, setIsCounting] = useState(false)
  const [animationClass, setAnimationClass] = useState('')
  const [isRunningA, setIsRunningA] = useState(false)
  const [isRunningB, setIsRunningB] = useState(false)

  const [matrix, setMatrix] = useState([
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]  
  ])

  const [hovered, setHovered] = useState({ x: 10, y: 10, visible: false });

  // Hàm xử lý khi hover vào phần tử con
  const handleMouseEnter = (event) => {
    const rect = event.target.getBoundingClientRect(); // Lấy vị trí của thẻ con
    setHovered({
      x: rect.left + rect.width / 2, // Tọa độ X căn giữa
      y: rect.top + rect.height / 2,  // Tọa độ Y căn giữa
      visible: true, // Hiển thị dấu X
    });
  };

  // Hàm xử lý khi rời khỏi phần tử con
  const handleMouseLeave = () => {
    setHovered({ ...hovered, visible: false }); // Ẩn dấu X
  };

  const setTable = (row, col, val) => {
    const roomName = room.join('/')
    const newMatrix = matrix.map(row => [...row])
    newMatrix[row][col] = val
    if(checkWin(row, col, val)) {
      socket.emit('wingame', roomName, newMatrix, me.id)
    } else socket.emit('setMatrix', roomName, newMatrix, me.id)
  }

  const LeaveRoom = () => {
    const roomName = room.join('/')
    socket.emit('leaveRoom', roomName)
    setMatrix([
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0]  
    ])
    setIsplaying(false)
  }
  
  const Timeout = () => {
    const roomName = room.join('/')
    socket.emit('timeout', roomName, userID)
  }

  const PlayAgain = () => {
    LeaveRoom()
    FindMatch()
  }

  const checkWin = (rowIndex, colIndex, value) => {
    //kiem tra huong doc
    let check = 1
    for(let i=rowIndex-1; i>=0; i--) {
        if(matrix[i][colIndex]==value) check++
    }
    for(let i=rowIndex+1; i<=2; i++) {
        if(matrix[i][colIndex]==value) check++
    }
    if(check==3) return true

    //kiem tra huong ngang
    check = 1
    for(let j=colIndex-1; j>=0; j--) {
        if(matrix[rowIndex][j]==value) check++
    }
    for(let j=colIndex+1; j<=2; j++) {
        if(matrix[rowIndex][j]==value) check++
    }
    if(check==3) return true

    //kiem tra huong xien trai
    check = 1
    let i=rowIndex-1, j=colIndex-1
    while(i>=0 && j>=0){
        if(matrix[i][j]==value) check++
        i--;
        j--;
    }
    i=rowIndex+1; j=colIndex+1
    while(i<=2 && j<=2){
        if(matrix[i][j]==value) check++
        i++;
        j++;
    }
    if(check==3) return true

    //kiem tra huong xien phai
    check = 1
    i=rowIndex-1; j=colIndex+1
    while(i>=0 && j<=2){
        if(matrix[i][j]==value) check++
        i--;
        j++;
    }
    i=rowIndex+1; j=colIndex-1
    while(i<=2 && j>=0){
        if(matrix[i][j]==value) check++
        i++;
        j--;
    }
    if(check==3) return true

    return false
  } 

  useEffect(() => {
    getCompetitor();
    setCountDown(3)
    setIsCounting(true)
    setAnimationClass('scale-effect')
  
    const handleUpdateMatrix = (newMatrix, nextplayer) => {
      setMatrix(newMatrix)
      const checkDraw = newMatrix.flat().some(element => element === 0)
      if(!checkDraw) {
        const roomName = room.join('/')
        socket.emit('drawgame', roomName)
        handleDrawgame()
      }else if (me.id == nextplayer) {
        setActivePlayer(true);
        setIsRunningA(true)
        setIsRunningB(false)
      }
    };
  
    const handleEndgame = (newMatrix, IDPlayer) => {
      setMatrix(newMatrix);
      if (me.id == IDPlayer) {
        setMe(prevUser => ({
          ...prevUser,
          total: prevUser.total + 1,
          win: prevUser.win + 1
        }));
        setMessage('You Win!');
      } else {
        setMe(prevUser => ({
          ...prevUser,
          total: prevUser.total + 1,
          lose: prevUser.lose + 1
        }));
        setMessage('You Lose!');
      }
      setOpenNotifi(true);
      setIsRunningA(false)
      setIsRunningB(false)
    };

    const handleEndgameTimeout = (IDPlayer) => {
      if (me.id == IDPlayer) {
        setMe(prevUser => ({
          ...prevUser,
          total: prevUser.total + 1,
          win: prevUser.win + 1
        }));
        setMessage('You Win!');
      } else {
        setMe(prevUser => ({
          ...prevUser,
          total: prevUser.total + 1,
          lose: prevUser.lose + 1
        }));
        setMessage('You Lose!');
      }
      setOpenNotifi(true)
    }    
  
    // Đăng ký sự kiện socket
    socket.on('updateMatrix', handleUpdateMatrix);
    socket.on('endgame', handleEndgame);
    socket.on('endgame-timeout', handleEndgameTimeout)
    
  
    // Cleanup: hủy đăng ký sự kiện khi component unmount
    return () => {
      socket.off('updateMatrix', handleUpdateMatrix);
      socket.off('endgame', handleEndgame);
      socket.off('endgame-timeout', handleEndgameTimeout)
    };
  }, []);

  const handleDrawgame = () => {
    setMe(prevUser => ({
      ...prevUser,
      total: prevUser.total + 1
    }));
    setMessage('You Draw!');
    setOpenNotifi(true);
    setIsRunningA(false)
    setIsRunningB(false)
  };

  useEffect(() => {
    if(ActivePlayer) {
      setFocusPlayer1('light')
      setFocusPlayer2('dark')
    } else {
      setFocusPlayer2('light')
      setFocusPlayer1('dark')
    }
  }, [ActivePlayer]);

  useEffect(() => {
    let timer;
    if (isCounting && CountDown > 0) {
      timer = setInterval(() => {
        setCountDown((prevCount) => prevCount - 1);
        setAnimationClass('scale-effect');
      }, 1000);
    } else if (CountDown === 0) {
      setIsCounting(false); 
      if(room[1]==userID) {
        setIsRunningA(true)
        setIsRunningB(false)
      } else{
        if(!ActivePlayer) {
          setIsRunningA(false)
          setIsRunningB(true)
        }
      }
    }

    return () => clearInterval(timer);
  }, [isCounting, CountDown]);

  useEffect(() => {
    if (animationClass) {
      const timer = setTimeout(() => {
        setAnimationClass('');
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [animationClass]);

  const getCompetitor = () => {
    let id
    if(room[1]==userID) {
      id=room[2]
      setShapePlayer(true)
      setActivePlayer(true)
    }
    else if(room[2]==userID) {
      id=room[1]
      setShapePlayer(false)
      setActivePlayer(false)
    }

    const user = onlineUsers.find(item => item.id==id)
    setCompetitor(user)
  }

  return (
    <div className='container'>
      { isCounting && (<Ready CountDown={CountDown} animationClass={animationClass}></Ready>)}
      { openNotifi && (<Notification message={message} LeaveRoom={LeaveRoom} PlayAgain={PlayAgain}></Notification>)}
      <div className='header'>
        <div className={FocusPlayer1}>
          { room[1]==userID ? <div className='x-shape'></div> : <div className='o-shape'></div> }
          <CountdownBar direct={true} isRunning={isRunningA} Timeout={Timeout} ></CountdownBar>
          <h4 style={{marginTop: '10px', marginLeft: '10px'}}>{me.username}</h4>
        </div>
        <div className={FocusPlayer2} style={{display: 'flex', alignItems: 'end', flexDirection: 'column'}}>
          { room[1]!=userID ? <div className='x-shape'></div> : <div className='o-shape'></div> }
          <CountdownBar direct={false} isRunning={isRunningB} Timeout={Timeout} ></CountdownBar>
          <h4 style={{marginTop: '10px', marginRight: '10px'}}>{competitor.username}</h4>
        </div>
      </div>

      <div id='table'>
            {
                // Duyệt qua từng hàng của mảng
                matrix.map((row, rowIndex) => (
                row.map((cell, colIndex) => (
                    <ItemTable
                    handleMouseEnter={handleMouseEnter} 
                    handleMouseLeave={handleMouseLeave}
                    key={`${rowIndex}-${colIndex}`}
                    rowIndex={rowIndex}   // Truyền vị trí hàng
                    colIndex={colIndex}   // Truyền vị trí cột
                    value={matrix[rowIndex][colIndex]}
                    setTable={setTable}
                    ShapePlayer={ShapePlayer}
                    ActivePlayer={ActivePlayer}
                    setActivePlayer={setActivePlayer}
                    setIsRunningA={setIsRunningA}
                    setIsRunningB={setIsRunningB}
                    />
                ))
                ))
            }
            {hovered.visible && (
              ShapePlayer ? (
                <div
                  className="cross-x"
                  style={{ top: `${hovered.y-15}px`, left: `${hovered.x}px` }}
                ></div>
              ) : (
                <div
                  className="cross-o"
                  style={{ top: `${hovered.y-60}px`, left: `${hovered.x-60}px` }}
                ></div>
              )
            )}       
            </div>

    </div>
  )
}

export default Match