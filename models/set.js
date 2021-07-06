var config = require('../config')

const create = async (request) => {
    const response = await fetch(config.server_api + '/api/set/create', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(request)
    })
  
    if (response.status === 200) {
      return await response.json()
    } else {
      return null
    }
}

const getByStudent = async (request, studentId) => {
    const response = await fetch(config.server_api + '/api/set/get/' + studentId, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(request)
    })
  
    if (response.status === 200) {
      return await response.json()
    } else {
      return null
    }
}

const set = async (request, id) => {
    const response = await fetch(config.server_api + '/api/set/set/' + id, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(request)
    })
  
    if (response.status === 200) {
      return await response.json()
    } else {
      return false
    }
}

const hardDelete = async (request, id) => {
    const response = await fetch(config.server_api + '/api/set/hardDelete/' + id, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(request)
    })
  
    if (response.status === 200) {
      return true
    } else {
      return false
    }
}

module.exports = {
  getByStudent, create, set, hardDelete
}
