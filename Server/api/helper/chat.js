const io = require('socket.io')(8002);
io.on('connection', (socket) => {
    console.log('a user connected');
    
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  
    socket.on('offer', (offer) => {
      socket.broadcast.emit('offer', offer);
    });
  
    socket.on('answer', (answer) => {
      socket.broadcast.emit('answer', answer);
    });
  
    socket.on('ice-candidate', (candidate) => {
      socket.broadcast.emit('ice-candidate', candidate);
    });
  });