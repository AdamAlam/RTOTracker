import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [attendanceDays, setAttendanceDays] = useState(new Set())
  const [plannedDays, setPlannedDays] = useState(new Set())
  const [blockedDays, setBlockedDays] = useState(new Set())
  const [checkDate, setCheckDate] = useState(new Date())

  useEffect(() => {
    const savedAttendance = localStorage.getItem('attendanceDays')
    const savedPlanned = localStorage.getItem('plannedDays')
    const savedBlocked = localStorage.getItem('blockedDays')
    const savedCheckDate = localStorage.getItem('checkDate')
    
    if (savedAttendance) {
      setAttendanceDays(new Set(JSON.parse(savedAttendance)))
    }
    if (savedPlanned) {
      setPlannedDays(new Set(JSON.parse(savedPlanned)))
    }
    if (savedBlocked) {
      setBlockedDays(new Set(JSON.parse(savedBlocked)))
    }
    if (savedCheckDate) {
      setCheckDate(new Date(savedCheckDate))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('attendanceDays', JSON.stringify(Array.from(attendanceDays)))
  }, [attendanceDays])

  useEffect(() => {
    localStorage.setItem('plannedDays', JSON.stringify(Array.from(plannedDays)))
  }, [plannedDays])

  useEffect(() => {
    localStorage.setItem('blockedDays', JSON.stringify(Array.from(blockedDays)))
  }, [blockedDays])

  useEffect(() => {
    localStorage.setItem('checkDate', checkDate.toISOString())
  }, [checkDate])

  const generateCalendarMonths = () => {
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

  const months = generateCalendarMonths()
  
  const calculateCompliance = () => {
    const allWeeks = months.flatMap(month => month.weeks)
    
    const twelveWeeksAgo = new Date(checkDate)
    twelveWeeksAgo.setDate(checkDate.getDate() - (12 * 7))
    
    const relevantWeeks = allWeeks.filter(week => {
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
    
    if (daysDroppingOff > 0) {
      const weeksAfterDropoff = [...weekTotals]
      
      const simulatedWeeks = []
      
      const nextMonday = new Date(checkDate)
      const daysUntilMonday = (1 - checkDate.getDay() + 7) % 7 || 7
      nextMonday.setDate(checkDate.getDate() + daysUntilMonday)
      
      const nextMondayTwelveWeeksAgo = new Date(nextMonday)
      nextMondayTwelveWeeksAgo.setDate(nextMonday.getDate() - (12 * 7))
      
      const nextMondayRelevantWeeks = allWeeks.filter(week => {
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
    }
    
    return {
      totalDays: Array.from(attendanceDays).length + Array.from(plannedDays).length,
      bestEightWeeks,
      isCompliant: bestEightWeeks >= 24,
      daysDroppingOff,
      requiredDaysNextWeek
    }
  }

  const { totalDays, bestEightWeeks, isCompliant, daysDroppingOff, requiredDaysNextWeek } = calculateCompliance()

  const toggleDay = (date) => {
    const dateString = date.toISOString().split('T')[0]
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    if (date <= today) {
      const newAttendance = new Set(attendanceDays)
      if (newAttendance.has(dateString)) {
        newAttendance.delete(dateString)
      } else {
        newAttendance.add(dateString)
      }
      setAttendanceDays(newAttendance)
    } else {
      const newPlanned = new Set(plannedDays)
      if (newPlanned.has(dateString)) {
        newPlanned.delete(dateString)
      } else {
        newPlanned.add(dateString)
      }
      setPlannedDays(newPlanned)
    }
  }

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

  const isCurrentMonth = (date, month) => {
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

  const toggleBlockedDay = (date) => {
    const dateString = date.toISOString().split('T')[0]
    const newBlocked = new Set(blockedDays)
    
    if (newBlocked.has(dateString)) {
      newBlocked.delete(dateString)
    } else {
      newBlocked.add(dateString)
      const newPlanned = new Set(plannedDays)
      if (newPlanned.has(dateString)) {
        newPlanned.delete(dateString)
        setPlannedDays(newPlanned)
      }
    }
    
    setBlockedDays(newBlocked)
  }

  const clearAll = () => {
    setAttendanceDays(new Set())
    setPlannedDays(new Set())
    setBlockedDays(new Set())
  }

  return (
    <div className="app">
      <h1>Office Attendance Compliance Tracker</h1>
      
      <div className={`compliance-status ${isCompliant ? 'compliant' : 'non-compliant'}`}>
        <div className="status-indicator"></div>
        <div className="status-text">
          {isCompliant ? '✅ In Compliance' : '❌ Not in Compliance'}
        </div>
      </div>

      <div className="controls">
        <div className="control-group">
          <label htmlFor="checkDate">Compliance Check Date:</label>
          <input
            type="date"
            id="checkDate"
            value={checkDate.toISOString().split('T')[0]}
            onChange={(e) => setCheckDate(new Date(e.target.value))}
            className="date-input"
          />
        </div>
      </div>

      <div className="stats">
        <div className="stat">
          <span className="stat-label">Actual attendance:</span>
          <span className="stat-value">{attendanceDays.size}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Planned attendance:</span>
          <span className="stat-value">{plannedDays.size}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Best 8 weeks total:</span>
          <span className="stat-value">{bestEightWeeks}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Required for compliance:</span>
          <span className="stat-value">24</span>
        </div>
        <div className="stat">
          <span className="stat-label">Days dropping off next week:</span>
          <span className="stat-value">{daysDroppingOff}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Required days next week:</span>
          <span className="stat-value">{requiredDaysNextWeek}</span>
        </div>
      </div>

      <div className="calendar-container">
        {months.map((month, monthIndex) => (
          <div key={monthIndex} className="month">
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
                {week.map((day, dayIndex) => {
                  const isWeekdayDay = isWeekday(day)
                  const isMarked = isAttendanceDay(day)
                  const isPlanned = isPlannedDay(day)
                  const isBlocked = isBlockedDay(day)
                  const isFuture = isFutureDate(day)
                  const isThisMonth = isCurrentMonth(day, month)
                  const isDroppingOff = isInDroppingOffWeek(day)
                  
                  return (
                    <button
                      key={dayIndex}
                      className={`day ${!isWeekdayDay ? 'weekend' : ''} ${isMarked ? 'attended' : ''} ${isPlanned ? 'planned' : ''} ${isBlocked ? 'blocked' : ''} ${!isThisMonth ? 'other-month' : ''} ${isDroppingOff ? 'dropping-off' : ''}`}
                      onClick={() => isWeekdayDay && !isBlocked && toggleDay(day)}
                      onContextMenu={(e) => {
                        e.preventDefault()
                        if (isWeekdayDay && isFuture) {
                          toggleBlockedDay(day)
                        }
                      }}
                      disabled={!isWeekdayDay || isBlocked}
                    >
                      <div className="day-number">
                        {day.getDate()}
                      </div>
                    </button>
                  )
                })}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="actions">
        <button onClick={clearAll} className="btn btn-secondary">
          Clear All
        </button>
      </div>
    </div>
  )
}

export default App
