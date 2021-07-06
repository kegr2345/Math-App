import Set from '../../models/set'
import Account from '../../models/account'

const create = async (request) => {
    return await Set.create(request)
}

const authorize = async (request) => {
    return await Account.authorize(request)
}

export default { create, authorize }