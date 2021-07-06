import Class from '../../models/class'
import Account from '../../models/account'

const setClass = async (request, classId) => {
  return await Class.set(request, classId)
}

const authorize = async (request) => {
  return await Account.authorize(request)
}

export default { setClass, authorize }
