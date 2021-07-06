var config = require('../config')

const create = async (request) => {
    const response = await fetch(config.server_api + '/api/session/create', {
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

const getAllRelations = async (request) => {
    const response = await fetch(config.server_api + '/api/session/getAllRelations', {
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
    const response = await fetch(config.server_api + '/api/class/hardDelete/' + id, {
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
  create, getAllRelations, hardDelete
}
