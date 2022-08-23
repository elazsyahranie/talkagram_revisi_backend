const helper = require('../../helpers/wrapper')
const bcrypt = require('bcrypt')
const authModel = require('./auth_model')
require('dotenv').config()
const jwt = require('jsonwebtoken')

const dataRefreshToken = {}

module.exports = {
  getAllUser: async (req, res) => {
    try {
      let { page, limit } = req.query
      page = parseInt(page)
      limit = parseInt(limit)
      const totalData = await authModel.getDataCount()
      console.log('Total Data: ' + totalData)
      const totalPage = Math.ceil(totalData / limit)
      console.log('Total Page: ' + totalPage)
      const offset = page * limit - limit
      const pageInfo = {
        page,
        totalPage,
        limit,
        totalData
      }
      const result = await authModel.getDataAll(limit, offset)
      return helper.response(res, 200, 'Success Get Data', result, pageInfo)
    } catch (error) {
      return helper.response(res, 400, 'Bad Request', error)
    }
  },
  register: async (req, res) => {
    try {
      const { userName, userEmail, userPassword } = req.body
      const salt = bcrypt.genSaltSync(10)
      const encryptPassword = bcrypt.hashSync(userPassword, salt)
      const setData = {
        user_verification: '1',
        user_name: userName,
        user_email: userEmail,
        user_password: encryptPassword
      }

      const checkEmailUser = await authModel.getDataByCondition({
        user_email: userEmail
      })

      if (checkEmailUser.length === 0) {
        const result = await authModel.register(setData)
        return helper.response(res, 200, 'Success Register User', result)
      } else {
        return helper.response(res, 400, 'Email already registered')
      }
    } catch (error) {
      console.log(error)
      return helper.response(res, 400, 'Bad Request', error)
    }
  },
  login: async (req, res) => {
    try {
      const { userEmail, userPassword } = req.body
      const checkUserEmail = await authModel.getDataConditions({
        user_email: userEmail
      })

      if (checkUserEmail.length > 0) {
        if (checkUserEmail[0].user_verification === 0) {
          return helper.response(res, 403, 'Account is not verified')
        }

        const checkPassword = bcrypt.compareSync(
          userPassword,
          checkUserEmail[0].user_password
        )

        if (checkPassword) {
          console.log('User berhasil login')
          const payload = checkUserEmail[0]
          delete payload.user_password
          delete payload.user_pin
          const token = jwt.sign({ ...payload }, process.env.PRIVATE_KEY, {
            expiresIn: '24h'
          })
          const refreshToken = jwt.sign(
            { ...payload },
            process.env.PRIVATE_KEY,
            // {
            //   expiresIn: '24h'
            // }
          )
          // Memasukkan data checkUserEmail ke dalam refreshToken
          dataRefreshToken[checkUserEmail[0].user_id] = refreshToken
          const result = { ...payload, token, refreshToken }
          return helper.response(res, 200, 'Succes Login !', result)
        } else {
          return helper.response(res, 400, 'Password incorrect')
        }
      } else {
        return helper.response(res, 404, 'Email not registered')
      }
    } catch (error) {
      return helper.response(res, 400, 'Bad Request', error)
    }
  },
  refresh: async (req, res) => {
    try {
      const { refreshToken } = req.body
      // Jika userId pada dataRefreshToken
      // Apa refreshToken masih bisa dipakai?
      // console.log(refreshToken)
      jwt.verify(refreshToken, process.env.PRIVATE_KEY, (error, result) => {
        if (
          (error && error.name === 'JsonWebTokenError') ||
          (error && error.name === 'TokenExpiredError')
        ) {
          // Jika refreshToken tidak bisa dipakai lagi 
          /* Coba di sini ditaruh logic untuk generate refreshToken nya */
          delete dataRefreshToken.user_id
          return helper.response(res, 403, error.message)
        } else {
          if (
            result.user_id in dataRefreshToken &&
            dataRefreshToken[result.user_id] === refreshToken
          ) {
            // Jika refreshToken masih bisa dipakai
            delete result.iat
            delete result.exp
            const token = jwt.sign(result, process.env.PRIVATE_KEY, {
              expiresIn: '1h'
            })
            const newResult = { result, token, refreshToken }
            return helper.response(
              res,
              200,
              'Refresh token succesful',
              newResult
            )
          } else {
            return helper.response(res, 403, 'Wrong refresh token')
          }
        }
      })
      // Jika userId TIDAK ADA pada dataRefreshToken
    } catch (error) {
      return helper.response(res, 400, 'Bad Request', error)
    }
  },
  updateUser: async (req, res) => {
    try {
      const { id } = req.params
      const { userName, emailName, phoneNumber } = req.body
      const setData = {
        user_name: userName,
        user_email: emailName,
        user_phone: phoneNumber
      }
      const result = await authModel.updateData(setData, id)
      return helper.response(res, 200, 'Success Update User', result)
    } catch (error) {
      return helper.response(res, 400, 'Bad Request', error)
    }
  },
  deleteUser: async (req, res) => {
    try {
      const { id } = req.params
      const result = await authModel.deleteData(id)
      return helper.response(res, 200, `Success Delete User ${id}`, result)
    } catch (error) {
      return helper.response(res, 400, 'Bad Request', error)
    }
  },
  changeUserVerification: async (req, res) => {
    try {
      const { userId, token } = req.params
      const setData = {
        user_verification: '1'
      }
      let verificationToken = ''
      jwt.verify(token, process.env.PRIVATE_KEY, (error, result) => {
        if (
          (error && error.name === 'JsonWebTokenError') ||
          (error && error.name === 'TokenExpiredError')
        ) {
          // Jika refreshToken tidak bisa  dipakai lagi
          return helper.response(res, 403, 'error_jwt_expired')
        } else {
          verificationToken = token
        }
      })
      if (verificationToken) {
        const result = await authModel.updateData(setData, userId)
        return helper.response(
          res,
          200,
          `User ${userId} have been verified!`,
          result
        )
      } else {
        console.log('Change user verification controller is NOT working!')
      }
    } catch (error) {
      console.log(error)
    }
  }
}
