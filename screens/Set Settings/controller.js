import Set from '../../models/set'
import Account from '../../models/account'

const setSet = async (request, setId) => {
  return await Set.set(request, setId)
}

const authorize = async (request) => {
  return await Account.authorize(request)
}

export default { setSet, authorize }