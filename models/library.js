var config = require('../config')

const getByTeacher = async (request, id) => {
    const response = await fetch(config.server_api + '/api/library/get/' + id, {
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

const create = async (request) => {
    const response = await fetch(config.server_api + '/api/library/create', {
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

const hardDelete = async (request, id) => {
    const response = await fetch(config.server_api + '/api/library/hardDelete/' + id, {
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
  getByTeacher, create, hardDelete
}
