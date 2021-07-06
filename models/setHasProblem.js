var config = require('../config')

const create = async (request) => {
    const response = await fetch(config.server_api + '/api/setHasProblem/create', {
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

const getBySet = async (request, setId) => {
    const response = await fetch(config.server_api + '/api/setHasProblem/getBySet/' + setId, {
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

const get = async (request, id) => {
    const response = await fetch(config.server_api + '/api/setHasProblem/get/' + id, {
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

const del = async (request, id) => {
    const response = await fetch(config.server_api + '/api/setHasProblem/delete/' + id, {
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
  create, getBySet, del, get
}
