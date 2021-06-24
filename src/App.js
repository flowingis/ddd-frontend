import React, { useState, useEffect, useCallback } from 'react'
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import employeesRepository from './lib/api/employeesRepository'
import reviewsRepository from './lib/api/reviewsRepository'
import EmpoyeesList from './components/EmpoyeesList'

const MIN_RANKING_TO_PROMOTE = 7
const MIN_NUMBER_OF_REVIEWS_TO_BE_PROMOTED = 4

function AppContent ({ loading, employees, onPromoteClick }) {
  if (loading) {
    return <div>Loading</div>
  }

  return <EmpoyeesList employees={employees} onPromoteClick={onPromoteClick} />
}

export default function App () {
  const [loading, setLoading] = useState(true)
  const [employees, setEmployees] = useState([])

  useEffect(() => {
    employeesRepository
      .list()
      .then(data => {
        setEmployees(data)
        setLoading(false)
      })
  }, [])

  const onPromoteClick = useCallback(async (toPromote) => {
    const reviews = await reviewsRepository.listReceivedReviews(toPromote.id)

    if (reviews.length < MIN_NUMBER_OF_REVIEWS_TO_BE_PROMOTED) {
      window.alert(`${toPromote.name} receveid only ${reviews.length} peer reviews, they cannot be promoted`)
      return
    }

    const averageRanking = reviews
      .map(r => r.ranking)
      .reduce((acc, ranking) => acc + ranking, 0) / reviews.length

    if (averageRanking < MIN_RANKING_TO_PROMOTE) {
      window.alert(`The ranking of ${toPromote.name} is too low (${averageRanking}) to be promoted`)
      return
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
  }, [employees])

  return (
    <Container maxWidth='sm'>
      <Box my={4}>
        <Typography variant='h4' component='h1' gutterBottom>
          Employees
        </Typography>
        <AppContent loading={loading} employees={employees} onPromoteClick={onPromoteClick} />
      </Box>
    </Container>
  )
}
