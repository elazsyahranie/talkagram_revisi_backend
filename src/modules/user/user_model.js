const db = require('../../config/mysql')
const connection = require('../../config/mysql')

module.exports = {
  getDataAll: (limit, offset, sort, search) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT * FROM user WHERE user_name LIKE '%${search}%' ORDER BY ${sort} LIMIT ? OFFSET ?`,
        [limit, offset],
        (error, result) => {
          !error ? resolve(result) : reject(new Error(error))
        }
      )
    })
  },
  getUserSearchKeyword: (keyword) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT * FROM user WHERE user_name LIKE '%${keyword}%'`,
        (error, result) => {
          console.log(result)
          !error ? resolve(result) : reject(new Error(error))
        }
      )
    })
  },
  findRoom: (idOne, idTwo) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT * FROM contact WHERE contact_user_id = ${idOne} AND contact_friend_id = ${idTwo}`,
        (error, result) => {
          !error ? resolve(result) : reject(new Error(result))
        }
      )
    })
  },
  // SELECT * FROM user JOIN balance ON user.user_id = balance.user_id WHERE user.user_id = ${id}
  // 'SELECT * FROM room_chat JOIN user ON room_chat.friend_id = user.user_id JOIN last_chat ON room_chat.room_chat = last_chat.room_chat WHERE room_chat.user_id = ?;'
  findRoomList: (id) => {
    return new Promise((resolve, reject) => {
      let query = 'SELECT '
      query += 'room_chat.room_chat, room_chat.room_chat_id, '
      query += 'room_chat.last_chat, room_chat.user_id, '
      query += 'room_chat.friend_id, user.user_id, user.user_name '
      query += 'FROM room_chat '
      query += 'INNER JOIN user ON room_chat.friend_id = user.user_id '
      query += 'WHERE room_chat.user_id = ?'
      db.all(
        query,
        [id],
        (error, result) => {
          !error ? resolve(result) : reject(new Error(result))
        }
      )
    })
  },
  findRoomListByUserId: (id) => {
    return new Promise((resolve, reject) => {
      let query = 'SELECT '
      query += 'room_chat.room_chat, room_chat.room_chat_id, '
      query += 'room_chat.last_chat, room_chat.user_id, '
      query += 'room_chat.friend_id, user.user_id, '
      query += 'user.user_name '
      query += 'FROM room_chat INNER JOIN user ON room_chat.friend_id = user.user_id WHERE room_chat.user_id = ?;'
      db.all(query, [id], (error, result) => {
        !error ? resolve(result) : reject(new Error(error))
      })
    })
  },
  sendInvitation: (data) => {
    return new Promise((resolve, reject) => {
      connection.query(
        'INSERT INTO friend_request SET ?',
        data,
        (error, result) => {
          console.log(error)
          if (!error) {
            const newResult = {
              id: result.insertId,
              ...data
            }
            resolve(newResult)
          } else {
            reject(new Error(error))
          }
        }
      )
    })
  },
  // DELETE FROM friend_request WHERE contact_user_id = 33 AND contact_friend_id = 69
  eraseRequest: (userId, friendId) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `DELETE FROM friend_request WHERE contact_user_id = ${userId} AND contact_friend_id = ${friendId}`,
        (error, result) => {
          !error ? resolve(result) : reject(new Error(error))
        }
      )
    })
  },
  addContact: (data) => {
    return new Promise((resolve, reject) => {
      connection.query('INSERT INTO contact SET ?', data, (error, result) => {
        console.log(error)
        if (!error) {
          const newResult = {
            id: result.insertId,
            ...data
          }
          resolve(newResult)
        } else {
          reject(new Error(error))
        }
      })
    })
  },
  insertRoom: (data) => {
    return new Promise((resolve, reject) => {
      connection.query('INSERT INTO room_chat SET ?', data, (error, result) => {
        console.log(error)
        if (!error) {
          const newResult = {
            id: result.insertId,
            ...data
          }
          resolve(newResult)
        } else {
          reject(new Error(error))
        }
      })
    })
  },
  getDataConditions: (data) => {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM user WHERE ?', data, (error, result) => {
        !error ? resolve(result) : reject(new Error(error))
      })
    })
  },
  getDataByCondition: (condition) => {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT * FROM user WHERE ?',
        condition,
        (error, result) => {
          !error ? resolve(result) : reject(new Error(error))
        }
      )
    })
  },
  getContactData: (condition) => {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT * FROM contact INNER JOIN user ON contact.contact_friend_id = user.user_id WHERE ?',
        condition,
        (error, result) => {
          !error ? resolve(result) : reject(new Error(error))
        }
      )
    })
  },
  getContactDataOnly: (id) => {
    return new Promise((resolve, reject) => {
      db.all(
        'SELECT * FROM contact WHERE contact.contact_user_id = ? OR contact_friend_id = ?',
        [id],
        (error, result) => {
          !error ? resolve(result) : reject(new Error(error))
        }
      )
    })
  },
  getDataCount: (search) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT COUNT(*) AS total FROM contact WHERE contact_user_id = ${search}`,
        (error, result) => {
          !error ? resolve(result[0].total) : reject(new Error(error))
        }
      )
    })
  },
  // Select A.column, B.column FROM TABLE1 A INNER JOIN TABLE2 B ON A.Id = (case when (your condition) then b.Id else (something) END)
  // SELECT * FROM contact INNER JOIN user ON contact.contact_friend_id = user.user_id AND contact.contact_friend_id = user.user_id WHERE contact_friend_id = 33 AND contact_user_id = 33;
  getContactDataPagination: (id, limit, offset, sort) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT * FROM contact INNER JOIN user ON contact.contact_friend_id = user.user_id WHERE contact_user_id = ${id} ORDER BY ${sort} LIMIT ? OFFSET ?`,
        [limit, offset],
        (error, result) => {
          console.log(error)
          !error ? resolve(result) : reject(new Error(error))
        }
      )
    })
  },
  getFriendRequest: (condition) => {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT * FROM friend_request WHERE ?',
        condition,
        (error, result) => {
          console.log(error)
          !error ? resolve(result) : reject(new Error(error))
        }
      )
    })
  },
  getPendingRequest: (id) => {
    return new Promise((resolve, reject) => {
      db.all(
        'SELECT * FROM friend_request WHERE contact_friend_id = ?',
        [id],
        (error, result) => {
          console.log(error)
          !error ? resolve(result) : reject(new Error(error))
        }
      )
    })
  },
  getDataById: (id) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT * FROM user WHERE user_id = ${id}`,
        (error, result) => {
          console.log(error)
          !error ? resolve(result) : reject(new Error(error))
        }
      )
    })
  },
  updateData: (setData, id) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `UPDATE user SET ? WHERE user_id = ${id}`,
        setData,
        (error, result) => {
          if (!error) {
            const newResult = {
              id: id,
              ...setData
            }
            resolve(newResult)
          } else {
            reject(new Error(error))
          }
        }
      )
    })
  },
  updateUserImage: (setData, id) => {
    return new Promise((resolve, reject) => {
      connection.query(
        'UPDATE user SET ? WHERE ?',
        [setData, id],
        (error, result) => {
          if (!error) {
            const newResult = {
              id: id,
              ...setData
            }
            console.log(newResult)
            resolve(newResult)
          } else {
            reject(new Error(error))
          }
        }
      )
    })
  },
  updateUserPassword: (setData, id) => {
    return new Promise((resolve, reject) => {
      connection.query(
        'UPDATE user SET ? WHERE user_id = ?',
        [setData, id],
        (error, result) => {
          if (!error) {
            const newResult = {
              id: result.insertId,
              ...setData
            }
            resolve(newResult)
          } else {
            reject(new Error(error))
          }
        }
      )
    })
  },
  deleteData: (id) => {
    return new Promise((resolve, reject) => {
      connection.query(
        'DELETE FROM user WHERE user_id = ?',
        id,
        (error, result) => {
          !error ? resolve(result) : reject(new Error(error))
        }
      )
    })
  }
}
