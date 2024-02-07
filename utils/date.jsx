export const dateFromDDMMYYYY = (date) => {
    if (!date) return undefined
    const [day, month, year] = date.split('/')
    return new Date(year, month - 1, day)
  }