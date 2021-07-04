import employeeAggregateFactory, { RESULT_TYPES } from './employeeAggregateFactory'
import { EVENT_TYPES } from '../services/eventBus'

describe('Employee Aggregate Factory', () => {
  it('should create an instance of EmployeeAggregate', () => {
    const employee = {
      id: '1',
      name: 'John Doe'
    }

    const reviews = [
      {
        id: '1',
        ranking: 5
      },
      {
        id: '2',
        ranking: 7
      }
    ]

    const employeeAggregate = employeeAggregateFactory.create(employee, reviews)

    expect(employeeAggregate.employee).toEqual(employee)
    expect(employeeAggregate.ranking).toEqual({
      numberOfReviews: 2,
      averageRanking: 6
    })
  })

  it('should create an immutable aggregate', () => {
    const employee = {
      id: '1',
      name: 'John Doe'
    }

    const reviews = []

    const employeeAggregate = employeeAggregateFactory.create(employee, reviews)

    expect(() => {
      employeeAggregate.employee.promoted = true
    }).toThrow()
  })

  it('should return a "NOT_ENOUGH_REVIEWS" error if there are less than 4 reviews', () => {
    const employee = {
      id: '1',
      name: 'John Doe'
    }

    const reviews = [{
      id: '1',
      ranking: 5
    }]

    const employeeAggregate = employeeAggregateFactory.create(employee, reviews)

    const result = employeeAggregate.promote()

    expect(result.type).toBe(RESULT_TYPES.NOT_ENOUGH_REVIEWS)
  })

  it('should return a "RANKING_TOO_LOW" error if there are less than 4 reviews', () => {
    const employee = {
      id: '1',
      name: 'John Doe'
    }

    const reviews = [{
      id: '1',
      ranking: 5
    }, {
      id: '2',
      ranking: 5
    }, {
      id: '3',
      ranking: 5
    }, {
      id: '4',
      ranking: 5
    }, {
      id: '5',
      ranking: 5
    }]

    const employeeAggregate = employeeAggregateFactory.create(employee, reviews)

    const result = employeeAggregate.promote()

    expect(result.type).toBe(RESULT_TYPES.RANKING_TOO_LOW)
  })

  it('should return a promoted employee when in valid conditions', () => {
    const employee = {
      id: '1',
      name: 'John Doe'
    }

    const reviews = [{
      id: '1',
      ranking: 8
    }, {
      id: '2',
      ranking: 7
    }, {
      id: '3',
      ranking: 7
    }, {
      id: '4',
      ranking: 7
    }, {
      id: '5',
      ranking: 7
    }]

    const employeeAggregate = employeeAggregateFactory.create(employee, reviews)

    const result = employeeAggregate.promote()

    expect(result.type).toBe(RESULT_TYPES.OK)
    expect(result.employee.promoted).toBe(true)
  })

  it('when promoting an aggregate, an "EMPLOYEE_PROMOTED" event should be returned. Events should re emptied after the invocation of releaseEvents', () => {
    const employee = {
      id: '1',
      name: 'John Doe'
    }

    const reviews = [{
      id: '1',
      ranking: 8
    }, {
      id: '2',
      ranking: 7
    }, {
      id: '3',
      ranking: 7
    }, {
      id: '4',
      ranking: 7
    }, {
      id: '5',
      ranking: 7
    }]

    const employeeAggregate = employeeAggregateFactory.create(employee, reviews)

    employeeAggregate.promote()

    const events = employeeAggregate.releaseEvents()

    expect(events.length).toBe(1)
    expect(events[0].type).toBe(EVENT_TYPES.EMPLOYEE_PROMOTED)

    const newEvents = employeeAggregate.releaseEvents()
    expect(newEvents.length).toBe(0)
  })
})
