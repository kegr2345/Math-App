import Student from '../../models/student'
import Account from '../../models/account'

const create = async (request) => {
    return await Student.create(request)
}

const authorize = async (request) => {
    return await Account.authorize(request)
}

export default { create, authorize }