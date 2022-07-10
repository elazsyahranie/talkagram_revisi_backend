const express = require('express')
const Route = express.Router()
const uploads = require('../../middleware/uploads')
const { authentication } = require('../../middleware/auth')

const {
  getAllUser,
  getUsernameSearchKeyword,
  getUserbyId,
  getContacts,
  getContactsWithoutUserData,
  sendFriendRequest,
  getFriendRequestData,
  getPendingRequestData,
  confirmFriendRequest,
  getContactPagination,
  createRoom,
  getRoomList,
  changeUserVerification,
  updateUser,
  updateUserPassword,
  updateUserImage,
  deleteUser
} = require('./user_controller')

Route.get('/', authentication, getAllUser)
Route.get(
  '/keyword',
  authentication,
  getUsernameSearchKeyword
)
Route.get('/:id', authentication, getUserbyId)
Route.post(
  '/send-friend-request',
  authentication,
  sendFriendRequest
)
Route.get('/friend-request/:id', authentication, getFriendRequestData)
Route.get('/pending-request/:id', authentication, getPendingRequestData)
Route.post(
  '/confirm-friend-request',
  authentication,
  confirmFriendRequest
)
Route.get('/contact/:id', authentication, getContacts)
Route.get(
  '/contact-data-only/:id',
  authentication,
  getContactsWithoutUserData
)
Route.get('/contact-pagination/:id', authentication, getContactPagination)
Route.post(
  '/create-room',
  createRoom
)
Route.get('/get-room-list/:id', authentication, getRoomList)
Route.get('/verify-user/:token', changeUserVerification)
Route.patch(
  '/:id',
  authentication,
  updateUser
)
Route.patch(
  '/update-password/:id',
  updateUserPassword
)
Route.patch(
  '/update-image/:id',
  uploads,
  updateUserImage
)
Route.delete('/:id', deleteUser)
module.exports = Route
