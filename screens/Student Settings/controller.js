import Student from '../../models/student'
import Account from '../../models/account'

const setStudent = async (request, classId) => {
  return await Student.set(request, classId)
}

const authorize = async (request) => {
  return await Account.authorize(request)
}

export default { setStudent, authorize }
