import { useState, useEffect } from 'react'

export function useAttendanceData() {
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

  return {
    attendanceDays,
    plannedDays,
    blockedDays,
    checkDate,
    setCheckDate,
    toggleDay,
    toggleBlockedDay,
    clearAll
  }
}