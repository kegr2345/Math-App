import Set from '../../models/set'
import SetHasProblem from '../../models/setHasProblem'
import Problem from '../../models/problem'
import Account from '../../models/account'

const getSetByStudent = async (setRequest, studentId) => {
  return await Set.getByStudent(setRequest, studentId)
}

const getSetHasProblemBySet = async (setHasProblemRequest, setId) => {
  return await SetHasProblem.getBySet(setHasProblemRequest, setId)
}

const getProblem = async (problemRequest, id) => {
  return await Problem.get(problemRequest, id)
}

const authorize = async (request) => {
  return await Account.authorize(request)
}

export default { getSetByStudent, getSetHasProblemBySet, getProblem, authorize }
