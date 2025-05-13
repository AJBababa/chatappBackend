"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var http_1 = __importDefault(require("http"));
var socket_io_1 = __importDefault(require("socket.io"));
var cors_1 = __importDefault(require("cors"));
var path_1 = __importDefault(require("path"));
var app = express_1.default();
app.use(express_1.default.json());
var server = http_1.default.createServer(app);
var socket = new socket_io_1.default.Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});
app.use(cors_1.default());
var port = process.env.PORT || 3000;
app.use(express_1.default.static(path_1.default.join(__dirname, 'dist/chat-app')));
var users = new Set();
socket.on('connection', function (socket) {
    socket.on('join', function (username) {
        if (username) {
            socket.username = username;
            users.add(username);
            socket.emit('user list', Array.from(users));
        }
    });
    socket.on('chat message', function (msg) {
        socket.emit('chat message', { username: socket.username, message: msg });
    });
    socket.on('disconnect', function () {
        if (socket.username) {
            users.delete(socket.username);
            socket.emit('user list', Array.from(users));
        }
    });
});
app.listen(port, function () {
    return console.log("App listening on PORT " + port + ".");
});
