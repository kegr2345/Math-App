import Account from '../../models/account'

const authorize = async (request) => {
  let response = await Account.authorize(request)
  return response
}

export default { authorize }
