import employeesRepository from '../api/employeesRepository'
import reviewsRepository from '../api/reviewsRepository'
import employeeAggregateFactory from '../model/employeeAggregateFactory'
import eventBus from './eventBus'

const list = employeesRepository.list
const promote = async (toPromote) => {
  const reviews = await reviewsRepository.listReceivedReviews(toPromote.id)
  const result = employeeAggregateFactory
    .create(toPromote, reviews, eventBus)
    .promote()

  return result
}

const employeesService = {
  list,
  promote
}

export default employeesService
