import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
// import graphqlServer from './graphql/index.js';
import http from 'http';
import cors from 'cors';
//import  socket io
import { Server } from 'socket.io';
import { expressMiddleware } from '@apollo/server/express4';
import jwt from 'jsonwebtoken';
import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { typeDefs, resolvers } from './graphql/index.js';


dotenv.config();
connectDB();

const app = express();
const httpServer = http.createServer(app);

const server = new ApolloServer({
    typeDefs: typeDefs,
    resolvers: resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

await server.start();


const io = new Server(httpServer, {
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

app.use('/graphql', cors(), express.json(), expressMiddleware(server,
    {
        context: async ({ req }) => {
            const token = req.headers.authorization || '';
            let user = null;

            if (token) {
                try {
                    user = jwt.verify(token, process.env.JWT_SECRET);
                    user = { _id: user.userId };
                } catch (err) {
                    throw new Error('Authentication error');
                }
            }

            return { user };
        },
    }));


app.get('/', (_, res) => {
    res.send('Task Manager API');
});

app.use((_, res) => {
    res.status(404).send('404 Not Found');
});

export {
    io
}

export default httpServer

