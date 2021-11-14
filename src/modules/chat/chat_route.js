const express = require('express')
const Route = express.Router()
const { authentication } = require('../../middleware/auth')

const {
  insertMessage,
  getMessages,
  updateChat,
  updateLastChat,
  eraseChat
} = require('./chat_controller')

Route.post('/insert-message', authentication, insertMessage)
Route.get('/get-message/:room', authentication, getMessages)
Route.patch('/update-chat/:id', authentication, updateChat)
Route.patch('/update-last-chat/:roomchat', authentication, updateLastChat)
Route.delete('/erase-chat/:id', authentication, eraseChat)
module.exports = Route
