const STORAGE_PREFIX = '@Besoft:kerben-'

const remove = (name) => {
  localStorage.removeItem(STORAGE_PREFIX + name)
}

export default {
  set: (name, value) => {
    if (value === null || value === undefined) {
      remove(name)
    } else {
      localStorage.setItem(`${STORAGE_PREFIX}${name}`, JSON.stringify(value))
    }
  },
  get: (name, default_value = null) => {
    return (
      JSON.parse(localStorage.getItem(`${STORAGE_PREFIX}${name}`)) ||
      default_value
    )
  },
  remove,
}
