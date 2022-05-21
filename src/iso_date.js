export default class IsoDate {

  // new IsoDate()
  // new IsoDate('')
  //
  // new IsoDate(date)
  //
  // new IsoDate("2022-05-16")
  //
  // new IsoDate("2022", "05", "16")
  constructor(dateOrYear, month, day) {
    if (dateOrYear && month && day) {
      this.yyyy = dateOrYear.toString()
      this.mm   = this.zeroPad(month)
      this.dd   = this.zeroPad(day)
    } else if (dateOrYear instanceof Date) {
      this.yyyy = dateOrYear.getFullYear().toString()
      this.mm   = this.zeroPad(dateOrYear.getMonth() + 1)
      this.dd   = this.zeroPad(dateOrYear.getDate())
    } else if (dateOrYear) {
      [this.yyyy, this.mm, this.dd] = dateOrYear.split('-')
    } else {
      const today = new Date()
      this.yyyy = today.getFullYear().toString()
      this.mm   = this.zeroPad(today.getMonth() + 1)
      this.dd   = this.zeroPad(today.getDate())
    }
  }

  toString() {
    return [this.yyyy, this.mm, this.dd].join('-')
  }

  setDayOfMonth(dayOfMonth) {
    const date = this.toDate()
    date.setDate(dayOfMonth)
    return new IsoDate(date)
  }

  // @param [Number] first day of the week (Sunday is 0)
  firstDayOfWeek(weekStart) {
    const date = this.toDate()
    date.setDate(date.getDate() - (7 + date.getDay() - weekStart) % 7)
    return new IsoDate(date)
  }

  // @param [Number] first day of the week (Sunday is 0)
  lastDayOfWeek(weekStart) {
    const date = this.toDate()
    date.setDate(date.getDate() + (weekStart + 6 - date.getDay()) % 7)
    return new IsoDate(date)
  }

  previousYear() {
    const date = new Date(+this.yyyy - 1, +this.mm - 1)
    const endOfMonth = IsoDate.daysInMonth(date.getMonth() + 1, date.getYear())
    date.setDate(+this.dd > endOfMonth ? endOfMonth : +this.dd)
    return new IsoDate(date)
  }

  nextYear() {
    const date = new Date(+this.yyyy + 1, +this.mm - 1)
    const endOfMonth = IsoDate.daysInMonth(date.getMonth() + 1, date.getYear())
    date.setDate(+this.dd > endOfMonth ? endOfMonth : +this.dd)
    return new IsoDate(date)
  }

  nextMonthSameDayOfMonth() {
    const date = new Date(+this.yyyy, +this.mm)
    const endOfMonth = IsoDate.daysInMonth(date.getMonth() + 1, date.getYear())
    date.setDate(+this.dd > endOfMonth ? endOfMonth : +this.dd)
    return new IsoDate(date)
  }

  previousMonthSameDayOfMonth() {
    const date = new Date(+this.yyyy, +this.mm - 2)
    const endOfMonth = IsoDate.daysInMonth(date.getMonth() + 1, date.getYear())
    date.setDate(+this.dd > endOfMonth ? endOfMonth : +this.dd)
    return new IsoDate(date)
  }

  nextMonthSameDayOfWeek() {
    const date = this.toDate()
    const month = date.getMonth()
    date.setDate(date.getDate() + 28)
    if (date.getMonth() == month) date.setDate(date.getDate() + 7)
    return new IsoDate(date)
  }

  previousMonthSameDayOfWeek() {
    const date = this.toDate()
    const month = date.getMonth()
    date.setDate(date.getDate() - 28)
    if (date.getMonth() == month) date.setDate(date.getDate() - 7)
    return new IsoDate(date)
  }

  isWeekend() {
    return [0, 6].includes(this.toDate().getDay())
  }

  isToday() {
    return this.equals(new IsoDate())
  }

  isFirstDayOfWeek(weekStart) {
    return this.toDate().getDay() == weekStart
  }

  equals(isoDate) {
    return this.toString() == isoDate.toString()
  }

  before(isoDate) {
    return this.toString() < isoDate.toString()
  }

  after(isoDate) {
    return this.toString() > isoDate.toString()
  }

  increment(count = 1) {
    const date = this.toDate()
    date.setDate(date.getDate() + count)
    return new IsoDate(date)
  }

  static isValidStr(str) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(str)) return false
    return IsoDate.isValidDate(...str.split('-').map(s => +s))
  }

  // @param year [Number] four-digit year
  // @param month [Number] month number (January is 1)
  // @param day [Number] day in month
  static isValidDate(year, month, day) {
    if (year  < 1000 || year  > 9999) return false
    if (month <    1 || month >   12) return false
    if (day   <    1 || day   > IsoDate.daysInMonth(month, year)) return false
    return true
  }

  // private

  // Returns the number of days in the month.
  //
  // @param month [Number] the month (1 is January)
  // @param year [Number] the year (e.g. 2022)
  // @return [Number] the number of days
  static daysInMonth(month, year) {
    if ([1, 3, 5, 7, 8, 10, 12].includes(month)) return 31
    if ([4, 6, 9, 11].includes(month)) return 30
    return IsoDate.isLeapYear(year) ? 29 : 28
  }

  static isLeapYear(year) {
    if ((year % 400) == 0) return true
    if ((year % 100) == 0) return false
    return year % 4 == 0
  }

  // Returns a two-digit zero-padded string.
  zeroPad(num) {
    return num.toString().padStart(2, '0')
  }

  toDate() {
    // Cannot use `new Date('YYYY-MM-DD')`: it is treated as UTC, not local.
    return new Date(+this.yyyy, +this.mm - 1, +this.dd)
  }
}
