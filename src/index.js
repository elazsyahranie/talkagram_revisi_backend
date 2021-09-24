const express = require('express')
require('dotenv').config()
const morgan = require('morgan')
const cors = require('cors')
// const { v4: uuidv4 } = require('uuid')
const xss = require('xss-clean')
const helmet = require('helmet')
const compression = require('compression')
const bodyParser = require('body-parser')
const routerNavigation = require('./routes')
const socket = require('socket.io')

const app = express()
const port = process.env.DB_PORT

app.use(morgan('dev'))
app.use(cors())
app.options('', cors())
app.use(xss())
app.use(helmet())
app.use(compression())
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
app.use('/backend/api/v1', routerNavigation)
app.use('/backend/api', express.static('src/uploads'))

const server = require('http').createServer(app)
const io = socket(server, {
  cors: {
    origin: '*'
  },
  path: '/backend3/socket.io'
})

const listUsersOnline = []

io.on('connection', (socket) => {
  console.log('Socket.io connect !')

  socket.on('connection-server', (userId) => {
    listUsersOnline.push(userId)
    console.log(userId)
    io.emit('list-users-online', listUsersOnline)
  })

  // Global Message -- Dikirim ke semua client, dan termasuk pengirim
  socket.on('globalMessage', (data) => {
    console.log(data)
    io.emit('chatMessage', data)
  })
  // Private Message -- Hanya dikirim ke kita saja (hanya penngirim yang bisa baca pesannya)
  socket.on('privateMessage', (data) => {
    console.log(data)
    socket.emit('chatMessage', data)
  })
  // Broadcast Message -- Dikirim ke semua client, tapi tidak termasuk pengirim
  socket.on('broadcastMessage', (data) => {
    console.log(data)
    socket.broadcast.emit('chatMessage', data)
  })
  // Room Message
  socket.on('joinRoom', (data) => {
    console.log(data)
    if (data.previousRoom) {
      socket.leave(data.previousRoom)
    }
    socket.join(data.room)
    socket.broadcast.to(data.room).emit('chatMessage', {
      user_name: 'BOT',
      message: `${data.user_name} joined chat!`
    })
  })
  socket.on('roomMessage', (data) => {
    io.to(data.room).emit('chatMessage', data)
  })
  // Harus sama dengan di Frontend. 'globalMessage' ya 'globalMessage'
})

server.listen(port, () => {
  // bagian sini ubah jadi server.listen
  console.log(`Express app is listen on port ${port} !`)
})
