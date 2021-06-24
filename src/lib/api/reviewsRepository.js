import faker from 'faker'

const createDummyData = (receiverId) => {
  const size = faker.datatype.number({
    min: 3,
    max: 10
  })

  return [...Array(size)].map(() => {
    return {
      id: faker.datatype.uuid(),
      ranking: faker.datatype.number({
        min: 3,
        max: 10
      }),
      receiverId,
      senderId: faker.datatype.uuid(),
      review: faker.lorem.words(10)
    }
  })
}

const listReceivedReviews = (employeeId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(createDummyData(employeeId))
    }, 200)
  })
}

const reviewsRepository = {
  listReceivedReviews
}

export default reviewsRepository
