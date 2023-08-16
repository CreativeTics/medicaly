"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const dotenv_1 = require("dotenv");
const config_1 = require("./config");
(0, dotenv_1.config)();
const httpServer = (0, http_1.createServer)();
const io = new socket_io_1.Server(httpServer, { cors: { origin: '*' } });
io.of('signature-pad').on('connection', (socket) => {
    console.log('a user connected' + socket.id);
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
    socket.on('join', function (room) {
        socket.join(room);
        socket.emit('joined', room);
        io.to(room).emit('message', { room: room, id: socket.id });
    });
    socket.on('message', function (message) {
        socket.broadcast.to(message.room).emit('message', message);
        io.to(message.room).emit('message', message);
    });
});
httpServer.listen(config_1.default.portNumber);
console.log(`listening on port ${config_1.default.portNumber}`);
//# sourceMappingURL=index.js.map