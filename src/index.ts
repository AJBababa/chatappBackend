import express from "express";
import cors from 'cors';
import http from 'http';
import path from 'path';
import { Server } from 'socket.io';

const app = express();
const httpServer = http.createServer(app);
const socketIO = new Server(httpServer, {
    cors: {
        origin: '*',
        methods: ["GET", "POST"]
    }
});

app.use(cors());
const port = process.env.PORT || 3000;
app.use(express.static(path.join(__dirname, 'dist/chat-app')));

const users = new Set();

socketIO.on('connection', (socket: any) => {

    socket.on('join', (username: any) => {
        if (username) {
            console.log(`Se ha unido ${username}`);
            socket.username = username;
            users.add(username);
            socketIO.emit('user list', Array.from(users));
        }
    });

    socket.on('chat message', (msg: any) => {
        socketIO.emit('chat message', {
            username: socket.username,
            message: msg 
        });
    });

    socket.on('disconnect', () => {
        if (socket.username) {
            users.delete(socket.username);
            socketIO.emit('user list', Array.from(users));
        }
    });
});


httpServer.listen(port, () =>
    console.log(`App listening on port ${port}`));