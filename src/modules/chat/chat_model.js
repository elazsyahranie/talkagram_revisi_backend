const db = require("../../config/mysql");
const connection = require("../../config/mysql");

module.exports = {
  recordMessage: (room_chat, sender_id, receiver_id, message) => {
    return new Promise((resolve, reject) => {
      db.serialize(() => {
        db.exec("BEGIN TRANSACTION;");
        let insertQuery = "INSERT INTO chat ";
        insertQuery += "(room_chat, sender_id, receiver_id, message) ";
        insertQuery += "VALUES (?, ?, ?, ?);";

        db.run(
          insertQuery,
          [room_chat, sender_id, receiver_id, message],
          (error) => {
            !error ? resolve() : reject(new Error(error));
          }
        );

        let updateQuery = "UPDATE room_chat ";
        updateQuery = "SET last_chat = ? ";
        updateQuery = "WHERE room_chat = ?;";

        db.run(updateQuery, [message, room_chat], (error) => {
          !error ? resolve() : reject(new Error(error));
        });

        db.exec("COMMIT;");
      });
    });
    // return new Promise((resolve, reject) => {
    //   let query = 'INSERT INTO chat '
    //   query += '(room_chat, sender_id, receiver_id, message) '
    //   query += 'VALUES (?, ?, ?, ?)'
    //   db.run(query, [
    //     room_chat,
    //     sender_id,
    //     receiver_id,
    //     message
    //   ], (error) => {
    //     !error ? resolve () : reject(new Error(error))
    //   })
    // })
  },
  // UPDATE room_chat SET last_chat = 'Hi!' WHERE room_chat = 926
  recordLastmessage: (message, room_chat) => {
    return new Promise((resolve, reject) => {
      let query = "UPDATE room_chat ";
      query += "SET last_chat = ? ";
      query += "WHERE room_chat = ?";
      db.run(query, [message, room_chat], (error) => {
        console.log(error);
        !error ? resolve() : reject(new Error(error));
      });
    });
  },
  // SELECT * FROM room_chat JOIN user ON room_chat.friend_id = user.user_id WHERE room_chat.user_id = ${id}
  getChatRecords: (room) => {
    return new Promise((resolve, reject) => {
      db.all(
        "SELECT * FROM chat JOIN user ON chat.sender_id = user.user_id WHERE chat.room_chat = ?",
        [room],
        (error, result) => {
          console.log(result);
          !error ? resolve(result) : reject(new Error(error));
        }
      );
    });
  },
  changeChat: (newChat, id) => {
    return new Promise((resolve, reject) => {
      connection.query(
        "UPDATE chat SET ? WHERE chat_id = ?",
        [newChat, id],
        (error, result) => {
          if (!error) {
            console.log(result);
            const newResult = {
              id: id,
              ...newChat,
            };
            resolve(newResult);
          } else {
            reject(new Error(error));
          }
        }
      );
    });
  },
  changeLastChat: (newChat, roomChat) => {
    return new Promise((resolve, reject) => {
      connection.query(
        "UPDATE last_chat SET ? WHERE room_chat = ?",
        [newChat, roomChat],
        (error, result) => {
          if (!error) {
            console.log(result);
            const newResult = {
              roomChat: roomChat,
              ...newChat,
            };
            resolve(newResult);
          } else {
            reject(new Error(error));
          }
        }
      );
    });
  },
  deleteChat: (id) => {
    return new Promise((resolve, reject) => {
      connection.query(
        "DELETE FROM chat WHERE chat_id = ?",
        id,
        (error, result) => {
          !error ? resolve(result) : reject(new Error(error));
        }
      );
    });
  },
};
