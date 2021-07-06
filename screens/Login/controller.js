import Account from '../../models/account'
import Teacher from '../../models/teacher'
import Library from '../../models/library'

const login = async (request) => {
  let response = await Account.login(request)
  return response
}

const authorize = async (request) => {
  let response = await Account.authorize(request)
  return response
}

const getTeacher = async (teacherRequest, accountId) => {
  let response = await Teacher.get(teacherRequest, accountId)
  return response
}

const getLibraryByTeacher = async (libraryRequest, teacherId) => {
  let response = await Library.getByTeacher(libraryRequest, teacherId)
  return response
}

export default { login, authorize, getTeacher, getLibraryByTeacher }
