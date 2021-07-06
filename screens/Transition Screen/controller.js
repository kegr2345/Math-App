import Account from '../../models/account'

const authorize = async (request) => {
  return await Account.authorize(request)
}

export default { authorize }
