const STORAGE_PREFIX = '@Besoft:kerben-'

const remove = (name: string) => {
  localStorage.removeItem(STORAGE_PREFIX + name)
}

export default {
  set: (name: string, value: any) => {
    if (value === null || value === undefined) {
      remove(name)
    } else {
      localStorage.setItem(`${STORAGE_PREFIX}${name}`, JSON.stringify(value))
    }
  },
  get: (name: string, default_value: any = null) => {
    return (
      JSON.parse(localStorage.getItem(`${STORAGE_PREFIX}${name}`) || 'null') ||
      default_value
    )
  },
  remove,
}
