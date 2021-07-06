var config = require('../config')

const get = async (request, id) => {
  const response = await fetch(config.server_api + '/api/account/get/' + id, {
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
  const response = await fetch(config.server_api + '/api/account/get', {
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

const getRelations = async (request, id) => {
  const response = await fetch(config.server_api + '/api/account/getRelations/' + id, {
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
  const response = await fetch(config.server_api + '/api/account/getRelations', {
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
  const response = await fetch(config.server_api + '/api/account/delete/' + id, {
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

const invite = async (request) => {
  const response = await fetch(config.server_api + '/api/account/invite', {
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

const register = async (request) => {
  const response = await fetch(config.server_api + '/api/account/register', {
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

const login = async (request) => {
  const response = await fetch(config.server_api + '/api/account/login', {
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

const authorize = async (request) => {
  const response = await fetch(config.server_api + '/api/account/authorize', {
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

const logout = async (request) => {
  const response = await fetch(config.server_api + '/api/account/logout', {
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

const requestReset = async (request) => {
  const response = await fetch(config.server_api + '/api/account/requestReset', {
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

const reset = async (request) => {
  const response = await fetch(config.server_api + '/api/account/reset', {
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

const set = async (request, id) => {
  const response = await fetch(config.server_api + '/api/account/set/' + id, {
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

const validateInviteToken = async (request) => {
  const response = await fetch(config.server_api + '/api/account/validateInviteToken', {
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

const validateResetToken = async (request) => {
  const response = await fetch(config.server_api + '/api/account/validateResetToken', {
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
  get, getAll, getRelations, getAllRelations, register, login, invite, authorize, logout, requestReset, reset, del, set, validateInviteToken, validateResetToken
}
