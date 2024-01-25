const users = [];

const addUser = ({ id, username, room}) => {

  username = username.trim();
  room = room.trim();

  if(!username || !room)  {
    return {
      error: "사용자 이름 또는 방이 필요합니다."
    }
  }

  const user = {id, username, room}
  users.push(user)
  return {user}
}


const getUsersInRoom = (room) => {
  room = room.trim();

  return users.filter(user => user.room === room)
}

const getUser = (id) =>{
  return users.find(user => user.id ===id)
}

const removeUser = (id)=>{
  const index = users.findIndex((user)=> user.id ===id);
  if(index !== -1){
    return users.splice(index, 1)[0];
  }

}

module.exports = {
  addUser,
  getUsersInRoom,
  getUser,
  removeUser
}