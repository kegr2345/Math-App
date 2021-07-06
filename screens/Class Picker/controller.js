import Class from '../../models/class'
import Account from '../../models/account'

const getByTeacher = async (classRequest, teacherId) => {
  return await Class.getByTeacher(classRequest, teacherId)
}

const authorize = async (request) => {
  return await Account.authorize(request)
}

export default { getByTeacher, authorize }