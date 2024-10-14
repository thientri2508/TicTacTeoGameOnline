const express = require('express')
const app = express()
const server = require('http').createServer(app);
const io = require('socket.io')(server, { cors: { origin: "*", methods: [ "GET", "POST" ]}})

app.use(express.json())

const PORT = process.env.PORT || 5000

server.listen(PORT, () => console.log(`Server started on port ${PORT}`))

let onlineUsers = [];
let waitingUsers = [];

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);
  
    // Khi người dùng join với username
    socket.on('join', (username) => {
      onlineUsers.push({ id: socket.id, username, total: 0, win: 0, lose: 0 });
      socket.emit('updateUserList', onlineUsers);  // Cập nhật danh sách người dùng
      socket.broadcast.emit('updateUserList', onlineUsers);
    });

    socket.on('getUserList', (ms) => {
      socket.emit('updateUserList', onlineUsers);  // Cập nhật danh sách người dùng
      socket.broadcast.emit('updateUserList', onlineUsers);
    });

    socket.on('FindMatch', (userID) => {
      waitingUsers.push(userID); // Thêm user vào danh sách chờ
  
      // Kiểm tra xem có ít nhất 2 user trong danh sách chờ không
      while (waitingUsers.length >= 2) {
        // Lấy 2 user đầu tiên từ hàng chờ
        const user1Id = waitingUsers.shift();
        const user2Id = waitingUsers.shift();

        // Lấy lại đối tượng socket dựa trên socket.id
        const user1 = io.sockets.sockets.get(user1Id);
        const user2 = io.sockets.sockets.get(user2Id);

        if (user1 && user2) {
          // Tạo room cho 2 user
          const roomName = `room/${user1Id}/${user2Id}`;

          // Thêm cả hai vào room
          user1.join(roomName);
          user2.join(roomName);
    
          // Thông báo cho cả hai rằng họ đã tham gia room
          io.to(roomName).emit('roomCreated', roomName);
        }
      }
    });

    socket.on('setMatrix', (roomName, newMatrix, IDPlayer) => {
      const arr = roomName.split("/")
      const nextplayer = arr[1]==IDPlayer ? arr[2] : arr[1]
      io.to(roomName).emit('updateMatrix', newMatrix, nextplayer);
    });

    socket.on('wingame', (roomName, newMatrix, IDPlayer) => {
      const arr = roomName.split("/")
      let userWin, userLose
      if(arr[1]==IDPlayer) {
        userWin=arr[1]
        userLose=arr[2]
      } else if(arr[2]==IDPlayer){
        userWin=arr[2]
        userLose=arr[1]
      }

      onlineUsers = onlineUsers.map(user => {
        if (user.id === userWin) {
          return {
            ...user,  
            total: user.total+1,
            win: user.win+1
          };
        }
        if (user.id === userLose) {
          return {
            ...user,  
            total: user.total+1,
            lose: user.lose+1
          };
        }
        return user; 
      });
      io.to(roomName).emit('endgame', newMatrix, IDPlayer);
    });

    socket.on('timeout', (roomName, IDPlayer) => {
      const arr = roomName.split("/")
      let userWin, userLose
      if(arr[1]==IDPlayer) {
        userWin=arr[1]
        userLose=arr[2]
      } else if(arr[2]==IDPlayer){
        userWin=arr[2]
        userLose=arr[1]
      }

      onlineUsers = onlineUsers.map(user => {
        if (user.id === userWin) {
          return {
            ...user,  
            total: user.total+1,
            win: user.win+1
          };
        }
        if (user.id === userLose) {
          return {
            ...user,  
            total: user.total+1,
            lose: user.lose+1
          };
        }
        return user; 
      });
      io.to(roomName).emit('endgame-timeout', IDPlayer);
    });

    socket.on('drawgame', (roomName) => {
      const arr = roomName.split("/")
      onlineUsers = onlineUsers.map(user => {
        if (user.id === arr[1] || user.id === arr[2]) {
          return {
            ...user,  
            total: user.total+1
          };
        }
        return user; 
      });
    });

    socket.on('leaveRoom', (roomName) => {
      // Xóa socket khỏi room
      socket.leave(roomName);
    });
  
    //Khi người dùng ngắt kết nối
    socket.on('disconnect', () => {
      onlineUsers = onlineUsers.filter(user => user.id !== socket.id);
      socket.emit('updateUserList', onlineUsers);  // Cập nhật danh sách người dùng
      socket.broadcast.emit('updateUserList', onlineUsers);
    });
  });