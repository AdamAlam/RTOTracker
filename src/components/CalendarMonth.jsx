import CalendarDay from './CalendarDay'

function CalendarMonth({ 
  month, 
  attendanceDays,
  plannedDays,
  blockedDays,
  checkDate,
  onDayClick,
  onDayRightClick
}) {
  const isWeekday = (date) => {
    const day = date.getDay()
    return day !== 0 && day !== 6
  }

  const isAttendanceDay = (date) => {
    const dateString = date.toISOString().split('T')[0]
    return attendanceDays.has(dateString)
  }

  const isPlannedDay = (date) => {
    const dateString = date.toISOString().split('T')[0]
    return plannedDays.has(dateString)
  }

  const isBlockedDay = (date) => {
    const dateString = date.toISOString().split('T')[0]
    return blockedDays.has(dateString)
  }

  const isFutureDate = (date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date > today
  }

  const isCurrentMonth = (date) => {
    return date.getMonth() === month.month && date.getFullYear() === month.year
  }

  const isInDroppingOffWeek = (date) => {
    const today = new Date(checkDate)
    const daysUntilMonday = (1 - today.getDay() + 7) % 7 || 7
    const nextMonday = new Date(today)
    nextMonday.setDate(today.getDate() + daysUntilMonday)
    
    const twelveWeeksFromNextMonday = new Date(nextMonday)
    twelveWeeksFromNextMonday.setDate(nextMonday.getDate() - (12 * 7))
    
    const droppingWeekStart = new Date(twelveWeeksFromNextMonday)
    droppingWeekStart.setDate(twelveWeeksFromNextMonday.getDate() - twelveWeeksFromNextMonday.getDay())
    
    const droppingWeekEnd = new Date(droppingWeekStart)
    droppingWeekEnd.setDate(droppingWeekStart.getDate() + 6)
    
    return date >= droppingWeekStart && date <= droppingWeekEnd
  }

  const handleDayRightClick = (day) => {
    const isWeekdayDay = isWeekday(day)
    const isFuture = isFutureDate(day)
    
    if (isWeekdayDay && isFuture) {
      onDayRightClick(day)
    }
  }

  return (
    <div className="month">
      <div className="month-header">
        {month.name}
      </div>
      <div className="weekday-headers">
        <div className="weekday-header">Sun</div>
        <div className="weekday-header">Mon</div>
        <div className="weekday-header">Tue</div>
        <div className="weekday-header">Wed</div>
        <div className="weekday-header">Thu</div>
        <div className="weekday-header">Fri</div>
        <div className="weekday-header">Sat</div>
      </div>
      {month.weeks.map((week, weekIndex) => (
        <div key={weekIndex} className="days">
          {week.map((day, dayIndex) => (
            <CalendarDay
              key={dayIndex}
              day={day}
              isWeekday={isWeekday(day)}
              isAttended={isAttendanceDay(day)}
              isPlanned={isPlannedDay(day)}
              isBlocked={isBlockedDay(day)}
              isCurrentMonth={isCurrentMonth(day)}
              isDroppingOff={isInDroppingOffWeek(day)}
              onDayClick={onDayClick}
              onDayRightClick={handleDayRightClick}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

export default CalendarMonth