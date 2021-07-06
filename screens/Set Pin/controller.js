import Account from '../../models/account'
import Teacher from '../../models/teacher'

const login = async (request) => {
  let response = await Account.login(request)
  return response
}

const setPin = async (request, teacherId) => {
  return await Teacher.setPin(request, teacherId)
}

const authorize = async (request) => {
  return await Account.authorize(request)
}

export default { login, setPin, authorize }