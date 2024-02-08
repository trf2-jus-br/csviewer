export const dateFromDDMMYYYY = (date) => {
  if (!date) return undefined
  const [day, month, year] = date.split('/')
  return new Date(year, month - 1, day)
}

export const interval = (date1, date2) => {
  if (date1 > date2) { // swap
    var result = interval(date2, date1);
    result.years = -result.years;
    result.months = -result.months;
    result.days = -result.days;
    result.hours = -result.hours;
    return result;
  }
  result = {
    years: date2.getYear() - date1.getYear(),
    months: date2.getMonth() - date1.getMonth(),
    days: date2.getDate() - date1.getDate(),
    hours: date2.getHours() - date1.getHours()
  };
  if (result.hours < 0) {
    result.days--;
    result.hours += 24;
  }
  if (result.days < 0) {
    result.months--;
    // days = days left in date1's month, 
    //   plus days that have passed in date2's month
    var copy1 = new Date(date1.getTime());
    copy1.setDate(32);
    result.days = 32 - date1.getDate() - copy1.getDate() + date2.getDate();
  }
  if (result.months < 0) {
    result.years--;
    result.months += 12;
  }
  return result;
}

export const dateDiff = (start, end) => {
  const result = interval(start, end)
  const days = result.days
  const months = result.months
  const years = result.years
  let s = ''
  if (years > 0) s += `${years} ano${years > 1 ? 's' : ''}`
  if (months > 0) s += `${s ? (days > 0 ? ', ' : ' e ') : ''}${months} mês${months > 1 ? 'es' : ''}`
  if (days > 0) s += `${s ? ' e ' : ''}${days} dia${days > 1 ? 's' : ''}`
  return s ? s : undefined
}
