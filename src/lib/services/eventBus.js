export const EVENT_TYPES = {
  EMPLOYEE_PROMOTED: Symbol('EMPLOYEE_PROMOTED')
}

const create = () => {
  let subsribers = []
  const subscribe = cb => {
    subsribers.push(cb)
    return () => {
      subsribers = subsribers.filter(s => s !== cb)
    }
  }

  const publish = (type, payload) => {
    if (!Object.values(EVENT_TYPES).includes(type)) {
      throw new Error('Invalid event')
    }

    subsribers.forEach(subscriber => subscriber({
      type,
      payload
    }))
  }

  return {
    subscribe,
    publish
  }
}

export default create()
