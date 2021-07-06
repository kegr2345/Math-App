import Set from '../../models/set'
import Account from '../../models/account'

const getByStudent = async (request, studentId) => {
  return await Set.getByStudent(request, studentId)
}

const set = async (setReq, id) => {
  return await Set.set(setReq, id)
}

const del = async (request, id) => {
  return await Set.hardDelete(request, id)
}

const authorize = async (request) => {
  return await Account.authorize(request)
}

export default { getByStudent, set, del, authorize }
