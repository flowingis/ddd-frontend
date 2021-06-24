import clone from 'lodash.clonedeep'
import { set } from 'dot-prop-immutable'
import deepFreeze from 'deep-freeze-strict'

const freeze = aggregate => deepFreeze(clone(aggregate))

const MIN_NUMBER_OF_REVIEWS_TO_BE_PROMOTED = 4
const MIN_RANKING_TO_BE_PROMOTED = 7

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
  const aggregate = {
    employee,
    ranking: createRankingValueObject(reviews),
    promote: () => {
      if (aggregate.ranking.numberOfReviews < MIN_NUMBER_OF_REVIEWS_TO_BE_PROMOTED) {
        return freeze(clone(aggregate))
      }

      if (aggregate.ranking.averageRanking < MIN_RANKING_TO_BE_PROMOTED) {
        return freeze(clone(aggregate))
      }

      return freeze(set(aggregate, 'employee.promoted', true))
    }
  }

  return freeze(clone(aggregate))
}

const favoriteDoctorAggregate = {
  create
}

export default favoriteDoctorAggregate
