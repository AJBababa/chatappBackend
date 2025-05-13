import express from 'express';
import http from 'http';
import socketIo from 'socket.io';
import cors from 'cors';
import path from 'path';

const app = express();
app.use(express.json());


const server = http.createServer(app);
const socket = new socketIo.Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'dist/chat-app')));

const users = new Set();

socket.on('connection', (socket: any) => {

    socket.on('join', (username: any) => {
        if (username) {
            socket.username = username;
            users.add(username);
            socket.emit('user list', Array.from(users));
        }
    });

    socket.on('chat message', (msg: any) => {
        socket.emit('chat message', { username: socket.username, message: msg });
    });

    socket.on('disconnect', () => {
        if (socket.username) {
            users.delete(socket.username);
            socket.emit('user list', Array.from(users));
        }
    });
});





app.listen(port, () => 
    console.log(`App listening on PORT ${port}.`));