export function generateCalendarMonths(checkDate) {
  const months = []
  
  const startDate = new Date(checkDate)
  startDate.setDate(checkDate.getDate() - (12 * 7))
  
  const endDate = new Date(checkDate)
  endDate.setDate(checkDate.getDate() + (24 * 7))
  
  const currentMonth = new Date(startDate.getFullYear(), startDate.getMonth(), 1)
  
  while (currentMonth <= endDate) {
    const month = {
      year: currentMonth.getFullYear(),
      month: currentMonth.getMonth(),
      name: currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      weeks: []
    }
    
    const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
    const lastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0)
    
    const calendarStart = new Date(firstDay)
    calendarStart.setDate(firstDay.getDate() - firstDay.getDay())
    
    const currentWeek = new Date(calendarStart)
    
    for (let weekIndex = 0; weekIndex < 5; weekIndex++) {
      const week = []
      for (let i = 0; i < 7; i++) {
        week.push(new Date(currentWeek))
        currentWeek.setDate(currentWeek.getDate() + 1)
      }
      month.weeks.push(week)
    }
    
    const potentialSixthWeek = []
    for (let i = 0; i < 7; i++) {
      potentialSixthWeek.push(new Date(currentWeek))
      currentWeek.setDate(currentWeek.getDate() + 1)
    }
    
    const hasWeekdaysFromThisMonth = potentialSixthWeek.some(day => {
      const isFromThisMonth = day.getMonth() === month.month && day.getFullYear() === month.year
      const isWeekday = day.getDay() !== 0 && day.getDay() !== 6
      return isFromThisMonth && isWeekday
    })
    
    if (hasWeekdaysFromThisMonth) {
      month.weeks.push(potentialSixthWeek)
    }
    
    months.push(month)
    currentMonth.setMonth(currentMonth.getMonth() + 1)
  }
  
  return months
}