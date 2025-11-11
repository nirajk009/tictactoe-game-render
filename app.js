const express = require('express');
// const morgan = require('morgan');
const socketIO = require('socket.io');

const httpServer = require("http").createServer(express);

const io = socketIO(httpServer, {
  cors: {
    origin: [
      "https://nirajk009.github.io",
      "http://localhost:5173",
      "http://127.0.0.1:5173"
    ],
    methods: ["GET", "POST"],
    credentials: true
  }
});




httpServer.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});
console.log("app is working fine");

// const app = express();
// const port = 3000;
// app.use(morgan('tiny'));


const connectedSockets = {};

// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });

io.on('connection', (socket) => {
  console.log('A user connected');

  // Listen for 'clientEvent' from the client
  socket.on('clientEvent', (data) => {
    console.log('Received from client:', data);
    // Sending a response back to the client
    socket.emit('serverEvent', { message: 'Hello, client! teri ma randi' });
  });
    //room

  socket.on('joined_room2', (room1,name) => {

    // Associate the name with the socket ID or any identifier you want
    socket.name = name;

    // Get all clients in 'roomName' and their names



    console.log('Server received joined_room2 event with data:');
    socket.join(room1);
    const room = room1;
    socket.emit('joined', name);
    console.log(name + ' joined room ' + room);
        socket.score=0;
 const roomClients = io.sockets.adapter.rooms.get(room);
  
  if (roomClients && roomClients.size > 1) {

    console.log('Room has more than one connection');

    
    const roomClients = io.sockets.adapter.rooms.get(room);

    if (roomClients) {
      // Extract names of all roommates
      const roommates = [];
      roomClients.forEach((clientId) => {
        const clientSocket = io.sockets.sockets.get(clientId);
            socket.score=0;
        roommates.push(clientSocket.name);
        //socket.score=0;
      
     // Assuming the name is stored as 'name'
      });

      console.log('Roommates in roomName:', roommates);
           socket.broadcast.to(room).emit('p_data', {p1:roommates[0],p2:roommates[1],room_name:room});
      socket.emit('p_data', {p1:roommates[0],p2:roommates[1],room_name:room});
      socket.room69=room;
    }

  }
if (roomClients.size==2) {
id2=socket.id;
  connectedSockets[socket.id] = { score: 0 };
    connectedSockets[socket.id+2] = { player: 2 };
    connectedSockets[socket.id+1] = { name: socket.name };
socket.player=2;
socket.score=0;
socket.room1=room;
  socket.emit('2done');
  socket.turn="0";
  socket.emit('my_turn',socket.turn);
   console.log(socket.turn+" "+socket.name)
}else{
  id1=socket.id;
socket.room1=room;
  connectedSockets[socket.id] = { score: 0 };
    connectedSockets[socket.id+2] = { player: 1 };
    connectedSockets[socket.id+1] = { name: socket.name };
socket.player=1;
socket.score=0;
socket.turn="X";
  socket.emit('my_turn',socket.turn);
  console.log(socket.turn+" "+socket.name)
}
    

socket.on('whos_turn',data=>{
console.log(data+" ki turn hei");
})


socket.on('niraj',(data)=>{
	socket.to(room).emit('niraj_cl',data);
   console.log('Received from client:', data);
 console.log(socket.turn+" "+socket.name)

});  
 });  
    socket.on('is_win',(data)=>{
      console.log(data+"makiiiiiiiiiiiiiiiiiiiiii")
if(data==='xwins'){
    const roomClients = io.sockets.adapter.rooms.get(socket.room1);

    roomClients.forEach((clientId) => {
        const clientSocket = io.sockets.sockets.get(clientId);
           if(clientSocket.player==1){
            clientSocket.score=(clientSocket.score)+1;
            console.log(clientSocket.name+"score : "+clientSocket.score);
           }});

}else{
    const roomClients = io.sockets.adapter.rooms.get(socket.room1);

    roomClients.forEach((clientId) => {
        const clientSocket = io.sockets.sockets.get(clientId);
           if(clientSocket.player==2){
            clientSocket.score=(clientSocket.score)+1;
            console.log(clientSocket.name+"score : "+clientSocket.score);
           }
        
      
      
     // Assuming the name is stored as 'name'
      });
}

    });

socket.on('is_win2',()=>{
 const roomClients2 = io.sockets.adapter.rooms.get(socket.room1);
   // Extract names of all roommates
      const roommates2 = [];
      roomClients2.forEach((clientId) => {
        const clientSocket2 = io.sockets.sockets.get(clientId);
            socket.score=0;
        roommates2.push(clientSocket2.name);
                roommates2.push(clientSocket2.score);

        //socket.score=0;
         // Assuming the name is stored as 'name'
      });
 console.log('Roommates in roomName:', roommates2);
  });

socket.on('chadar',(data)=>{
room_c=data.room;
   socket.broadcast.to(room_c).emit('chadar_act');
})

socket.on('chadar2',(data)=>{
   socket.broadcast.emit('chadar_act2');
})

socket.on('reset_karo',(data)=>{
  room_c=data.room;
   socket.broadcast.to(room_c).emit('reset_kare');
})
// solve above


socket.on('going_offline',(data)=>{
roomxx=data.room;
//console.log("nega te tala ta"+roomxx);
  socket.broadcast.to(roomxx).emit('offline');
});

socket.on('coming_back',(data)=>{
roomxx=data.room;
//console.log("nega te tala ta2"+roomxx);
  socket.broadcast.to(roomxx).emit('online');
});

socket.on('room_set',(data)=>{
socket.room69=data.room;
});
 socket.on('disconnect', () => {
    console.log('user disconnected'+socket.room69);
    roper=socket.room69;
   socket.broadcast.to(roper).emit('discon');
  });

///chat

socket.on('msg_gaya',(data)=>{
	roomx=data.roomx;
    msg_Was=data.msg;
socket.broadcast.to(roomx).emit('msg_aaya',{msg_is:msg_Was});
console.log(msg_Was)
  });

socket.on('typeping',(data)=>{
	roomx=data.room_is;
socket.broadcast.to(roomx).emit('typeing4u');
console.log("nigggggggggggggggggga");
  });

socket.on('typeping_rook',(data)=>{
	roomx=data.room_is;
socket.broadcast.to(roomx).emit('typeing_gayi');
  console.log("nigggggggggggggggggga 22222222222");
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });



});


