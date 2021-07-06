var config = require('../config')

const create = async (request) => {
    const response = await fetch(config.server_api + '/api/attempt/create', {
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

module.exports = {
  create
}
