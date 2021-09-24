const connection = require('../../config/mysql')

module.exports = {
  recordMessage: (data) => {
    return new Promise((resolve, reject) => {
      connection.query('INSERT INTO chat SET ?', data, (error, result) => {
        console.log(error)
        if (!error) {
          const newResult = {
            id: result.insertId,
            ...data
          }
          resolve(newResult)
        } else {
          reject(new Error(result))
        }
      })
    })
  },
  // SELECT * FROM room_chat JOIN user ON room_chat.friend_id = user.user_id WHERE room_chat.user_id = ${id}
  getChatRecords: (room) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT * FROM chat JOIN user ON chat.sender_id = user.user_id WHERE chat.room_chat = ${room}`,
        (error, result) => {
          console.log(result)
          !error ? resolve(result) : reject(new Error(error))
        }
      )
    })
  }
}
