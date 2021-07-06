import Problem from '../../models/problem'
import SetHasProblem from '../../models/setHasProblem'
import Account from '../../models/account'

const getProblemByTeacher = async (request, teacherId) => {
  return await Problem.getByTeacher(request, teacherId)
}

const getSetHasProblem = async (request, id) => {
  return await SetHasProblem.get(request, id)
}

const getSetHasProblemBySet = async (request, setId) => {
  return await SetHasProblem.getBySet(request, setId)
}

const createSetHasProblem = async (request, setHasProblemReq) => {
  return await SetHasProblem.create(request, setHasProblemReq)
}

const deleteSetHasProblem = async (request, id) => {
  return await SetHasProblem.del(request, id)
}

const authorize = async (request) => {
  return await Account.authorize(request)
}

export default { getProblemByTeacher, getSetHasProblemBySet, createSetHasProblem, deleteSetHasProblem, getSetHasProblem, authorize }
