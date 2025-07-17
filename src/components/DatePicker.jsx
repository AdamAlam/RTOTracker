function DatePicker({ checkDate, onDateChange }) {
  return (
    <div className="controls">
      <div className="control-group">
        <label htmlFor="checkDate">Compliance Check Date:</label>
        <input
          type="date"
          id="checkDate"
          value={checkDate.toISOString().split('T')[0]}
          onChange={(e) => onDateChange(new Date(e.target.value))}
          className="date-input"
        />
      </div>
    </div>
  )
}

export default DatePicker