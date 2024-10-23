const { handleConnection } = require("../features/socketcontroller/messagecontroller");
const { Server: SocketIOServer } = require('socket.io');


let io;


const initializeSocketIO = (server) => {
    io = new SocketIOServer(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    io.on("connection", (socket) => {
        console.log(`Client connected: ${socket.id}`);
              handleConnection(socket);
    });
};




module.exports = {
    initializeSocketIO
};
