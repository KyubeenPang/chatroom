const express = require('express')

const app = express()
const path = require('path');

//express 와 socket.io 서버를 연동하는 방법
const http = require('http')
const { Server } = require('socket.io') 
const server = http.createServer(app);
const io = new Server(server);

const { generateMessage } = require('./util/messages');
const { addUser, getUsersInRoom, getUser, removeUser } = require('./util/users');


io.on('connection', (socket) =>{

  console.log('socket', socket.id);

  socket.on('join', (options, cb)=>{
    const { error, user } = addUser({id: socket.id, ...options});

    if(error) {
      return cb(error);
    }

    socket.join(user.room);

    socket.emit('message', generateMessage('Admin', `${user.room} 에 오신 걸 환영합니다.` ))

    socket.broadcast.to(user.room).emit('message', generateMessage('Admin', `앗 야생의 ${user.username}가 튀어나왔다!`))

    io.to(user.room).emit('roomData', {
      room: user.room,
      users: getUsersInRoom(user.room)
    })
  })


  socket.on('sendMessage', (message, cb)=>{
    const user = getUser(socket.id)

    io.to(user.room).emit('message', generateMessage(user.username,message))
    cb();
  })


  socket.on('disconnect', ()=>{

    console.log('socket disconnected', socket.id)
    const user = removeUser(socket.id);

    if(user){
      io.to(user.room).emit('message', generateMessage('Admin', `${user.username}님이 방을 나갔습니다.`))
      io.to(user.room),emit('roomData', {
        room: user.room,
        users: getUsersInRoom(user.room)
      })
    }
  })



})



app.use(express.static(path.join(__dirname, '../public')))

const port = 4000;
server.listen(port, ()=>{ 
  console.log(`listening on port ${port}`);
})