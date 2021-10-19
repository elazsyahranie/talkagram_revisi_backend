const express = require('express')
const Route = express.Router()
const { authentication } = require('../../middleware/auth')

const {
  insertMessage,
  getMessages,
  updateChat,
  eraseChat
} = require('./chat_controller')

Route.post('/insert-message', authentication, insertMessage)
Route.get('/get-message/:room', authentication, getMessages)
Route.patch('/update-chat/:id', authentication, updateChat)
Route.delete('/erase-chat/:id', authentication, eraseChat)
module.exports = Route
