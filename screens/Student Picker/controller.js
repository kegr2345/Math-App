import Student from '../../models/student'
import Account from '../../models/account'

const getByClass = async (studentRequest, classId) => {
  return await Student.getByClass(studentRequest, classId)
}

const authorize = async (request) => {
  return await Account.authorize(request)
}

export default { getByClass, authorize }
