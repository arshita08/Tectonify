require('dotenv').config({
  path: `./env-files/${process.env.NODE_ENV || 'development'}.env`,
});

const debug = require('debug')('express:www');
const express = require('express');
const fs = require('fs');
const http = require('http');
const app = require('../app');
const cors = require('cors');
const logger = require('../logger');
const { HTTP_HOST, PORT } = process.env;
const { Server: SocketIOServer } = require('socket.io');
const { initializeSocketIO, isSocketConnected } = require('./socketserverhandle');



// Create HTTP server
const options = {
  //  key: fs.readFileSync('/etc/nginx/ssl-certificates/api.tectonify.com.key'),
  //  cert: fs.readFileSync('/etc/nginx/ssl-certificates/api.tectonify.com.crt')
};
const server = http.createServer(app);

const wsOptions = {
  // key: fs.readFileSync('/etc/nginx/ssl-certificates/api.tectonify.com.key'),
  // cert: fs.readFileSync('/etc/nginx/ssl-certificates/api.tectonify.com.crt')
};
// Setup WebSocket server
// const setupWebSocketServer = (server) => {
//   try {
//     const io = new SocketIOServer(server, {
//       cors: {
//         origin: "*",
//         methods: ["GET", "POST"]
//       }
//     });

//     io.on("connection", (socket) => {
//       console.log(`New connection: ${socket.id}`); 
//       handleConnection(socket);
//     });

//     console.log("Socket.io server is running over HTTPS");
//   } catch (error) {
//     console.error("Error setting up Socket.io server:", error);
//   }
// };

// Setup the WebSocket server
const wsServer = http.createServer(wsOptions);
initializeSocketIO(wsServer);

// Start the WebSocket server
const WS_PORT =  3002;
wsServer.listen(WS_PORT, () => {
  console.log(`WebSocket server is running on http://localhost:${WS_PORT}`);
});

// Normalize port number or named pipe
function normalizePort(val) {
  const port = parseInt(val, 10);
  if (Number.isNaN(port)) {
    return val; // named pipe
  }
  if (port >= 0) {
    return port; // port number
  }
  return false;
}

// Get port from environment and store in Express
const port = normalizePort(PORT || '3001');
app.set('port', port);

// Handle HTTP server "error" event
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;

  // Handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      logger.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      logger.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      logger.error('Error occurred: ', error);
      throw error;
  }
}

// Event listener for HTTP server "listening" event
function onListening() {
  const addr = server.address();
  const bind = addr ? (typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`) : 'unknown';
  debug(`Listening on ${bind}`);
}

// Error handling for uncaught exceptions and unhandled rejections
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception at: %s - message: %s', err.stack, err.message);
});

process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled Rejection at: %s - message: %s', reason.stack, reason.message);
});

// Listen on provided port, on all network interfaces
server.listen(port, HTTP_HOST);
server.on('error', onError);
server.on('listening', onListening);

//wsServer.listen(WS_PORT || 3002, () => {
//  logger.info(`WebSocket server running on https://${HTTP_HOST || 'localhost'}:${WS_PORT || 3002}`);
//});

