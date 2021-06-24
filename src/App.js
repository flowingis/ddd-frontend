import React, { useState, useEffect, useCallback } from 'react'
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import employeesService from './lib/services/employeesService'
import EmpoyeesList from './components/EmpoyeesList'
import { RESULT_TYPES } from './lib/model/employeeAggregateFactory'

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
    employeesService
      .list()
      .then(data => {
        setEmployees(data)
        setLoading(false)
      })
  }, [])

  const onPromoteClick = useCallback(async (toPromote) => {
    const result = await employeesService.promote(toPromote)

    if (result.type === RESULT_TYPES.NOT_ENOUGH_REVIEWS) {
      window.alert(`${toPromote.name} receveid only ${result.numberOfReviews} peer reviews, they cannot be promoted`)
      return
    }

    if (result.type === RESULT_TYPES.RANKING_TOO_LOW) {
      window.alert(`The ranking of ${toPromote.name} is too low (${result.averageRanking}) to be promoted`)
      return
    }

    const { employee } = result
    setEmployees(employees => employees.map(toCheck => {
      if (toCheck.id === employee.id) {
        return employee
      }
      return toCheck
    }))
  }, [])

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
