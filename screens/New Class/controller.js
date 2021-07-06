import Class from '../../models/class'
import Library from '../../models/library'
import Account from '../../models/account'

const create = async (request) => {
    return await Class.create(request)
}

const getLibraryByTeacher = async (teacherId) => {
    return await Library.getByTeacher(teacherId)
}

const authorize = async (request) => {
    return await Account.authorize(request)
}

export default { create, getLibraryByTeacher, authorize }