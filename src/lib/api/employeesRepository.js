import faker from 'faker'

const createDummyData = () => {
  const size = faker.datatype.number({
    min: 3,
    max: 10
  })

  return [...Array(size)].map(() => {
    return {
      id: faker.datatype.uuid(),
      promoted: faker.datatype.boolean(),
      name: faker.name.findName(),
      avatar: faker.image.avatar()
    }
  })
}

const list = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(createDummyData())
    }, 200)
  })
}

const promote = (id) => Promise.resolve()

const employeesRepository = {
  list,
  promote
}

export default employeesRepository
