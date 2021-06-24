import clone from 'lodash.clonedeep'
import { set } from 'dot-prop-immutable'
import deepFreeze from 'deep-freeze-strict'
import { EVENT_TYPES } from '../services/eventBus'

const freeze = aggregate => deepFreeze(clone(aggregate))

const MIN_NUMBER_OF_REVIEWS_TO_BE_PROMOTED = 4
const MIN_RANKING_TO_BE_PROMOTED = 7

export const RESULT_TYPES = {
  OK: Symbol('OK'),
  NOT_ENOUGH_REVIEWS: Symbol('NOT_ENOUGH_REVIEWS'),
  RANKING_TOO_LOW: Symbol('RANKING_TOO_LOW')
}

const createRankingValueObject = reviews => {
  const numberOfReviews = reviews.length
  const averageRanking = reviews
    .map(r => r.ranking)
    .reduce((acc, ranking) => acc + ranking, 0) / numberOfReviews

  return Object.freeze({
    numberOfReviews,
    averageRanking
  })
}

const create = (employee, reviews) => {
  const ranking = createRankingValueObject(reviews)

  let events = []

  const aggregate = {
    employee,
    ranking,
    releaseEvents: () => {
      const clonedEvents = freeze([...events])
      events = []
      return clonedEvents
    },
    promote: () => {
      if (ranking.numberOfReviews < MIN_NUMBER_OF_REVIEWS_TO_BE_PROMOTED) {
        return {
          type: RESULT_TYPES.NOT_ENOUGH_REVIEWS,
          numberOfReviews: ranking.numberOfReviews,
          aggregate: freeze(clone(aggregate))
        }
      }

      if (ranking.averageRanking < MIN_RANKING_TO_BE_PROMOTED) {
        return {
          type: RESULT_TYPES.RANKING_TOO_LOW,
          averageRanking: ranking.averageRanking,
          aggregate: freeze(clone(aggregate))
        }
      }

      const newAggregate = set(aggregate, 'employee.promoted', true)

      events.push({
        type: EVENT_TYPES.EMPLOYEE_PROMOTED,
        payload: newAggregate.employee
      })

      return {
        type: RESULT_TYPES.OK,
        aggregate: newAggregate,
        employee: newAggregate.employee
      }
    }
  }

  return freeze(clone(aggregate))
}

const favoriteDoctorAggregate = {
  create
}

export default favoriteDoctorAggregate
