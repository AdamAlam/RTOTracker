export function calculateCompliance(months, attendanceDays, plannedDays, blockedDays, checkDate) {
  const allWeeks = months.flatMap(month => month.weeks)
  
  const twelveWeeksAgo = new Date(checkDate)
  twelveWeeksAgo.setDate(checkDate.getDate() - (12 * 7))
  
  const uniqueWeeks = new Map()
  allWeeks.forEach(week => {
    const weekStart = week[0]
    const weekKey = weekStart.toISOString().split('T')[0]
    if (!uniqueWeeks.has(weekKey)) {
      uniqueWeeks.set(weekKey, week)
    }
  })
  
  const relevantWeeks = Array.from(uniqueWeeks.values()).filter(week => {
    const weekStart = week[0]
    const weekEnd = week[6]
    return weekEnd >= twelveWeeksAgo && weekStart <= checkDate
  })
  
  const weekTotals = relevantWeeks.map(week => {
    return week.filter(day => {
      const dayOfWeek = day.getDay()
      if (dayOfWeek === 0 || dayOfWeek === 6) return false
      if (day < twelveWeeksAgo || day > checkDate) return false
      
      const dateString = day.toISOString().split('T')[0]
      if (blockedDays.has(dateString)) return false
      return attendanceDays.has(dateString) || plannedDays.has(dateString)
    }).length
  })
  
  const today = new Date(checkDate)
  const daysUntilMonday = (1 - today.getDay() + 7) % 7 || 7
  const nextMonday = new Date(today)
  nextMonday.setDate(today.getDate() + daysUntilMonday)
  
  const nextMondayTwelveWeeksAgo = new Date(nextMonday)
  nextMondayTwelveWeeksAgo.setDate(nextMonday.getDate() - (12 * 7))
  
  const droppingWeekStart = new Date(nextMondayTwelveWeeksAgo)
  droppingWeekStart.setDate(nextMondayTwelveWeeksAgo.getDate() - nextMondayTwelveWeeksAgo.getDay())
  
  const droppingWeekEnd = new Date(droppingWeekStart)
  droppingWeekEnd.setDate(droppingWeekStart.getDate() + 6)
  
  let daysDroppingOff = 0
  for (let d = new Date(droppingWeekStart); d <= droppingWeekEnd; d.setDate(d.getDate() + 1)) {
    const dayOfWeek = d.getDay()
    if (dayOfWeek === 0 || dayOfWeek === 6) continue
    
    const dateString = d.toISOString().split('T')[0]
    if (!blockedDays.has(dateString) && (attendanceDays.has(dateString) || plannedDays.has(dateString))) {
      daysDroppingOff++
    }
  }
  
  const sortedWeeks = [...weekTotals].sort((a, b) => b - a)
  const bestEightWeeks = sortedWeeks.slice(0, 8).reduce((sum, count) => sum + count, 0)
  
  let requiredDaysNextWeek = 0
  
  const nextMondayUniqueWeeks = new Map()
  allWeeks.forEach(week => {
    const weekStart = week[0]
    const weekKey = weekStart.toISOString().split('T')[0]
    if (!nextMondayUniqueWeeks.has(weekKey)) {
      nextMondayUniqueWeeks.set(weekKey, week)
    }
  })
  
  const nextMondayRelevantWeeks = Array.from(nextMondayUniqueWeeks.values()).filter(week => {
    const weekStart = week[0]
    const weekEnd = week[6]
    return weekEnd >= nextMondayTwelveWeeksAgo && weekStart <= nextMonday
  })
  
  const nextMondayWeekTotals = nextMondayRelevantWeeks.map(week => {
    return week.filter(day => {
      const dayOfWeek = day.getDay()
      if (dayOfWeek === 0 || dayOfWeek === 6) return false
      if (day < nextMondayTwelveWeeksAgo || day > nextMonday) return false
      
      const dateString = day.toISOString().split('T')[0]
      if (blockedDays.has(dateString)) return false
      return attendanceDays.has(dateString) || plannedDays.has(dateString)
    }).length
  })
  
  const sortedNextMondayWeeks = [...nextMondayWeekTotals].sort((a, b) => b - a)
  const bestEightAfterDropoff = sortedNextMondayWeeks.slice(0, 8).reduce((sum, count) => sum + count, 0)
  
  if (bestEightAfterDropoff < 24) {
    const deficit = 24 - bestEightAfterDropoff
    
    if (sortedNextMondayWeeks.length >= 8) {
      const weakestInTop8 = sortedNextMondayWeeks[7]
      requiredDaysNextWeek = Math.max(deficit, weakestInTop8 + 1)
    } else {
      requiredDaysNextWeek = deficit
    }
  }
  
  return {
    totalDays: Array.from(attendanceDays).length + Array.from(plannedDays).length,
    bestEightWeeks,
    isCompliant: bestEightWeeks >= 24,
    daysDroppingOff,
    requiredDaysNextWeek
  }
}