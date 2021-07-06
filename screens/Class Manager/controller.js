import Class from '../../models/class'
import Account from '../../models/account'

const getByTeacher = async (classRequest, teacherId) => {
  return await Class.getByTeacher(classRequest, teacherId)
}

const del = async (classRequest, id) => {
  return await Class.hardDelete(classRequest, id)
}

const authorize = async (request) => {
  return await Account.authorize(request)
}

export default { getByTeacher, del, authorize }
