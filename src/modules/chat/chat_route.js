const express = require('express')
const Route = express.Router()

const {
  insertMessage,
  getMessages,
  updateChat,
  eraseChat
} = require('./chat_controller')

Route.post('/insert-message', insertMessage)
Route.get('/get-message/:room', getMessages)
Route.patch('/update-chat/:id', updateChat)
Route.delete('/erase-chat/:id', eraseChat)
module.exports = Route
