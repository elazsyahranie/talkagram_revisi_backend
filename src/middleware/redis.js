const redis = require('redis')
const client = redis.createClient()

const helper = require('../helpers/wrapper')
// const helperUser = require('../helpers/wrapperUser')

module.exports = {
  getUserByIdRedis: (req, res, next) => {
    const { id } = req.params
    if (id) {
      client.get(`getuser:${id}`, (error, result) => {
        if (!error && result != null) {
          console.log('data ada di dalam redis')
          return helper.response(
            res,
            200,
            `Succes Get User by Id ${id} (Redis)`,
            JSON.parse(result)
          )
        } else {
          console.log('data tidak ada dalam redis')
          next()
        }
      })
    }
  },
  getContactsRedis: (req, res, next) => {
    const { id } = req.params
    if (id) {
      client.get(`getcontacts:${id}`, (error, result) => {
        if (!error && result != null) {
          console.log('data ada di dalam redis')
          return helper.response(
            res,
            200,
            `Succes Get Contacts by Id ${id} (Redis)`,
            JSON.parse(result)
          )
        } else {
          console.log('Data tidak ada dalam redis')
          next()
        }
      })
    }
  },
  getContactsDataOnlyRedis: (req, res, next) => {
    const { id } = req.params
    if (id) {
      client.get(`getcontactsdataonly:${id}`, (error, result) => {
        if (!error && result != null) {
          console.log('data ada di dalam redis')
          return helper.response(
            res,
            200,
            `Success get contacts (data only) by ${id} - Redis`,
            JSON.parse(result)
          )
        } else {
          console.log('Data tidak ada dalam redis')
          next()
        }
      })
    }
  },
  getContactPaginationRedis: (req, res, next) => {
    const { id } = req.params
    if (id) {
      client.get(`getcontactspagiantion:${id}`, (error, result) => {
        if (!error && result != null) {
          console.log(`data contact-by-pagination id ${id} di dalam redis`)
          return helper.response(
            res,
            200,
            `Success get contacts (with pagination) by Id ${id} (Redis)`,
            JSON.parse(result)
          )
        } else {
          console.log('Data tidak ada dalam redis')
          next()
        }
      })
    }
  },
  getUserSearchKeywordRedis: (req, res, next) => {
    const { keyword } = req.query
    if (keyword) {
      client.get(`getusersearch:${keyword}`, (error, result) => {
        if (!error && result != null) {
          console.log('data ada di dalam redis')
          return helper.response(
            res,
            200,
            `Succes Get User by Keyword: ${keyword} (Redis)`,
            JSON.parse(result)
          )
        } else {
          console.log('data tidak ada dalam redis')
          next()
        }
      })
    }
  },
  clearDataUserRedis: (req, res, next) => {
    client.keys('getuser*', (_error, result) => {
      console.log('isi key dalam redis', result)
      if (result.length > 0) {
        result.forEach((item) => {
          client.del(item)
        })
      }
      next()
    })
  },
  clearDataContactsRedis: (req, res, next) => {
    client.keys('getcontacts*', (_error, result) => {
      console.log('isi key dalam redis', result)
      if (result.length > 0) {
        result.forEach((item) => {
          client.del(item)
        })
      }
      next()
    })
  }
}
