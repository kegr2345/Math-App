import Set from '../../models/set'
import SetHasProblem from '../../models/setHasProblem'
import Problem from '../../models/problem'
import Session from '../../models/session'
import Attempt from '../../models/attempt'
import Account from '../../models/account'

const getSetByStudent = async (request, studentId) => {
  return await Set.getByStudent(request, studentId)
}

const getSetHasProblemBySet = async (request, setId) => {
  return await SetHasProblem.getBySet(request, setId)
}

const getProblem = async (request, id) => {
  return await Problem.get(request, id)
}

const createSession = async (sessionReq) => {
  return await Session.create(sessionReq)
}

const createAttempt = async (attemptReq) => {
  return await Attempt.create(attemptReq)
}

const authorize = async (request) => {
  return await Account.authorize(request)
}

export default { getSetByStudent, getSetHasProblemBySet, getProblem, createSession, createAttempt, authorize }
