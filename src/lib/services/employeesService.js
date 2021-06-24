import employeesRepository from '../api/employeesRepository'
import reviewsRepository from '../api/reviewsRepository'

const MIN_NUMBER_OF_REVIEWS_TO_BE_PROMOTED = 4
const MIN_RANKING_TO_BE_PROMOTED = 7

const list = employeesRepository.list
const promote = async (toPromote, employees, setEmployees) => {
  const reviews = await reviewsRepository.listReceivedReviews(toPromote.id)

  if (reviews.length < MIN_NUMBER_OF_REVIEWS_TO_BE_PROMOTED) {
    throw new Error(`${toPromote.name} receveid only ${reviews.length} peer reviews, they cannot be promoted`)
  }

  const averageRanking = reviews
    .map(r => r.ranking)
    .reduce((acc, ranking) => acc + ranking, 0) / reviews.length

  if (averageRanking < MIN_RANKING_TO_BE_PROMOTED) {
    throw new Error(`The ranking of ${toPromote.name} is too low (${averageRanking}) to be promoted`)
  }

  const newEmployees = employees.map(employee => {
    if (employee.id === toPromote.id) {
      employee.promoted = true
    }
    return employee
  })
  setEmployees(newEmployees)
  employeesRepository
    .promote(toPromote.id)
    .catch(e => {
      // Error handling
      console.error(e)
      setEmployees(employees)
    })
}

const employeesService = {
  list,
  promote
}

export default employeesService
