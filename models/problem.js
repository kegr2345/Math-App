var config = require('../config')

const create = async (request) => {
    const response = await fetch(config.server_api + '/api/problem/create/', {
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

const getByTeacher = async (request, teacherId) => {
  const response = await fetch(config.server_api + '/api/problem/getByTeacher/' + teacherId, {
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
  const response = await fetch(config.server_api + '/api/problem/get/' + id, {
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
    const response = await fetch(config.server_api + '/api/problem/set/' + id, {
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

const hardDelete = async (request, id) => {
    const response = await fetch(config.server_api + '/api/problem/hardDelete/' + id, {
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
  getByTeacher, create, set, hardDelete, get
}
