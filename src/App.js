import React, { useState, useEffect, useCallback } from 'react'
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import employeesService from './lib/services/employeesService'
import EmpoyeesList from './components/EmpoyeesList'

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
    try {
      await employeesService.promote(toPromote, employees, setEmployees)
    } catch (e) {
      window.alert(e.message)
    }
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
