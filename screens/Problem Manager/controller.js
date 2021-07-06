import Problem from '../../models/problem'
import Account from '../../models/account'

const getProblemByTeacher = async (problemRequest, teacherId) => {
  return await Problem.getByTeacher(problemRequest, teacherId)
}

const del = async (problemRequest, id) => {
  return await Problem.hardDelete(problemRequest, id)
}

const authorize = async (request) => {
  return await Account.authorize(request)
}

export default { getProblemByTeacher, del, authorize }
