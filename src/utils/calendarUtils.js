export function generateCalendarMonths(checkDate) {
  const months = []
  
  const startDate = new Date(checkDate)
  startDate.setDate(checkDate.getDate() - (12 * 7))
  
  const endDate = new Date(checkDate)
  endDate.setDate(checkDate.getDate() + (4 * 7))
  
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
    while (currentWeek <= lastDay || currentWeek.getDay() !== 0) {
      const week = []
      for (let i = 0; i < 7; i++) {
        week.push(new Date(currentWeek))
        currentWeek.setDate(currentWeek.getDate() + 1)
      }
      month.weeks.push(week)
      
      if (week[6] > lastDay) break
    }
    
    months.push(month)
    currentMonth.setMonth(currentMonth.getMonth() + 1)
  }
  
  return months
}