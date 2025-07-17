import './App.css'
import ComplianceStatus from './components/ComplianceStatus'
import DatePicker from './components/DatePicker'
import StatsPanel from './components/StatsPanel'
import CalendarMonth from './components/CalendarMonth'
import { useAttendanceData } from './hooks/useAttendanceData'
import { generateCalendarMonths } from './utils/calendarUtils'
import { calculateCompliance } from './utils/complianceUtils'

function App() {
  const {
    attendanceDays,
    plannedDays,
    blockedDays,
    checkDate,
    setCheckDate,
    toggleDay,
    toggleBlockedDay,
    clearAll
  } = useAttendanceData()

  const months = generateCalendarMonths(checkDate)
  const compliance = calculateCompliance(months, attendanceDays, plannedDays, blockedDays, checkDate)

  return (
    <div className="app">
      <h1>Office Attendance Compliance Tracker</h1>
      
      <ComplianceStatus isCompliant={compliance.isCompliant} />

      <DatePicker checkDate={checkDate} onDateChange={setCheckDate} />

      <StatsPanel
        attendanceCount={attendanceDays.size}
        plannedCount={plannedDays.size}
        bestEightWeeks={compliance.bestEightWeeks}
        daysDroppingOff={compliance.daysDroppingOff}
        requiredDaysNextWeek={compliance.requiredDaysNextWeek}
      />

      <div className="calendar-container">
        {months.map((month, monthIndex) => (
          <CalendarMonth
            key={monthIndex}
            month={month}
            attendanceDays={attendanceDays}
            plannedDays={plannedDays}
            blockedDays={blockedDays}
            checkDate={checkDate}
            onDayClick={toggleDay}
            onDayRightClick={toggleBlockedDay}
          />
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