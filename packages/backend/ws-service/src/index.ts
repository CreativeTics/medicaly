import { createServer } from 'http'
import { Server, Socket } from 'socket.io'

import { config } from 'dotenv'
import cnf from './config'
config()
const httpServer = createServer()
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  },
})

io.of('signature-pad').on('connection', (socket: Socket) => {
  console.log('a user connected' + socket.id)
  socket.on('disconnect', () => {
    console.log('user disconnected')
  })
  socket.on('join', function (room: string) {
    socket.join(room)
    socket.emit('joined', room)
    io.to(room).emit('message', { room: room, id: socket.id })
  })
  socket.on('message', function (message: any) {
    socket.broadcast.to(message.room).emit('message', message)
    io.to(message.room).emit('message', message)
  })
})

httpServer.listen(cnf.portNumber)
console.log(`listening on port ${cnf.portNumber}`)
