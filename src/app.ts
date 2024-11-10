import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import graphqlServer from './graphql/index.js';
import http from 'http';
import cors from 'cors';
import { WebSocketServer } from 'ws';
//import  socket io
import { Server } from 'socket.io';

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

// const wss = new WebSocketServer({
//     server
// });

const io = new Server(server, {
    cors: {
        origin: '*',
    }
});

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.emit('message', { message: 'Welcome!' });

    // Handle joining a room
    socket.on('joinRoom', (room) => {
        socket.join(room);
        console.log(`User ${socket.id} joined room: ${room}`);
    });

    // Handle leaving a room
    socket.on('leaveRoom', (room) => {
        socket.leave(room);
        console.log(`User ${socket.id} left room: ${room}`);
    });

    // Handle sending a message to a room
    socket.on('messageRoom', (room, message) => {
        io.to(room).emit('message', { message });
        console.log(`Message sent to room ${room}: ${message}`);
    });

    // Handle disconnecting
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

graphqlServer.applyMiddleware({ app });

const rooms = {};

// wss.on('connection', (ws) => {
//     console.log('New WebSocket connection');

//     // Handle incoming messages from the client
//     ws.on('message', (message,data) => {
//         console.log('Received from client:', message.toString());
//         let convertMessage = JSON.parse(message.toString());
//         console.log('convertMessage', convertMessage);
//         if(convertMessage && convertMessage.action === 'join') {
//             const room = convertMessage.room;
//             if(!rooms[room]) {
//                 rooms[room] = [];
//             }
//             rooms[room].push(ws);
//         }
//         else if(convertMessage && convertMessage.action === 'leave') {
//             ws.leave(convertMessage.room);
//             console.log('Left room', convertMessage.room);
//             ws.send('You left room ' + convertMessage.room);
//         }
//         else if(convertMessage && convertMessage.action === 'messageRoom') {
//             wss.to(convertMessage.room).emit('message', 'Hello from room');
//             console.log('Message sent to room', convertMessage.room);
//         }
//     });

//     // Handle WebSocket disconnection
//     ws.on('close', () => {
//         console.log('Client disconnected');
//     });
// });

app.get('/', (_, res) => {
    res.send('Task Manager API');
});

app.use((_, res) => {
    res.status(404).send('404 Not Found');
});

export {
    io
}

export default server

