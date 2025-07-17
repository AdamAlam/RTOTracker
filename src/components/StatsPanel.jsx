function StatsPanel({ 
  attendanceCount, 
  plannedCount, 
  bestEightWeeks, 
  daysDroppingOff, 
  requiredDaysNextWeek 
}) {
  return (
    <div className="stats">
      <div className="stat">
        <span className="stat-label">Actual attendance:</span>
        <span className="stat-value">{attendanceCount}</span>
      </div>
      <div className="stat">
        <span className="stat-label">Planned attendance:</span>
        <span className="stat-value">{plannedCount}</span>
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
  )
}

export default StatsPanel