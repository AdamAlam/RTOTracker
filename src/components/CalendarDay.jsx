function CalendarDay({ 
  day, 
  isWeekday, 
  isAttended, 
  isPlanned, 
  isBlocked, 
  isCurrentMonth, 
  isDroppingOff,
  onDayClick,
  onDayRightClick
}) {
  const handleClick = () => {
    if (isWeekday && !isBlocked) {
      onDayClick(day)
    }
  }

  const handleRightClick = (e) => {
    e.preventDefault()
    onDayRightClick(day)
  }

  const classNames = [
    'day',
    !isWeekday && 'weekend',
    isAttended && 'attended',
    isPlanned && 'planned',
    isBlocked && 'blocked',
    !isCurrentMonth && 'other-month',
    isDroppingOff && 'dropping-off'
  ].filter(Boolean).join(' ')

  return (
    <button
      className={classNames}
      onClick={handleClick}
      onContextMenu={handleRightClick}
      disabled={!isWeekday || isBlocked}
    >
      <div className="day-number">
        {day.getDate()}
      </div>
    </button>
  )
}

export default CalendarDay