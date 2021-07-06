var config = require('../config')

const get = async (request, accountId) => {
  const response = await fetch(config.server_api + '/api/teacher/get/' + accountId, {
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

const getAll = async (request) => {
  const response = await fetch(config.server_api + '/api/teacher/get', {
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

const set = async (request, accountId) => {
  const response = await fetch(config.server_api + '/api/teacher/set/' + accountId, {
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

const setPin = async (request, id) => {
  const response = await fetch(config.server_api + '/api/teacher/setPin/' + id, {
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

const del = async (request, accountId) => {
  const response = await fetch(config.server_api + '/api/teacher/delete/' + accountId, {
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
  get, getAll, set, del, setPin
}
