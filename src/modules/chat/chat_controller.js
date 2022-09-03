const helper = require('../../helpers/wrapper')
const chatModel = require('./chat_model')

module.exports = {
  insertMessage: async (req, res) => {
    try {
      const { roomChat, senderId, receiverId, chatMessage } = req.body
      const result = await chatModel.recordMessage(roomChat, senderId, receiverId, chatMessage)
      const result2 = await chatModel.recordLastmessage(chatMessage)
      return helper.response(res, 200, 'Chat message recorded!', result, result2)
    } catch (error) {
      console.log(error)
      return helper.response(res, 400, 'Bad request', error)
    }
  },
  getMessages: async (req, res) => {
    try {
      const { room } = req.params
      const result = await chatModel.getChatRecords(room)
      return helper.response(res, 200, 'Get messages success!', result)
    } catch (error) {
      console.log(error)
      return helper.response(res, 400, 'Bad request', error)
    }
  },
  updateChat: async (req, res) => {
    try {
      const { id } = req.params
      const { newMessage } = req.body
      const newChat = {
        last_chat: newMessage
      }
      const result = await chatModel.changeChat(newChat, id)
      return helper.response(res, 200, 'Change message success!', result)
    } catch (error) {
      console.log(error)
      return helper.response(res, 400, 'Bad request', error)
    }
  },
  updateLastChat: async (req, res) => {
    try {
      const { roomChat } = req.params
      const { newLastMessage } = req.body
      const newLastChat = {
        message: newLastMessage
      }
      const result = await chatModel.changeChat(newLastChat, roomChat)
      return helper.response(res, 200, 'Change last message success!', result)
    } catch (error) {
      console.log(error)
      return helper.response(res, 400, 'Bad request', error)
    }
  },
  eraseChat: async (req, res) => {
    try {
      const { id } = req.params
      const result = await chatModel.deleteChat(id)
      return helper.response(res, 200, 'Delete chat succesful!', result)
    } catch (error) {
      console.log(error)
      return helper.response(res, 400, 'Bad request', error)
    }
  }
}
