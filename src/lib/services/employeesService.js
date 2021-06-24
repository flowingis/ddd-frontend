import employeesRepository from '../api/employeesRepository'
import reviewsRepository from '../api/reviewsRepository'
import employeeAggregateFactory, { RESULT_TYPES } from '../model/employeeAggregateFactory'

const list = employeesRepository.list
const promote = async (toPromote) => {
  const reviews = await reviewsRepository.listReceivedReviews(toPromote.id)
  const result = employeeAggregateFactory
    .create(toPromote, reviews)
    .promote()

  if (result.type === RESULT_TYPES.OK) {
    employeesRepository
      .promote(toPromote.id)
  }

  return result
}

const employeesService = {
  list,
  promote
}

export default employeesService
