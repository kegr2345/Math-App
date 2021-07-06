import Teacher from '../../models/teacher'
import Account from '../../models/account'

const get = async (request) => {
  let response = await Teacher.get(request, accountId)
  return response
}

const authorize = async (request) => {
  return await Account.authorize(request)
}

export default { authorize, get }