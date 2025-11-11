const express = require('express');
const socketIO = require('socket.io');
const http = require('http');

// CREATE THE EXPRESS APP
const app = express();

// CREATE HTTP SERVER
const httpServer = http.createServer(app);

// SOCKET.IO SETUP
const io = socketIO(httpServer, {
  cors: {
    origin: ["https://nirajk009.github.io"],
    methods: ["GET", "POST"],
    credentials: true
  }
});

// DEFINE PORT - THIS WAS MISSING!
const port = process.env.PORT || 3000;

// LISTEN ON PORT
httpServer.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});

const connectedSockets = {};

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('clientEvent', (data) => {
    console.log('Received from client:', data);
    socket.emit('serverEvent', { message: 'Hello, client!' });
  });
  
  socket.on('joined_room2', (room1, name) => {
    socket.name = name;
    console.log('Server received joined_room2 event with data:');
    socket.join(room1);
    const room = room1;
    socket.emit('joined', name);
    console.log(name + ' joined room ' + room);
    socket.score = 0;
    const roomClients = io.sockets.adapter.rooms.get(room);
  
    if (roomClients && roomClients.size > 1) {
      console.log('Room has more than one connection');
      
      if (roomClients) {
        const roommates = [];
        roomClients.forEach((clientId) => {
          const clientSocket = io.sockets.sockets.get(clientId);
          roommates.push(clientSocket.name);
        });

        console.log('Roommates in roomName:', roommates);
        socket.broadcast.to(room).emit('p_data', {p1:roommates[0], p2:roommates[1], room_name:room});
        socket.emit('p_data', {p1:roommates[0], p2:roommates[1], room_name:room});
        socket.room69 = room;
      }
    }
    
    if (roomClients.size == 2) {
      connectedSockets[socket.id] = { score: 0 };
      connectedSockets[socket.id+2] = { player: 2 };
      connectedSockets[socket.id+1] = { name: socket.name };
      socket.player = 2;
      socket.score = 0;
      socket.room1 = room;
      socket.emit('2done');
      socket.turn = "0";
      socket.emit('my_turn', socket.turn);
      console.log(socket.turn + " " + socket.name)
    } else {
      socket.room1 = room;
      connectedSockets[socket.id] = { score: 0 };
      connectedSockets[socket.id+2] = { player: 1 };
      connectedSockets[socket.id+1] = { name: socket.name };
      socket.player = 1;
      socket.score = 0;
      socket.turn = "X";
      socket.emit('my_turn', socket.turn);
      console.log(socket.turn + " " + socket.name)
    }
    
    socket.on('whos_turn', data => {
      console.log(data + " ki turn hei");
    })

    socket.on('niraj', (data) => {
      socket.to(room).emit('niraj_cl', data);
      console.log('Received from client:', data);
      console.log(socket.turn + " " + socket.name)
    });  
  });  
  
  socket.on('is_win', (data) => {
    console.log(data + "makiiiiiiiiiiiiiiiiiiiiii")
    if(data === 'xwins'){
      const roomClients = io.sockets.adapter.rooms.get(socket.room1);
      roomClients.forEach((clientId) => {
        const clientSocket = io.sockets.sockets.get(clientId);
        if(clientSocket.player == 1){
          clientSocket.score = (clientSocket.score) + 1;
          console.log(clientSocket.name + "score : " + clientSocket.score);
        }
      });
    } else {
      const roomClients = io.sockets.adapter.rooms.get(socket.room1);
      roomClients.forEach((clientId) => {
        const clientSocket = io.sockets.sockets.get(clientId);
        if(clientSocket.player == 2){
          clientSocket.score = (clientSocket.score) + 1;
          console.log(clientSocket.name + "score : " + clientSocket.score);
        }
      });
    }
  });

  socket.on('is_win2', () => {
    const roomClients2 = io.sockets.adapter.rooms.get(socket.room1);
    const roommates2 = [];
    roomClients2.forEach((clientId) => {
      const clientSocket2 = io.sockets.sockets.get(clientId);
      roommates2.push(clientSocket2.name);
      roommates2.push(clientSocket2.score);
    });
    console.log('Roommates in roomName:', roommates2);
  });

  socket.on('chadar', (data) => {
    const room_c = data.room;
    socket.broadcast.to(room_c).emit('chadar_act');
  })

  socket.on('chadar2', (data) => {
    socket.broadcast.emit('chadar_act2');
  })

  socket.on('reset_karo', (data) => {
    const room_c = data.room;
    socket.broadcast.to(room_c).emit('reset_kare');
  })

  socket.on('going_offline', (data) => {
    const roomxx = data.room;
    socket.broadcast.to(roomxx).emit('offline');
  });

  socket.on('coming_back', (data) => {
    const roomxx = data.room;
    socket.broadcast.to(roomxx).emit('online');
  });

  socket.on('room_set', (data) => {
    socket.room69 = data.room;
  });
  
  socket.on('disconnect', () => {
    console.log('user disconnected' + socket.room69);
    const roper = socket.room69;
    socket.broadcast.to(roper).emit('discon');
  });

  socket.on('msg_gaya', (data) => {
    const roomx = data.roomx;
    const msg_Was = data.msg;
    socket.broadcast.to(roomx).emit('msg_aaya', {msg_is: msg_Was});
    console.log(msg_Was)
  });

  socket.on('typeping', (data) => {
    const roomx = data.room_is;
    socket.broadcast.to(roomx).emit('typeing4u');
  });

  socket.on('typeping_rook', (data) => {
    const roomx = data.room_is;
    socket.broadcast.to(roomx).emit('typeing_gayi');
  });
});
