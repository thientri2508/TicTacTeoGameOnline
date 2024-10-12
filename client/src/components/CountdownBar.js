import React, { useState, useEffect } from 'react';
import '../style/Match.css'

const styles = {
    usera: {
      border: '1px solid #000',
      width: '200px',
      height: '9px',
      position: 'relative',
      marginTop: '20px'
    },
    useraTime: {
      position: 'absolute',
      top: '-75px',
      left: '80px',
    },
    userb: {
      border: '1px solid #000',
      width: '200px',
      position: 'relative',
      height: '9px',
      marginTop: '20px',
      transform: 'rotate(180deg)'
    },
    userbTime: {
      position: 'absolute',
      top: '25px',
      left: '80px',
      transform: 'rotate(180deg)',
    }
  };

const CountdownBar = ({direct, isRunning, Timeout}) => {
  const totalTime = 15; // Thời gian đếm ngược tổng cộng là 60 giây (1 phút)
  const [timeLeft, setTimeLeft] = useState(totalTime);

    useEffect(() => {
    let interval = null; // Khai báo biến cho interval

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 0.1); // Giảm thời gian mỗi giây
      }, 100);
    } else if (!isRunning && timeLeft !== 0) {
      clearInterval(interval); // Dừng interval khi không chạy
    }

    //if(timeLeft==0 && direct) alert("lose")
    if(timeLeft<=0 && !direct) {
      Timeout()
    }

    return () => clearInterval(interval); // Dọn dẹp interval khi component unmount
  }, [isRunning, timeLeft]);

  // Tính chiều rộng thanh dựa trên phần trăm thời gian còn lại
  const widthPercentage = (timeLeft / totalTime) * 100;

  return (
    <div style={ direct ? styles.usera : styles.userb  }>
      <div className='number' style={ direct ? styles.useraTime : styles.userbTime  }>{timeLeft.toFixed(1) >= 0 ? timeLeft.toFixed(1): '0.0'}</div>
      <div
        style={{
          height: '8px',
          background: 'linear-gradient(to right, #ffa400, #00aefd)',
          borderRadius: '5px',
          width: `${widthPercentage}%`, // Đặt chiều rộng thanh theo tỷ lệ thời gian còn lại
          transition: 'width linear', // Làm mượt quá trình co lại
        }}
      ></div>
    </div>
  );
};

export default CountdownBar;
