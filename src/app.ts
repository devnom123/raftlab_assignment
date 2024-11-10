import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import server from './graphql/index.js';

dotenv.config();
connectDB();

const app = express();
server.applyMiddleware({ app });

app.get('/', (_, res) => {
    res.send('Task Manager API');
});

app.use((_, res) => {
    res.status(404).send('404 Not Found');
});


export default app;
