import Problem from '../../models/problem'
import Account from '../../models/account'

const create = async (request) => {
    return await Problem.create(request)
}

const authorize = async (request) => {
    return await Account.authorize(request)
}

export default { create, authorize }