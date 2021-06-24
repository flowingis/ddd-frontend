import employeesRepository from '../api/employeesRepository'
import reviewsRepository from '../api/reviewsRepository'
import employeeAggregateFactory from '../model/employeeAggregateFactory'

const list = employeesRepository.list
const promote = async (toPromote, employees, setEmployees) => {
  const reviews = await reviewsRepository.listReceivedReviews(toPromote.id)
  const aggregate = employeeAggregateFactory
    .create(toPromote, reviews)
    .promote()

  const newEmployee = aggregate.employee

  if (newEmployee.promoted === false) {
    throw new Error(`${toPromote.name} cannot be promoted`)
  }

  const newEmployees = employees.map(employee => {
    if (employee.id === toPromote.id) {
      return newEmployee
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
